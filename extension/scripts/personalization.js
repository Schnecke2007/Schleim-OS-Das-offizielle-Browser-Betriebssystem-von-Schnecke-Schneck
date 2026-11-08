(() => {
  'use strict';
  const KEY = 'ssos-personalization-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const LANG = () => document.body.dataset.language || 'de';
  const DICT = {
    de: {
      editor:'App-Editor', editorIntro:'Eigene Webseiten als Apps auf dem Startbildschirm verwalten.', add:'＋ App hinzufügen', url:'Webseiten-URL', name:'App-Name', iconUrl:'Icon-URL (optional)', iconFile:'Eigenes Icon hochladen', detect:'Name & Icon automatisch erkennen', save:'App speichern', update:'Änderungen speichern', cancel:'Abbrechen', edit:'Bearbeiten', delete:'Löschen', open:'Öffnen', apps:'Eigene Apps', noApps:'Noch keine eigenen Apps hinzugefügt.', nameFallback:'Webseite', urlRequired:'Bitte eine gültige http- oder https-Adresse eingeben.', saved:'App gespeichert.', deleted:'App entfernt.', confirmDelete:'Diese eigene App wirklich entfernen?', permission:'Für das automatische Auslesen des Seitentitels kann der Browser um Zugriff auf diese einzelne Website bitten.', metadataDone:'Seitentitel und Icon übernommen.', metadataFallback:'Die Seite gibt keine Metadaten frei. Der Domainname und das Favicon werden verwendet.', personalize:'Personalisierung', appearance:'Farbe & Hintergrund', accent:'Akzentfarbe (HEX)', wallpaperUrl:'Hintergrundbild-URL', wallpaperFile:'Hintergrundbild hochladen', saveDesign:'Design speichern', clearWallpaper:'Eigenes Hintergrundbild entfernen', lockSettings:'Sperrbildschirm', city:'Wetter-Ort / Stadt', weather:'Wetter aktualisieren', shortcuts:'Sperrbildschirm-Verknüpfungen', shortcutName:'Name', shortcutUrl:'Ziel-URL', shortcutIcon:'Symbol', saveLock:'Sperrbildschirm speichern', export:'Homescreen exportieren', import:'Homescreen importieren', backup:'Konfigurationsdatei (JSON)', backupInfo:'Sichert deine eigenen Apps, Sprache, Farbe, Hintergrund und Sperrbildschirm-Einstellungen.', exportDone:'Konfiguration exportiert.', importDone:'Konfiguration importiert. Die Seite wird neu geladen.', importBad:'Diese Konfigurationsdatei ist ungültig oder nicht kompatibel.', designSaved:'Personalisierung gespeichert.', wallpaperSaved:'Hintergrundbild gespeichert.', weatherPending:'Wetter wird geladen …', weatherMissing:'Lege in den Einstellungen eine Stadt fest.', weatherError:'Wetterdaten konnten nicht geladen werden.', swipe:'Nach oben wischen oder antippen zum Entsperren', externalTranslate:'Original-Webseiten lassen sich aus Datenschutz- und Browser-Sicherheitsgründen nicht direkt im OS übersetzen. Öffne die Seite bei Bedarf über den Übersetzungslink mit Google Translate.', shortcutDefaults:'Google, Karten und YouTube sind Beispiel-Verknüpfungen und können geändert werden.', customApp:'Eigene App', addUrlHint:'Die Webseite wird in einem neuen Browser-Tab geöffnet.', theme:'Farbcode übernehmen', fileTooLarge:'Die Bilddatei ist zu groß. Bitte ein kleineres Bild (max. 1,5 MB) verwenden.', iconPreview:'Icon-Vorschau', lockTap:'Zum Entsperren antippen', locationError:'Standort/Wetter konnte nicht ermittelt werden.'
    },
    en: {
      editor:'App Editor', editorIntro:'Manage your own websites as apps on the home screen.', add:'＋ Add app', url:'Website URL', name:'App name', iconUrl:'Icon URL (optional)', iconFile:'Upload custom icon', detect:'Detect name & icon automatically', save:'Save app', update:'Save changes', cancel:'Cancel', edit:'Edit', delete:'Delete', open:'Open', apps:'Your apps', noApps:'No custom apps added yet.', nameFallback:'Website', urlRequired:'Enter a valid http or https address.', saved:'App saved.', deleted:'App removed.', confirmDelete:'Remove this custom app?', permission:'The browser may ask for access to this individual website to read its page title automatically.', metadataDone:'Page title and icon loaded.', metadataFallback:'The site does not expose metadata. Using the domain name and favicon.', personalize:'Personalization', appearance:'Color & wallpaper', accent:'Accent color (HEX)', wallpaperUrl:'Wallpaper URL', wallpaperFile:'Upload wallpaper', saveDesign:'Save design', clearWallpaper:'Remove custom wallpaper', lockSettings:'Lock screen', city:'Weather location / city', weather:'Refresh weather', shortcuts:'Lock screen shortcuts', shortcutName:'Name', shortcutUrl:'Target URL', shortcutIcon:'Icon', saveLock:'Save lock screen', export:'Export home screen', import:'Import home screen', backup:'Configuration file (JSON)', backupInfo:'Backs up your custom apps, language, color, wallpaper and lock screen settings.', exportDone:'Configuration exported.', importDone:'Configuration imported. Reloading the page.', importBad:'This configuration file is invalid or incompatible.', designSaved:'Personalization saved.', wallpaperSaved:'Wallpaper saved.', weatherPending:'Loading weather …', weatherMissing:'Set a city in Settings.', weatherError:'Could not load weather data.', swipe:'Swipe up or tap to unlock', externalTranslate:'External websites cannot be translated directly inside the OS because of browser security and privacy boundaries. Open the page through the Google Translate link when needed.', shortcutDefaults:'Google, Maps and YouTube are sample shortcuts and can be edited.', customApp:'Custom app', addUrlHint:'The website opens in a new browser tab.', theme:'Apply color code', fileTooLarge:'Image is too large. Please use a smaller file (max. 1.5 MB).', iconPreview:'Icon preview', lockTap:'Tap to unlock', locationError:'Could not determine location/weather.'
    },
    nl: {
      editor:'App-editor', editorIntro:'Beheer eigen websites als apps op het startscherm.', add:'＋ App toevoegen', url:'Website-URL', name:'App-naam', iconUrl:'Pictogram-URL (optioneel)', iconFile:'Eigen pictogram uploaden', detect:'Naam en pictogram automatisch herkennen', save:'App opslaan', update:'Wijzigingen opslaan', cancel:'Annuleren', edit:'Bewerken', delete:'Verwijderen', open:'Openen', apps:'Eigen apps', noApps:'Er zijn nog geen eigen apps toegevoegd.', nameFallback:'Website', urlRequired:'Voer een geldige http- of https-adres in.', saved:'App opgeslagen.', deleted:'App verwijderd.', confirmDelete:'Deze eigen app verwijderen?', permission:'De browser kan toestemming vragen voor deze website om automatisch de paginatitel te lezen.', metadataDone:'Paginatitel en pictogram geladen.', metadataFallback:'De website geeft geen metadata vrij. Domeinnaam en favicon worden gebruikt.', personalize:'Personalisatie', appearance:'Kleur en achtergrond', accent:'Accentkleur (HEX)', wallpaperUrl:'Achtergrondafbeelding-URL', wallpaperFile:'Achtergrond uploaden', saveDesign:'Ontwerp opslaan', clearWallpaper:'Eigen achtergrond verwijderen', lockSettings:'Vergrendelscherm', city:'Weerlocatie / stad', weather:'Weer vernieuwen', shortcuts:'Snelkoppelingen op vergrendelscherm', shortcutName:'Naam', shortcutUrl:'Doel-URL', shortcutIcon:'Symbool', saveLock:'Vergrendelscherm opslaan', export:'Startscherm exporteren', import:'Startscherm importeren', backup:'Configuratiebestand (JSON)', backupInfo:'Maakt een back-up van je eigen apps, taal, kleur, achtergrond en vergrendelscherminstellingen.', exportDone:'Configuratie geëxporteerd.', importDone:'Configuratie geïmporteerd. De pagina wordt vernieuwd.', importBad:'Dit configuratiebestand is ongeldig of niet compatibel.', designSaved:'Personalisatie opgeslagen.', wallpaperSaved:'Achtergrond opgeslagen.', weatherPending:'Weer wordt geladen …', weatherMissing:'Stel een stad in bij Instellingen.', weatherError:'Weergegevens konden niet worden geladen.', swipe:'Veeg omhoog of tik om te ontgrendelen', externalTranslate:'Externe websites kunnen vanwege browserbeveiliging en privacy niet rechtstreeks in het OS worden vertaald. Open de pagina indien nodig via Google Translate.', shortcutDefaults:'Google, Maps en YouTube zijn voorbeeldsnelkoppelingen en kunnen worden aangepast.', customApp:'Eigen app', addUrlHint:'De website wordt geopend in een nieuw browsertabblad.', theme:'Kleurcode toepassen', fileTooLarge:'De afbeelding is te groot. Gebruik een kleiner bestand (max. 1,5 MB).', iconPreview:'Pictogramvoorbeeld', lockTap:'Tik om te ontgrendelen', locationError:'Locatie/weer kon niet worden bepaald.'
    }
  };
  const t = key => DICT[LANG()]?.[key] || DICT.de[key] || key;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = raw => {
    try { const u = new URL(String(raw).trim()); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; }
  };
  const defaults = () => ({
    apps: [], homeOrder: [], accent: '#d5a66d', wallpaperUrl: '', wallpaperData: '', weatherCity: '',
    shortcuts: [
      {icon:'🌐',name:'Google',url:'https://www.google.com/'},
      {icon:'🗺️',name:'Maps',url:'https://maps.google.com/'},
      {icon:'▶️',name:'YouTube',url:'https://www.youtube.com/'}
    ]
  });
  const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `app-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  function loadConfig() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!value || typeof value !== 'object') return defaults();
      const base = defaults();
      return {
        ...base, ...value,
        apps: Array.isArray(value.apps) ? value.apps.filter(a => a && safeUrl(a.url)).map(a => ({id:String(a.id || makeId()), name:String(a.name || t('nameFallback')).slice(0,60), url:safeUrl(a.url), icon:String(a.icon || '🌐'), iconUrl:safeUrl(a.iconUrl) || '', color:/^#[0-9a-f]{6}$/i.test(a.color || '') ? a.color : ''})) : [],
        homeOrder: Array.isArray(value.homeOrder) ? value.homeOrder.filter(id => typeof id === 'string' && id.length <= 160).slice(0,250) : [],
        accent: /^#[0-9a-f]{6}$/i.test(value.accent || '') ? value.accent : base.accent,
        wallpaperUrl: safeUrl(value.wallpaperUrl) || '', wallpaperData: typeof value.wallpaperData === 'string' && value.wallpaperData.startsWith('data:image/') ? value.wallpaperData : '',
        weatherCity: String(value.weatherCity || '').slice(0,80),
        shortcuts: Array.isArray(value.shortcuts) ? value.shortcuts.slice(0,3).map((s,i)=>({icon:String(s.icon || ['🌐','🗺️','▶️'][i]).slice(0,4),name:String(s.name || '').slice(0,25),url:safeUrl(s.url) || ''})) : base.shortcuts
      };
    } catch { return defaults(); }
  }
  let config = loadConfig();
  let editingId = null;
  let pendingIconData = '';
  function saveConfig() {
    try { localStorage.setItem(KEY, JSON.stringify(config)); }
    catch { toast(t('fileTooLarge')); }
    applyVisuals(); renderHomeTiles(); renderLockScreen();
    window.dispatchEvent(new Event('ssos-custom-apps-changed'));
  }
  function toast(message) {
    const el = $('#toast'); if (!el) return;
    el.textContent = message; el.classList.add('show');
    clearTimeout(toast._timer); toast._timer = setTimeout(() => el.classList.remove('show'), 2500);
  }
  function iconMarkup(app, small = false) {
    const iconUrl = app.iconUrl || (String(app.icon).startsWith('data:image/') ? app.icon : '');
    return iconUrl ? `<img class="ssos-app-icon-img" src="${esc(iconUrl)}" alt="" ${small?'':'loading="lazy"'}>` : `<span>${esc(app.icon || '🌐')}</span>`;
  }
  function tileKey(tile) {
    if (tile.dataset.app) return `app:${tile.dataset.app}`;
    if (tile.dataset.ssosCustomApp) return `custom:${tile.dataset.ssosCustomApp}`;
    if (tile.dataset.ssosOpenEditor === 'add') return 'add';
    if (tile.dataset.ssosOpenEditor) return 'editor';
    return '';
  }
  function applyHomeOrder() {
    const grid = $('#homeAppGrid'); if (!grid) return;
    const tiles = [...grid.querySelectorAll(':scope > .app-icon')];
    const byKey = new Map(tiles.map(tile => [tileKey(tile), tile]).filter(([key]) => key));
    const ordered = [];
    (Array.isArray(config.homeOrder) ? config.homeOrder : []).forEach(key => {
      const tile = byKey.get(key);
      if (tile && !ordered.includes(tile)) ordered.push(tile);
    });
    tiles.forEach(tile => { if (!ordered.includes(tile)) ordered.push(tile); });
    ordered.forEach(tile => grid.appendChild(tile));
  }
  function saveHomeOrder() {
    const grid = $('#homeAppGrid'); if (!grid) return;
    config.homeOrder = [...grid.querySelectorAll(':scope > .app-icon')].map(tileKey).filter(Boolean);
    try { localStorage.setItem(KEY, JSON.stringify(config)); } catch { toast(t('fileTooLarge')); }
  }
  function initHomeReordering() {
    const grid = $('#homeAppGrid'); if (!grid || grid.dataset.ssosReorderReady) return;
    grid.dataset.ssosReorderReady = '1';
    let candidate = null;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let holdTimer = null;
    let suppressClickUntil = 0;
    document.addEventListener('click', event => {
      if (Date.now() <= suppressClickUntil && event.target.closest('#homeAppGrid .app-icon')) {
        event.preventDefault(); event.stopImmediatePropagation();
      }
    }, true);
    const finish = () => {
      if (holdTimer) clearTimeout(holdTimer);
      holdTimer = null;
      if (dragging) {
        suppressClickUntil = Date.now() + 450;
        candidate?.classList.remove('ssos-dragging');
        grid.classList.remove('ssos-reorder-active');
        saveHomeOrder();
      }
      candidate = null;
      dragging = false;
    };
    grid.addEventListener('pointerdown', event => {
      const tile = event.target.closest('.app-icon');
      if (!tile || !grid.contains(tile) || event.button > 0) return;
      candidate = tile; startX = event.clientX; startY = event.clientY; dragging = false;
      if (event.pointerType === 'touch') {
        holdTimer = setTimeout(() => {
          if (!candidate) return;
          dragging = true;
          candidate.classList.add('ssos-dragging');
          grid.classList.add('ssos-reorder-active');
        }, 260);
      }
    });
    document.addEventListener('pointermove', event => {
      if (!candidate) return;
      const distance = Math.hypot(event.clientX - startX, event.clientY - startY);
      if (!dragging && event.pointerType !== 'touch' && distance > 5) {
        dragging = true;
        candidate.classList.add('ssos-dragging');
        grid.classList.add('ssos-reorder-active');
      }
      if (!dragging) {
        if (event.pointerType === 'touch' && distance > 10) finish();
        return;
      }
      event.preventDefault();
      const element = document.elementFromPoint(event.clientX, event.clientY);
      const target = element?.closest('.app-icon');
      if (!target || target === candidate || !grid.contains(target)) return;
      const rect = target.getBoundingClientRect();
      const before = (event.clientY < rect.top + rect.height / 2) ||
        (Math.abs(event.clientY - (rect.top + rect.height / 2)) < rect.height / 3 && event.clientX < rect.left + rect.width / 2);
      grid.insertBefore(candidate, before ? target : target.nextSibling);
    }, {passive:false});
    document.addEventListener('pointerup', finish);
    document.addEventListener('pointercancel', finish);
    window.addEventListener('ssos-home-grid-rendered', () => {
      applyHomeOrder();
      initHomeReordering();
    });
  }
  function renderHomeTiles() {
    const grid = $('#homeAppGrid'); if (!grid) return;
    $$('.ssos-editor-tile,.ssos-plus-tile,.ssos-custom-tile', grid).forEach(el => el.remove());
    const editor = document.createElement('button');
    editor.type = 'button'; editor.className = 'app-icon ssos-editor-tile'; editor.dataset.ssosOpenEditor = '1';
    editor.innerHTML = `<span class="icon-tile">🧩</span><small>${esc(t('editor'))}</small>`;
    const plus = document.createElement('button');
    plus.type = 'button'; plus.className = 'app-icon ssos-plus-tile'; plus.dataset.ssosOpenEditor = 'add';
    plus.innerHTML = `<span class="icon-tile ssos-plus-icon">＋</span><small>${esc(t('add').replace('＋ ',''))}</small>`;
    grid.append(editor, plus);
    config.apps.forEach(app => {
      const tile = document.createElement('button'); tile.type = 'button'; tile.className = 'app-icon ssos-custom-tile';
      tile.dataset.ssosCustomApp = app.id; tile.title = app.name;
      tile.innerHTML = `<span class="icon-tile">${iconMarkup(app)}</span><small>${esc(app.name)}</small>`;
      grid.insertBefore(tile, editor);
    });
    applyHomeOrder();
    initHomeReordering();
  }
  function openEditor(focusAdd = false) {
    const home = $('#homeScreen'), app = $('#appScreen'), panel = $('#controlPanel'), search = $('#searchScreen');
    if (!home || !app) return;
    home.classList.add('hidden'); panel?.classList.add('hidden'); search?.classList.add('hidden'); app.classList.remove('hidden');
    $('#appWindowTitle').textContent = t('editor'); $('#appWindowEmoji').textContent = '🧩';
    $('#appContent').innerHTML = editorMarkup();
    renderAppList();
    if (focusAdd) setTimeout(() => $('#ssosAppUrl')?.focus(), 60);
  }
  function editorMarkup() {
    return `<div class="app-hero"><p class="eyebrow">PERSONAL WORKSPACE</p><h2>${esc(t('editor'))}</h2><p>${esc(t('editorIntro'))}</p><span class="large-emoji">🧩</span></div>
      <p class="notice">${esc(t('addUrlHint'))}</p>
      <button class="app-button ssos-full-button" type="button" data-ssos-focus-add>${esc(t('add'))}</button>
      <section class="ssos-card ssos-form" id="ssosAppForm"><h3>${esc(t('add'))}</h3>
        <label>${esc(t('url'))}<input id="ssosAppUrl" type="url" inputmode="url" placeholder="https://example.com" autocomplete="url"></label>
        <button class="app-button secondary" type="button" id="ssosDetectMetadata">✨ ${esc(t('detect'))}</button>
        <label>${esc(t('name'))}<input id="ssosAppName" type="text" maxlength="60" placeholder="Website"></label>
        <label>${esc(t('iconUrl'))}<input id="ssosAppIconUrl" type="url" placeholder="https://example.com/favicon.ico"></label>
        <label>${esc(t('iconFile'))}<input id="ssosAppIconFile" type="file" accept="image/*"></label>
        <div class="ssos-icon-preview"><span>${esc(t('iconPreview'))}</span><div id="ssosIconPreview">🌐</div></div>
        <div class="ssos-form-actions"><button class="app-button" type="button" id="ssosSaveApp">${esc(t('save'))}</button><button class="app-button secondary" type="button" id="ssosCancelEdit">${esc(t('cancel'))}</button></div>
      </section>
      <h3 class="content-heading">${esc(t('apps'))}</h3><div id="ssosAppList" class="ssos-app-list"></div>`;
  }
  function renderAppList() {
    const list = $('#ssosAppList'); if (!list) return;
    if (!config.apps.length) { list.innerHTML = `<p class="body-copy">${esc(t('noApps'))}</p>`; return; }
    list.innerHTML = config.apps.map(app => `<article class="ssos-app-row"><div class="ssos-row-icon">${iconMarkup(app,true)}</div><div class="ssos-row-copy"><b>${esc(app.name)}</b><small>${esc(new URL(app.url).hostname)}</small></div><button type="button" class="ssos-small-button" data-ssos-edit="${esc(app.id)}">${esc(t('edit'))}</button><button type="button" class="ssos-small-button danger" data-ssos-delete="${esc(app.id)}">${esc(t('delete'))}</button></article>`).join('');
    $$('img.ssos-app-icon-img', list).forEach(img => img.addEventListener('error', () => { img.replaceWith(Object.assign(document.createElement('span'), {textContent:'🌐'})); }, {once:true}));
  }
  function previewIcon(src) {
    const box = $('#ssosIconPreview'); if (!box) return;
    box.innerHTML = src ? `<img src="${esc(src)}" alt="">` : '🌐';
    const img = $('img', box); if (img) img.addEventListener('error', () => { box.textContent = '🌐'; }, {once:true});
  }
  function resetAppForm() {
    editingId = null; pendingIconData = '';
    const form = $('#ssosAppForm'); if (!form) return;
    $('#ssosAppUrl').value = ''; $('#ssosAppName').value = ''; $('#ssosAppIconUrl').value = ''; $('#ssosAppIconFile').value = '';
    $('#ssosSaveApp').textContent = t('save'); form.querySelector('h3').textContent = t('add'); previewIcon('');
  }
  function editApp(id) {
    const item = config.apps.find(a => a.id === id); if (!item) return;
    editingId = id; pendingIconData = item.icon.startsWith('data:image/') ? item.icon : '';
    $('#ssosAppUrl').value = item.url; $('#ssosAppName').value = item.name; $('#ssosAppIconUrl').value = item.iconUrl || '';
    $('#ssosSaveApp').textContent = t('update'); $('#ssosAppForm').querySelector('h3').textContent = t('edit');
    previewIcon(item.iconUrl || pendingIconData);
    $('#ssosAppForm').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function domainLabel(url) {
    try { return new URL(url).hostname.replace(/^www\./,'').split('.')[0].replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }
    catch { return t('nameFallback'); }
  }
  async function requestSiteReadPermission(url) {
    if (!globalThis.chrome?.permissions?.request) return false;
    try {
      const origin = new URL(url).origin;
      // Called directly from the Detect button's click handler so Chrome can show its permission prompt.
      return await chrome.permissions.request({origins:[origin+'/*']});
    } catch { return false; }
  }
  async function detectMetadata() {
    const url = safeUrl($('#ssosAppUrl')?.value || ''); if (!url) { toast(t('urlRequired')); return; }
    const btn = $('#ssosDetectMetadata'); if (btn) { btn.disabled = true; btn.textContent = '…'; }
    let title = domainLabel(url); let iconUrl = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=128`;
    const allowed = await requestSiteReadPermission(url);
    if (allowed || !globalThis.chrome?.permissions?.request) {
      try {
        const response = await fetch(url, {mode:'cors', credentials:'omit', redirect:'follow'});
        if (response.ok) {
          const html = await response.text(); const doc = new DOMParser().parseFromString(html,'text/html');
          const pageTitle = doc.querySelector('meta[property="og:title"]')?.content || doc.querySelector('title')?.textContent || doc.querySelector('meta[name="application-name"]')?.content;
          if (pageTitle?.trim()) title = pageTitle.trim().slice(0,60);
          const icon = doc.querySelector('link[rel~="icon"]')?.getAttribute('href') || doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href');
          if (icon) iconUrl = new URL(icon,url).href;
        }
      } catch { /* Many websites disallow cross-origin metadata reads. A safe hostname/favicon fallback is used. */ }
    }
    $('#ssosAppName').value = $('#ssosAppName').value.trim() || title;
    $('#ssosAppIconUrl').value = iconUrl; previewIcon(iconUrl);
    if (btn) { btn.disabled = false; btn.textContent = `✨ ${t('detect')}`; }
    toast(title !== domainLabel(url) ? t('metadataDone') : t('metadataFallback'));
  }
  function saveApp() {
    const url = safeUrl($('#ssosAppUrl')?.value || ''); if (!url) { toast(t('urlRequired')); return; }
    const name = ($('#ssosAppName')?.value || '').trim().slice(0,60) || domainLabel(url);
    const previous = editingId ? config.apps.find(a => a.id === editingId) : null;
    const iconField = pendingIconData ? '' : (safeUrl($('#ssosAppIconUrl')?.value || '') || `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=128`);
    const app = {id:editingId || makeId(), name, url, icon:pendingIconData || previous?.icon || '🌐', iconUrl:iconField, color:''};
    if (editingId) config.apps = config.apps.map(a => a.id === editingId ? app : a); else config.apps.push(app);
    saveConfig(); renderAppList(); resetAppForm(); toast(t('saved'));
  }
  async function compressImage(file, maxBytes = 1500000) {
    if (!file || !file.type.startsWith('image/')) throw new Error('image');
    if (file.size > 8000000) throw new Error('large');
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width*scale); canvas.height = Math.round(bitmap.height*scale);
    const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap,0,0,canvas.width,canvas.height); bitmap.close?.();
    let quality = .82, data = canvas.toDataURL('image/jpeg',quality);
    while (data.length > maxBytes * 1.37 && quality > .45) { quality -= .08; data = canvas.toDataURL('image/jpeg',quality); }
    if (data.length > maxBytes * 1.37) throw new Error('large');
    return data;
  }
  function renderSettingsTools() {
    if ($('#ssosSettingsTools') || !$('#resetSettings')) return;
    const mount = $('#appContent'); if (!mount) return;
    const section = document.createElement('section'); section.id = 'ssosSettingsTools'; section.className = 'ssos-settings-tools';
    section.innerHTML = `<div class="ssos-section-heading"><p class="eyebrow">PERSONAL WORKSPACE</p><h3>${esc(t('personalize'))}</h3></div>
      <div class="ssos-card"><h4>🎨 ${esc(t('appearance'))}</h4>
        <label>${esc(t('accent'))}<div class="ssos-color-row"><input type="color" id="ssosAccentPicker" value="${esc(config.accent)}"><input type="text" id="ssosAccentHex" value="${esc(config.accent)}" maxlength="7" placeholder="#D5A66D"></div></label>
        <label>${esc(t('wallpaperUrl'))}<input id="ssosWallpaperUrl" type="url" placeholder="https://example.com/wallpaper.jpg" value="${esc(config.wallpaperUrl)}"></label>
        <label>${esc(t('wallpaperFile'))}<input id="ssosWallpaperFile" type="file" accept="image/*"></label>
        <div class="ssos-form-actions"><button class="app-button" type="button" id="ssosSaveDesign">${esc(t('saveDesign'))}</button><button class="app-button secondary" type="button" id="ssosClearWallpaper">${esc(t('clearWallpaper'))}</button></div>
      </div>
      <div class="ssos-card"><h4>🔒 ${esc(t('lockSettings'))}</h4>
        <label>${esc(t('city'))}<input id="ssosWeatherCity" type="text" value="${esc(config.weatherCity)}" placeholder="z. B. Bottrop"></label>
        <div class="ssos-shortcut-editor"><b>${esc(t('shortcuts'))}</b>${config.shortcuts.map((s,i)=>`<div class="ssos-shortcut-fields"><label>${esc(t('shortcutIcon'))}<input data-ssos-shortcut-icon="${i}" value="${esc(s.icon)}" maxlength="4"></label><label>${esc(t('shortcutName'))}<input data-ssos-shortcut-name="${i}" value="${esc(s.name)}" maxlength="25"></label><label>${esc(t('shortcutUrl'))}<input data-ssos-shortcut-url="${i}" value="${esc(s.url)}" type="url" placeholder="https://example.com"></label></div>`).join('')}</div>
        <div class="ssos-form-actions"><button class="app-button" type="button" id="ssosSaveLock">${esc(t('saveLock'))}</button><button class="app-button secondary" type="button" id="ssosRefreshWeather">${esc(t('weather'))}</button></div>
        <p class="body-copy">${esc(t('shortcutDefaults'))}</p>
      </div>
      <div class="ssos-card"><h4>📦 ${esc(t('backup'))}</h4><p class="body-copy">${esc(t('backupInfo'))}</p>
        <div class="ssos-form-actions"><button class="app-button" type="button" id="ssosExport">⬇ ${esc(t('export'))}</button><label class="app-button secondary ssos-file-label">⬆ ${esc(t('import'))}<input type="file" id="ssosImportFile" accept="application/json,.json"></label></div>
      </div>
      <div class="ssos-card"><h4>🧩 ${esc(t('editor'))}</h4><p class="body-copy">${esc(t('editorIntro'))}</p><button class="app-button secondary" type="button" data-ssos-open-editor="1">${esc(t('editor'))} öffnen ↗</button></div>`;
    mount.appendChild(section);
    $('#ssosAccentPicker').addEventListener('input',e=>$('#ssosAccentHex').value=e.target.value);
    $('#ssosAccentHex').addEventListener('input',e=>{if(/^#[0-9a-f]{6}$/i.test(e.target.value))$('#ssosAccentPicker').value=e.target.value;});
  }
  function applyVisuals() {
    document.documentElement.style.setProperty('--accent', config.accent || '#d5a66d');
    document.documentElement.style.setProperty('--accent-rgb', (config.accent || '#d5a66d').match(/[a-f0-9]{2}/gi)?.map(v=>parseInt(v,16)).join(',') || '213,166,109');
    const image = config.wallpaperData || config.wallpaperUrl;
    const screen = $('#screen'), lock = $('#lockScreen');
    if (screen) screen.style.backgroundImage = image ? `linear-gradient(155deg,rgba(20,14,11,.30),rgba(11,18,14,.52)),url("${image.replace(/"/g,'%22')}")` : '';
    if (lock) lock.style.backgroundImage = image ? `linear-gradient(155deg,rgba(20,14,11,.50),rgba(11,18,14,.70)),url("${image.replace(/"/g,'%22')}")` : '';
  }
  function renderLockScreen() {
    const lock = $('#lockScreen'); if (!lock) return;
    if (!$('#ssosLockWeather')) {
      const weather = document.createElement('div'); weather.id = 'ssosLockWeather'; weather.className = 'ssos-lock-weather';
      const shortcuts = document.createElement('div'); shortcuts.id = 'ssosLockShortcuts'; shortcuts.className = 'ssos-lock-shortcuts';
      $('.lock-clock',lock)?.after(weather,shortcuts);
    }
    const shortcuts = $('#ssosLockShortcuts'); if (shortcuts) {
      shortcuts.innerHTML = config.shortcuts.filter(s=>s.url).map(s=>`<button type="button" data-ssos-lock-url="${esc(s.url)}" title="${esc(s.name)}"><span>${esc(s.icon)}</span><small>${esc(s.name)}</small></button>`).join('');
    }
    const prompt = $('.lock-bottom p',lock); if (prompt) prompt.textContent = t('swipe');
  }
  function weatherIcon(code) {
    if ([0].includes(code)) return '☀️'; if ([1,2].includes(code)) return '🌤️'; if ([3].includes(code)) return '☁️';
    if ([45,48].includes(code)) return '🌫️'; if ([51,53,55,56,57].includes(code)) return '🌦️'; if ([61,63,65,66,67,80,81,82].includes(code)) return '🌧️';
    if ([71,73,75,77,85,86].includes(code)) return '❄️'; if ([95,96,99].includes(code)) return '⛈️'; return '🌡️';
  }
  async function refreshWeather() {
    const box = $('#ssosLockWeather'); if (!config.weatherCity.trim()) { if(box)box.textContent=t('weatherMissing'); return; }
    if (box) box.textContent=t('weatherPending');
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(config.weatherCity)}&count=1&language=${LANG()}&format=json`;
      const geoRes = await fetch(geoUrl); if (!geoRes.ok) throw new Error('geo'); const geo = await geoRes.json(); const place=geo.results?.[0]; if(!place)throw new Error('place');
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
      const weatherRes = await fetch(weatherUrl); if (!weatherRes.ok) throw new Error('weather'); const data=await weatherRes.json();
      const current=data.current; const result=`${weatherIcon(current.weather_code)} <b>${Math.round(current.temperature_2m)}°C</b><small>${esc(place.name)} · ${Math.round(current.wind_speed_10m)} km/h</small>`;
      if(box)box.innerHTML=result;
    } catch { if(box)box.textContent=t('weatherError'); }
  }
  function saveDesign() {
    const hex=$('#ssosAccentHex')?.value.trim() || config.accent;
    if(!/^#[0-9a-f]{6}$/i.test(hex)){toast('Bitte einen gültigen HEX-Farbcode wie #D5A66D eingeben.');return;}
    const wallpaper=safeUrl($('#ssosWallpaperUrl')?.value || '');
    if($('#ssosWallpaperUrl')?.value.trim() && !wallpaper){toast(t('urlRequired'));return;}
    config.accent=hex; config.wallpaperUrl=wallpaper; config.wallpaperData=''; saveConfig(); toast(t('designSaved'));
  }
  function saveLockSettings() {
    config.weatherCity=$('#ssosWeatherCity')?.value.trim() || '';
    config.shortcuts=config.shortcuts.map((s,i)=>({
      icon:$(`[data-ssos-shortcut-icon="${i}"]`)?.value.trim() || s.icon,
      name:$(`[data-ssos-shortcut-name="${i}"]`)?.value.trim() || s.name,
      url:safeUrl($(`[data-ssos-shortcut-url="${i}"]`)?.value || '')
    }));
    saveConfig(); refreshWeather(); toast(t('designSaved'));
  }
  function exportBackup() {
    const preferences={};
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i); if(!key?.startsWith('ssos-'))continue;
      try { preferences[key]=JSON.parse(localStorage.getItem(key)); } catch { preferences[key]=localStorage.getItem(key); }
    }
    preferences[KEY]=config;
    const backup={format:'schnecke-schneck-os',schemaVersion:1,exportedAt:new Date().toISOString(),preferences};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`schnecke-schneck-homescreen-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1500); toast(t('exportDone'));
  }
  async function importBackup(file) {
    try {
      const data=JSON.parse(await file.text());
      if(data.format!=='schnecke-schneck-os'||data.schemaVersion!==1||!data.preferences||typeof data.preferences!=='object')throw new Error('schema');
      const allowed=/^ssos-[a-zA-Z0-9_-]{1,64}$/;
      for(const [key,value] of Object.entries(data.preferences)){
        if(!allowed.test(key))continue;
        if(key===KEY && (!value || typeof value!=='object'))continue;
        localStorage.setItem(key,JSON.stringify(value));
      }
      window.location.reload();
    } catch { toast(t('importBad')); }
  }
  function refreshSettingsIfOpen() { if ($('#resetSettings')) renderSettingsTools(); }
  function init() {
    renderHomeTiles(); renderLockScreen(); applyVisuals();
    if (config.weatherCity) refreshWeather();
    const appContent=$('#appContent'); if(appContent){new MutationObserver(()=>refreshSettingsIfOpen()).observe(appContent,{childList:true,subtree:true});}
    window.addEventListener('ssos-home-grid-rendered', renderHomeTiles);
    $('#lockScreen')?.addEventListener('click',e=>{if(e.target.closest('[data-ssos-lock-url]'))return; if(e.target.closest('#unlockButton'))return; $('#unlockButton')?.click();});
    let touchStart=null; $('#lockScreen')?.addEventListener('pointerdown',e=>{touchStart={y:e.clientY};},{passive:true});
    $('#lockScreen')?.addEventListener('pointerup',e=>{if(touchStart && touchStart.y-e.clientY>42 && !e.target.closest('[data-ssos-lock-url]'))$('#unlockButton')?.click();touchStart=null;},{passive:true});
    document.addEventListener('click',async e=>{
      if(e.target.closest('[data-ssos-open-editor]')){openEditor(e.target.closest('[data-ssos-open-editor]').dataset.ssosOpenEditor==='add');return;}
      if(e.target.closest('[data-ssos-custom-app]')){const app=config.apps.find(a=>a.id===e.target.closest('[data-ssos-custom-app]').dataset.ssosCustomApp);if(app)window.open(app.url,'_blank','noopener,noreferrer');return;}
      if(e.target.closest('[data-ssos-focus-add]')){$('#ssosAppUrl')?.focus();return;}
      if(e.target.closest('#ssosDetectMetadata')){await detectMetadata();return;}
      if(e.target.closest('#ssosSaveApp')){saveApp();return;}
      if(e.target.closest('#ssosCancelEdit')){resetAppForm();return;}
      const edit=e.target.closest('[data-ssos-edit]');if(edit){editApp(edit.dataset.ssosEdit);return;}
      const del=e.target.closest('[data-ssos-delete]');if(del){if(confirm(t('confirmDelete'))){config.apps=config.apps.filter(a=>a.id!==del.dataset.ssosDelete);saveConfig();renderAppList();toast(t('deleted'));}return;}
      if(e.target.closest('#ssosSaveDesign')){saveDesign();return;}
      if(e.target.closest('#ssosClearWallpaper')){config.wallpaperUrl='';config.wallpaperData='';saveConfig();toast(t('designSaved'));return;}
      if(e.target.closest('#ssosSaveLock')){saveLockSettings();return;}
      if(e.target.closest('#ssosRefreshWeather')){config.weatherCity=$('#ssosWeatherCity')?.value.trim()||'';saveConfig();refreshWeather();return;}
      if(e.target.closest('#ssosExport')){exportBackup();return;}
      const lockUrl=e.target.closest('[data-ssos-lock-url]');if(lockUrl){window.open(lockUrl.dataset.ssosLockUrl,'_blank','noopener,noreferrer');return;}
    });
    document.addEventListener('change',async e=>{
      if(e.target.id==='ssosAppIconUrl'){previewIcon(safeUrl(e.target.value));}
      if(e.target.id==='ssosAppIconFile'){
        const file=e.target.files?.[0]; if(!file)return;
        try{pendingIconData=await compressImage(file,500000);$('#ssosAppIconUrl').value='';previewIcon(pendingIconData);}catch{toast(t('fileTooLarge'));}
      }
      if(e.target.id==='ssosWallpaperFile'){
        const file=e.target.files?.[0]; if(!file)return;
        try{config.wallpaperData=await compressImage(file,1500000);config.wallpaperUrl='';saveConfig();toast(t('wallpaperSaved'));}catch{toast(t('fileTooLarge'));}
      }
      if(e.target.id==='ssosImportFile'){
        const file=e.target.files?.[0];if(file)await importBackup(file);
      }
    });
  }
  function openCustomApp(id) {
    const app=config.apps.find(item=>item.id===String(id));
    if(!app || !safeUrl(app.url))return false;
    window.open(app.url,'_blank','noopener,noreferrer');
    return true;
  }
  function getApps() {
    return config.apps.map(app=>({id:app.id,name:app.name,url:app.url,icon:app.icon,iconUrl:app.iconUrl}));
  }
  window.SSOSPersonalization = Object.freeze({openEditor, exportBackup, importBackup: file => importBackup(file), getApps, openCustomApp});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.dispatchEvent(new Event('ssos-custom-apps-changed'));
})();
