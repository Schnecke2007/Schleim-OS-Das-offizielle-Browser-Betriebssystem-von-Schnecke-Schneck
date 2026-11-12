(() => {
  'use strict';

  const LOCAL_PREFIX = 'ssos-';
  const PERSONALIZATION_KEY = 'ssos-personalization-v1';
  const META_PREFIX = 'schleimos.sync.meta:';
  const CHUNK_PREFIX = 'schleimos.sync.part:';
  const CHUNK_BYTES = 5100;
  const $ = (selector, root = document) => root.querySelector(selector);
  const syncArea = globalThis.chrome?.storage?.sync || null;
  const language = () => document.body?.dataset.language || 'de';

  const MESSAGES = {
    de: {
      title: '☁️ Automatische Browser-Synchronisierung',
      description: 'Deine Schleim-OS-Einstellungen werden automatisch über den Synchronisierungsspeicher deines Browsers abgeglichen. Du brauchst keine separate Cloud-App und musst dich nicht in Schleim OS anmelden.',
      note: 'Voraussetzung: Du bist im Browserprofil angemeldet und dessen Synchronisierung ist eingeschaltet. Der Browser bestimmt selbst, wann Daten übertragen werden. Das Browserkontingent ist begrenzt; hochgeladene Hintergrundbilder bleiben lokal.',
      checking: 'Browser-Synchronisierung wird vorbereitet …',
      ready: 'Browser-Speicher bereit. Der Cloud-Abgleich erfolgt, sofern die Synchronisierung deines Browserprofils aktiv ist.',
      saved: 'Einstellungen im Browser-Speicher aktualisiert. Die Cloud-Übertragung übernimmt der Browser.',
      unsupported: 'Dieser Browser stellt keinen synchronisierbaren Erweiterungsspeicher bereit. Die Einstellungen bleiben lokal.',
      error: 'Synchronisierung nicht möglich: ',
      restored: 'Einstellungen aus dem Browserkonto übernommen. Schleim OS wird aktualisiert …'
    },
    en: {
      title: '☁️ Automatic browser sync',
      description: 'Your Schleim OS settings are automatically mirrored through your browser’s sync storage. No separate cloud app or Schleim OS sign-in is required.',
      note: 'Requirement: sign in to your browser profile and enable its sync feature. The browser decides when data is transferred. Browser storage is limited; uploaded wallpaper images remain local.',
      checking: 'Preparing browser sync …',
      ready: 'Browser storage is ready. Cloud transfer takes place when browser-profile sync is enabled.',
      saved: 'Settings updated in browser storage. The browser handles cloud transfer.',
      unsupported: 'This browser does not provide synchronizable extension storage. Settings remain local.',
      error: 'Sync unavailable: ',
      restored: 'Settings received from browser sync. Schleim OS is refreshing …'
    },
    nl: {
      title: '☁️ Automatische browsersynchronisatie',
      description: 'Je Schleim OS-instellingen worden automatisch bijgewerkt via de synchronisatieopslag van je browser. Je hebt geen aparte cloud-app nodig en hoeft je niet bij Schleim OS aan te melden.',
      note: 'Voorwaarde: je bent aangemeld bij je browserprofiel en synchronisatie is ingeschakeld. De browser bepaalt zelf wanneer gegevens worden overgedragen. De browseropslag is beperkt; geüploade achtergrondafbeeldingen blijven lokaal.',
      checking: 'Browsersynchronisatie wordt voorbereid …',
      ready: 'Browseropslag is gereed. Cloudoverdracht vindt plaats wanneer synchronisatie van je browserprofiel is ingeschakeld.',
      saved: 'Instellingen bijgewerkt in browseropslag. De browser verzorgt de cloudoverdracht.',
      unsupported: 'Deze browser biedt geen synchroniseerbare extensieopslag. Instellingen blijven lokaal.',
      error: 'Synchronisatie niet beschikbaar: ',
      restored: 'Instellingen ontvangen via browsersynchronisatie. Schleim OS wordt vernieuwd …'
    }
  };
  const t = key => MESSAGES[language()]?.[key] || MESSAGES.de[key] || key;

  let ready = false;
  let applyingRemote = false;
  let flushTimer = null;
  let reloadTimer = null;
  let lastError = '';
  const pending = new Map();

  const nativeSetItem = Storage.prototype.setItem;
  const nativeRemoveItem = Storage.prototype.removeItem;
  const nativeClear = Storage.prototype.clear;

  function setStatus(message, isError = false) {
    document.querySelectorAll('[data-ssos-browser-sync-status]').forEach(node => {
      node.textContent = message;
      node.dataset.state = isError ? 'error' : 'ok';
    });
  }

  function renderPanel() {
    return '<section class="ssos-card" id="ssosBrowserSyncSettings">' +
      '<h4>' + t('title') + '</h4>' +
      '<p class="body-copy">' + t('description') + '</p>' +
      '<p class="body-copy" data-ssos-browser-sync-status>' + t('checking') + '</p>' +
      '<p class="body-copy">' + t('note') + '</p>' +
      '</section>';
  }

  function mountPanel() {
    const root = $('#ssosSettingsTools');
    if (!root || $('#ssosBrowserSyncSettings', root)) return;
    root.insertAdjacentHTML('beforeend', renderPanel());
    if (!syncArea) setStatus(t('unsupported'), true);
    else if (ready) setStatus(lastError ? t('error') + lastError : t('ready'), !!lastError);
  }

  function metaKey(key) {
    return META_PREFIX + encodeURIComponent(key);
  }

  function chunkKey(key, index) {
    return CHUNK_PREFIX + encodeURIComponent(key) + ':' + index;
  }

  function bytesToBase64(bytes) {
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(String(value || ''));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function prepareCloudValue(key, raw) {
    if (key !== PERSONALIZATION_KEY) return String(raw);
    try {
      const value = JSON.parse(raw);
      if (!value || typeof value !== 'object' || Array.isArray(value)) return String(raw);
      // Uploaded image data can exceed browser-sync quotas. Keep it on this device.
      // Wallpaper URLs, app links, tile order and ordinary design settings still sync.
      value.wallpaperData = '';
      if (Array.isArray(value.apps)) {
        value.apps = value.apps.map(app => {
          if (!app || typeof app !== 'object') return app;
          const next = { ...app };
          if (typeof next.icon === 'string' && next.icon.startsWith('data:image/')) next.icon = '🌐';
          if (typeof next.iconUrl === 'string' && next.iconUrl.startsWith('data:image/')) next.iconUrl = '';
          return next;
        });
      }
      return JSON.stringify(value);
    } catch {
      return String(raw);
    }
  }

  function mergeLocalOnlyAssets(key, incomingRaw) {
    if (key !== PERSONALIZATION_KEY) return incomingRaw;
    try {
      const incoming = JSON.parse(incomingRaw);
      const currentRaw = localStorage.getItem(key);
      const current = currentRaw ? JSON.parse(currentRaw) : null;
      if (!incoming || typeof incoming !== 'object' || !current || typeof current !== 'object') return incomingRaw;
      if (typeof current.wallpaperData === 'string' && current.wallpaperData.startsWith('data:image/')) {
        incoming.wallpaperData = current.wallpaperData;
      }
      const localApps = new Map((Array.isArray(current.apps) ? current.apps : []).map(app => [String(app?.id || ''), app]));
      if (Array.isArray(incoming.apps)) {
        incoming.apps = incoming.apps.map(app => {
          const local = localApps.get(String(app?.id || ''));
          if (!local || !app || typeof app !== 'object') return app;
          const merged = { ...app };
          if (typeof local.icon === 'string' && local.icon.startsWith('data:image/')) merged.icon = local.icon;
          if (typeof local.iconUrl === 'string' && local.iconUrl.startsWith('data:image/')) merged.iconUrl = local.iconUrl;
          return merged;
        });
      }
      return JSON.stringify(incoming);
    } catch {
      return incomingRaw;
    }
  }

  async function publishBatch(entries) {
    if (!syncArea || !entries.length) return;
    const chunkWrites = {};
    const metaWrites = {};
    const removals = [];
    const oldMetaKeys = entries.map(([key]) => metaKey(key));
    const oldMetas = await syncArea.get(oldMetaKeys);

    for (const [key, item] of entries) {
      const previous = oldMetas[metaKey(key)];
      if (item.deleted) {
        metaWrites[metaKey(key)] = { key, deleted: true, partCount: 0, updatedAt: Date.now() };
        for (let index = 0; index < Number(previous?.partCount || 0); index++) removals.push(chunkKey(key, index));
        continue;
      }

      const bytes = new TextEncoder().encode(prepareCloudValue(key, item.raw));
      const chunks = [];
      for (let offset = 0; offset < bytes.length; offset += CHUNK_BYTES) {
        chunks.push(bytes.subarray(offset, Math.min(offset + CHUNK_BYTES, bytes.length)));
      }
      if (!chunks.length) chunks.push(new Uint8Array());
      chunks.forEach((chunk, index) => { chunkWrites[chunkKey(key, index)] = bytesToBase64(chunk); });
      metaWrites[metaKey(key)] = { key, deleted: false, partCount: chunks.length, updatedAt: Date.now() };
      for (let index = chunks.length; index < Number(previous?.partCount || 0); index++) removals.push(chunkKey(key, index));
    }

    // Payload parts are written first; the manifest is written afterwards.
    if (Object.keys(chunkWrites).length) await syncArea.set(chunkWrites);
    await syncArea.set(metaWrites);
    if (removals.length) await syncArea.remove(removals);
  }

  async function flushPending() {
    if (!ready || !syncArea || !pending.size) return;
    if (flushTimer) window.clearTimeout(flushTimer);
    flushTimer = null;
    const batch = [...pending.entries()];
    pending.clear();
    try {
      await publishBatch(batch);
      lastError = '';
      setStatus(t('saved'));
    } catch (error) {
      lastError = String(error?.message || error || 'Unknown error');
      setStatus(t('error') + lastError + ' Deine lokalen Einstellungen bleiben erhalten.', true);
      console.warn('[Schleim OS] Browser sync failed:', error);
    }
  }

  function queueChange(key, raw, deleted = false) {
    if (!ready || applyingRemote || !syncArea || !String(key).startsWith(LOCAL_PREFIX)) return;
    pending.set(String(key), deleted ? { deleted: true } : { raw: String(raw ?? '') });
    if (flushTimer) window.clearTimeout(flushTimer);
    flushTimer = window.setTimeout(() => { flushPending(); }, 450);
  }

  async function readRemoteValue(meta) {
    if (!meta || typeof meta.key !== 'string' || !meta.key.startsWith(LOCAL_PREFIX)) return null;
    if (meta.deleted) return { key: meta.key, deleted: true };
    const count = Math.max(0, Math.min(512, Number(meta.partCount) || 0));
    if (!count) return null;
    const keys = Array.from({ length: count }, (_, index) => chunkKey(meta.key, index));
    let values = await syncArea.get(keys);
    let chunks = keys.map(key => values[key]);
    if (chunks.some(value => typeof value !== 'string')) {
      await new Promise(resolve => window.setTimeout(resolve, 350));
      values = await syncArea.get(keys);
      chunks = keys.map(key => values[key]);
    }
    if (chunks.some(value => typeof value !== 'string')) throw new Error('A browser-sync data block is missing.');
    const arrays = chunks.map(base64ToBytes);
    const total = arrays.reduce((sum, chunk) => sum + chunk.length, 0);
    const joined = new Uint8Array(total);
    let offset = 0;
    for (const chunk of arrays) { joined.set(chunk, offset); offset += chunk.length; }
    return { key: meta.key, deleted: false, raw: new TextDecoder().decode(joined) };
  }

  async function applyRemoteMeta(meta, allowReload = true) {
    const remote = await readRemoteValue(meta);
    if (!remote) return false;
    let changed = false;
    applyingRemote = true;
    try {
      const current = localStorage.getItem(remote.key);
      if (remote.deleted) {
        if (current !== null) { nativeRemoveItem.call(localStorage, remote.key); changed = true; }
      } else {
        const merged = mergeLocalOnlyAssets(remote.key, remote.raw);
        if (current !== merged) { nativeSetItem.call(localStorage, remote.key, merged); changed = true; }
      }
    } finally {
      applyingRemote = false;
    }
    if (changed && allowReload && document.visibilityState === 'visible') {
      if (reloadTimer) window.clearTimeout(reloadTimer);
      setStatus(t('restored'));
      reloadTimer = window.setTimeout(() => window.location.reload(), 500);
    }
    return changed;
  }

  function installStorageHooks() {
    Storage.prototype.setItem = function (key, value) {
      const result = nativeSetItem.apply(this, arguments);
      if (this === localStorage && String(key).startsWith(LOCAL_PREFIX)) queueChange(String(key), String(value));
      return result;
    };
    Storage.prototype.removeItem = function (key) {
      const result = nativeRemoveItem.apply(this, arguments);
      if (this === localStorage && String(key).startsWith(LOCAL_PREFIX)) queueChange(String(key), null, true);
      return result;
    };
    Storage.prototype.clear = function () {
      const keys = this === localStorage
        ? Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(key => key?.startsWith(LOCAL_PREFIX))
        : [];
      const result = nativeClear.apply(this, arguments);
      keys.forEach(key => queueChange(key, null, true));
      return result;
    };
    window.addEventListener('storage', event => {
      if (event.storageArea !== localStorage || !event.key?.startsWith(LOCAL_PREFIX)) return;
      queueChange(event.key, event.newValue, event.newValue === null);
    });
    window.addEventListener('pagehide', () => { flushPending(); });
  }

  async function initializeSync() {
    if (!syncArea) {
      ready = true;
      mountPanel();
      setStatus(t('unsupported'), true);
      return;
    }

    try {
      try { await syncArea.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }); } catch { /* Optional on older compatible browsers. */ }
      const all = await syncArea.get(null);
      const remoteMetas = Object.entries(all)
        .filter(([key, value]) => key.startsWith(META_PREFIX) && value && typeof value === 'object' && typeof value.key === 'string')
        .map(([, value]) => value);
      const remoteKeys = new Set(remoteMetas.map(meta => meta.key));
      let restored = false;
      for (const meta of remoteMetas) restored = (await applyRemoteMeta(meta, false)) || restored;

      const localEntries = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith(LOCAL_PREFIX) && !remoteKeys.has(key)) {
          localEntries.push([key, { raw: localStorage.getItem(key) || '' }]);
        }
      }
      if (localEntries.length) await publishBatch(localEntries);

      ready = true;
      installStorageHooks();
      mountPanel();
      const bytesInUse = await syncArea.getBytesInUse(null).catch(() => null);
      const usage = Number.isFinite(bytesInUse) ? ' (' + (bytesInUse / 1024).toFixed(1) + ' KB used)' : '';
      setStatus(lastError ? t('error') + lastError : t('ready') + usage, !!lastError);
      if (restored) {
        setStatus(t('restored'));
        window.setTimeout(() => window.location.reload(), 500);
      }

      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'sync') return;
        const changedMetas = Object.entries(changes)
          .filter(([key, change]) => key.startsWith(META_PREFIX) && change.newValue)
          .map(([, change]) => change.newValue);
        changedMetas.reduce((promise, meta) => promise.then(() => applyRemoteMeta(meta, true)), Promise.resolve())
          .catch(error => {
            lastError = String(error?.message || error);
            setStatus(t('error') + lastError, true);
          });
      });
    } catch (error) {
      ready = true;
      lastError = String(error?.message || error || 'Unknown error');
      installStorageHooks();
      mountPanel();
      setStatus(t('error') + lastError + ' Your local settings are preserved.', true);
      console.warn('[Schleim OS] Could not initialize browser sync:', error);
    }
  }

  function observeSettingsPanel() {
    mountPanel();
    if (!document.body || !globalThis.MutationObserver) return;
    const observer = new MutationObserver(() => mountPanel());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  observeSettingsPanel();
  initializeSync();
})();
