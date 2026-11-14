(() => {
  'use strict';

  const STORAGE_KEY = 'sonosControlConfig';
  const TEXT = {
    de: {
      intro: 'Steuere deine Sonos-Lautsprecher direkt aus Schleim OS.',
      bridgeTitle: 'Verbindung einrichten',
      bridgeIntro: 'Trage die URL deiner bereitgestellten Schleim-OS-Sonos-Bridge ein.',
      bridgeUrl: 'Cloudflare-Worker-URL',
      save: 'Server speichern',
      connect: 'Mit Sonos verbinden',
      reconnect: 'Erneut verbinden',
      disconnect: 'Sonos trennen',
      accountNeeded: 'Melde dich mit deinem Sonos-Konto an und erlaube Schleim OS den Zugriff auf dein Sonos-System.',
      notConfigured: 'Die Sonos-Bridge ist noch nicht eingerichtet. Folge zuerst der Einrichtungsanleitung.',
      permission: 'Erlaube Schleim OS den Netzwerkzugriff auf die eingetragene Bridge.',
      connecting: 'Warte auf die Freigabe bei Sonos …',
      connected: 'Mit Sonos verbunden',
      failed: 'Die Verbindung konnte nicht hergestellt werden.',
      house: 'Sonos-Haushalt',
      room: 'Lautsprecher oder Raumgruppe',
      refresh: 'Aktualisieren',
      nowPlaying: 'Aktuelle Wiedergabe',
      nothingPlaying: 'Im Moment wird nichts wiedergegeben.',
      unknownTrack: 'Unbekannter Titel',
      source: 'Quelle',
      previous: 'Vorheriger Titel',
      play: 'Wiedergabe',
      pause: 'Pause',
      next: 'Nächster Titel',
      rewind: '15 Sekunden zurück',
      forward: '15 Sekunden vor',
      volume: 'Lautstärke',
      mute: 'Stumm',
      unmute: 'Ton einschalten',
      modes: 'Wiedergabeoptionen',
      shuffle: 'Zufallswiedergabe',
      repeat: 'Wiederholen',
      repeatOne: 'Titel wiederholen',
      crossfade: 'Überblenden',
      favorites: 'Sonos-Favoriten',
      playlists: 'Sonos-Playlists',
      noFavorites: 'Keine Sonos-Favoriten gefunden.',
      noPlaylists: 'Keine Sonos-Playlists gefunden.',
      commandTitle: 'Musik über Texteingabe starten',
      commandPlaceholder: 'Zum Beispiel: Spiele meinen Favoriten Radio oder Playlist Sommer',
      commandButton: 'Auf Sonos abspielen',
      commandHint: 'Die offizielle Control API kann gespeicherte Sonos-Favoriten und Sonos-Playlists starten. Eine freie Suche nach beliebigen Titeln über alle verbundenen Musikdienste ist für Drittanbieter-Apps nicht Teil dieser API. Speichere gewünschte Titel oder Sender in Sonos zuerst als Favorit.',
      noMatch: 'Kein passender Sonos-Favorit oder keine Playlist gefunden. Speichere den Inhalt zuerst in der Sonos-App als Favorit oder Playlist.',
      saved: 'Einstellungen gespeichert.',
      disconnected: 'Sonos wurde getrennt.',
      badUrl: 'Bitte gib eine gültige HTTPS-Worker-URL ein.',
      permissionDenied: 'Der Netzwerkzugriff wurde nicht freigegeben.',
      popupBlocked: 'Der Browser hat das Anmeldefenster blockiert. Erlaube Pop-ups für Schleim OS und versuche es erneut.',
      bridgeError: 'Die Bridge ist nicht erreichbar. Prüfe URL und Bereitstellung.',
      loading: 'Lade Sonos-System …',
      attribution: 'Wiedergabe über Sonos',
      setupGuide: 'Einrichtungsanleitung öffnen',
      chooseHouse: 'Haushalt auswählen',
      chooseRoom: 'Raum auswählen',
      statusIdle: 'Bereit',
      noDuration: '--:--'
    },
    en: {
      intro: 'Control your Sonos speakers directly from Schleim OS.',
      bridgeTitle: 'Configure connection',
      bridgeIntro: 'Enter the URL of your deployed Schleim OS Sonos Bridge.',
      bridgeUrl: 'Cloudflare Worker URL',
      save: 'Save server',
      connect: 'Connect to Sonos',
      reconnect: 'Reconnect',
      disconnect: 'Disconnect Sonos',
      accountNeeded: 'Sign in with your Sonos account and allow Schleim OS to access your Sonos system.',
      notConfigured: 'The Sonos Bridge is not configured yet. Follow the setup guide first.',
      permission: 'Allow Schleim OS to access the entered Bridge URL.',
      connecting: 'Waiting for Sonos authorization …',
      connected: 'Connected to Sonos',
      failed: 'Connection could not be established.',
      house: 'Sonos household',
      room: 'Speaker or room group',
      refresh: 'Refresh',
      nowPlaying: 'Now playing',
      nothingPlaying: 'Nothing is playing right now.',
      unknownTrack: 'Unknown track',
      source: 'Source',
      previous: 'Previous track',
      play: 'Play',
      pause: 'Pause',
      next: 'Next track',
      rewind: 'Rewind 15 seconds',
      forward: 'Fast forward 15 seconds',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      modes: 'Playback options',
      shuffle: 'Shuffle',
      repeat: 'Repeat',
      repeatOne: 'Repeat track',
      crossfade: 'Crossfade',
      favorites: 'Sonos favorites',
      playlists: 'Sonos playlists',
      noFavorites: 'No Sonos favorites found.',
      noPlaylists: 'No Sonos playlists found.',
      commandTitle: 'Start music with text input',
      commandPlaceholder: 'For example: Play my favorite Radio or playlist Summer',
      commandButton: 'Play on Sonos',
      commandHint: 'The official Control API can start saved Sonos favorites and Sonos playlists. Free-text search for arbitrary tracks across all connected music services is not part of this API for third-party apps. Save tracks or stations as Sonos favorites in the Sonos app first.',
      noMatch: 'No matching Sonos favorite or playlist was found. Save the content in the Sonos app as a favorite or playlist first.',
      saved: 'Settings saved.',
      disconnected: 'Sonos disconnected.',
      badUrl: 'Enter a valid HTTPS Worker URL.',
      permissionDenied: 'Network access was not granted.',
      popupBlocked: 'The browser blocked the sign-in window. Allow pop-ups for Schleim OS and try again.',
      bridgeError: 'The Bridge is unreachable. Check the URL and deployment.',
      loading: 'Loading Sonos system …',
      attribution: 'Playback via Sonos',
      setupGuide: 'Open setup guide',
      chooseHouse: 'Choose household',
      chooseRoom: 'Choose room',
      statusIdle: 'Ready',
      noDuration: '--:--'
    },
    nl: {
      intro: 'Bedien je Sonos-speakers rechtstreeks vanuit Schleim OS.',
      bridgeTitle: 'Verbinding instellen',
      bridgeIntro: 'Voer de URL in van je geïmplementeerde Schleim OS Sonos Bridge.',
      bridgeUrl: 'Cloudflare Worker-URL',
      save: 'Server opslaan',
      connect: 'Verbinden met Sonos',
      reconnect: 'Opnieuw verbinden',
      disconnect: 'Sonos ontkoppelen',
      accountNeeded: 'Meld je aan met je Sonos-account en geef Schleim OS toegang tot je Sonos-systeem.',
      notConfigured: 'De Sonos Bridge is nog niet ingesteld. Volg eerst de installatiehandleiding.',
      permission: 'Geef Schleim OS netwerktoegang tot de ingevoerde Bridge.',
      connecting: 'Wachten op toestemming bij Sonos …',
      connected: 'Verbonden met Sonos',
      failed: 'De verbinding kon niet worden gemaakt.',
      house: 'Sonos-huishouden',
      room: 'Speaker of kamergroep',
      refresh: 'Vernieuwen',
      nowPlaying: 'Wordt nu afgespeeld',
      nothingPlaying: 'Er wordt momenteel niets afgespeeld.',
      unknownTrack: 'Onbekend nummer',
      source: 'Bron',
      previous: 'Vorig nummer',
      play: 'Afspelen',
      pause: 'Pauzeren',
      next: 'Volgend nummer',
      rewind: '15 seconden terug',
      forward: '15 seconden vooruit',
      volume: 'Volume',
      mute: 'Dempen',
      unmute: 'Geluid inschakelen',
      modes: 'Afspeelopties',
      shuffle: 'Willekeurig afspelen',
      repeat: 'Herhalen',
      repeatOne: 'Nummer herhalen',
      crossfade: 'Crossfade',
      favorites: 'Sonos-favorieten',
      playlists: 'Sonos-afspeellijsten',
      noFavorites: 'Geen Sonos-favorieten gevonden.',
      noPlaylists: 'Geen Sonos-afspeellijsten gevonden.',
      commandTitle: 'Muziek starten met tekstinvoer',
      commandPlaceholder: 'Bijvoorbeeld: Speel mijn favoriet Radio of afspeellijst Zomer',
      commandButton: 'Afspelen op Sonos',
      commandHint: 'De officiële Control API kan opgeslagen Sonos-favorieten en Sonos-afspeellijsten starten. Vrij zoeken naar willekeurige nummers via alle verbonden muziekdiensten maakt geen deel uit van deze API voor apps van derden. Sla nummers of zenders eerst als Sonos-favoriet op in de Sonos-app.',
      noMatch: 'Geen overeenkomende Sonos-favoriet of afspeellijst gevonden. Sla de inhoud eerst op in de Sonos-app.',
      saved: 'Instellingen opgeslagen.',
      disconnected: 'Sonos is ontkoppeld.',
      badUrl: 'Voer een geldige HTTPS Worker-URL in.',
      permissionDenied: 'Netwerktoegang is niet verleend.',
      popupBlocked: 'De browser heeft het aanmeldvenster geblokkeerd. Sta pop-ups toe voor Schleim OS en probeer het opnieuw.',
      bridgeError: 'De Bridge is niet bereikbaar. Controleer de URL en implementatie.',
      loading: 'Sonos-systeem laden …',
      attribution: 'Afgespeeld via Sonos',
      setupGuide: 'Installatiehandleiding openen',
      chooseHouse: 'Huishouden kiezen',
      chooseRoom: 'Kamer kiezen',
      statusIdle: 'Gereed',
      noDuration: '--:--'
    }
  };

  const lang = () => document.body?.dataset.language || 'de';
  const t = key => TEXT[lang()]?.[key] || TEXT.de[key] || key;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[char]));
  const safeId = value => String(value || '').replace(/[^A-Za-z0-9_.:-]/g, '');
  const validHttpUrl = value => {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.origin : ''; }
    catch { return ''; }
  };
  const formatTime = value => {
    const seconds = Math.max(0, Math.floor(Number(value || 0) / 1000));
    return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  };

  let root = null;
  let config = { workerUrl: '', sessionId: '', householdId: '', groupId: '' };
  let households = [];
  let groups = [];
  let players = [];
  let favorites = [];
  let playlists = [];
  let playback = {};
  let metadata = {};
  let volume = {};
  let playModes = {};
  let pollTimer = null;
  let operationBusy = false;

  function render() {
    return '<div class="ssos-sonos-app" id="ssosSonosApp">' +
      '<div class="ssos-sonos-hero"><div><p class="eyebrow">SCHLEIM OS · SONOS CONTROL</p><h2>Sonos.</h2><p>' + esc(t('intro')) + '</p></div><span class="ssos-sonos-hero-icon">🔊</span></div>' +
      '<section class="ssos-sonos-card ssos-sonos-setup">' +
        '<div class="ssos-sonos-section-head"><div><p class="eyebrow">BRIDGE</p><h3>' + esc(t('bridgeTitle')) + '</h3></div><span class="ssos-sonos-state-dot"></span></div>' +
        '<p class="ssos-sonos-muted">' + esc(t('bridgeIntro')) + '</p>' +
        '<label class="ssos-sonos-label" for="ssosSonosWorkerUrl">' + esc(t('bridgeUrl')) + '</label>' +
        '<input id="ssosSonosWorkerUrl" type="url" inputmode="url" autocomplete="url" placeholder="https://dein-worker.workers.dev" value="">' +
        '<div class="ssos-sonos-row"><button class="app-button secondary" type="button" data-sonos-action="save-worker">' + esc(t('save')) + '</button><a class="ssos-sonos-guide" href="https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/blob/main/extension/docs/SONOS-APP.md" target="_blank" rel="noopener noreferrer">' + esc(t('setupGuide')) + ' ↗</a></div>' +
        '<p class="ssos-sonos-muted">' + esc(t('permission')) + '</p>' +
        '<button class="app-button" type="button" data-sonos-action="connect">' + esc(t('connect')) + '</button>' +
        '<p class="ssos-sonos-status" id="ssosSonosStatus" role="status" aria-live="polite"></p>' +
      '</section>' +
      '<section class="ssos-sonos-control-panel" id="ssosSonosControlPanel" hidden>' +
        '<div class="ssos-sonos-connection-line"><span class="ssos-sonos-connected-mark">●</span><b>' + esc(t('connected')) + '</b><button type="button" class="text-button" data-sonos-action="refresh">' + esc(t('refresh')) + '</button><button type="button" class="text-button ssos-sonos-disconnect" data-sonos-action="disconnect">' + esc(t('disconnect')) + '</button></div>' +
        '<div class="ssos-sonos-select-grid">' +
          '<label class="ssos-sonos-label">' + esc(t('house')) + '<select id="ssosSonosHousehold"><option value="">' + esc(t('chooseHouse')) + '</option></select></label>' +
          '<label class="ssos-sonos-label">' + esc(t('room')) + '<select id="ssosSonosGroup"><option value="">' + esc(t('chooseRoom')) + '</option></select></label>' +
        '</div>' +
        '<section class="ssos-sonos-card ssos-sonos-now-playing">' +
          '<div class="ssos-sonos-section-head"><div><p class="eyebrow">SONOS</p><h3>' + esc(t('nowPlaying')) + '</h3></div><span id="ssosSonosPlaybackState" class="ssos-sonos-playback-state">' + esc(t('statusIdle')) + '</span></div>' +
          '<div class="ssos-sonos-track">' +
            '<div class="ssos-sonos-art" id="ssosSonosArt">🔊</div>' +
            '<div class="ssos-sonos-track-info"><b id="ssosSonosTrackTitle">' + esc(t('nothingPlaying')) + '</b><span id="ssosSonosTrackArtist">—</span><small id="ssosSonosTrackAlbum"></small><small id="ssosSonosSource">' + esc(t('attribution')) + '</small></div>' +
          '</div>' +
          '<div class="ssos-sonos-progress"><span id="ssosSonosPosition">' + esc(t('noDuration')) + '</span><input id="ssosSonosSeek" type="range" min="0" max="1000" value="0" aria-label="Seek"><span id="ssosSonosDuration">' + esc(t('noDuration')) + '</span></div>' +
          '<div class="ssos-sonos-transport">' +
            '<button type="button" data-sonos-action="previous" aria-label="' + esc(t('previous')) + '" title="' + esc(t('previous')) + '">⏮</button>' +
            '<button type="button" data-sonos-action="rewind" aria-label="' + esc(t('rewind')) + '" title="' + esc(t('rewind')) + '">↶ 15</button>' +
            '<button type="button" class="ssos-sonos-main-play" id="ssosSonosPlayPause" data-sonos-action="playpause" aria-label="' + esc(t('play')) + '" title="' + esc(t('play')) + '">▶</button>' +
            '<button type="button" data-sonos-action="forward" aria-label="' + esc(t('forward')) + '" title="' + esc(t('forward')) + '">15 ↷</button>' +
            '<button type="button" data-sonos-action="next" aria-label="' + esc(t('next')) + '" title="' + esc(t('next')) + '">⏭</button>' +
          '</div>' +
        '</section>' +
        '<section class="ssos-sonos-card ssos-sonos-volume-card">' +
          '<div class="ssos-sonos-section-head"><h3>' + esc(t('volume')) + '</h3><span id="ssosSonosVolumeValue">—</span></div>' +
          '<div class="ssos-sonos-volume-row"><input id="ssosSonosVolume" type="range" min="0" max="100" value="20" aria-label="' + esc(t('volume')) + '"><button type="button" class="ssos-sonos-mute" data-sonos-action="mute" id="ssosSonosMute">' + esc(t('mute')) + '</button></div>' +
        '</section>' +
        '<section class="ssos-sonos-card">' +
          '<div class="ssos-sonos-section-head"><h3>' + esc(t('modes')) + '</h3></div>' +
          '<div class="ssos-sonos-modes">' +
            '<label><input type="checkbox" id="ssosSonosShuffle"> ' + esc(t('shuffle')) + '</label>' +
            '<label><input type="checkbox" id="ssosSonosRepeat"> ' + esc(t('repeat')) + '</label>' +
            '<label><input type="checkbox" id="ssosSonosRepeatOne"> ' + esc(t('repeatOne')) + '</label>' +
            '<label><input type="checkbox" id="ssosSonosCrossfade"> ' + esc(t('crossfade')) + '</label>' +
          '</div>' +
        '</section>' +
        '<section class="ssos-sonos-card">' +
          '<div class="ssos-sonos-section-head"><h3>' + esc(t('favorites')) + '</h3></div><div class="ssos-sonos-library-list" id="ssosSonosFavorites"><p class="ssos-sonos-muted">' + esc(t('noFavorites')) + '</p></div>' +
        '</section>' +
        '<section class="ssos-sonos-card">' +
          '<div class="ssos-sonos-section-head"><h3>' + esc(t('playlists')) + '</h3></div><div class="ssos-sonos-library-list" id="ssosSonosPlaylists"><p class="ssos-sonos-muted">' + esc(t('noPlaylists')) + '</p></div>' +
        '</section>' +
        '<section class="ssos-sonos-card ssos-sonos-command-card">' +
          '<div class="ssos-sonos-section-head"><h3>' + esc(t('commandTitle')) + '</h3></div>' +
          '<form id="ssosSonosCommandForm"><input id="ssosSonosCommand" type="text" maxlength="160" placeholder="' + esc(t('commandPlaceholder')) + '" autocomplete="off"><button class="app-button" type="submit">' + esc(t('commandButton')) + '</button></form>' +
          '<p class="ssos-sonos-muted">' + esc(t('commandHint')) + '</p>' +
        '</section>' +
      '</section>' +
    '</div>';
  }

  function storageGet() {
    return new Promise(resolve => {
      const area = globalThis.chrome?.storage?.local;
      if (area?.get) {
        area.get(STORAGE_KEY, result => resolve(result?.[STORAGE_KEY] || {}));
      } else {
        try { resolve(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); } catch { resolve({}); }
      }
    });
  }
  function storageSet(value) {
    return new Promise((resolve, reject) => {
      const area = globalThis.chrome?.storage?.local;
      if (area?.set) {
        area.set({ [STORAGE_KEY]: value }, () => {
          const error = globalThis.chrome?.runtime?.lastError;
          if (error) reject(new Error(error.message));
          else resolve();
        });
      } else {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); resolve(); }
        catch (error) { reject(error); }
      }
    });
  }

  function setStatus(message, error = false) {
    const node = root?.querySelector('#ssosSonosStatus');
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('is-error', !!error);
  }
  function setConnected(value) {
    const panel = root?.querySelector('#ssosSonosControlPanel');
    const connect = root?.querySelector('[data-sonos-action="connect"]');
    if (panel) panel.hidden = !value;
    if (connect) connect.hidden = !!value;
  }
  function api(path, method = 'GET', body) {
    if (!config.workerUrl || !config.sessionId) return Promise.reject(new Error(t('notConfigured')));
    const options = {
      method,
      headers: { 'Authorization': 'Bearer ' + config.sessionId, 'Accept': 'application/json' },
      cache: 'no-store'
    };
    if (body !== undefined) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    return fetch(config.workerUrl + '/api' + path, options).then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || ('Sonos API error ' + response.status));
      return data;
    });
  }
  async function requestWorkerPermission() {
    if (!globalThis.chrome?.permissions?.request) return true;
    const origin = validHttpUrl(config.workerUrl);
    if (!origin) return false;
    return new Promise(resolve => {
      chrome.permissions.request({ origins: [origin + '/*'] }, granted => resolve(!!granted));
    });
  }
  function makeState() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  }
  function pause(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  async function pollAuthorization(state, popup) {
    setStatus(t('connecting'));
    for (let i = 0; i < 60; i++) {
      await pause(2000);
      if (!root?.isConnected) return;
      try {
        const response = await fetch(config.workerUrl + '/oauth/status', {
          headers: { 'Authorization': 'Bearer ' + state, 'Accept': 'application/json' },
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.connected) {
            config.sessionId = state;
            config.pendingState = '';
            await storageSet(config);
            if (popup && !popup.closed) popup.close();
            await loadSonosSystem();
            return;
          }
        }
      } catch { /* The user may still be signing in. */ }
    }
    if (popup && !popup.closed) popup.close();
    setStatus(t('failed'), true);
  }
  async function connectSonos() {
    if (!config.workerUrl) { setStatus(t('notConfigured'), true); return; }
    const popup = window.open('about:blank', '_blank');
    if (!popup) { setStatus(t('popupBlocked'), true); return; }
    try {
      const granted = await requestWorkerPermission();
      if (!granted) {
        popup.close();
        setStatus(t('permissionDenied'), true);
        return;
      }
      const state = makeState();
      config.pendingState = state;
      await storageSet(config);
      popup.location.replace(config.workerUrl + '/oauth/login?state=' + encodeURIComponent(state));
      await pollAuthorization(state, popup);
    } catch (error) {
      if (popup && !popup.closed) popup.close();
      setStatus(error.message || t('failed'), true);
    }
  }
  async function checkSession() {
    if (!config.sessionId || !config.workerUrl) return false;
    const response = await fetch(config.workerUrl + '/oauth/status', {
      headers: { 'Authorization': 'Bearer ' + config.sessionId, 'Accept': 'application/json' },
      cache: 'no-store'
    }).catch(() => null);
    if (!response?.ok) {
      config.sessionId = '';
      await storageSet(config);
      return false;
    }
    return true;
  }
  function selectedHousehold() { return config.householdId || households[0]?.id || ''; }
  function selectedGroup() { return config.groupId || groups[0]?.id || ''; }
  function playerLabel(group) {
    if (group.name) return group.name;
    const ids = group.playerIds || [];
    const names = ids.map(id => players.find(player => player.id === id)?.name).filter(Boolean);
    return names.join(' + ') || group.id || 'Sonos';
  }
  function fillSelect(selector, items, value, labelFn, placeholder) {
    const select = root?.querySelector(selector);
    if (!select) return;
    select.innerHTML = '<option value="">' + esc(placeholder) + '</option>' + items.map(item =>
      '<option value="' + esc(item.id) + '"' + (item.id === value ? ' selected' : '') + '>' + esc(labelFn(item)) + '</option>'
    ).join('');
  }
  async function loadSonosSystem() {
    if (!root?.isConnected) return;
    setConnected(true);
    setStatus(t('loading'));
    try {
      const data = await api('/households');
      households = Array.isArray(data.households) ? data.households : [];
      if (!households.length) throw new Error('No Sonos household was returned for this account.');
      if (!households.some(item => item.id === config.householdId)) config.householdId = households[0].id;
      fillSelect('#ssosSonosHousehold', households, config.householdId, item => item.name || item.id, t('chooseHouse'));
      await loadGroups();
      setStatus(t('connected'));
      if (pollTimer) clearInterval(pollTimer);
      pollTimer = setInterval(() => { if (root?.isConnected) refreshPlayback(); }, 12000);
    } catch (error) {
      setConnected(false);
      setStatus(error.message || t('bridgeError'), true);
    }
  }
  async function loadGroups() {
    const householdId = selectedHousehold();
    if (!householdId) return;
    config.householdId = householdId;
    await storageSet(config);
    const data = await api('/households/' + safeId(householdId) + '/groups');
    groups = Array.isArray(data.groups) ? data.groups : [];
    players = Array.isArray(data.players) ? data.players : [];
    if (!groups.some(item => item.id === config.groupId)) config.groupId = groups[0]?.id || '';
    fillSelect('#ssosSonosGroup', groups, config.groupId, playerLabel, t('chooseRoom'));
    await loadGroupContent();
  }
  async function loadGroupContent() {
    const groupId = safeId(selectedGroup());
    if (!groupId) return;
    config.groupId = groupId;
    await storageSet(config);
    await Promise.all([refreshPlayback(), loadLibrary()]);
  }
  async function refreshPlayback() {
    const groupId = safeId(selectedGroup());
    if (!groupId) return;
    try {
      const results = await Promise.all([
        api('/groups/' + groupId + '/playback'),
        api('/groups/' + groupId + '/playbackMetadata'),
        api('/groups/' + groupId + '/groupVolume'),
        api('/groups/' + groupId + '/playback/playMode').catch(() => ({}))
      ]);
      playback = results[0] || {};
      metadata = results[1] || {};
      volume = results[2] || {};
      playModes = results[3]?.playModes || results[3] || {};
      updatePlaybackUI();
    } catch (error) {
      setStatus(error.message || t('bridgeError'), true);
    }
  }
  async function loadLibrary() {
    const householdId = safeId(selectedHousehold());
    if (!householdId) return;
    const results = await Promise.all([
      api('/households/' + householdId + '/favorites').catch(() => ({})),
      api('/households/' + householdId + '/playlists').catch(() => ({}))
    ]);
    favorites = results[0]?.favorites || results[0]?.items || [];
    playlists = results[1]?.playlists || results[1]?.items || [];
    renderLibrary();
  }
  function currentItem() {
    return metadata.currentItem || metadata.item || playback.currentItem || {};
  }
  function updatePlaybackUI() {
    if (!root?.isConnected) return;
    const item = currentItem();
    const title = item.name || item.title || item.trackName || t('nothingPlaying');
    const artist = item.artist || item.artistName || '';
    const album = item.album || item.albumName || '';
    const art = item.imageUrl || item.artUrl || item.artworkUrl || item.albumArtUri || '';
    const source = metadata.container?.name || metadata.container?.serviceName || metadata.container?.type || t('attribution');
    const state = playback.playbackState || playback.state || 'PLAYBACK_STATE_IDLE';
    const duration = Number(item.durationMillis || item.duration || playback.durationMillis || 0);
    const position = Number(playback.positionMillis || playback.position || item.positionMillis || 0);
    const setText = (id, value) => { const el = root.querySelector(id); if (el) el.textContent = String(value || ''); };
    setText('#ssosSonosTrackTitle', title);
    setText('#ssosSonosTrackArtist', artist || '—');
    setText('#ssosSonosTrackAlbum', album);
    setText('#ssosSonosSource', t('attribution') + (source && source !== t('attribution') ? ' · ' + source : ''));
    setText('#ssosSonosPlaybackState', state.replace('PLAYBACK_STATE_', '').toLocaleLowerCase(lang()));
    setText('#ssosSonosPosition', formatTime(position));
    setText('#ssosSonosDuration', duration ? formatTime(duration) : t('noDuration'));
    const artBox = root.querySelector('#ssosSonosArt');
    if (artBox) {
      if (/^https?:\/\//i.test(art)) artBox.innerHTML = '<img src="' + esc(art) + '" alt="">';
      else artBox.textContent = '🔊';
    }
    const seek = root.querySelector('#ssosSonosSeek');
    const canSeek = playback.playbackAction?.canSeek !== false && duration > 0;
    if (seek) {
      seek.max = String(duration || 1000);
      seek.value = String(Math.min(position, duration || 1000));
      seek.disabled = !canSeek;
    }
    const playing = state === 'PLAYBACK_STATE_PLAYING' || state === 'PLAYING';
    const playButton = root.querySelector('#ssosSonosPlayPause');
    if (playButton) {
      playButton.textContent = playing ? 'Ⅱ' : '▶';
      playButton.setAttribute('aria-label', playing ? t('pause') : t('play'));
      playButton.title = playing ? t('pause') : t('play');
    }
    const actions = playback.playbackAction || {};
    const previous = root.querySelector('[data-sonos-action="previous"]');
    const next = root.querySelector('[data-sonos-action="next"]');
    if (previous) previous.disabled = actions.canSkipBack === false;
    if (next) next.disabled = actions.canSkip === false;
    const volumeSlider = root.querySelector('#ssosSonosVolume');
    if (volumeSlider && document.activeElement !== volumeSlider) volumeSlider.value = String(volume.volume ?? 20);
    setText('#ssosSonosVolumeValue', Number(volume.volume ?? 0) + '%');
    const mute = root.querySelector('#ssosSonosMute');
    if (mute) mute.textContent = volume.muted ? t('unmute') : t('mute');
    const modes = {
      shuffle: 'shuffle',
      repeat: 'repeat',
      repeatOne: 'repeatOne',
      crossfade: 'crossfade'
    };
    Object.entries(modes).forEach(([key, id]) => {
      const checkbox = root.querySelector('#ssosSonos' + id.charAt(0).toUpperCase() + id.slice(1));
      if (checkbox) checkbox.checked = !!playModes[key];
    });
  }
  function renderLibrary() {
    const list = (items, target, type, empty) => {
      const node = root?.querySelector(target);
      if (!node) return;
      node.innerHTML = items.length ? items.map(item => {
        const name = item.name || item.title || item.id || 'Sonos';
        const id = item.id || item.favoriteId || item.playlistId || '';
        return '<button class="ssos-sonos-library-item" type="button" data-sonos-' + type + '-id="' + esc(id) + '"><span>♫</span><b>' + esc(name) + '</b><span>▶</span></button>';
      }).join('') : '<p class="ssos-sonos-muted">' + esc(empty) + '</p>';
    };
    list(favorites, '#ssosSonosFavorites', 'favorite', t('noFavorites'));
    list(playlists, '#ssosSonosPlaylists', 'playlist', t('noPlaylists'));
  }
  async function action(path, method = 'POST', body) {
    if (operationBusy) return;
    operationBusy = true;
    try {
      await api(path, method, body);
      await refreshPlayback();
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      operationBusy = false;
    }
  }
  async function setPlayMode(key, value) {
    const groupId = safeId(selectedGroup());
    if (!groupId) return;
    try {
      await api('/groups/' + groupId + '/playback/playMode', 'POST', { playModes: { [key]: value } });
      playModes[key] = value;
      setStatus(t('connected'));
    } catch (error) {
      setStatus(error.message, true);
    }
  }
  async function playFavorite(id) {
    const groupId = safeId(selectedGroup());
    if (!groupId || !id) return;
    await action('/groups/' + groupId + '/favorites', 'POST', { favoriteId: id, action: 'PLAY_NOW', playOnCompletion: true });
  }
  async function playPlaylist(id) {
    const groupId = safeId(selectedGroup());
    if (!groupId || !id) return;
    await action('/groups/' + groupId + '/playlists', 'POST', { playlistId: id, action: 'PLAY_NOW' });
  }
  function normalizeSearch(value) {
    return String(value || '').toLocaleLowerCase(lang()).replace(/^(spiele|spiel|play|speel)\s+/i, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  async function runTextCommand(value) {
    const query = normalizeSearch(value);
    if (!query) return;
    const find = list => list.find(item => {
      const name = normalizeSearch(item.name || item.title || '');
      return name === query || name.includes(query) || query.includes(name);
    });
    const favorite = find(favorites);
    if (favorite) { await playFavorite(favorite.id || favorite.favoriteId); return; }
    const playlist = find(playlists);
    if (playlist) { await playPlaylist(playlist.id || playlist.playlistId); return; }
    setStatus(t('noMatch'), true);
  }
  async function saveWorker() {
    const input = root?.querySelector('#ssosSonosWorkerUrl');
    const raw = String(input?.value || '').trim().replace(/\/+$/, '');
    const origin = validHttpUrl(raw);
    if (!origin || new URL(raw).pathname !== '/' && new URL(raw).pathname !== '') {
      setStatus(t('badUrl'), true);
      return;
    }
    config.workerUrl = origin;
    try {
      const granted = await requestWorkerPermission();
      if (!granted) { setStatus(t('permissionDenied'), true); return; }
      await storageSet(config);
      setStatus(t('saved'));
    } catch (error) {
      setStatus(error.message, true);
    }
  }
  async function disconnect() {
    if (config.sessionId && config.workerUrl) {
      await fetch(config.workerUrl + '/session', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + config.sessionId },
        cache: 'no-store'
      }).catch(() => null);
    }
    config.sessionId = '';
    config.pendingState = '';
    await storageSet(config);
    households = [];
    groups = [];
    favorites = [];
    playlists = [];
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
    setConnected(false);
    setStatus(t('disconnected'));
  }
  function bindEvents() {
    if (root.dataset.sonosBound) return;
    root.dataset.sonosBound = '1';
    root.querySelector('#ssosSonosWorkerUrl').value = config.workerUrl || '';
    root.addEventListener('click', async event => {
      const favoriteButton = event.target.closest('[data-sonos-favorite-id]');
      if (favoriteButton) { await playFavorite(favoriteButton.dataset.sonosFavoriteId); return; }
      const playlistButton = event.target.closest('[data-sonos-playlist-id]');
      if (playlistButton) { await playPlaylist(playlistButton.dataset.sonosPlaylistId); return; }
      const button = event.target.closest('[data-sonos-action]');
      if (!button) return;
      const kind = button.dataset.sonosAction;
      if (kind === 'save-worker') { await saveWorker(); return; }
      if (kind === 'connect') { await connectSonos(); return; }
      if (kind === 'refresh') { await loadSonosSystem(); return; }
      if (kind === 'disconnect') { await disconnect(); return; }
      const groupId = safeId(selectedGroup());
      if (!groupId) return;
      if (kind === 'playpause') {
        const state = playback.playbackState || playback.state || '';
        const playing = state === 'PLAYBACK_STATE_PLAYING' || state === 'PLAYING';
        await action('/groups/' + groupId + '/playback/' + (playing ? 'pause' : 'play'));
      } else if (kind === 'previous') await action('/groups/' + groupId + '/playback/skipToPreviousTrack');
      else if (kind === 'next') await action('/groups/' + groupId + '/playback/skipToNextTrack');
      else if (kind === 'rewind' || kind === 'forward') {
        const duration = Number(currentItem().durationMillis || playback.durationMillis || 0);
        const position = Number(playback.positionMillis || playback.position || 0);
        const next = Math.max(0, Math.min(duration || Number.MAX_SAFE_INTEGER, position + (kind === 'forward' ? 15000 : -15000)));
        await action('/groups/' + groupId + '/playback/seek', 'POST', { positionMillis: next });
      } else if (kind === 'mute') {
        await api('/groups/' + groupId + '/groupVolume/mute', 'POST', { muted: !volume.muted });
        await refreshPlayback();
      }
    });
    root.addEventListener('change', async event => {
      if (event.target.id === 'ssosSonosHousehold') {
        config.householdId = event.target.value;
        config.groupId = '';
        await loadGroups().catch(error => setStatus(error.message, true));
      }
      if (event.target.id === 'ssosSonosGroup') {
        config.groupId = event.target.value;
        await loadGroupContent().catch(error => setStatus(error.message, true));
      }
      if (event.target.id === 'ssosSonosVolume') {
        const groupId = safeId(selectedGroup());
        await api('/groups/' + groupId + '/groupVolume', 'POST', { volume: Number(event.target.value) })
          .then(refreshPlayback).catch(error => setStatus(error.message, true));
      }
      const modeMap = {
        ssosSonosShuffle: 'shuffle',
        ssosSonosRepeat: 'repeat',
        ssosSonosRepeatOne: 'repeatOne',
        ssosSonosCrossfade: 'crossfade'
      };
      if (modeMap[event.target.id]) await setPlayMode(modeMap[event.target.id], !!event.target.checked);
      if (event.target.id === 'ssosSonosSeek') {
        const groupId = safeId(selectedGroup());
        await api('/groups/' + groupId + '/playback/seek', 'POST', { positionMillis: Number(event.target.value) })
          .then(refreshPlayback).catch(error => setStatus(error.message, true));
      }
    });
    root.addEventListener('submit', async event => {
      if (event.target.id !== 'ssosSonosCommandForm') return;
      event.preventDefault();
      await runTextCommand(root.querySelector('#ssosSonosCommand')?.value || '');
    });
  }
  async function mount(container) {
    root = container?.querySelector('#ssosSonosApp');
    if (!root) return;
    if (pollTimer) clearInterval(pollTimer);
    config = await storageGet();
    config = {
      workerUrl: typeof config.workerUrl === 'string' ? config.workerUrl : '',
      sessionId: typeof config.sessionId === 'string' ? config.sessionId : '',
      householdId: typeof config.householdId === 'string' ? config.householdId : '',
      groupId: typeof config.groupId === 'string' ? config.groupId : '',
      pendingState: typeof config.pendingState === 'string' ? config.pendingState : ''
    };
    bindEvents();
    if (config.sessionId && await checkSession()) {
      await loadSonosSystem();
    } else {
      setConnected(false);
      setStatus(config.workerUrl ? t('accountNeeded') : t('notConfigured'));
    }
  }

  window.SSOSSonosApp = Object.freeze({ render, mount });
})();
