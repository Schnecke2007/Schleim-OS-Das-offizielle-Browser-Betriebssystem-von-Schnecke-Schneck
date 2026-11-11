(() => {
  'use strict';
  const KEY = 'ssos-personalization-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const LANG = () => document.body.dataset.language || 'de';
  const DICT = {
    de: {
      nameFallback:'Webseite', urlRequired:'Bitte eine gültige http- oder https-Adresse eingeben.', detect:'Name & Icon automatisch erkennen',
      metadataDone:'Seitentitel und Icon übernommen.', metadataFallback:'Die Seite gibt keine Metadaten frei. Der Domainname und das Favicon werden verwendet.',
      personalize:'Personalisierung', appearance:'Farbe & Hintergrund', accent:'Akzentfarbe (HEX)', wallpaperUrl:'Hintergrundbild-URL',
      wallpaperFile:'Hintergrundbild hochladen', saveDesign:'Design speichern', clearWallpaper:'Eigenes Hintergrundbild entfernen',
      lockSettings:'Sperrbildschirm', city:'Wetter-Ort / Stadt', weather:'Wetter aktualisieren', shortcuts:'Sperrbildschirm-Verknüpfungen',
      shortcutName:'Name', shortcutUrl:'Ziel-URL', shortcutIcon:'Symbol', saveLock:'Sperrbildschirm speichern',
      export:'Homescreen exportieren', import:'Homescreen importieren', backup:'Konfigurationsdatei (JSON)',
      backupInfo:'Sichert deine gespeicherten Webseiten, Store-Installationen und Bewertungen sowie Sprache, Farbe, Hintergrund und Sperrbildschirm-Einstellungen.',
      exportDone:'Konfiguration exportiert.', importBad:'Diese Konfigurationsdatei ist ungültig oder nicht kompatibel.',
      designSaved:'Personalisierung gespeichert.', wallpaperSaved:'Hintergrundbild gespeichert.', weatherPending:'Wetter wird geladen …',
      weatherMissing:'Lege in den Einstellungen eine Stadt fest.', weatherError:'Wetterdaten konnten nicht geladen werden.',
      swipe:'Nach oben wischen oder antippen zum Entsperren', shortcutDefaults:'Google, Karten und YouTube sind Beispiel-Verknüpfungen und können geändert werden.',
      fileTooLarge:'Die Bilddatei ist zu groß. Bitte ein kleineres Bild (max. 1,5 MB) verwenden.'
    },
    en: {
      nameFallback:'Website', urlRequired:'Enter a valid http or https address.', detect:'Detect name & icon automatically',
      metadataDone:'Page title and icon loaded.', metadataFallback:'The site does not expose metadata. Using the domain name and favicon.',
      personalize:'Personalization', appearance:'Color & wallpaper', accent:'Accent color (HEX)', wallpaperUrl:'Wallpaper URL',
      wallpaperFile:'Upload wallpaper', saveDesign:'Save design', clearWallpaper:'Remove custom wallpaper',
      lockSettings:'Lock screen', city:'Weather location / city', weather:'Refresh weather', shortcuts:'Lock screen shortcuts',
      shortcutName:'Name', shortcutUrl:'Target URL', shortcutIcon:'Icon', saveLock:'Save lock screen',
      export:'Export home screen', import:'Import home screen', backup:'Configuration file (JSON)',
      backupInfo:'Backs up your saved websites, Store installations and ratings, language, color, wallpaper and lock screen settings.',
      exportDone:'Configuration exported.', importBad:'This configuration file is invalid or incompatible.',
      designSaved:'Personalization saved.', wallpaperSaved:'Wallpaper saved.', weatherPending:'Loading weather …',
      weatherMissing:'Set a city in Settings.', weatherError:'Could not load weather data.',
      swipe:'Swipe up or tap to unlock', shortcutDefaults:'Google, Maps and YouTube are sample shortcuts and can be edited.',
      fileTooLarge:'Image is too large. Please use a smaller file (max. 1.5 MB).'
    },
    nl: {
      nameFallback:'Website', urlRequired:'Voer een geldig http- of https-adres in.', detect:'Naam en pictogram automatisch herkennen',
      metadataDone:'Paginatitel en pictogram geladen.', metadataFallback:'De website geeft geen metadata vrij. Domeinnaam en favicon worden gebruikt.',
      personalize:'Personalisatie', appearance:'Kleur en achtergrond', accent:'Accentkleur (HEX)', wallpaperUrl:'Achtergrondafbeelding-URL',
      wallpaperFile:'Achtergrond uploaden', saveDesign:'Ontwerp opslaan', clearWallpaper:'Eigen achtergrond verwijderen',
      lockSettings:'Vergrendelscherm', city:'Weerlocatie / stad', weather:'Weer vernieuwen', shortcuts:'Snelkoppelingen op vergrendelscherm',
      shortcutName:'Naam', shortcutUrl:'Doel-URL', shortcutIcon:'Symbool', saveLock:'Vergrendelscherm opslaan',
      export:'Startscherm exporteren', import:'Startscherm importeren', backup:'Configuratiebestand (JSON)',
      backupInfo:'Maakt een back-up van je opgeslagen websites, Store-installaties en beoordelingen, taal, kleur, achtergrond en vergrendelscherminstellingen.',
      exportDone:'Configuratie geëxporteerd.', importBad:'Dit configuratiebestand is ongeldig of niet compatibel.',
      designSaved:'Personalisatie opgeslagen.', wallpaperSaved:'Achtergrond opgeslagen.', weatherPending:'Weer wordt geladen …',
      weatherMissing:'Stel een stad in bij Instellingen.', weatherError:'Weergegevens konden niet worden geladen.',
      swipe:'Veeg omhoog of tik om te ontgrendelen', shortcutDefaults:'Google, Maps en YouTube zijn voorbeeldsnelkoppelingen en kunnen worden aangepast.',
      fileTooLarge:'De afbeelding is te groot. Gebruik een kleiner bestand (max. 1,5 MB).'
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

  const STORE_KEY = 'ssos-store-v1';
  const STORE_ISSUE_URL = 'https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues/new';
  const STORE_CATALOG_FALLBACK = [
    {id:'chatgpt-web',name:'ChatGPT',icon:'🤖',url:'https://chatgpt.com/',category:'ai',addedAt:'2026-11-11',featured:true,tags:'ki künstliche intelligenz chatbot schreiben fragen',description:{de:'KI-Assistent für Fragen, Ideen, Texte und kreative Aufgaben.',en:'AI assistant for questions, ideas, writing and creative tasks.',nl:'AI-assistent voor vragen, ideeën, teksten en creatieve taken.'}},
    {id:'youtube-web',name:'YouTube',icon:'▶️',url:'https://www.youtube.com/',category:'media',addedAt:'2026-11-11',featured:true,tags:'videos musik unterhaltung clips',description:{de:'Videos, Musik, Tutorials und Unterhaltung entdecken.',en:'Discover videos, music, tutorials and entertainment.',nl:'Ontdek videos, muziek, tutorials en entertainment.'}},
    {id:'spotify-web',name:'Spotify',icon:'🎧',url:'https://open.spotify.com/',category:'media',addedAt:'2026-11-11',featured:true,tags:'musik podcasts audio playlist',description:{de:'Musik und Podcasts direkt im Browser anhören.',en:'Listen to music and podcasts directly in your browser.',nl:'Luister rechtstreeks in je browser naar muziek en podcasts.'}},
    {id:'wikipedia-web',name:'Wikipedia',icon:'📚',url:'https://www.wikipedia.org/',category:'knowledge',addedAt:'2026-11-11',featured:true,tags:'wissen lexikon recherche lernen',description:{de:'Wissen und Hintergrundinformationen in einer freien Enzyklopädie finden.',en:'Find knowledge and background information in a free encyclopedia.',nl:'Vind kennis en achtergrondinformatie in een vrije encyclopedie.'}},
    {id:'google-maps-web',name:'Google Maps',icon:'🗺️',url:'https://maps.google.com/',category:'navigation',addedAt:'2026-11-11',featured:false,tags:'karten routen navigation orte',description:{de:'Orte suchen, Karten ansehen und Routen planen.',en:'Find places, explore maps and plan routes.',nl:'Zoek plaatsen, bekijk kaarten en plan routes.'}},
    {id:'google-drive-web',name:'Google Drive',icon:'📁',url:'https://drive.google.com/',category:'productivity',addedAt:'2026-11-11',featured:false,tags:'dateien cloud dokumente speicher',description:{de:'Dateien und Dokumente online verwalten.',en:'Manage files and documents online.',nl:'Beheer bestanden en documenten online.'}},
    {id:'whatsapp-web',name:'WhatsApp Web',icon:'💬',url:'https://web.whatsapp.com/',category:'communication',addedAt:'2026-11-11',featured:false,tags:'nachrichten chat kommunikation',description:{de:'WhatsApp-Nachrichten im Browser nutzen.',en:'Use WhatsApp messaging in your browser.',nl:'Gebruik WhatsApp-berichten in je browser.'}},
    {id:'duckduckgo-web',name:'DuckDuckGo',icon:'🦆',url:'https://duckduckgo.com/',category:'privacy',addedAt:'2026-11-11',featured:false,tags:'suche datenschutz privat suchen',description:{de:'Alternative Suchmaschine mit Fokus auf Datenschutz.',en:'Alternative search engine with a focus on privacy.',nl:'Alternatieve zoekmachine met aandacht voor privacy.'}}
  ];
  let STORE_CATALOG = STORE_CATALOG_FALLBACK;
  const STORE_CATALOG_URL = 'https://raw.githubusercontent.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/data/store-apps.json';
  const STORE_TEXT = {
    de:{intro:'Entdecke Webseiten als Apps für deinen Startbildschirm. Store-Apps öffnen sich in einem neuen Browser-Tab.',search:'Im Schleim-Store suchen …',allCategories:'Alle Kategorien',recommended:'Für dich empfohlen',top:'Deine Top-Bewertungen auf diesem Gerät',topEmpty:'Noch keine Bewertungen auf diesem Gerät. Bewerte Apps mit den Sternen, damit hier deine Favoriten erscheinen.',newest:'Neu im Store',all:'Alle Apps',installed:'Deine installierten Apps',legacy:'Bisherige eigene Webseiten',propose:'App vorschlagen',submitIntro:'Dein Vorschlag wird als GitHub-Issue vorbereitet und von Schnecke Schneck geprüft. Er erscheint nicht automatisch im Store.',url:'Webseiten-URL',detect:'Name und Icon erkennen',name:'App-Name',category:'Kategorie',description:'Beschreibung',iconUrl:'Icon-URL (optional)',iconFile:'Eigenes Icon (optional)',iconPreview:'Icon-Vorschau',submit:'Vorschlag auf GitHub einreichen',uploadNote:'Ein lokal ausgewähltes Icon kann nicht automatisch zu GitHub übertragen werden. Bitte lade die Bilddatei nach dem Öffnen des GitHub-Formulars dort noch einmal hoch.',systemNote:'System-Apps und die fest eingebauten Inhalte von Schleim OS bleiben immer erhalten. Sie können hier nicht deinstalliert werden.',install:'Installieren',installedLabel:'Installiert',uninstall:'Deinstallieren',open:'Öffnen',rated:'Deine Bewertung',notRated:'Noch nicht bewertet',noResults:'Keine passenden Apps gefunden.',noInstalled:'Du hast noch keine Store-Apps installiert.',legacyEmpty:'Keine früher hinzugefügten Webseiten vorhanden.',confirmUninstall:'Diese Store-App vom Startbildschirm entfernen?',legacyConfirm:'Diese eigene Webseite vom Startbildschirm entfernen?',prepared:'Vorschlag vorbereitet. Prüfe die Angaben auf GitHub und sende das Formular dort ab.',invalid:'Bitte gib eine gültige http- oder https-Adresse ein.',needName:'Bitte gib einen App-Namen ein.',needDescription:'Bitte beschreibe kurz, was die Webseite bietet.',categories:{tools:'Tools',ai:'KI & Chatbots',media:'Medien',knowledge:'Wissen',navigation:'Navigation',productivity:'Produktivität',communication:'Kommunikation',privacy:'Suche & Datenschutz'}},
    en:{intro:'Discover websites as apps for your home screen. Store apps open in a new browser tab.',search:'Search the Schleim-Store …',allCategories:'All categories',recommended:'Recommended for you',top:'Your top ratings on this device',topEmpty:'No ratings on this device yet. Rate apps with the stars to build your own favourites here.',newest:'New in the Store',all:'All apps',installed:'Your installed apps',legacy:'Previously added websites',propose:'Suggest an app',submitIntro:'Your suggestion is prepared as a GitHub issue and reviewed by Schnecke Schneck. It is not published automatically.',url:'Website URL',detect:'Detect name and icon',name:'App name',category:'Category',description:'Description',iconUrl:'Icon URL (optional)',iconFile:'Custom icon (optional)',iconPreview:'Icon preview',submit:'Submit suggestion on GitHub',uploadNote:'A locally selected icon cannot be transferred to GitHub automatically. Please upload the image again in the GitHub form after it opens.',systemNote:'System apps and built-in Schleim OS content are always kept. They cannot be uninstalled here.',install:'Install',installedLabel:'Installed',uninstall:'Uninstall',open:'Open',rated:'Your rating',notRated:'Not rated yet',noResults:'No matching apps found.',noInstalled:'You have not installed any Store apps yet.',legacyEmpty:'No previously added websites were found.',confirmUninstall:'Remove this Store app from your home screen?',legacyConfirm:'Remove this custom website from your home screen?',prepared:'Suggestion prepared. Review the details on GitHub and submit the form there.',invalid:'Enter a valid http or https website address.',needName:'Enter an app name.',needDescription:'Briefly describe what the website offers.',categories:{tools:'Tools',ai:'AI & chatbots',media:'Media',knowledge:'Knowledge',navigation:'Navigation',productivity:'Productivity',communication:'Communication',privacy:'Search & privacy'}},
    nl:{intro:'Ontdek websites als apps voor je startscherm. Store-apps openen in een nieuw browsertabblad.',search:'Zoeken in de Schleim-Store …',allCategories:'Alle categorieën',recommended:'Aanbevolen voor jou',top:'Jouw hoogste beoordelingen op dit apparaat',topEmpty:'Er zijn nog geen beoordelingen op dit apparaat. Beoordeel apps met de sterren om hier je favorieten te zien.',newest:'Nieuw in de Store',all:'Alle apps',installed:'Je geïnstalleerde apps',legacy:'Eerder toegevoegde websites',propose:'Een app voorstellen',submitIntro:'Je voorstel wordt voorbereid als GitHub-issue en beoordeeld door Schnecke Schneck. Het wordt niet automatisch gepubliceerd.',url:'Website-URL',detect:'Naam en pictogram herkennen',name:'App-naam',category:'Categorie',description:'Beschrijving',iconUrl:'Pictogram-URL (optioneel)',iconFile:'Eigen pictogram (optioneel)',iconPreview:'Voorbeeld pictogram',submit:'Voorstel indienen op GitHub',uploadNote:'Een lokaal geselecteerd pictogram kan niet automatisch naar GitHub worden verzonden. Upload de afbeelding opnieuw in het GitHub-formulier nadat het is geopend.',systemNote:'Systeemapps en ingebouwde Schleim OS-inhoud blijven altijd behouden. Je kunt ze hier niet verwijderen.',install:'Installeren',installedLabel:'Geïnstalleerd',uninstall:'Verwijderen',open:'Openen',rated:'Jouw beoordeling',notRated:'Nog niet beoordeeld',noResults:'Geen overeenkomende apps gevonden.',noInstalled:'Je hebt nog geen Store-apps geïnstalleerd.',legacyEmpty:'Er zijn geen eerder toegevoegde websites gevonden.',confirmUninstall:'Deze Store-app van het startscherm verwijderen?',legacyConfirm:'Deze eigen website van het startscherm verwijderen?',prepared:'Voorstel voorbereid. Controleer de gegevens op GitHub en verstuur het formulier daar.',invalid:'Voer een geldig http- of https-websiteadres in.',needName:'Voer een app-naam in.',needDescription:'Beschrijf kort wat de website biedt.',categories:{tools:'Hulpmiddelen',ai:'AI & chatbots',media:'Media',knowledge:'Kennis',navigation:'Navigatie',productivity:'Productiviteit',communication:'Communicatie',privacy:'Zoeken & privacy'}}
  };
  const st = key => STORE_TEXT[LANG()]?.[key] || STORE_TEXT.de[key] || key;
  const storeCategory = key => STORE_TEXT[LANG()]?.categories?.[key] || STORE_TEXT.de.categories[key] || key;

  async function loadStoreCatalog(){
    const sources=[STORE_CATALOG_URL,'../data/store-apps.json'];
    for(const source of sources){
      try{
        const response=await fetch(source,{cache:'no-store',credentials:'omit'});
        if(!response.ok)continue;
        const raw=await response.json();
        const entries=Array.isArray(raw)?raw:(Array.isArray(raw.apps)?raw.apps:[]);
        const normalized=entries.filter(app=>app&&typeof app==='object').map(app=>{
          const id=String(app.id||'').trim().toLowerCase();
          const name=String(app.name||'').trim().slice(0,60);
          const url=safeUrl(app.url);
          const description=app.description&&typeof app.description==='object'?app.description:{};
          if(!/^[a-z0-9][a-z0-9-]{1,79}$/.test(id)||!name||!url||!String(description.de||'').trim())return null;
          return {
            id,name,url,
            icon:String(app.icon||'🌐').slice(0,8),
            iconUrl:safeUrl(app.iconUrl)||'',
            category:Object.prototype.hasOwnProperty.call(STORE_TEXT.de.categories,String(app.category))?String(app.category):'tools',
            addedAt:/^\d{4}-\d{2}-\d{2}$/.test(String(app.addedAt||''))?String(app.addedAt):new Date().toISOString().slice(0,10),
            featured:app.featured===true,
            tags:String(app.tags||'').slice(0,400),
            description:{
              de:String(description.de||'').slice(0,1200),
              en:String(description.en||description.de||'').slice(0,1200),
              nl:String(description.nl||description.de||'').slice(0,1200)
            }
          };
        }).filter(Boolean);
        if(!normalized.length)continue;
        STORE_CATALOG=normalized;
        renderHomeTiles();
        renderStoreSections();
        return true;
      }catch{/* Keep the bundled fallback catalogue when offline or when GitHub is unavailable. */}
    }
    return false;
  }
  const storeView = {query:'',category:'all'};
  function loadStoreState(){
    try{
      const value=JSON.parse(localStorage.getItem(STORE_KEY)||'null')||{};
      const validId=id=>typeof id==='string'&&/^[a-z0-9][a-z0-9-]{1,79}$/.test(id);
      return {
        installed:Array.isArray(value.installed)?[...new Set(value.installed.filter(validId))].slice(0,100):[],
        ratings:value.ratings&&typeof value.ratings==='object'?Object.fromEntries(Object.entries(value.ratings).filter(([id,r])=>validId(id)&&Number.isInteger(r)&&r>=1&&r<=5)):{}
      };
    }catch{return {installed:[],ratings:{}};}
  }
  let storeState=loadStoreState();
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
  let pendingIconData = '';
  function previewIcon(source) {
    const box = $('#ssosIconPreview');
    if (!box) return;
    const value = String(source || '').trim();
    const image = value.startsWith('data:image/') ? value : safeUrl(value);
    box.innerHTML = image ? `<img src="${esc(image)}" alt="">` : '🌐';
  }
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
    if(tile.dataset.app)return 'app:'+tile.dataset.app;
    if(tile.dataset.ssosStoreApp)return 'store:'+tile.dataset.ssosStoreApp;
    if(tile.dataset.ssosCustomApp)return 'custom:'+tile.dataset.ssosCustomApp;
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
    const grid=$('#homeAppGrid');if(!grid)return;
    $$('.ssos-store-tile,.ssos-custom-tile',grid).forEach(el=>el.remove());
    config.apps.forEach(app=>{
      const tile=document.createElement('button');tile.type='button';tile.className='app-icon ssos-custom-tile';
      tile.dataset.ssosCustomApp=app.id;tile.title=app.name;
      tile.innerHTML='<span class="icon-tile">'+iconMarkup(app)+'</span><small>'+esc(app.name)+'</small>';
      grid.appendChild(tile);
    });
    storeState.installed.forEach(id=>{
      const app=STORE_CATALOG.find(item=>item.id===id);if(!app)return;
      const tile=document.createElement('button');tile.type='button';tile.className='app-icon ssos-store-tile';
      tile.dataset.ssosStoreApp=app.id;tile.title=app.name;
      tile.innerHTML='<span class="icon-tile">'+iconMarkup(app)+'</span><small>'+esc(app.name)+'</small>';
      grid.appendChild(tile);
    });
    applyHomeOrder();initHomeReordering();
  }
  function storeHost(app){try{return new URL(app.url).hostname.replace(/^www\./,'');}catch{return app.url;}}
  function storeCard(app){
    const installed=storeState.installed.includes(app.id),rating=storeState.ratings[app.id]||0;
    const buttons=installed
      ?'<button class="app-button secondary" type="button" data-ssos-store-open="'+esc(app.id)+'">'+esc(st('open'))+' ↗</button><button class="app-button secondary ssos-store-remove" type="button" data-ssos-store-uninstall="'+esc(app.id)+'">'+esc(st('uninstall'))+'</button>'
      :'<button class="app-button ssos-store-install" type="button" data-ssos-store-install="'+esc(app.id)+'">＋ '+esc(st('install'))+'</button>';
    const stars=[1,2,3,4,5].map(n=>'<button class="ssos-store-star'+(rating>=n?' selected':'')+'" type="button" data-ssos-rate-app="'+esc(app.id)+'" data-rating="'+n+'" aria-label="'+n+' / 5">★</button>').join('');
    const description=app.description[LANG()]||app.description.de;
    const icon=safeUrl(app.iconUrl)?'<img src="'+esc(safeUrl(app.iconUrl))+'" alt="" loading="lazy">':esc(app.icon||'🌐');
    return '<article class="ssos-store-card"><div class="ssos-store-card-head"><span class="ssos-store-icon">'+icon+'</span><div class="ssos-store-card-title"><b>'+esc(app.name)+'</b><small>'+esc(storeCategory(app.category))+' · '+esc(storeHost(app))+'</small></div></div><p class="ssos-store-description">'+esc(description)+'</p><div class="ssos-store-rating"><span class="ssos-store-rating-label">'+esc(rating?st('rated')+': '+rating+'/5':st('notRated'))+'</span><div class="ssos-store-stars">'+stars+'</div></div><div class="ssos-store-actions">'+buttons+'</div></article>';
  }
  function renderLegacyApps(){
    if(!config.apps.length)return '<p class="body-copy">'+esc(st('legacyEmpty'))+'</p>';
    return config.apps.map(app=>'<article class="ssos-store-legacy-row"><span class="ssos-store-icon">'+iconMarkup(app,true)+'</span><div><b>'+esc(app.name)+'</b><small>'+esc(storeHost(app))+'</small></div><button class="app-button secondary" type="button" data-ssos-legacy-open="'+esc(app.id)+'">'+esc(st('open'))+' ↗</button><button class="app-button secondary ssos-store-remove" type="button" data-ssos-legacy-uninstall="'+esc(app.id)+'">'+esc(st('uninstall'))+'</button></article>').join('');
  }
  function renderStoreSections(){
    const root=$('#ssosStoreDiscover');if(!root)return;
    const category=storeView.category,q=storeView.query.trim().toLocaleLowerCase(LANG());
    const matches=STORE_CATALOG.filter(app=>{
      const description=app.description[LANG()]||app.description.de;
      const value=(app.name+' '+app.url+' '+app.category+' '+storeCategory(app.category)+' '+app.tags+' '+description).toLocaleLowerCase(LANG());
      return (!q||value.includes(q))&&(category==='all'||app.category===category);
    });
    const featured=STORE_CATALOG.filter(app=>app.featured&&(category==='all'||app.category===category));
    const topRated=STORE_CATALOG.filter(app=>(storeState.ratings[app.id]||0)>0&&(category==='all'||app.category===category)).sort((a,b)=>(storeState.ratings[b.id]||0)-(storeState.ratings[a.id]||0));
    const newest=STORE_CATALOG.filter(app=>category==='all'||app.category===category).sort((a,b)=>b.addedAt.localeCompare(a.addedAt));
    const set=(id,markup)=>{const el=$('#'+id);if(el)el.innerHTML=markup;};
    set('ssosStoreFeatured',featured.map(storeCard).join('')||'<p class="body-copy">'+esc(st('noResults'))+'</p>');
    set('ssosStoreTopRated',topRated.length?topRated.map(storeCard).join(''):'<p class="ssos-store-empty">'+esc(st('topEmpty'))+'</p>');
    set('ssosStoreNew',newest.map(storeCard).join('')||'<p class="body-copy">'+esc(st('noResults'))+'</p>');
    set('ssosStoreAll',matches.map(storeCard).join('')||'<p class="body-copy">'+esc(st('noResults'))+'</p>');
    set('ssosStoreInstalled',storeState.installed.map(id=>STORE_CATALOG.find(app=>app.id===id)).filter(Boolean).map(storeCard).join('')||'<p class="body-copy">'+esc(st('noInstalled'))+'</p>');
    set('ssosStoreLegacy',renderLegacyApps());
    const searchBox=$('#ssosStoreSearchResults');if(searchBox)searchBox.hidden=!q;
    root.hidden=!!q;
    set('ssosStoreSearchList',matches.map(storeCard).join('')||'<p class="body-copy">'+esc(st('noResults'))+'</p>');
    $$('#ssosStoreCategories [data-ssos-store-category]').forEach(button=>button.classList.toggle('selected',button.dataset.ssosStoreCategory===category));
  }
  function renderStore(){
    storeView.query='';storeView.category='all';
    const categories=[...new Set(STORE_CATALOG.map(app=>app.category))];
    const categoryButtons='<button class="ssos-store-category selected" type="button" data-ssos-store-category="all">'+esc(st('allCategories'))+'</button>'+categories.map(key=>'<button class="ssos-store-category" type="button" data-ssos-store-category="'+esc(key)+'">'+esc(storeCategory(key))+'</button>').join('');
    const categoryOptions=Object.entries(STORE_TEXT[LANG()]?.categories||STORE_TEXT.de.categories).map(([key,label])=>'<option value="'+esc(key)+'">'+esc(label)+'</option>').join('');
    const markup='<div class="app-hero ssos-store-hero"><p class="eyebrow">SCHNECKE SCHNECK · SCHLEIM-STORE</p><h2>Schleim-Store</h2><p>'+esc(st('intro'))+'</p><span class="large-emoji">🛍️</span></div>'+
      '<label class="ssos-store-search"><span>⌕</span><input id="ssosStoreSearch" type="search" placeholder="'+esc(st('search'))+'" autocomplete="off"></label>'+
      '<div class="ssos-store-categories" id="ssosStoreCategories">'+categoryButtons+'</div>'+
      '<div class="ssos-store-system-note">🔒 '+esc(st('systemNote'))+'</div>'+
      '<div id="ssosStoreDiscover">'+
        '<section class="ssos-store-section"><h3>'+esc(st('recommended'))+'</h3><div class="ssos-store-grid" id="ssosStoreFeatured"></div></section>'+
        '<section class="ssos-store-section"><h3>'+esc(st('top'))+'</h3><div class="ssos-store-grid" id="ssosStoreTopRated"></div></section>'+
        '<section class="ssos-store-section"><h3>'+esc(st('newest'))+'</h3><div class="ssos-store-grid" id="ssosStoreNew"></div></section>'+
        '<section class="ssos-store-section"><h3>'+esc(st('all'))+'</h3><div class="ssos-store-grid" id="ssosStoreAll"></div></section>'+
        '<section class="ssos-store-section"><h3>'+esc(st('installed'))+'</h3><div class="ssos-store-grid" id="ssosStoreInstalled"></div></section>'+
        '<section class="ssos-store-section"><h3>'+esc(st('legacy'))+'</h3><div class="ssos-store-installed" id="ssosStoreLegacy"></div></section>'+
      '</div>'+
      '<section class="ssos-store-section ssos-store-search-results" id="ssosStoreSearchResults" hidden><h3>'+esc(st('all'))+'</h3><div class="ssos-store-grid" id="ssosStoreSearchList"></div></section>'+
      '<section class="ssos-store-submit"><div class="ssos-section-heading"><p class="eyebrow">COMMUNITY</p><h3>'+esc(st('propose'))+'</h3></div><p class="body-copy">'+esc(st('submitIntro'))+'</p>'+
        '<form id="ssosAppSubmissionForm" class="ssos-card ssos-form">'+
          '<label>'+esc(st('url'))+'<input id="ssosAppUrl" type="url" inputmode="url" placeholder="https://example.com" autocomplete="url" required></label>'+
          '<button class="app-button secondary" type="button" id="ssosDetectMetadata">✨ '+esc(st('detect'))+'</button>'+
          '<label>'+esc(st('name'))+'<input id="ssosAppName" type="text" maxlength="60" placeholder="Website" required></label>'+
          '<label>'+esc(st('category'))+'<select id="ssosAppCategory">'+categoryOptions+'</select></label>'+
          '<label>'+esc(st('description'))+'<textarea id="ssosAppDescription" rows="3" maxlength="1200" placeholder="Was kann die Webseite?" required></textarea></label>'+
          '<label>'+esc(st('iconUrl'))+'<input id="ssosAppIconUrl" type="url" placeholder="https://example.com/favicon.ico"></label>'+
          '<label>'+esc(st('iconFile'))+'<input type="file" id="ssosAppIconFile" accept="image/*"></label>'+
          '<div class="ssos-icon-preview"><span>'+esc(st('iconPreview'))+'</span><div id="ssosIconPreview">🌐</div></div><p class="ssos-store-upload-note">'+esc(st('uploadNote'))+'</p>'+
          '<div class="ssos-form-actions"><button class="app-button" type="submit" id="ssosSubmitApp">'+esc(st('submit'))+' ↗</button></div>'+
          '<a id="ssosIssueFallback" class="ssos-store-issue-fallback" href="#" target="_blank" rel="noopener noreferrer" hidden>GitHub Issue öffnen ↗</a>'+
        '</form></section>'+
      (globalThis.chrome?.runtime?.id?'<section class="ssos-store-admin-entry"><button class="app-button secondary ssos-admin-open" id="ssosOpenAdmin" type="button">🔐 '+(LANG()==='en'?'Admin portal':LANG()==='nl'?'Adminportaal':'Admin-Portal')+'</button><div id="ssosAdminPortal" class="ssos-admin-portal" hidden></div></section>':'');
    setTimeout(renderStoreSections,0);
    return markup;
  }
  function saveStoreState(){
    try{localStorage.setItem(STORE_KEY,JSON.stringify(storeState));}catch{toast(t('fileTooLarge'));}
    renderHomeTiles();renderStoreSections();window.dispatchEvent(new Event('ssos-store-changed'));
  }
  function openStoreApp(id){
    const app=STORE_CATALOG.find(item=>item.id===String(id));
    if(!app||!storeState.installed.includes(app.id))return false;
    window.open(app.url,'_blank','noopener,noreferrer');return true;
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
  function submitAppSuggestion(){
    const url=safeUrl($('#ssosAppUrl')?.value||'');
    if(!url){toast(st('invalid'));return;}
    const name=($('#ssosAppName')?.value||'').trim().slice(0,60);
    if(!name){toast(st('needName'));return;}
    const description=($('#ssosAppDescription')?.value||'').trim().slice(0,1200);
    if(!description){toast(st('needDescription'));return;}
    const categoryKey=$('#ssosAppCategory')?.value||'tools';
    const category=STORE_TEXT.de.categories[categoryKey]||STORE_TEXT.de.categories.tools;
    const iconUrl=safeUrl($('#ssosAppIconUrl')?.value||'');
    let issueDescription=description;
    if(pendingIconData)issueDescription+='\n\n'+({de:'Ein eigenes Icon wurde lokal ausgewählt. Bitte lade die Bilddatei im GitHub-Formular erneut hoch.',en:'A custom icon was selected locally. Please upload the image again in the GitHub form.',nl:'Er is lokaal een eigen pictogram geselecteerd. Upload de afbeelding opnieuw in het GitHub-formulier.'}[LANG()]||'A custom icon was selected locally. Please upload the image again in the GitHub form.');
    const language=LANG();
    const issueBody='## App information\n\n**Name:** '+name+'\n\n**Website:** '+url+'\n\n**Category:** '+category+'\n\n**Icon URL:** '+(iconUrl||'Not provided')+'\n\n**Submission language:** '+language+'\n\n## Description\n\n'+issueDescription+'\n';
    const params=new URLSearchParams();
    params.set('template','app-submission.md');
    params.set('title',({de:'[Schleim-Store] App-Vorschlag: ',en:'[Schleim-Store] App suggestion: ',nl:'[Schleim-Store] Appvoorstel: '}[language]||'[Schleim-Store] App suggestion: ')+name);
    params.set('body',issueBody);
    const issueUrl=STORE_ISSUE_URL+'?'+params.toString();
    const fallback=$('#ssosIssueFallback');if(fallback){fallback.href=issueUrl;fallback.hidden=false;}
    window.open(issueUrl,'_blank','noopener,noreferrer');
    toast(st('prepared'));
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
`;
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
    loadStoreCatalog();
    if (config.weatherCity) refreshWeather();
    const appContent=$('#appContent'); if(appContent){new MutationObserver(()=>refreshSettingsIfOpen()).observe(appContent,{childList:true,subtree:true});}
    window.addEventListener('ssos-home-grid-rendered', renderHomeTiles);
    $('#lockScreen')?.addEventListener('click',e=>{if(e.target.closest('[data-ssos-lock-url]'))return; if(e.target.closest('#unlockButton'))return; $('#unlockButton')?.click();});
    let touchStart=null; $('#lockScreen')?.addEventListener('pointerdown',e=>{touchStart={y:e.clientY};},{passive:true});
    $('#lockScreen')?.addEventListener('pointerup',e=>{if(touchStart && touchStart.y-e.clientY>42 && !e.target.closest('[data-ssos-lock-url]'))$('#unlockButton')?.click();touchStart=null;},{passive:true});
    document.addEventListener('click',async e=>{
      const storeTile=e.target.closest('[data-ssos-store-app]');
      if(storeTile){openStoreApp(storeTile.dataset.ssosStoreApp);return;}
      const install=e.target.closest('[data-ssos-store-install]');
      if(install){const id=install.dataset.ssosStoreInstall;if(STORE_CATALOG.some(app=>app.id===id)&&!storeState.installed.includes(id)){storeState.installed.push(id);saveStoreState();toast(st('installedLabel')+' ✓');}return;}
      const storeOpen=e.target.closest('[data-ssos-store-open]');
      if(storeOpen){openStoreApp(storeOpen.dataset.ssosStoreOpen);return;}
      const uninstall=e.target.closest('[data-ssos-store-uninstall]');
      if(uninstall){const id=uninstall.dataset.ssosStoreUninstall;if(confirm(st('confirmUninstall'))){storeState.installed=storeState.installed.filter(item=>item!==id);saveStoreState();toast(st('uninstall')+' ✓');}return;}
      const rate=e.target.closest('[data-ssos-rate-app]');
      if(rate){const id=rate.dataset.ssosRateApp,value=Number(rate.dataset.rating);if(STORE_CATALOG.some(app=>app.id===id)&&Number.isInteger(value)&&value>=1&&value<=5){storeState.ratings[id]=value;saveStoreState();}return;}
      const legacyOpen=e.target.closest('[data-ssos-legacy-open]');
      if(legacyOpen){openCustomApp(legacyOpen.dataset.ssosLegacyOpen);return;}
      const legacyRemove=e.target.closest('[data-ssos-legacy-uninstall]');
      if(legacyRemove){const id=legacyRemove.dataset.ssosLegacyUninstall;if(confirm(st('legacyConfirm'))){config.apps=config.apps.filter(app=>app.id!==id);saveConfig();renderStoreSections();toast(st('uninstall')+' ✓');}return;}
      if(e.target.closest('#ssosDetectMetadata')){await detectMetadata();return;}
      if(e.target.closest('#ssosSaveDesign')){saveDesign();return;}
      if(e.target.closest('#ssosClearWallpaper')){config.wallpaperUrl='';config.wallpaperData='';saveConfig();toast(t('designSaved'));return;}
      if(e.target.closest('#ssosSaveLock')){saveLockSettings();return;}
      if(e.target.closest('#ssosRefreshWeather')){config.weatherCity=$('#ssosWeatherCity')?.value.trim()||'';saveConfig();refreshWeather();return;}
      if(e.target.closest('#ssosExport')){exportBackup();return;}
      const lockUrl=e.target.closest('[data-ssos-lock-url]');if(lockUrl){window.open(lockUrl.dataset.ssosLockUrl,'_blank','noopener,noreferrer');return;}
    });
    document.addEventListener('input',e=>{
      if(e.target.id==='ssosStoreSearch'){storeView.query=e.target.value||'';renderStoreSections();}
      if(e.target.id==='ssosAppIconUrl')previewIcon(safeUrl(e.target.value));
    });
    document.addEventListener('click',e=>{
      const category=e.target.closest('[data-ssos-store-category]');
      if(category){storeView.category=category.dataset.ssosStoreCategory||'all';renderStoreSections();return;}
    });
    document.addEventListener('submit',e=>{
      if(e.target?.id==='ssosAppSubmissionForm'){e.preventDefault();submitAppSuggestion();}
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
  window.SSOSPersonalization = Object.freeze({renderStore, refreshStoreCatalog:loadStoreCatalog, getStoreCatalog:()=>STORE_CATALOG.map(app=>({...app,description:{...app.description}})), exportBackup, importBackup: file => importBackup(file), getApps, openCustomApp, openStoreApp});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.dispatchEvent(new Event('ssos-custom-apps-changed'));
})();
