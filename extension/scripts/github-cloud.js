(() => {
  'use strict';

  const STATE_KEY = 'ssosGithubCloudState';
  const AUTH_KEY = 'ssosGithubCloudAuth';
  const SNAPSHOT_KEY = 'ssosGithubCloudSnapshot';
  // Public Client ID inserted once by the Schleim OS project owner.
  const GITHUB_APP_CLIENT_ID = '';
  const BACKUP_REPO_NAME = 'schleim-os-cloud-backup';
  const BACKUP_REPO_DESCRIPTION = 'Private personal Schleim OS cloud backup. Created automatically by Schleim OS.';
  const BACKUP_FILE = 'schleim-os-backup.json';
  const BACKUP_FORMAT = 'schleim-os-github-cloud-backup';
  const BACKUP_INTERVAL = 5 * 60 * 1000;
  const SNAPSHOT_INTERVAL = 15 * 1000;
  const API = 'https://api.github.com';
  const DEVICE_CODE_URL = 'https://github.com/login/device/code';
  const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const $ = (selector, root = document) => root.querySelector(selector);

  let state = {
    config: { clientId: GITHUB_APP_CLIENT_ID, repoName: BACKUP_REPO_NAME },
    auth: null,
    connected: false,
    initializing: true
  };
  let snapshotTimer = null;
  let fallbackBackupTimer = null;
  let pageHideBound = false;
  let backupInProgress = false;
  let loginInProgress = false;

  function storageArea() {
    return globalThis.chrome?.storage?.local || null;
  }

  function sessionArea() {
    return globalThis.chrome?.storage?.session || null;
  }

  async function readState() {
    const local = storageArea();
    const session = sessionArea();
    if (!local) throw new Error('Der Erweiterungsspeicher ist nicht verfügbar.');
    const saved = (await local.get([STATE_KEY]))?.[STATE_KEY] || {};
    let auth = saved.auth || null;

    // Migrate a prior session-only login to persistent extension storage.
    if (!auth && session) auth = (await session.get([AUTH_KEY]))?.[AUTH_KEY] || null;
    state.config = { ...state.config, ...(saved.config || {}) };
    if (GITHUB_APP_CLIENT_ID) state.config.clientId = GITHUB_APP_CLIENT_ID;
    if (!state.config.clientId) state.config.clientId = GITHUB_APP_CLIENT_ID;
    if (!state.config.repoName) state.config.repoName = BACKUP_REPO_NAME;
    if (auth && !saved.auth) await local.set({ [STATE_KEY]: { config: state.config, auth } });
    if (session) await session.remove([AUTH_KEY]);
    try { await local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }); } catch {}
    return { config: state.config, auth };
  }

  async function writeState() {
    const local = storageArea();
    const session = sessionArea();
    if (!local) throw new Error('Der Erweiterungsspeicher ist nicht verfügbar.');
    await local.set({ [STATE_KEY]: { config: state.config, auth: state.auth || null } });
    if (!state.auth) await local.remove([SNAPSHOT_KEY]);
    if (session) await session.remove([AUTH_KEY]);
    try { await local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }); } catch {}
  }

  function setStatus(message, isError = false) {
    document.querySelectorAll('[data-ssos-cloud-status]').forEach(node => {
      node.textContent = message;
      node.dataset.state = isError ? 'error' : 'ok';
    });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => node.classList.remove('show'), 2600);
  }

  function renderSettingsPanel() {
    return '<section class="ssos-card" id="ssosGithubCloudSettings">' +
      '<h4>☁️ GitHub-Cloud-Sicherung</h4>' +
      '<p class="body-copy">Einmal mit GitHub verbinden. Schleim OS erstellt automatisch ein privates Backup-Repository und sichert deinen Startbildschirm sofort sowie danach alle fünf Minuten.</p>' +
      '<div class="ssos-form-actions"><button class="app-button" type="button" data-ssos-cloud-toggle>Mit GitHub verbinden</button></div>' +
      '<p class="body-copy" data-ssos-cloud-status>GitHub ist noch nicht verbunden.</p>' +
      '<p class="body-copy" data-ssos-cloud-last-backup></p>' +
      '</section>';
  }

  function mountSettingsPanel() {
    const root = $('#ssosSettingsTools');
    if (!root || $('#ssosGithubCloudSettings', root)) return;
    root.insertAdjacentHTML('beforeend', renderSettingsPanel());
    updatePanels();
  }

  function formatTime(value) {
    if (!value) return '';
    try {
      return new Intl.DateTimeFormat(document.body.dataset.language === 'en' ? 'en-GB' : document.body.dataset.language === 'nl' ? 'nl-NL' : 'de-DE', {
        dateStyle: 'short', timeStyle: 'short'
      }).format(new Date(value));
    } catch {
      return new Date(value).toLocaleString();
    }
  }

  function updatePanels() {
    const auth = state.auth;
    const connectedMessage = state.connected
      ? 'Verbunden als @' + (auth?.username || 'GitHub') + ' · automatische Sicherung alle 5 Minuten.'
      : 'GitHub ist noch nicht verbunden.';
    document.querySelectorAll('[data-ssos-cloud-status]').forEach(node => {
      node.textContent = state.initializing ? 'GitHub-Verbindung wird geprüft …' : connectedMessage;
      node.dataset.state = state.connected ? 'ok' : 'idle';
    });
    document.querySelectorAll('[data-ssos-cloud-last-backup]').forEach(node => {
      node.textContent = auth?.lastBackupAt ? 'Letzte Sicherung: ' + formatTime(auth.lastBackupAt) : '';
    });
    document.querySelectorAll('[data-ssos-cloud-toggle]').forEach(node => {
      node.textContent = state.connected ? 'GitHub trennen' : 'Mit GitHub verbinden';
      node.disabled = state.initializing || loginInProgress;
    });
  }

  async function postForm(url, values) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(values).toString(),
      credentials: 'omit',
      cache: 'no-store'
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error_description || result.message || result.error || ('GitHub antwortete mit HTTP ' + response.status));
    }
    return result;
  }

  async function requestDeviceCode(clientId) {
    const device = await postForm(DEVICE_CODE_URL, { client_id: clientId, scope: 'offline_access' });
    if (!device.device_code || !device.user_code) throw new Error(device.error_description || device.error || 'GitHub konnte keinen Gerätecode erstellen.');
    return device;
  }

  async function pollForAccessToken(clientId, device) {
    let interval = Math.max(5, Number(device.interval) || 5);
    const expiresAt = Date.now() + Math.max(60, Number(device.expires_in) || 900) * 1000;
    while (Date.now() < expiresAt) {
      await new Promise(resolve => window.setTimeout(resolve, interval * 1000));
      const response = await postForm(ACCESS_TOKEN_URL, {
        client_id: clientId,
        device_code: device.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
      });
      if (response.access_token) return response;
      if (response.error === 'authorization_pending') continue;
      if (response.error === 'slow_down') { interval += 5; continue; }
      if (response.error === 'expired_token') throw new Error('Der Gerätecode ist abgelaufen. Bitte starte die Anmeldung erneut.');
      if (response.error === 'access_denied') throw new Error('Die GitHub-Anmeldung wurde abgelehnt.');
      throw new Error(response.error_description || response.error || 'Die GitHub-Anmeldung ist fehlgeschlagen.');
    }
    throw new Error('Der Gerätecode ist abgelaufen. Bitte starte die Anmeldung erneut.');
  }

  async function refreshAccessToken() {
    const auth = state.auth;
    if (!auth?.refreshToken || !auth.expiresAt || Date.now() < auth.expiresAt - 60000) return auth?.accessToken || null;
    const refreshed = await postForm(ACCESS_TOKEN_URL, {
      client_id: state.config.clientId,
      grant_type: 'refresh_token',
      refresh_token: auth.refreshToken
    });
    auth.accessToken = refreshed.access_token;
    auth.refreshToken = refreshed.refresh_token || auth.refreshToken;
    auth.expiresAt = refreshed.expires_in ? Date.now() + Number(refreshed.expires_in) * 1000 : null;
    auth.refreshExpiresAt = refreshed.refresh_token_expires_in ? Date.now() + Number(refreshed.refresh_token_expires_in) * 1000 : auth.refreshExpiresAt;
    await writeState();
    return auth.accessToken;
  }

  async function apiRequest(path, options = {}, suppliedToken = null) {
    const token = suppliedToken || await refreshAccessToken();
    if (!token) throw new Error('Du bist nicht bei GitHub angemeldet.');
    const headers = {
      'Accept': 'application/vnd.github+json',
      'Authorization': 'Bearer ' + token,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    };
    const response = await fetch(API + path, {
      ...options,
      headers,
      credentials: 'omit',
      cache: 'no-store'
    });
    const raw = await response.text();
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: raw }; }
    if (!response.ok) {
      const error = new Error(data.message || ('GitHub API antwortete mit HTTP ' + response.status));
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  async function createOrFindBackupRepository(token, username, preferredName = '') {
    const preferred = /^[A-Za-z0-9._-]{1,100}$/.test(preferredName) ? preferredName : '';
    const candidates = [...new Set([...(preferred ? [preferred] : []), BACKUP_REPO_NAME, ...Array.from({ length: 20 }, (_, index) => BACKUP_REPO_NAME + '-' + (index + 2))])];
    for (const repoName of candidates) {
      let existing = null;
      try {
        existing = await apiRequest('/repos/' + encodeURIComponent(username) + '/' + encodeURIComponent(repoName), {}, token);
      } catch (error) {
        if (error.status !== 404) throw error;
      }
      if (existing) {
        const owned = String(existing.owner?.login || '').toLowerCase() === String(username).toLowerCase();
        const isExpectedBackup = repoName === preferred || existing.description === BACKUP_REPO_DESCRIPTION;
        if (owned && existing.private === true && isExpectedBackup) return repoName;
        continue;
      }
      try {
        const created = await apiRequest('/user/repos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: repoName,
            description: BACKUP_REPO_DESCRIPTION,
            private: true,
            auto_init: true,
            has_issues: false,
            has_projects: false,
            has_wiki: false
          })
        }, token);
        if (created.private !== true || String(created.owner?.login || '').toLowerCase() !== String(username).toLowerCase()) {
          throw new Error('GitHub hat kein privates Backup-Repository im angemeldeten Konto erstellt.');
        }
        return String(created.name || repoName);
      } catch (error) {
        if (error.status === 422) continue;
        if (error.status === 403) {
          throw new Error('Der GitHub-App fehlt die Berechtigung „Repository creation: Write“. Bitte den Projektbetreiber informieren.');
        }
        throw error;
      }
    }
    throw new Error('Es konnte kein freier Name für das private Backup-Repository gefunden werden.');
  }

  function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  }

  function decodeBase64(value) {
    const binary = atob(String(value || '').replace(/\s/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function collectSnapshot() {
    const preferences = {};
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith('ssos-')) continue;
      try {
        preferences[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        preferences[key] = localStorage.getItem(key);
      }
    }
    return {
      format: BACKUP_FORMAT,
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      product: 'Schleim OS',
      preferences
    };
  }

  async function readBackup(token) {
    const auth = state.auth;
    const path = '/repos/' + encodeURIComponent(auth.username) + '/' + encodeURIComponent(auth.repoName) + '/contents/' + BACKUP_FILE;
    try {
      const file = await apiRequest(path, {}, token);
      if (!file.content || file.encoding !== 'base64') throw new Error('Die GitHub-Sicherungsdatei enthält kein lesbares JSON.');
      const backup = JSON.parse(decodeBase64(file.content));
      if (backup.format !== BACKUP_FORMAT || !backup.preferences || typeof backup.preferences !== 'object') {
        throw new Error('Die Datei im Backup-Repository ist keine gültige Schleim-OS-Sicherung.');
      }
      return { file, backup };
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async function uploadBackup(token) {
    const snapshot = collectSnapshot();
    const auth = state.auth;
    const path = '/repos/' + encodeURIComponent(auth.username) + '/' + encodeURIComponent(auth.repoName) + '/contents/' + BACKUP_FILE;
    let existing = null;
    try {
      existing = await apiRequest(path, {}, token);
    } catch (error) {
      if (error.status !== 404) throw error;
    }
    const body = {
      message: 'Schleim OS: automatische Cloud-Sicherung',
      content: encodeBase64(JSON.stringify(snapshot, null, 2) + '\n')
    };
    if (existing?.sha) body.sha = existing.sha;
    await apiRequest(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, token);
    auth.lastBackupAt = new Date().toISOString();
    auth.lastSyncedRepo = auth.username + '/' + auth.repoName;
    await writeState();
    updatePanels();
    return snapshot;
  }

  function restoreSnapshot(snapshot) {
    const preferences = snapshot?.preferences;
    if (!preferences || typeof preferences !== 'object' || Array.isArray(preferences)) {
      throw new Error('Die Sicherungsdatei enthält keine gültigen Einstellungen.');
    }
    for (const [key, value] of Object.entries(preferences)) {
      if (!/^ssos-[a-zA-Z0-9_-]{1,64}$/.test(key)) continue;
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }

  async function restoreFromCloud(silent = false) {
    if (!state.connected) throw new Error('Bitte melde dich zuerst bei GitHub an.');
    const token = await refreshAccessToken();
    const saved = await readBackup(token);
    if (!saved) throw new Error('Im Backup-Repository wurde noch keine Sicherung gefunden.');
    if (!silent && !window.confirm('Die vorhandene GitHub-Sicherung wird auf diesen Browser übertragen. Die aktuellen lokalen Einstellungen werden dabei ersetzt. Fortfahren?')) return;
    restoreSnapshot(saved.backup);
    state.auth.lastSyncedRepo = state.auth.username + '/' + state.auth.repoName;
    await writeState();
    toast('GitHub-Sicherung wiederhergestellt. Schleim OS wird neu geladen.');
    window.setTimeout(() => window.location.reload(), 500);
  }

  async function firstSyncAfterConnection() {
    const token = await refreshAccessToken();
    const remote = await readBackup(token);
    const repoKey = state.auth.username + '/' + state.auth.repoName;
    if (remote && state.auth.lastSyncedRepo !== repoKey) {
      const restore = window.confirm('In deinem privaten GitHub-Repository wurde bereits eine Schleim-OS-Sicherung gefunden.\n\nOK = vorhandene GitHub-Sicherung auf diesem Gerät wiederherstellen.\nAbbrechen = den aktuellen Startbildschirm hochladen und die bisherige Sicherung ersetzen.');
      if (restore) {
        restoreSnapshot(remote.backup);
        state.auth.lastSyncedRepo = repoKey;
        await writeState();
        toast('Vorhandene GitHub-Sicherung übernommen. Schleim OS wird neu geladen.');
        window.setTimeout(() => window.location.reload(), 500);
        return;
      }
    }
    await uploadBackup(token);
  }

  async function backupNow(silent = false) {
    if (!state.connected || backupInProgress) return;
    backupInProgress = true;
    updatePanels();
    try {
      const token = await refreshAccessToken();
      await uploadBackup(token);
      if (!silent) toast('GitHub-Sicherung wurde aktualisiert.');
    } catch (error) {
      setStatus('Sicherung fehlgeschlagen: ' + error.message, true);
      if (error.status === 401 || error.status === 403) {
        state.connected = false;
        stopScheduler();
      }
    } finally {
      backupInProgress = false;
      updatePanels();
    }
  }

  async function publishSnapshot() {
    if (!state.connected || !globalThis.chrome?.runtime?.id) return false;
    try {
      const snapshot = collectSnapshot();
      const response = await chrome.runtime.sendMessage({ type: 'SSOS_GITHUB_CLOUD_SNAPSHOT', snapshot });
      if (!response?.ok) throw new Error(response?.error || 'Der Hintergrunddienst hat die Momentaufnahme nicht bestätigt.');
      return true;
    } catch (error) {
      console.warn('[Schleim OS] Snapshot konnte nicht an den Hintergrunddienst übergeben werden:', error);
      return false;
    }
  }

  async function startScheduler() {
    stopScheduler();
    await publishSnapshot();
    snapshotTimer = window.setInterval(() => { publishSnapshot(); }, SNAPSHOT_INTERVAL);
    if (!pageHideBound) {
      window.addEventListener('pagehide', publishSnapshot);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') publishSnapshot();
      });
      pageHideBound = true;
    }
    try {
      chrome.runtime.sendMessage({ type: 'SSOS_GITHUB_CLOUD_ENSURE_ALARM' }).catch(() => {});
    } catch {}
    // Fallback for Chromium variants without the alarms API.
    if (!globalThis.chrome?.alarms) {
      fallbackBackupTimer = window.setInterval(() => backupNow(true), BACKUP_INTERVAL);
    }
  }

  function stopScheduler() {
    if (snapshotTimer) window.clearInterval(snapshotTimer);
    if (fallbackBackupTimer) window.clearInterval(fallbackBackupTimer);
    snapshotTimer = null;
    fallbackBackupTimer = null;
  }

  async function startDeviceLogin() {
    if (loginInProgress) return;
    loginInProgress = true;
    updatePanels();
    try {
      const clientId = String(state.config.clientId || GITHUB_APP_CLIENT_ID).trim();
      if (!/^[A-Za-z0-9_]{8,80}$/.test(clientId)) {
        throw new Error('Die einmalige GitHub-App-Einrichtung ist noch nicht abgeschlossen. Die öffentliche Client-ID fehlt.');
      }
      state.config.clientId = clientId;
      await writeState();
      setStatus('Verbindung zu GitHub wird vorbereitet …');
      const device = await requestDeviceCode(clientId);
      document.querySelectorAll('[data-ssos-cloud-status]').forEach(node => {
        node.innerHTML = 'Öffne <a href="' + escapeHtml(device.verification_uri || 'https://github.com/login/device') + '" target="_blank" rel="noopener noreferrer">github.com/login/device</a> und gib diesen Code ein: <b>' + escapeHtml(device.user_code) + '</b>. Danach die Berechtigung für Schleim OS auf GitHub bestätigen.';
      });
      toast('GitHub-Gerätecode wurde erstellt.');
      const tokenData = await pollForAccessToken(clientId, device);
      setStatus('Anmeldung erfolgreich. Privates Backup-Repository wird automatisch erstellt …');
      const user = await apiRequest('/user', {}, tokenData.access_token);
      const username = String(user.login || '').trim();
      if (!username) throw new Error('GitHub hat keinen Benutzernamen zurückgegeben.');
      const repoName = await createOrFindBackupRepository(tokenData.access_token, username, '');
      state.config.repoName = repoName;
      state.auth = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        expiresAt: tokenData.expires_in ? Date.now() + Number(tokenData.expires_in) * 1000 : null,
        refreshExpiresAt: tokenData.refresh_token_expires_in ? Date.now() + Number(tokenData.refresh_token_expires_in) * 1000 : null,
        username,
        repoName,
        lastBackupAt: null,
        lastSyncedRepo: null
      };
      state.connected = true;
      await writeState();
      await firstSyncAfterConnection();
      await startScheduler();
      updatePanels();
      setStatus('Verbunden als @' + username + '. Das private Backup-Repository ist eingerichtet; die automatische Sicherung läuft alle fünf Minuten.');
      mountSettingsPanel();
    } catch (error) {
      setStatus(error.message || 'GitHub-Anmeldung fehlgeschlagen.', true);
      toast(error.message || 'GitHub-Anmeldung fehlgeschlagen.');
    } finally {
      loginInProgress = false;
      updatePanels();
    }
  }

  async function logout() {
    stopScheduler();
    state.auth = null;
    state.connected = false;
    await writeState();
    updatePanels();
    setStatus('Du wurdest von der GitHub-Cloud abgemeldet. Die Store-Oberfläche bleibt weiterhin öffentlich zugänglich.');
    toast('GitHub-Verbindung getrennt.');
  }

  async function initialize() {
    try {
      const saved = await readState();
      state.config = { ...state.config, ...(saved.config || {}) };
      state.auth = saved.auth || null;
      if (!state.auth?.accessToken) {
        state.auth = null;
        state.connected = false;
        return;
      }
      const token = await refreshAccessToken();
      const user = await apiRequest('/user', {}, token);
      const username = String(user.login || '').trim();
      if (!username || username.toLowerCase() !== String(state.auth.username || '').toLowerCase()) {
        throw new Error('Das angemeldete GitHub-Konto stimmt nicht mit der gespeicherten Verbindung überein.');
      }
      state.auth.repoName = await createOrFindBackupRepository(token, username, state.auth.repoName || '');
      state.auth.username = username;
      state.connected = true;
      await writeState();
      await firstSyncAfterConnection();
      await startScheduler();
    } catch (error) {
      state.connected = false;
      stopScheduler();
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        state.auth = null;
        await writeState().catch(() => {});
      }
      console.warn('[Schleim OS] GitHub Cloud nicht verfügbar:', error);
    } finally {
      state.initializing = false;
      updatePanels();
      mountSettingsPanel();
    }
  }

  document.addEventListener('click', async event => {
    const toggle = event.target.closest('[data-ssos-cloud-toggle]');
    if (!toggle) return;
    try {
      if (state.connected) await logout();
      else await startDeviceLogin();
    } catch (error) {
      setStatus(error.message || 'Die Aktion ist fehlgeschlagen.', true);
      toast(error.message || 'Die Aktion ist fehlgeschlagen.');
    }
  });

  const personalizationObserver = new MutationObserver(() => {
    if ($('#ssosSettingsTools')) mountSettingsPanel();
  });
  personalizationObserver.observe(document.documentElement, { childList: true, subtree: true });

  const api = {
    mountSettingsPanel,
    get connected() { return state.connected; }
  };

  if (globalThis.chrome?.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[STATE_KEY]) {
        state.auth = changes[STATE_KEY].newValue?.auth || null;
        state.connected = !!state.auth?.accessToken;
        updatePanels();
      }
      if (areaName === 'local' && changes.ssosGithubCloudLastError?.newValue) {
        setStatus('GitHub-Sicherung fehlgeschlagen: ' + changes.ssosGithubCloudLastError.newValue.message, true);
      }
    });
  }

  window.SSOSGitHubCloud = Object.freeze(api);
  initialize();
})();