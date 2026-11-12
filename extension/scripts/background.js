(() => {
  'use strict';

  const STATE_KEY = 'ssosGithubCloudState';
  const AUTH_KEY = 'ssosGithubCloudAuth';
  const SNAPSHOT_KEY = 'ssosGithubCloudSnapshot';
  const LAST_ERROR_KEY = 'ssosGithubCloudLastError';
  const ALARM_NAME = 'ssosGithubCloudBackup';
  const BACKUP_FILE = 'schleim-os-backup.json';
  const BACKUP_FORMAT = 'schleim-os-github-cloud-backup';
  const API = 'https://api.github.com';
  const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  let uploadInProgress = false;

  function ensureAlarm() {
    if (!chrome.alarms) return;
    chrome.alarms.get(ALARM_NAME, alarm => {
      if (chrome.runtime.lastError || !alarm) {
        chrome.alarms.create(ALARM_NAME, { delayInMinutes: 5, periodInMinutes: 5 });
      }
    });
  }

  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  }

  async function postForm(url, values) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(values).toString(),
      credentials: 'omit',
      cache: 'no-store'
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) {
      throw new Error(data.error_description || data.message || data.error || ('GitHub antwortete mit HTTP ' + response.status));
    }
    return data;
  }

  async function request(path, options, token) {
    const response = await fetch(API + path, {
      ...(options || {}),
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer ' + token,
        'X-GitHub-Api-Version': '2022-11-28',
        ...((options && options.body) ? { 'Content-Type': 'application/json' } : {}),
        ...((options && options.headers) || {})
      },
      credentials: 'omit',
      cache: 'no-store'
    });
    const raw = await response.text();
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: raw }; }
    if (!response.ok) {
      const error = new Error(data.message || ('GitHub API antwortete mit HTTP ' + response.status));
      error.status = response.status;
      throw error;
    }
    return data;
  }

  async function currentCredentials() {
    const [persistent, temporary] = await Promise.all([
      chrome.storage.local.get([STATE_KEY]),
      chrome.storage.session.get([AUTH_KEY, SNAPSHOT_KEY])
    ]);
    return {
      config: persistent?.[STATE_KEY]?.config || {},
      auth: temporary?.[AUTH_KEY] || null,
      snapshot: temporary?.[SNAPSHOT_KEY] || null
    };
  }

  async function getAccessToken(config, auth) {
    if (!auth?.accessToken) throw new Error('GitHub-Sitzung ist nicht angemeldet.');
    if (!auth.expiresAt || Date.now() < auth.expiresAt - 60000) return auth.accessToken;
    if (!auth.refreshToken) throw new Error('GitHub-Sitzung ist abgelaufen. Bitte melde dich erneut an.');
    if (auth.refreshExpiresAt && Date.now() >= auth.refreshExpiresAt) {
      throw new Error('Die GitHub-Sitzung ist abgelaufen. Bitte melde dich erneut an.');
    }
    const refreshed = await postForm(ACCESS_TOKEN_URL, {
      client_id: config.clientId,
      grant_type: 'refresh_token',
      refresh_token: auth.refreshToken
    });
    auth.accessToken = refreshed.access_token;
    auth.refreshToken = refreshed.refresh_token || auth.refreshToken;
    auth.expiresAt = refreshed.expires_in ? Date.now() + Number(refreshed.expires_in) * 1000 : null;
    auth.refreshExpiresAt = refreshed.refresh_token_expires_in
      ? Date.now() + Number(refreshed.refresh_token_expires_in) * 1000
      : auth.refreshExpiresAt;
    await chrome.storage.session.set({ [AUTH_KEY]: auth });
    return auth.accessToken;
  }

  async function uploadLatestSnapshot() {
    if (uploadInProgress) return;
    uploadInProgress = true;
    try {
      const context = await currentCredentials();
      if (!context.auth?.accessToken || !context.snapshot || context.snapshot.format !== BACKUP_FORMAT) return;
      const token = await getAccessToken(context.config, context.auth);
      const owner = encodeURIComponent(context.auth.username);
      const repo = encodeURIComponent(context.auth.repoName);
      const path = '/repos/' + owner + '/' + repo + '/contents/' + BACKUP_FILE;
      let existing = null;
      try {
        existing = await request(path, {}, token);
      } catch (error) {
        if (error.status !== 404) throw error;
      }
      const body = {
        message: 'Schleim OS: automatische Cloud-Sicherung',
        content: encodeBase64(JSON.stringify(context.snapshot, null, 2) + '\n')
      };
      if (existing?.sha) body.sha = existing.sha;
      await request(path, { method: 'PUT', body: JSON.stringify(body) }, token);
      context.auth.lastBackupAt = new Date().toISOString();
      context.auth.lastSyncedRepo = context.auth.username + '/' + context.auth.repoName;
      await chrome.storage.session.set({ [AUTH_KEY]: context.auth });
      await chrome.storage.local.remove([LAST_ERROR_KEY]);
    } catch (error) {
      await chrome.storage.local.set({
        [LAST_ERROR_KEY]: { message: String(error?.message || 'Unbekannter GitHub-Fehler'), at: new Date().toISOString() }
      });
      if (error?.status === 401) await chrome.storage.session.remove([AUTH_KEY]);
    } finally {
      uploadInProgress = false;
    }
  }

  chrome.runtime.onInstalled.addListener(ensureAlarm);
  chrome.runtime.onStartup.addListener(ensureAlarm);
  chrome.alarms?.onAlarm.addListener(alarm => {
    if (alarm.name === ALARM_NAME) uploadLatestSnapshot();
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'SSOS_GITHUB_CLOUD_ENSURE_ALARM') {
      ensureAlarm();
      sendResponse({ ok: true });
      return false;
    }
    if (message?.type === 'SSOS_GITHUB_CLOUD_SNAPSHOT') {
      const snapshot = message.snapshot;
      if (!snapshot || snapshot.format !== BACKUP_FORMAT || !snapshot.preferences || typeof snapshot.preferences !== 'object') {
        sendResponse({ ok: false, error: 'Ungültige Schleim-OS-Sicherung.' });
        return false;
      }
      chrome.storage.session.set({ [SNAPSHOT_KEY]: snapshot })
        .then(() => sendResponse({ ok: true }))
        .catch(error => sendResponse({ ok: false, error: String(error?.message || error) }));
      return true;
    }
    return false;
  });

  try {
    chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' });
  } catch {}
  ensureAlarm();
})();