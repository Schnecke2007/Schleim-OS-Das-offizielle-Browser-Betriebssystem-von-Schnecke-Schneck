(() => {
  'use strict';

  const STATE_KEY = 'ssosGithubCloudState';
  const AUTH_KEY = 'ssosGithubCloudAuth';
  const SNAPSHOT_KEY = 'ssosGithubCloudSnapshot';
  const BACKUP_FILE = 'schleim-os-backup.json';
  const BACKUP_FORMAT = 'schleim-os-github-cloud-backup';
  const BACKUP_INTERVAL = 5 * 60 * 1000;
  const SNAPSHOT_INTERVAL = 15 * 1000;
  const API = 'https://api.github.com';
  const DEVICE_CODE_URL = 'https://github.com/login/device/code';
  const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const $ = (selector, root = document) => root.querySelector(selector);

  let state = {
    config: { clientId: '', repoName: 'schleim-os-cloud-backup' },
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
    if (!local || !session) throw new Error('Dieser Browser unterstützt keine sichere Sitzungsablage für die GitHub-Anmeldung.');
    const [persistent, temporary] = await Promise.all([
      local.get([STATE_KEY]),
      session.get([AUTH_KEY])
    ]);
    const saved = persistent?.[STATE_KEY] || {};
    const auth = temporary?.[AUTH_KEY] || saved.auth || null;

    // Migrate older installations: remove persisted tokens from extension local storage.
    if (saved.auth) {
      if (auth) await session.set({ [AUTH_KEY]: auth });
      await local.set({ [STATE_KEY]: { config: saved.config || {} } });
    }
    return { config: saved.config || {}, auth };
  }

  async function writeState() {
    const local = storageArea();
    const session = sessionArea();
    if (!local || !session) throw new Error('Die sichere Browser-Sitzungsablage ist nicht verfügbar.');
    await local.set({ [STATE_KEY]: { config: state.config } });
    if (state.auth) {
      await session.set({ [AUTH_KEY]: state.auth });
    } else {
      await session.remove([AUTH_KEY, SNAPSHOT_KEY]);
    }
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

  function configFromInputs(root) {
    const clientId = $('#ssosGithubClientId', root)?.value.trim() || state.config.clientId || '';
    const repoName = $('#ssosGithubRepoName', root)?.value.trim() || state.config.repoName || 'schleim-os-cloud-backup';
    return { clientId, repoName };
  }

  function validateConfig(config) {
    if (!/^[A-Za-z0-9_]{8,80}$/.test(config.clientId)) {
      throw new Error('Bitte trage eine gültige GitHub-App-Client-ID ein.');
    }
    if (!/^[A-Za-z0-9._-]{1,100}$/.test(config.repoName)) {
      throw new Error('Der Name des Backup-Repositories ist ungültig.');
    }
  }

  async function saveConfigFrom(root) {
    const next = configFromInputs(root);
    validateConfig(next);
    state.config = next;
    await writeState();
    updatePanels();
    setStatus('Einstellungen gespeichert. Du kannst dich jetzt mit GitHub anmelden.');
  }

  function renderSettingsPanel() {
    return '<section class="ssos-card" id="ssosGithubCloudSettings">' +
      '<h4>☁️ GitHub-Cloud-Sicherung</h4>' +
      '<p class="body-copy">Nach der Anmeldung wird dein kompletter Schleim-OS-Startbildschirm sofort in deinem privaten GitHub-Repository gesichert und anschließend alle fünf Minuten aktualisiert.</p>' +
      '<label>GitHub-App-Client-ID<input id="ssosGithubClientId" type="text" autocomplete="off" spellcheck="false" placeholder="Iv1. …"></label>' +
      '<label>Privates Backup-Repository<input id="ssosGithubRepoName" type="text" autocomplete="off" spellcheck="false" value="schleim-os-cloud-backup" placeholder="schleim-os-cloud-backup"></label>' +
      '<p class="body-copy">Benötigt wird eine GitHub-App mit aktiviertem Device Flow, Repository-Berechtigung <b>Contents: Read and write</b> und <b>Metadata: Read-only</b>. Installiere sie ausschließlich auf deinem privaten Backup-Repository.</p>' +
      '<p class="body-copy"><a href="https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/blob/main/docs/Deutsch/GITHUB-CLOUD-BACKUP.md" target="_blank" rel="noopener noreferrer">Einrichtung der GitHub-Cloud-Sicherung ↗</a></p>' +
      '<p class="body-copy" data-ssos-cloud-status>GitHub ist noch nicht verbunden.</p>' +
      '<div class="ssos-form-actions">' +
      '<button class="app-button secondary" type="button" data-ssos-cloud-save-config>Einstellungen speichern</button>' +
      '<button class="app-button" type="button" data-ssos-cloud-login>Mit GitHub anmelden</button>' +
      '<button class="app-button secondary" type="button" data-ssos-cloud-backup>Jetzt sichern</button>' +
      '<button class="app-button secondary" type="button" data-ssos-cloud-restore>Aus GitHub wiederherstellen</button>' +
      '<button class="app-button secondary" type="button" data-ssos-cloud-logout>Abmelden</button>' +
      '</div>' +
      '<p class="body-copy" data-ssos-cloud-last-backup></p>' +
      '</section>';
  }

  function mountSettingsPanel() {
    const root = $('#ssosSettingsTools');
    if (!root || $('#ssosGithubCloudSettings', root)) return;
    root.insertAdjacentHTML('beforeend', renderSettingsPanel());
    const client = $('#ssosGithubClientId', root);
    const repo = $('#ssosGithubRepoName', root);
    if (client) client.value = state.config.clientId || '';
    if (repo) repo.value = state.config.repoName || 'schleim-os-cloud-backup';
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
    document.querySelectorAll('[data-ssos-cloud-login]').forEach(node => node.hidden = state.connected || loginInProgress);
    document.querySelectorAll('[data-ssos-cloud-logout]').forEach(node => node.hidden = !state.connected);
    document.querySelectorAll('[data-ssos-cloud-backup], [data-ssos-cloud-restore]').forEach(node => node.hidden = !state.connected);
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

  async function validateRepository(token, username, repoName) {
    const repo = await apiRequest('/repos/' + encodeURIComponent(username) + '/' + encodeURIComponent(repoName), {}, token);
    if (!repo.private) throw new Error('Das Backup-Repository ist öffentlich. Bitte verwende ausschließlich ein privates GitHub-Repository.');
    if (String(repo.owner?.login || '').toLowerCase() !== String(username).toLowerCase()) {
      throw new Error('Das Backup-Repository muss zu deinem angemeldeten GitHub-Konto gehören.');
    }
    return repo;
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

  async function startDeviceLogin(root) {
    if (loginInProgress) return;
    loginInProgress = true;
    updatePanels();
    try {
      const nextConfig = configFromInputs(root || document);
      validateConfig(nextConfig);
      state.config = nextConfig;
      await writeState();
      setStatus('Verbindung zu GitHub wird vorbereitet …');
      const device = await requestDeviceCode(nextConfig.clientId);
      const statusNodes = document.querySelectorAll('[data-ssos-cloud-status]');
      statusNodes.forEach(node => {
        node.innerHTML = 'Öffne <a href="' + escapeHtml(device.verification_uri || 'https://github.com/login/device') + '" target="_blank" rel="noopener noreferrer">github.com/login/device</a> und gib diesen Code ein: <b>' + escapeHtml(device.user_code) + '</b>. Danach die App-Berechtigung auf GitHub bestätigen.';
      });
      toast('GitHub-Gerätecode wurde erstellt.');
      const tokenData = await pollForAccessToken(nextConfig.clientId, device);
      setStatus('Anmeldung erfolgreich. Backup-Repository wird geprüft …');
      const user = await apiRequest('/user', {}, tokenData.access_token);
      const username = String(user.login || '').trim();
      if (!username) throw new Error('GitHub hat keinen Benutzernamen zurückgegeben.');
      await validateRepository(tokenData.access_token, username, nextConfig.repoName);
      state.auth = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        expiresAt: tokenData.expires_in ? Date.now() + Number(tokenData.expires_in) * 1000 : null,
        refreshExpiresAt: tokenData.refresh_token_expires_in ? Date.now() + Number(tokenData.refresh_token_expires_in) * 1000 : null,
        username,
        repoName: nextConfig.repoName,
        lastBackupAt: null,
        lastSyncedRepo: null
      };
      state.connected = true;
      await writeState();
      await firstSyncAfterConnection();
      await startScheduler();
      updatePanels();
      setStatus('Verbunden als @' + username + '. Die automatische Sicherung läuft alle fünf Minuten.');
      mountSettingsPanel();
    } catch (error) {
      setStatus(error.message || 'GitHub-Anmeldung fehlgeschlagen.', true);
      toast('GitHub-Anmeldung fehlgeschlagen.');
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
      await validateRepository(token, username, state.auth.repoName);
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
    const save = event.target.closest('[data-ssos-cloud-save-config]');
    const login = event.target.closest('[data-ssos-cloud-login]');
    const backup = event.target.closest('[data-ssos-cloud-backup]');
    const restore = event.target.closest('[data-ssos-cloud-restore]');
    const signout = event.target.closest('[data-ssos-cloud-logout]');
    const root = event.target.closest('#ssosSettingsTools') || $('#appContent') || document;
    try {
      if (save) {
        await saveConfigFrom(root);
        toast('GitHub-Einstellungen gespeichert.');
      } else if (login) {
        await startDeviceLogin(root);
      } else if (backup) {
        await saveConfigFrom(root).catch(() => {});
        await backupNow(false);
      } else if (restore) {
        await restoreFromCloud(false);
      } else if (signout) {
        await logout();
      }
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
      if (areaName === 'session' && changes[AUTH_KEY]) {
        state.auth = changes[AUTH_KEY].newValue || null;
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