(() => {
  'use strict';

  const SITE = 'https://example.com';
  const URLS = {
    home: SITE,
    social: SITE + '/meine-social-media-kan%C3%A4le',
    about: SITE + '/%C3%BCber-mich',
    projects: SITE + '/meine-projekte',
    shop: 'https://example.com/shop',
    website: SITE + '/%C3%BCber-unsere-webseite',
    fanapp: SITE + '/unsere-app',
    agbs: SITE + '/agbs',
    privacy: SITE + '/datenschutz',
    imprint: SITE + '/impressum',
    instagram: 'https://www.instagram.com/YOUR_USERNAME/',
    tiktok: 'https://www.tiktok.com/@YOUR_USERNAME',
    whatsapp: 'https://example.com/contact',
    email: 'mailto:your-email@example.com',
    googleReview: 'https://example.com/reviews',
    scratch: 'https://scratch.mit.edu/',
    chatgpt: 'https://chatgpt.com/',
    voiceassistantDemo: 'https://example.com/demo/voice-assistant',
    parentsettingsPen: 'https://codepen.io/YOUR_USERNAME/pen/YOUR_PEN_ID_1',
    schildiPen: 'https://codepen.io/YOUR_USERNAME/pen/YOUR_PEN_ID_2',
    chatgptPen: 'https://codepen.io/YOUR_USERNAME/pen/YOUR_PEN_ID_3',
    fanAppDownload: 'https://example.com/demo/app'
  };

  // Alle App-Namen und Beschreibungen richten sich an Besucherinnen und Besucher.
  const APPS = [
    {id:'websitehome',name:'Startseite',icon:'🏠',hint:'Willkommen und Seitenübersicht',keys:'home start willkommen fan webseite'},
    {id:'about',name:'Über den Creator',icon:'💠',hint:'Profil und Hintergrund',keys:'über mich profil creator technik'},
    {id:'social',name:'Social Media',icon:'📸',hint:'Instagram und TikTok',keys:'instagram tiktok social feeds videos'},
    {id:'projects',name:'Projektwelt',icon:'🧩',hint:'Alle veröffentlichten Projekte',keys:'projekte chatgpt elterneinstellungen schildi smartphone sprachassistent scratch'},
    {id:'studio',name:'Creator Studio',icon:'🚀',hint:'Marke und Leistungen',keys:'creator studio google unternehmen medien software'},
    {id:'website',name:'Demo-Website',icon:'🌐',hint:'Die komplette Seitenübersicht',keys:'your website provider fan homepage unterseiten website'},
    {id:'shop',name:'Demo Shop',icon:'🛍️',hint:'Merch und Print-on-Demand',keys:'YOUR_PRINT_ON_DEMAND_PROVIDER shop merchandise bestellung'},
    {id:'browserstore',name:'Browser Store',icon:'🛍️',hint:'Apps entdecken, installieren und vorschlagen',keys:'Browser Store Browser store browser store app store apps installieren websites webapps'},
    {id:'fanapp',name:'Demo-App',icon:'📱',hint:'Die Community-App',keys:'fan app android download apk'},
    {id:'websiteinfo',name:'Über diese Website',icon:'ℹ️',hint:'Funktionen und Community',keys:'dark mode chat profile mitglieder gruppen ki'},
    {id:'voiceassistant',name:'AI Sprachassistent',icon:'🎙️',hint:'Voice assistant demo – Sprachassistent-Projekt',keys:'ai sprachassistent voice assistant voice assistant demo'},
    {id:'parentsettings',name:'Elterneinstellungen',icon:'👨‍👩‍👧',hint:'Zugangscode, Zeitlimit und Einstellungen',keys:'elterneinstellungen projekt eltern code timer'},
    {id:'schildi',name:'Smartphone UI demo',icon:'📲',hint:'Smartphone-Simulation',keys:'smartphone interface project pin'},
    {id:'chatgpt',name:'Eigenes ChatGPT',icon:'🤖',hint:'Eigene KI-Suchoberfläche',keys:'ki chatgpt künstliche intelligenz suche'},
    {id:'scratch',name:'Scratch-Projekt',icon:'🟧',hint:'Kreatives Programmierprojekt',keys:'scratch programmieren'},
    {id:'clouddemo',name:'Cloud storage demo',icon:'☁️',hint:'Cloud storage demo',keys:'cloud storage backup files'},
    {id:'iptv',name:'IPTV & Medien',icon:'📺',hint:'Streaming und Medien-Setups',keys:'iptv streaming sonos tunein'},
    {id:'tech',name:'Tech Lab',icon:'💻',hint:'Technik und Experimente',keys:'android samsung galaxy linux lineagos raspberry pi'},
    {id:'contact',name:'Kontakt',icon:'✉️',hint:'Nachrichten und Kooperationen',keys:'kontakt whatsapp business email'},
    {id:'whatsapp',name:'WhatsApp Business',icon:'💬',hint:'Nachricht senden',keys:'whatsapp hotline chat nachricht'},
    {id:'email',name:'E-Mail',icon:'📨',hint:'Kontakt per E-Mail',keys:'email gmail mail'},
    {id:'google',name:'Google-Profil',icon:'⭐',hint:'Creator Studio bewerten',keys:'google bewertung rezension maps'},
    {id:'images',name:'Fotos',icon:'📸',hint:'Private Foto- und Video-Mediathek',keys:'fotos bilder galerie mediathek videos cloud hochladen suche'},
    {id:'camera',name:'Kamera',icon:'📷',hint:'Fotos und Videos mit Front- und Rückkamera aufnehmen',keys:'kamera camera foto video selfie frontkamera rückkamera aufnehmen'},
    {id:'legal',name:'Rechtliches',icon:'⚖️',hint:'Impressum, Datenschutz und AGBs',keys:'rechtliches impressum datenschutz agb agbs bedingungen'},
    {id:'settings',name:'Einstellungen',icon:'⚙️',hint:'Darstellung und Kontrollzentrum',keys:'einstellungen wallpaper design helligkeit'},
    {id:'vpn',name:'VPN-Bridge',icon:'🛡️',hint:'Beispiel für eine native Android-VPN-Anbindung',keys:'vpn tunnel android native vpnservice'}
  ];

  // Nur diese Hauptbereiche erscheinen auf dem Home-Bildschirm und in der globalen App-Suche.
  const HOME_APP_IDS = ['about','browserstore','social','projects','studio','website','shop','images','camera','contact','legal','settings','vpn'];
  // The old static your website provider gallery URLs are no longer bundled. Keep the app usable
  // and offer the live public gallery below instead of referencing an undefined constant.
  const DEMO_WEBSITE_GALLERY_IMAGES = [];
  const PROJECT_CHILD_IDS = ['voiceassistant','parentsettings','schildi','chatgpt','scratch','clouddemo','iptv','tech'];
  const CONTACT_CHILD_IDS = ['whatsapp','email','google'];
  let activeAppId = null;
  let projectHubActive = false;
  let contactHubActive = false;
  let selectedLegalDocument = 'imprint';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const saved = (key, fallback) => {
    try { const value = localStorage.getItem('ssos-' + key); return value === null ? fallback : JSON.parse(value); }
    catch { return fallback; }
  };
  const state = {
    language:saved('language',null), wallpaper:saved('wallpaper','midnight'), theme:saved('theme','dark'), brightness:saved('brightness',90),
    glass:saved('glass',78), volume:saved('volume',35), quiet:saved('quiet',false), sounds:saved('sounds',true),
    wifi:saved('wifi',true), bluetooth:saved('bluetooth',true), mobile:saved('mobile',true), rotation:saved('rotation',true),
    flashlight:saved('flashlight',false), reduceMotion:saved('reduceMotion',false)
  };
  const els = {
    language:$('#languageScreen'), intro:$('#introScreen'), home:$('#homeScreen'), app:$('#appScreen'), panel:$('#controlPanel'), search:$('#searchScreen'), lock:$('#lockScreen'),
    appContent:$('#appContent'), toast:$('#toast'), title:$('#appWindowTitle'), emoji:$('#appWindowEmoji'),
    searchInput:$('#searchInput'), searchResults:$('#searchResults'), screen:$('#screen')
  };
  let toastTimer = null;
  let audioContext = null;

  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const LANGUAGES = {
    de: {name:'Deutsch', html:'de-DE'},
    en: {name:'English', html:'en'},
    nl: {name:'Nederlands', html:'nl-NL'}
  };
  const APP_LABELS = {
    en:{websitehome:'Home',about:'About',social:'Social Media',projects:'Projects',studio:'Creator Studio',website:'Demo website',shop:'Demo shop',browserstore:'Browser Store',fanapp:'Demo app',websiteinfo:'About this website',chatgpt:'Custom ChatGPT',parentsettings:'Parental settings',schildi:'Smartphone UI demo',voiceassistant:'AI voice assistant',scratch:'Scratch project',clouddemo:'Cloud storage demo',iptv:'IPTV & Media',tech:'Tech Lab',contact:'Contact',whatsapp:'WhatsApp Business',email:'Email',google:'Google profile',images:'Photos',camera:'Camera',legal:'Legal information',settings:'Settings',vpn:'VPN bridge'},
    nl:{websitehome:'Startpagina',about:'About the demo creator',social:'Sociale media',projects:'Projecten',studio:'Creator Studio',website:'Demo-Website',shop:'Demo-winkel',browserstore:'Browser Store',fanapp:'Demo-App',websiteinfo:'Over deze website',chatgpt:'Eigen ChatGPT',parentsettings:'Ouderinstellingen',schildi:'Smartphone UI demo',voiceassistant:'AI-spraakassistent',scratch:'Scratch-project',clouddemo:'Cloud storage demo',iptv:'IPTV & media',tech:'Tech Lab',contact:'Contact',whatsapp:'WhatsApp Business',email:'E-mail',google:'Google-profiel',images:'Foto’s',camera:'Camera',legal:'Juridische informatie',settings:'Instellingen',vpn:'VPN-bridge'}
  };
  const HINT_LABELS = {
    en:{websitehome:'Welcome and page overview',about:'Profile and background',social:'Instagram and TikTok',projects:'Published projects and demos',studio:'Brand and services',website:'All demo website sections',shop:'Merchandise and print on demand',browserstore:'Discover apps in the Browser Store, install and suggest websites',fanapp:'Community app information',websiteinfo:'Features and community',chatgpt:'AI and development',parentsettings:'Project from the project overview',schildi:'Smartphone project',voiceassistant:'AI voice assistant project',scratch:'Creative coding project',clouddemo:'Personal cloud project',iptv:'Streaming and media setups',tech:'Technology and experiments',contact:'Messages and collaborations',whatsapp:'Send a written message',email:'Contact by email',google:'Review the Creator Studio',images:'Private photo and video library',camera:'Take photos and videos with the front or rear camera',legal:'Imprint, privacy policy and terms',settings:'Appearance and language',vpn:'Example native Android VPN bridge'},
    nl:{websitehome:'Welkom en pagina-overzicht',about:'Profiel en achtergrond',social:'Instagram en TikTok',projects:'Gepubliceerde projecten',studio:'Merk en diensten',website:'Alle onderdelen van de Demo-Website',shop:'Merchandise en print on demand',browserstore:'Ontdek apps in de Browser Store, installeer en stel websites voor',fanapp:'Informatie over de community-app',websiteinfo:'Functies en community',chatgpt:'AI en ontwikkeling',parentsettings:'Project uit het projectenoverzicht',schildi:'Smartphoneproject',voiceassistant:'AI-spraakassistentproject',scratch:'Creatief programmeerproject',clouddemo:'Cloudopslagdemo',iptv:'Streaming en media-opstellingen',tech:'Technologie en experimenten',contact:'Berichten en samenwerkingen',whatsapp:'Een schriftelijk bericht sturen',email:'Contact via e-mail',google:'Beoordeel het Creator Studio',images:'Fotogalerij van de Demo-Website',legal:'Colofon, privacy en voorwaarden',settings:'Weergave en taal',vpn:'Voorbeeld van een native Android-VPN-bridge'}
  };
  // Phrase-level offline localization. Original German legal clauses remain available verbatim.
  const TEXT = {
    en:{
      'DIE DIGITALE WELT VON Demo Creator':'THE DIGITAL DEMO WORLD','Willkommen auf meiner offiziellen Demo-Website!':'Welcome to the demo website!','Projekte, Technik, Social Media und Demo environment – alles an einem Ort.':'Projects, technology, social media and the digital world – all in one place.','Hallo!':'Hello!','Schön, dass du da bist.':'Glad you are here.','Apps und Inhalte suchen':'Search apps and content','↓ Vom oberen Rand nach unten wischen – Kontrollzentrum öffnen':'Swipe down from the top edge to open Quick Settings','ENTDECKE DIE DIGITALE WELT':'EXPLORE THE DIGITAL WORLD','Demo Creator':'Demo Creator','Projekte & Creator-Welt':'Projects & Creator world','Schön, dass du hier bist.':'Glad you are here.','Entdecke die Apps':'Explore the apps','Alle anzeigen':'View all','Im Spotlight':'Featured','Einblick in das Cloud-Projekt':'Explore the cloud project','System starten':'Start system','Intro überspringen':'Skip intro','BUILT WITH 💠':'BUILT WITH 💠','Kontrollzentrum':'Quick Settings','WLAN':'Wi-Fi','Verbunden':'Connected','Bluetooth':'Bluetooth','Ruhemodus':'Do not disturb','Töne':'Sounds','Mobile Daten':'Mobile data','Autom. Drehen':'Auto-rotate','Taschenlampe':'Flashlight','Displayhelligkeit':'Screen brightness','Glas-Effekt':'Glass effect','Medienlautstärke':'Media volume','Hintergrund':'Wallpaper','Wähle deinen Look':'Choose your look','Dunkle Darstellung':'Dark appearance','Helle Darstellung':'Light appearance','Darstellung wechseln':'Switch appearance','Bewegung reduzieren':'Reduce motion','Bildschirm sperren':'Lock screen','Zum Entsperren antippen':'Tap to unlock','Was suchst du?':'What are you looking for?','Keine passende App gefunden. Probiere einen anderen Suchbegriff.':'No matching app found. Try another search term.','Hintergrund geändert':'Wallpaper changed','Einstellungen zurückgesetzt':'Settings reset','Schließen':'Close','Extern öffnen':'Open externally','Original-Shop in dieser App laden':'Load the original shop in this app','Original-Projektübersicht in dieser App laden':'Load the original project page in this app','Originalseite erneut laden':'Reload original page','Die externe Seite wird erst nach Auswahl geladen.':'The external page will only load after you select it.','Die Einbettung kann durch your website provider oder den jeweiligen Anbieter blockiert werden.':'Embedding may be blocked by your website provider or the respective provider.','Über den Creator':'ABOUT THE CREATOR','Ein Demo-Creator mit Begeisterung für Technik, Programmierung und digitale Ideen.':'A demo creator with a passion for technology, programming and digital ideas.','Meine größte Leidenschaft ist das Programmieren sowie die Entwicklung von Webseiten und eigenen digitalen Projekten.':'My greatest passion is programming and developing websites and digital projects.','Ich liebe es, neue Ideen auszuprobieren und diese in funktionierende Anwendungen umzusetzen.':'I love trying out new ideas and turning them into working applications.','In meiner Freizeit arbeite ich an verschiedenen eigenen Projekten, darunter Apps, Webseiten und eigene Systeme wie mein IPTV-Setup oder sogar eine eigene KI.':'In my free time I work on personal projects, including apps, websites and systems such as my IPTV setup and even my own AI.','Neben meinen Projekten bin ich auch als Content Creator aktiv und teile regelmäßig Einblicke in meine Arbeit und mein Leben auf Social Media.':'Alongside my projects, I am also active as a content creator and share glimpses of my work and life on social media.','Zusätzlich habe ich ein eigenes Google-Unternehmensprofil für mein Projekt „Demo Creator Studio“, über das ich Updates, Beiträge und Informationen veröffentliche.':'I also have a Google Business Profile for my project, “Demo Creator Studio”, where I publish updates, posts and information.','Ich freue mich immer über Nachrichten, Feedback oder einfach nette Gespräche.':'I always welcome messages, feedback or a friendly chat.','Vielen Dank für deine Unterstützung und viel Spaß beim Erkunden meiner Seite!':'Thank you for your support and enjoy exploring the site!','Auf einen Blick':'At a glance','Themen':'Topics','Folge der Browserspur.':'Follow the trail.','Öffentliche Kanäle, Beiträge und Einblicke aus der digitalen Welt von Demo Creator.':'Public channels, posts and insights from the digital world of Demo Creator.','Beiträge aus der öffentlichen Website-Galerie':'Posts from the public website gallery','Weitere Verweise aus den Beiträgen':'More links from the posts','Die Original-Feeds':'Original feeds','Die vollständigen Medien und die Funktion „Load More“ bleiben im originalen your website provider-/Instagram-Feed verfügbar.':'The full media and “Load More” feature remain available in the original your website provider/Instagram feed.','Ideen werden digital.':'Ideas become digital.','Auf der offiziellen Projektseite werden fünf Projekte namentlich aufgeführt. Jedes erhält hier einen eigenen App-Bereich.':'The official project page lists five projects by name. Each has its own app area here.','Weitere digitale Themen':'More digital topics','Schlagwörter':'Topics','PROJEKTDETAIL':'PROJECT DETAILS','MARKE & AUFTRITT':'BRAND & PRESENCE','Leistungen und Tätigkeitsbereiche':'Services and areas of activity','Google-Unternehmensprofil':'Google Business Profile','Feedback':'Feedback','Demo-Website':'FAN WEBSITE','Alle Bereiche an einem Ort.':'All sections in one place.','Die öffentliche Demo-Website wurde in eigenständige Apps aufgeteilt. Wähle eine Unterseite, um ihre Inhalte direkt hier zu lesen.':'The public fan website has been divided into individual apps. Choose a page to read its content here.','Unterseiten als Apps':'Pages as apps','Auf der Website beschriebene Funktionen':'Features described on the website','STARTSEITE':'HOME','Direkt zu den Inhalten':'Go straight to the content','Originalseite als eingebettete Ansicht':'Original page embedded here','Kontakt und Feedback':'Contact and feedback','Rechtliches':'Legal information','Demo Shop':'SNAIL SHOP','Merch mit Demon-Vibe.':'Merch with a snail vibe.','So ist der Shop beschrieben':'How the shop is described','Designs':'Designs','Print-on-Demand':'Print on demand','Versand':'Shipping','Bestellung':'Ordering','Über diese Website':'About this website','Mehr als eine Fan-Seite.':'More than a fan page.','Funktionen laut Website und Projektangaben':'Features described on the website and in project information','Mitglieder-Chat':'Member chat','Profile':'Profiles','Gruppen':'Groups','Demo AI':'Demo Creator’s AI','Shop-Einbindung':'Shop integration','Google-Bewertung':'Google review','Unsere App':'Our app','Demo Creator’s Demo-App.':'Demo Creator’s fan app.','Datenschutz und Sicherheit':'Privacy and security','Installationsanleitung':'Installation guide','Kontaktmöglichkeiten':'Contact options','Kontakt per E-Mail':'Contact by email','Schriftliche Nachricht senden':'Send a written message','Nachricht senden':'Send a message','E-Mail-Programm öffnen':'Open email app','Google-Bewertung schreiben':'Write a Google review','Originaltext der öffentlichen Demo-Website':'Original text from the public fan website','Alle Abschnitte öffnen':'Expand all sections','Aktuellen Originaltext auf your website provider prüfen':'Check the latest original text on your website provider','Einstellungen':'Settings','Oberfläche anpassen':'CUSTOMIZE THE INTERFACE','Passe das Erscheinungsbild dieser Besucher-App an. Die Änderungen werden lokal in diesem Browser gespeichert.':'Customize the appearance of this visitor app. Changes are stored locally in this browser.','Sprache':'Language','Sprache ändern':'Change language','Deutsch':'German','English':'English','Nederlands':'Dutch','Diese Übersetzung dient nur als Lesehilfe. Die deutsche Originalfassung ist maßgeblich.':'This translation is provided as a reading aid only. The German original is authoritative.','57 Browserige Artikel entdecken.':'Discover 57 slime-covered items.','Der vollständige Demo Shop läuft direkt in diesem App-Fenster – mit Öffnungszeiten, Live-Countdown, Tagesempfehlungen, Suche und dem kompletten Produktkatalog.':'The complete Snail Shop runs right inside this app window, with opening hours, a live countdown, daily recommendations, search and the full product catalogue.','Der Shop verwendet die bereitgestellte HTML-Anwendung. Produktvorschauen und Kaufziele werden über die von dir hinterlegten YOUR_PRINT_ON_DEMAND_PROVIDER-Kurzlinks geladen.':'The shop uses the supplied HTML application. Product previews and purchase destinations load through the YOUR_PRINT_ON_DEMAND_PROVIDER short links you provided.','Demo Shop · Original-HTML':'Snail Shop · original HTML','57 Artikel · responsive Ansicht':'57 items · responsive view','Shop separat öffnen':'Open shop separately','Shop-Quellcode und Funktionen':'Shop source code and features','Der vollständige vom Besucher bereitgestellte Shop-Code liegt als eigenständige Datei':'The complete supplied shop code is stored as a separate file','im Projektordner. So bleiben Styles, Produktdaten, JavaScript, Suchfilter, Öffnungszeiten und Produkt-IFrames getrennt von der OS-Oberfläche und können eigenständig gewartet werden.':'in the project folder. This keeps styles, product data, JavaScript, search filters, opening hours and product iframes separate from the OS interface and makes them independently maintainable.','Shop-HTML öffnen':'Open shop HTML','Im Shop enthalten':'Included in the shop','57 Artikel':'57 items','Vollständiger Produktkatalog mit SKU und Produktlink':'Complete catalogue with SKU and product link','Öffnungszeiten':'Opening hours','Mo–Do 17–20 Uhr, Fr 14–24 Uhr, Wochenende geschlossen':'Mon–Thu 17:00–20:00, Fri 14:00–00:00, closed at weekends','Tagesempfehlungen':'Daily recommendations','Drei automatisch ausgewählte Artikel des Tages':'Three automatically selected items of the day','Produktsuche':'Product search','Suche nach Produktname oder Artikelnummer':'Search by product name or item number','Countdown':'Countdown','Nächste Öffnung mit Tagen, Stunden, Minuten und Sekunden':'Next opening time with days, hours, minutes and seconds','Kaufen':'Buy','Direkte Weiterleitung zu den hinterlegten Produktlinks':'Direct link to the listed product pages','Originalprojekt direkt in dieser App':'Original project directly in this app','LIVE-DEMO':'LIVE DEMO','Interaktive Demo mit Zugangscode, Zeitlimit, Countdown und Einstellungsmenü.':'Interactive demo with an access code, time limit, countdown and settings menu.','Smartphone-Simulation mit Startanimation, PIN-Abfrage, zwei Seiten und App-Kacheln.':'Smartphone simulation with startup animation, PIN prompt, two screens and app tiles.','Eigene KI-Suchoberfläche mit Sprachsteuerung, Suchverlauf und Einstellungsmenü.':'Custom AI search interface with voice control, search history and settings menu.','Öffentliche Websim-Anwendung mit Chatbereich, Konto und Einstellungsbereichen.':'Public Websim application with chats, account and settings sections.','Wenn die Plattform das Einbetten verhindert oder die Demo ein eigenes Fenster benötigt, lässt sie sich direkt beim Originalanbieter öffnen.':'If the platform blocks embedding or the demo requires its own window, it can be opened directly at the original provider.','Einbettungs-Code anzeigen':'Show embed code','Die Anwendung lädt die aktuelle öffentliche Projektvorschau vom Originalanbieter. Änderungen dort erscheinen nach dem Neuladen der Demo.':'The app loads the current public project preview from the original provider. Changes published there appear after reloading the demo.','Funktionen':'Features','Eigenes ChatGPT':'Custom ChatGPT','Eine selbst gestaltete KI-Such- und Chatoberfläche mit mehreren Zusatzfunktionen.':'A custom AI search and chat interface with several extra features.','Das Projekt bietet ein Eingabefeld, Sprachsteuerung, Dateiimport für Textdateien, Vorlesefunktionen, Suchhistorie, Umbenennen, Export/Import und Druckoptionen. Die Suchfunktion leitet Anfragen je nach Text unter anderem an You.com, Lexica, Amazon Music oder YouTube weiter. Die Auswahl GPT 3.5 / GPT 4 ist im Projekt ebenfalls vorgesehen.':'The project offers an input field, voice control, text-file import, text-to-speech, search history, renaming, import/export and printing. Depending on the query, searches are forwarded to services such as You.com, Lexica, Amazon Music or YouTube. The project also includes a GPT 3.5 / GPT 4 selector.','Elterneinstellungen':'Parental settings','Ein Einstellungsprojekt mit Zugangscode, Timer und mehreren Eltern-Funktionen.':'A settings project with an access code, timer and several parental features.','Nach dem Einrichten eines vierstelligen Zugangscodes öffnet sich ein Menü mit Zeitlimit und Countdown, einer „Mein Kind finden“-E-Mail-Funktion, SK-Account-Verweisen sowie dem Zurücksetzen der Einstellungen. Der Originalcode speichert den Zugangscode im localStorage des Browserprofils. Das ist eine Demo-Sperre und keine belastbare Sicherheits- oder Kindersicherung.':'After setting a four-digit access code, a menu opens with a time limit and countdown, a “Find my child” email function, SK Account links and a reset option. The original code stores the access code in the browser profile’s localStorage. This is a demo lock, not robust security or parental control.','Smartphone UI demo':'Smartphone UI demo','Eine kleine Smartphone-Simulation mit PIN-Abfrage und einer eigenen Startoberfläche.':'A small smartphone simulation with a PIN prompt and its own home screen.','Das Projekt zeigt ein animiertes Intro, eine Smartphone-Oberfläche mit zwei Seiten, eine Uhr-/Suchseite und eine Kachelseite mit Verknüpfungen wie Amazon, Bing, TikTok, Wikipedia, Amazon Music, Netflix, Apple und Waze. Dazu kommen eine vierstellige PIN-Abfrage und ein Google-Custom-Search-Element. Die PIN wird lokal im Browser gespeichert und ist daher nicht als echte Gerätesicherung geeignet.':'The project shows an animated intro, a two-page smartphone interface, a clock/search page and a tile page with links such as Amazon, Bing, TikTok, Wikipedia, Amazon Music, Netflix, Apple and Waze. It also includes a four-digit PIN prompt and a Google Custom Search element. The PIN is stored locally in the browser and is not suitable as real device security.','AI Sprachassistent':'AI voice assistant','Voice assistant demo – ein eigener KI-Sprachassistent als Websim-Anwendung.':'Voice assistant demo – a custom AI voice assistant hosted as a Websim app.','Die öffentlich sichtbare Anwendung trägt den Namen Voice assistant demo und stellt unter anderem „Meine Chats“, „Neuer Chat“, „Konto“ sowie Bereiche für Einstellungen, Aktivierungsschlüssel, Benachrichtigungen, Adminbereich und Informationen bereit. Die eigentliche Laufzeitfunktion bleibt in der Websim-Anwendung gehostet.':'The publicly visible application is called Voice assistant demo and includes “My chats”, “New chat”, “Account”, and sections for settings, activation keys, notifications, an admin area and information. The live functionality remains hosted by Websim.','Sicherheitshinweis zum Originalprojekt:':'Security note about the original project:','Der Code fragt nach einem OpenAI-API-Schlüssel und speichert ihn im localStorage der CodePen-Vorschau. Ein API-Schlüssel im Browser kann durch Skripte oder Zugriff auf das Browserprofil offengelegt und auf Kosten des Kontoinhabers verwendet werden. Gib dort nur dann einen Schlüssel ein, wenn du dieses Risiko verstehst; verwende niemals einen Organisations- oder produktiven Hauptschlüssel.':'The code asks for an OpenAI API key and stores it in the CodePen preview’s localStorage. A browser-stored API key can be exposed by scripts or through access to the browser profile and used at the account owner’s expense. Only enter a key if you understand this risk; never use an organisation-wide or production master key.','Sicherheitshinweis:':'Security note:','Die verwendeten PINs/Zugangscodes werden unverschlüsselt im localStorage gespeichert. Sie dienen nur als Demo und schützen weder das Gerät noch echte Kindersicherungsfunktionen.':'The PINs/access codes are stored unencrypted in localStorage. They are only for demonstration and do not protect the device or provide real parental-control functions.','CodePen-Projekt öffnen':'Open CodePen project','Voice assistant demo öffnen':'Open Voice assistant demo','Projektübersicht':'Project overview','Originalprojekt':'Original project','Zur Projektübersicht':'Back to project overview','57 Browserige Artikel entdecken.':'Ontdek 57 slijmerige artikelen.','Der vollständige Demo Shop läuft direkt in diesem App-Fenster – mit Öffnungszeiten, Live-Countdown, Tagesempfehlungen, Suche und dem kompletten Produktkatalog.':'De volledige Slakkenwinkel draait direct in dit appvenster, met openingstijden, live-aftelling, dagelijkse aanbevelingen, zoeken en de volledige catalogus.','Der Shop verwendet die bereitgestellte HTML-Anwendung. Produktvorschauen und Kaufziele werden über die von dir hinterlegten YOUR_PRINT_ON_DEMAND_PROVIDER-Kurzlinks geladen.':'De winkel gebruikt de aangeleverde HTML-app. Productvoorbeelden en aankooplinks worden geladen via de opgegeven YOUR_PRINT_ON_DEMAND_PROVIDER-kortlinks.','Demo Shop · Original-HTML':'Slakkenwinkel · originele HTML','57 Artikel · responsive Ansicht':'57 artikelen · responsieve weergave','Shop separat öffnen':'Winkel apart openen','Shop-Quellcode und Funktionen':'Winkelcode en functies','Der vollständige vom Besucher bereitgestellte Shop-Code liegt als eigenständige Datei':'De volledige aangeleverde winkelcode staat in een apart bestand','im Projektordner. So bleiben Styles, Produktdaten, JavaScript, Suchfilter, Öffnungszeiten und Produkt-IFrames getrennt von der OS-Oberfläche und können eigenständig gewartet werden.':'in de projectmap. Zo blijven stijlen, productgegevens, JavaScript, zoekfilters, openingstijden en product-iframes gescheiden van de OS-interface en afzonderlijk te onderhouden.','Shop-HTML öffnen':'Winkel-HTML openen','Im Shop enthalten':'In de winkel opgenomen','57 Artikel':'57 artikelen','Vollständiger Produktkatalog mit SKU und Produktlink':'Volledige productcatalogus met SKU en productlink','Öffnungszeiten':'Openingstijden','Mo–Do 17–20 Uhr, Fr 14–24 Uhr, Wochenende geschlossen':'Ma–do 17:00–20:00, vr 14:00–00:00, weekend gesloten','Tagesempfehlungen':'Dagelijkse aanbevelingen','Drei automatisch ausgewählte Artikel des Tages':'Drie automatisch gekozen artikelen van de dag','Produktsuche':'Product zoeken','Suche nach Produktname oder Artikelnummer':'Zoeken op productnaam of artikelnummer','Countdown':'Aftelling','Nächste Öffnung mit Tagen, Stunden, Minuten und Sekunden':'Volgende opening met dagen, uren, minuten en seconden','Kaufen':'Kopen','Direkte Weiterleitung zu den hinterlegten Produktlinks':'Directe link naar de opgegeven productpagina’s','Originalprojekt direkt in dieser App':'Origineel project direct in deze app','LIVE-DEMO':'LIVE-DEMO','Interaktive Demo mit Zugangscode, Zeitlimit, Countdown und Einstellungsmenü.':'Interactieve demo met toegangscode, tijdslimiet, aftelling en instellingenmenu.','Smartphone-Simulation mit Startanimation, PIN-Abfrage, zwei Seiten und App-Kacheln.':'Smartphonesimulatie met startanimatie, pincode, twee schermen en apptegels.','Eigene KI-Suchoberfläche mit Sprachsteuerung, Suchverlauf und Einstellungsmenü.':'Eigen AI-zoekscherm met spraakbediening, zoekgeschiedenis en instellingenmenu.','Öffentliche Websim-Anwendung mit Chatbereich, Konto und Einstellungsbereichen.':'Openbare Websim-app met chats, account en instellingen.','Wenn die Plattform das Einbetten verhindert oder die Demo ein eigenes Fenster benötigt, lässt sie sich direkt beim Originalanbieter öffnen.':'Als het platform insluiten blokkeert of de demo een eigen venster nodig heeft, kan deze rechtstreeks bij de oorspronkelijke aanbieder worden geopend.','Einbettungs-Code anzeigen':'Insluitcode tonen','Die Anwendung lädt die aktuelle öffentliche Projektvorschau vom Originalanbieter. Änderungen dort erscheinen nach dem Neuladen der Demo.':'De app laadt de actuele openbare projectpreview van de oorspronkelijke aanbieder. Wijzigingen verschijnen na het opnieuw laden van de demo.','Funktionen':'Functies','Eigenes ChatGPT':'Eigen ChatGPT','Eine selbst gestaltete KI-Such- und Chatoberfläche mit mehreren Zusatzfunktionen.':'Een zelf ontworpen AI-zoek- en chatinterface met extra functies.','Das Projekt bietet ein Eingabefeld, Sprachsteuerung, Dateiimport für Textdateien, Vorlesefunktionen, Suchhistorie, Umbenennen, Export/Import und Druckoptionen. Die Suchfunktion leitet Anfragen je nach Text unter anderem an You.com, Lexica, Amazon Music oder YouTube weiter. Die Auswahl GPT 3.5 / GPT 4 ist im Projekt ebenfalls vorgesehen.':'Het project biedt een invoerveld, spraakbediening, import van tekstbestanden, voorlezen, zoekgeschiedenis, hernoemen, import/export en afdrukopties. Afhankelijk van de invoer stuurt de zoekfunctie opdrachten onder meer naar You.com, Lexica, Amazon Music of YouTube. Er is ook een keuze voor GPT 3.5 / GPT 4.','Elterneinstellungen':'Ouderinstellingen','Ein Einstellungsprojekt mit Zugangscode, Timer und mehreren Eltern-Funktionen.':'Een instellingenproject met toegangscode, timer en verschillende ouderfuncties.','Nach dem Einrichten eines vierstelligen Zugangscodes öffnet sich ein Menü mit Zeitlimit und Countdown, einer „Mein Kind finden“-E-Mail-Funktion, SK-Account-Verweisen sowie dem Zurücksetzen der Einstellungen. Der Originalcode speichert den Zugangscode im localStorage des Browserprofils. Das ist eine Demo-Sperre und keine belastbare Sicherheits- oder Kindersicherung.':'Na het instellen van een viercijferige toegangscode verschijnt een menu met tijdslimiet en aftelling, een e-mailfunctie “Mijn kind vinden”, SK-accountlinks en het resetten van instellingen. De originele code bewaart de toegangscode in localStorage van de browser. Dit is een demoslot en geen betrouwbare beveiliging of ouderlijk toezicht.','Smartphone UI demo':'Smartphone UI demo','Eine kleine Smartphone-Simulation mit PIN-Abfrage und einer eigenen Startoberfläche.':'Een kleine smartphonesimulatie met pincode en een eigen startscherm.','Das Projekt zeigt ein animiertes Intro, eine Smartphone-Oberfläche mit zwei Seiten, eine Uhr-/Suchseite und eine Kachelseite mit Verknüpfungen wie Amazon, Bing, TikTok, Wikipedia, Amazon Music, Netflix, Apple und Waze. Dazu kommen eine vierstellige PIN-Abfrage und ein Google-Custom-Search-Element. Die PIN wird lokal im Browser gespeichert und ist daher nicht als echte Gerätesicherung geeignet.':'Het project toont een geanimeerde intro, een smartphone-interface met twee pagina’s, een klok-/zoekpagina en een tegelpagina met links naar onder meer Amazon, Bing, TikTok, Wikipedia, Amazon Music, Netflix, Apple en Waze. Er is ook een viercijferige pincode en Google Custom Search. De pincode wordt lokaal in de browser opgeslagen en is geen echte apparaatbeveiliging.','AI Sprachassistent':'AI-spraakassistent','Voice assistant demo – ein eigener KI-Sprachassistent als Websim-Anwendung.':'Voice assistant demo – een eigen AI-spraakassistent als Websim-app.','Die öffentlich sichtbare Anwendung trägt den Namen Voice assistant demo und stellt unter anderem „Meine Chats“, „Neuer Chat“, „Konto“ sowie Bereiche für Einstellungen, Aktivierungsschlüssel, Benachrichtigungen, Adminbereich und Informationen bereit. Die eigentliche Laufzeitfunktion bleibt in der Websim-Anwendung gehostet.':'De openbaar zichtbare app heet Voice assistant demo en bevat onder meer “Mijn chats”, “Nieuwe chat”, “Account” en onderdelen voor instellingen, activatiesleutels, meldingen, beheerdersgedeelte en informatie. De werkende app blijft gehost op Websim.','Sicherheitshinweis zum Originalprojekt:':'Beveiligingsmelding over het originele project:','Der Code fragt nach einem OpenAI-API-Schlüssel und speichert ihn im localStorage der CodePen-Vorschau. Ein API-Schlüssel im Browser kann durch Skripte oder Zugriff auf das Browserprofil offengelegt und auf Kosten des Kontoinhabers verwendet werden. Gib dort nur dann einen Schlüssel ein, wenn du dieses Risiko verstehst; verwende niemals einen Organisations- oder produktiven Hauptschlüssel.':'De code vraagt om een OpenAI-API-sleutel en bewaart deze in localStorage van de CodePen-preview. Een API-sleutel in de browser kan door scripts of toegang tot het browserprofiel worden buitgemaakt en op kosten van de accounteigenaar worden gebruikt. Voer alleen een sleutel in als je dit risico begrijpt; gebruik nooit een organisatiebrede of productie-hoofdsleutel.','Sicherheitshinweis:':'Beveiligingsmelding:','Die verwendeten PINs/Zugangscodes werden unverschlüsselt im localStorage gespeichert. Sie dienen nur als Demo und schützen weder das Gerät noch echte Kindersicherungsfunktionen.':'De gebruikte pincodes/toegangscodes worden onversleuteld opgeslagen in localStorage. Ze zijn alleen bedoeld voor demonstratie en beveiligen het apparaat of echte ouderfuncties niet.','CodePen-Projekt öffnen':'CodePen-project openen','Voice assistant demo öffnen':'Voice assistant demo openen','Projektübersicht':'Projectoverzicht','Originalprojekt':'Origineel project','Zur Projektübersicht':'Terug naar projectoverzicht','Die vollständigen your website provider-HTML-Elemente sind im öffentlichen Seitenabruf nicht als Editor-Quellcode verfügbar.':'The complete your website provider HTML elements are not exposed as editor source code in the public page view.'
    },
    nl:{
      'DIE DIGITALE WELT VON Demo Creator':'DE DEMO DIGITALE WERELD','Willkommen auf meiner offiziellen Demo-Website!':'Welkom op de demo-website!','Projekte, Technik, Social Media und Demo environment – alles an einem Ort.':'Projecten, technologie, sociale media en de digitale wereld – alles op één plek.','Hallo!':'Hallo!','Schön, dass du da bist.':'Fijn dat je er bent.','Apps und Inhalte suchen':'Apps en inhoud zoeken','↓ Vom oberen Rand nach unten wischen – Kontrollzentrum öffnen':'Veeg vanaf de bovenrand omlaag om het bedieningspaneel te openen','ENTDECKE DIE DIGITALE WELT':'ONTDEK DE DIGITALE WERELD','Projekte & Creator-Welt':'Projecten & creatorwereld','Schön, dass du hier bist.':'Fijn dat je hier bent.','Entdecke die Apps':'Ontdek de apps','Alle anzeigen':'Alles bekijken','Im Spotlight':'Uitgelicht','Einblick in das Cloud-Projekt':'Bekijk het cloudproject','System starten':'Systeem starten','Intro überspringen':'Intro overslaan','Kontrollzentrum':'Bedieningspaneel','WLAN':'Wifi','Verbunden':'Verbonden','Bluetooth':'Bluetooth','Ruhemodus':'Niet storen','Töne':'Geluid','Mobile Daten':'Mobiele gegevens','Autom. Drehen':'Automatisch draaien','Taschenlampe':'Zaklamp','Displayhelligkeit':'Schermhelderheid','Glas-Effekt':'Glaseffect','Medienlautstärke':'Mediavolume','Hintergrund':'Achtergrond','Wähle deinen Look':'Kies je stijl','Dunkle Darstellung':'Donkere weergave','Helle Darstellung':'Lichte weergave','Darstellung wechseln':'Weergave wisselen','Bewegung reduzieren':'Beweging verminderen','Bildschirm sperren':'Scherm vergrendelen','Zum Entsperren antippen':'Tik om te ontgrendelen','Was suchst du?':'Waar ben je naar op zoek?','Keine passende App gefunden. Probiere einen anderen Suchbegriff.':'Geen passende app gevonden. Probeer een andere zoekterm.','Hintergrund geändert':'Achtergrond gewijzigd','Einstellungen zurückgesetzt':'Instellingen teruggezet','Schließen':'Sluiten','Extern öffnen':'Extern openen','Original-Shop in dieser App laden':'Originele winkel in deze app laden','Original-Projektübersicht in dieser App laden':'Origineel projectenoverzicht in deze app laden','Originalseite erneut laden':'Originele pagina opnieuw laden','Die externe Seite wird erst nach Auswahl geladen.':'De externe pagina wordt pas geladen nadat je deze hebt geselecteerd.','Die Einbettung kann durch your website provider oder den jeweiligen Anbieter blockiert werden.':'Insluiten kan door your website provider of de betreffende aanbieder worden geblokkeerd.','Über den Creator':'OVER DE CREATOR','A demo creator profile. Add your own introduction and interests.':'Een demo-creator met een passie voor technologie, programmeren en digitale ideeën.','Meine größte Leidenschaft ist das Programmieren sowie die Entwicklung von Webseiten und eigenen digitalen Projekten.':'Mijn grootste passie is programmeren en het ontwikkelen van websites en eigen digitale projecten.','Ich liebe es, neue Ideen auszuprobieren und diese in funktionierende Anwendungen umzusetzen.':'Ik vind het geweldig om nieuwe ideeën uit te proberen en om te zetten in werkende toepassingen.','In meiner Freizeit arbeite ich an verschiedenen eigenen Projekten, darunter Apps, Webseiten und eigene Systeme wie mein IPTV-Setup oder sogar eine eigene KI.':'In mijn vrije tijd werk ik aan eigen projecten, waaronder apps, websites en systemen zoals mijn IPTV-opstelling en zelfs mijn eigen AI.','Neben meinen Projekten bin ich auch als Content Creator aktiv und teile regelmäßig Einblicke in meine Arbeit und mein Leben auf Social Media.':'Naast mijn projecten ben ik actief als contentcreator en deel ik regelmatig een kijkje in mijn werk en leven op sociale media.','Zusätzlich habe ich ein eigenes Google-Unternehmensprofil für mein Projekt „Demo Creator Studio“, über das ich Updates, Beiträge und Informationen veröffentliche.':'Ik heb ook een Google-bedrijfsprofiel voor mijn project “Demo Creator Studio”, waar ik updates, berichten en informatie plaats.','Ich freue mich immer über Nachrichten, Feedback oder einfach nette Gespräche.':'Berichten, feedback of een gezellig gesprek zijn altijd welkom.','Vielen Dank für deine Unterstützung und viel Spaß beim Erkunden meiner Seite!':'Bedankt voor je steun en veel plezier met het ontdekken van de website!','Auf einen Blick':'In één oogopslag','Themen':'Onderwerpen','Folge der Browserspur.':'Volg het slijmspoor.','Öffentliche Kanäle, Beiträge und Einblicke aus der digitalen Welt von Demo Creator.':'Openbare kanalen, berichten en inkijkjes in de digitale wereld van Demo Creator.','Beiträge aus der öffentlichen Website-Galerie':'Berichten uit de openbare websitegalerij','Weitere Verweise aus den Beiträgen':'Meer links uit de berichten','Die Original-Feeds':'Originele feeds','Ideen werden digital.':'Ideeën worden digitaal.','Auf der offiziellen Projektseite werden fünf Projekte namentlich aufgeführt. Jedes erhält hier einen eigenen App-Bereich.':'Op de officiële projectpagina staan vijf projecten bij naam vermeld. Elk project heeft hier een eigen appgedeelte.','Weitere digitale Themen':'Meer digitale onderwerpen','Schlagwörter':'Trefwoorden','PROJEKTDETAIL':'PROJECTDETAILS','MARKE & AUFTRITT':'MERK & PRESENTATIE','Leistungen und Tätigkeitsbereiche':'Diensten en activiteiten','Google-Unternehmensprofil':'Google-bedrijfsprofiel','Feedback':'Feedback','Demo-Website':'Demo-Website','Alle Bereiche an einem Ort.':'Alle onderdelen op één plek.','Die öffentliche Demo-Website wurde in eigenständige Apps aufgeteilt. Wähle eine Unterseite, um ihre Inhalte direkt hier zu lesen.':'De openbare fansite is verdeeld in afzonderlijke apps. Kies een pagina om de inhoud hier te lezen.','Unterseiten als Apps':'Subpagina’s als apps','Auf der Website beschriebene Funktionen':'Functies die op de website worden beschreven','STARTSEITE':'STARTPAGINA','Direkt zu den Inhalten':'Direct naar de inhoud','Originalseite als eingebettete Ansicht':'Originele pagina als ingesloten weergave','Kontakt und Feedback':'Contact en feedback','Rechtliches':'Juridische informatie','Demo Shop':'SLAKKENWINKEL','Merch mit Demon-Vibe.':'Merch met een slakkenvibe.','So ist der Shop beschrieben':'Zo wordt de winkel beschreven','Designs':'Ontwerpen','Print-on-Demand':'Print-on-demand','Versand':'Verzending','Bestellung':'Bestelling','Über diese Website':'Over deze website','Mehr als eine Fan-Seite.':'Meer dan een fansite.','Funktionen laut Website und Projektangaben':'Functies volgens de website en projectinformatie','Mitglieder-Chat':'Ledenchats','Profile':'Profielen','Gruppen':'Groepen','Demo AI':'Demo Creator’s AI','Shop-Einbindung':'Winkelingebruik','Google-Bewertung':'Google-beoordeling','Unsere App':'Onze app','Demo Creator’s Demo-App.':'Demo Creator’s Demo-App.','Datenschutz und Sicherheit':'Privacy en beveiliging','Installationsanleitung':'Installatiehandleiding','Kontaktmöglichkeiten':'Contactmogelijkheden','Kontakt per E-Mail':'Contact via e-mail','Schriftliche Nachricht senden':'Schriftelijk bericht sturen','Nachricht senden':'Bericht sturen','E-Mail-Programm öffnen':'E-mailprogramma openen','Google-Bewertung schreiben':'Schrijf een Google-beoordeling','Originaltext der öffentlichen Demo-Website':'Originele tekst van de openbare fansite','Alle Abschnitte öffnen':'Alle onderdelen openen','Aktuellen Originaltext auf your website provider prüfen':'Controleer de actuele originele tekst op your website provider','Einstellungen':'Instellingen','Oberfläche anpassen':'WEERGAVE AANPASSEN','Passe das Erscheinungsbild dieser Besucher-App an. Die Änderungen werden lokal in diesem Browser gespeichert.':'Pas het uiterlijk van deze bezoekersapp aan. Wijzigingen worden lokaal in deze browser opgeslagen.','Sprache':'Taal','Sprache ändern':'Taal wijzigen','Deutsch':'Duits','English':'Engels','Nederlands':'Nederlands','Diese Übersetzung dient nur als Lesehilfe. Die deutsche Originalfassung ist maßgeblich.':'Deze vertaling is alleen bedoeld als leeshulp. De Duitse originele tekst is leidend.','Die vollständigen your website provider-HTML-Elemente sind im öffentlichen Seitenabruf nicht als Editor-Quellcode verfügbar.':'De volledige your website provider-HTML-elementen zijn in de openbare paginaweergave niet beschikbaar als editorbroncode.'
    }
  };


  const currentLanguage = () => (state.language && LANGUAGES[state.language]) ? state.language : 'de';
  const localize = text => {
    const lang=currentLanguage(); if(lang==='de')return text;
    const dict=TEXT[lang]||{}; let out=String(text);
    Object.keys(dict).sort((a,b)=>b.length-a.length).forEach(key=>{out=out.split(key).join(dict[key]);});
    return out;
  };
  const localizedAppName = id => APP_LABELS[currentLanguage()]?.[id] || APPS.find(a=>a.id===id)?.name || id;
  const localizedAppHint = app => HINT_LABELS[currentLanguage()]?.[app.id] || app.hint;
  function renderHomeAppGrid(){const grid=$('#homeAppGrid');if(!grid)return;grid.innerHTML=HOME_APP_IDS.map(id=>APPS.find(a=>a.id===id)).filter(Boolean).map(a=>`<button class="app-icon" data-app="${a.id}" type="button" aria-label="${localizedAppName(a.id)} open"><span class="icon-tile">${a.icon}</span><small>${localizedAppName(a.id)}</small></button>`).join('');window.dispatchEvent(new Event('ssos-home-grid-rendered'));}

  function applyShellLanguage(){
    const lang=currentLanguage(); document.documentElement.lang=LANGUAGES[lang].html; document.body.dataset.language=lang;
    const copy={
      de:{eyebrow:'WILLKOMMEN IN DER DIGITALEN WELT',title:'Welche Sprache sprichst du?',copy:'Wähle eine Sprache für dein Besuchererlebnis.',foot:'Du kannst die Sprache später in den Einstellungen ändern.',continue:'Weiter',intro:'DIE DIGITALE WELT VON Demo Creator',introCopy:'Projekte, Technik, Social Media und Demo environment – alles an einem Ort.',start:'System starten',skip:'Intro überspringen',home:'Hallo! <span>Schön, dass du da bist.</span>',search:'Apps und Inhalte suchen',hint:'↓ Vom oberen Rand nach unten wischen – Kontrollzentrum öffnen',control:'Kontrollzentrum',all:'Alle anzeigen',discover:'Entdecke die Apps'},
      en:{eyebrow:'WELCOME TO THE DIGITAL WORLD',title:'Which language do you speak?',copy:'Choose a language for your visitor experience.',foot:'You can change the language later in Settings.',continue:'Continue',intro:'THE DIGITAL WORLD OF Demo Creator',introCopy:'Projects, technology, social media and the digital world – all in one place.',start:'Start system',skip:'Skip intro',home:'Hello! <span>Glad you are here.</span>',search:'Search apps and content',hint:'↓ Swipe down from the top edge to open Quick Settings',control:'Quick Settings',all:'View all',discover:'Explore the apps'},
      nl:{eyebrow:'WELKOM IN DE DIGITALE WERELD',title:'Welke taal spreek je?',copy:'Kies een taal voor je bezoekerservaring.',foot:'Je kunt de taal later wijzigen in Instellingen.',continue:'Doorgaan',intro:'DE DIGITALE WERELD VAN Demo Creator',introCopy:'Projecten, technologie, sociale media en de digitale wereld – alles op één plek.',start:'Systeem starten',skip:'Intro overslaan',home:'Hallo! <span>Fijn dat je er bent.</span>',search:'Apps en inhoud zoeken',hint:'↓ Veeg vanaf de bovenrand omlaag om Snelle instellingen te openen',control:'Bedieningspaneel',all:'Alles bekijken',discover:'Ontdek de apps'}
    }[lang];
    $('#languageEyebrow').textContent=copy.eyebrow;$('#languageTitle').textContent=copy.title;$('#languageCopy').textContent=copy.copy;$('#languageFootnote').textContent=copy.foot;$('#confirmLanguage').innerHTML=copy.continue+' <span>↗</span>';
    $('#introScreen .eyebrow').textContent=copy.intro;$('#introScreen .intro-copy').textContent=copy.introCopy;$('#enterOS').innerHTML=copy.start+' <span>↗</span>';$('#skipIntro').textContent=copy.skip;
    $('#homeScreen .home-topline h2').innerHTML=copy.home;$('#openSearch span:nth-child(2)').textContent=copy.search;$('.gesture-hint').textContent=copy.hint;$('#controlPanel .panel-heading h2').textContent=copy.control;$('#showAllApps').innerHTML=copy.all+' <span>→</span>';$('.section-heading span').textContent=copy.discover;
    $('#searchInput').placeholder=lang==='de'?'Was suchst du?':lang==='en'?'What are you looking for?':'Waar ben je naar op zoek?';
    const cp=$('#controlPanel'); const labels=lang==='de'?['WLAN','Bluetooth','Ruhemodus','Töne','Mobile Daten','Autom. Drehen','Taschenlampe']:lang==='en'?['Wi-Fi','Bluetooth','Do not disturb','Sounds','Mobile data','Auto-rotate','Flashlight']:['Wifi','Bluetooth','Niet storen','Geluid','Mobiele gegevens','Automatisch draaien','Zaklamp'];
    $$('[data-toggle]',cp).forEach((b,i)=>{const label=$('b',b);if(label)label.textContent=labels[i]||label.textContent;});
    const controlLabels=lang==='de'?['Displayhelligkeit','Glas-Effekt','Medienlautstärke','Hintergrund','Wähle deinen Look']:lang==='en'?['Screen brightness','Glass effect','Media volume','Wallpaper','Choose your look']:['Schermhelderheid','Glaseffect','Mediavolume','Achtergrond','Kies je stijl'];
    $$('.slider-card b').forEach((el,i)=>{if(controlLabels[i])el.textContent=controlLabels[i];});$('.wallpaper-title b').textContent=controlLabels[3];$('.wallpaper-title small').textContent=controlLabels[4];

    const desktop={
      de:{explore:'ENTDECKEN',quick:'SCHNELLZUGRIFF',home:'Startseite',about:'Über mich',projects:'Projekte',social:'Social Media',shop:'Demo Shop',store:'Browser Store',studio:'Creator Studio',website:'Demo-Website',images:'Bilder',legal:'Rechtliches',contact:'Kontakt',settings:'Einstellungen',digital:'Digitale Welt',profile:'Creator-Profil',view:'Profil ansehen',featured:'PROJEKT IM SPOTLIGHT',exploreProject:'Entdecken',connect:'KONTAKT'},
      en:{explore:'EXPLORE',quick:'QUICK ACCESS',home:'Home',about:'About',projects:'Projects',social:'Social media',shop:'Demo shop',store:'Browser Store',studio:'Creator Studio',website:'Demo website',images:'Images',legal:'Legal',contact:'Contact',settings:'Settings',digital:'Digital world',profile:'Creator profile',view:'View profile',featured:'FEATURED PROJECT',exploreProject:'Explore',connect:'CONNECT'},
      nl:{explore:'ONTDEKKEN',quick:'SNELLE TOEGANG',home:'Startpagina',about:'Over mij',projects:'Projecten',social:'Sociale media',shop:'Demo-winkel',store:'Browser Store',studio:'Creator Studio',website:'Demo-Website',images:'Afbeeldingen',legal:'Juridisch',contact:'Contact',settings:'Instellingen',digital:'Digitale wereld',profile:'Creatorprofiel',view:'Bekijk profiel',featured:'UITGELICHT PROJECT',exploreProject:'Ontdekken',connect:'CONTACT'}
    }[lang];
    const side=$('.desktop-sidebar'); if(side){const labels=$$('.desktop-sidebar-label',side);if(labels[0])labels[0].textContent=desktop.explore;if(labels[1])labels[1].textContent=desktop.quick;const btns=$$('button span',side);[desktop.home,desktop.about,desktop.projects,desktop.social,desktop.shop,desktop.store,desktop.studio,desktop.website,desktop.images,desktop.legal,desktop.contact,desktop.settings].forEach((v,i)=>{if(btns[i])btns[i].textContent=v;});}
    const info=$$('.desktop-info-card');if(info.length){const profile=info[0];const eyebrow=$('.eyebrow',profile);if(eyebrow)eyebrow.textContent=desktop.profile.toUpperCase();const btn=$('button',profile);if(btn)btn.textContent=desktop.view+' ↗';const second=info[1];if(second){const e=$('.eyebrow',second);if(e)e.textContent=desktop.featured;const b=$('button',second);if(b)b.textContent=desktop.exploreProject+' ↗';}const third=info[2];if(third){const e=$('.eyebrow',third);if(e)e.textContent=desktop.connect;const b=$('button',third);if(b)b.textContent='✉️ '+desktop.contact+' the Creator Studio ↗';}}
    const topDate=$('#introScreen .intro-footer span:first-child');if(topDate)topDate.textContent=detectedDevice==='desktop'?'GALAXY BOOK6 PRO':detectedDevice==='tablet'?'GALAXY TAB S12 ULTRA':'GALAXY S24 EDITION';
    const foot=$('.control-footnote');if(foot)foot.textContent=lang==='de'?'Die Schnellschalter und Regler bilden die One-UI-Optik nach. Eine Browser-Webapp kann die echten Funk-, Taschenlampen- oder Medienlautstärke-Funktionen des Galaxy S24 nicht systemweit steuern.':lang==='en'?'The quick toggles and sliders reproduce the One UI look. A browser app cannot control the Galaxy device’s actual radios, flashlight or system media volume.':'De snelle schakelaars en schuifregelaars bootsen de One UI-stijl na. Een browserapp kan de echte radiofuncties, zaklamp of systeemmediavolume van het Galaxy-apparaat niet bedienen.';
    const actions=$$('.panel-actions button');const actionLabels=lang==='de'?['Darstellung wechseln','Bewegung reduzieren','Bildschirm sperren']:lang==='en'?['Switch appearance','Reduce motion','Lock screen']:['Weergave wisselen','Beweging verminderen','Scherm vergrendelen'];actions.forEach((b,i)=>{const span=$('span',b);if(span&&actionLabels[i])span.textContent=actionLabels[i];});
    const lockCaption=$('#lockScreen .lock-bottom p');if(lockCaption)lockCaption.textContent=lang==='de'?'Zum Entsperren antippen':lang==='en'?'Tap to unlock':'Tik om te ontgrendelen';
    const footBrand=$('#introScreen .intro-footer span:last-child');if(footBrand)footBrand.textContent='BUILT WITH 💠';
    const homeHero=$('#heroStudio .hero-bottom span:first-child');if(homeHero)homeHero.textContent=lang==='de'?'Schön, dass du hier bist.':lang==='en'?'Glad you are here.':'Fijn dat je hier bent.';
    const heroTag=$('#heroStudio .hero-tag');if(heroTag)heroTag.textContent=lang==='de'?'ENTDECKE DIE DIGITALE WELT':lang==='en'?'EXPLORE THE DIGITAL WORLD':'ONTDEK DE DIGITALE WERELD';
    const heroTitle=$('#heroStudio .hero-title b');if(heroTitle)heroTitle.textContent=lang==='de'?'Projekte & Creator-Welt':lang==='en'?'Projects & Creator world':'Projecten & creatorwereld';
    $('#deviceDetectedLabel').textContent=deviceLabel(detectedDevice);$('#deviceDetectedHint').textContent=deviceHint(detectedDevice);
    renderDevicePreviewButtons();
    renderHomeAppGrid();
  }

  let selectedLanguage=state.language||'de';
  function chooseLanguage(lang){
    if(!LANGUAGES[lang])return;
    selectedLanguage=lang;
    $$('[data-language-choice]').forEach(b=>b.classList.toggle('selected',b.dataset.languageChoice===lang));
    const prompt={
      de:{eyebrow:'WILLKOMMEN IN DER DIGITALEN WELT',title:'Welche Sprache sprichst du?',copy:'Wähle eine Sprache für dein Besuchererlebnis.',foot:'Du kannst die Sprache später in den Einstellungen ändern.',next:'Weiter'},
      en:{eyebrow:'WELCOME TO THE DIGITAL WORLD',title:'Which language do you speak?',copy:'Choose a language for your visitor experience.',foot:'You can change the language later in Settings.',next:'Continue'},
      nl:{eyebrow:'WELKOM IN DE DIGITALE WERELD',title:'Welke taal spreek je?',copy:'Kies een taal voor je bezoekerservaring.',foot:'Je kunt de taal later wijzigen in Instellingen.',next:'Doorgaan'}
    }[lang];
    $('#languageEyebrow').textContent=prompt.eyebrow;
    $('#languageTitle').textContent=prompt.title;
    $('#languageCopy').textContent=prompt.copy;
    $('#languageFootnote').textContent=prompt.foot;
    $('#confirmLanguage').innerHTML=prompt.next+' <span>↗</span>';
  }
  function confirmLanguage(){state.language=selectedLanguage;persist('language',selectedLanguage);applyShellLanguage();els.language.classList.add('hidden');els.intro.classList.remove('hidden');}
  const section = title => `<h3 class="content-heading">${title}</h3>`;
  const appHero = (eyebrow,title,copy,emoji='💠') => `<div class="app-hero"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${copy}</p><span class="large-emoji">${emoji}</span></div>`;
  const infoCard = (icon,title,desc) => `<article class="info-card"><span>${icon}</span><b>${title}</b><small>${desc}</small></article>`;
  const projectCard = (icon,title,desc,status='PROJEKT') => `<article class="project-card"><div class="project-icon">${icon}</div><div><b>${title}</b><p>${desc}</p><span class="status">${status}</span></div></article>`;
  const linkCard = (icon,title,desc,url) => `<a class="link-card" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><span class="link-icon">${icon}</span><span class="link-text"><b>${title}</b><small>${desc}</small></span><span class="chevron">↗</span></a>`;
  const external = (url,label,secondary=false) => `<a class="app-button${secondary?' secondary':''}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} <span>↗</span></a>`;
  const internalAppButton = (id,label) => `<button class="app-button secondary" type="button" data-app="${id}">${label} <span>→</span></button>`;

  const iframeSnippet = (title,url) => `<iframe title="${title}" src="${url}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>`;
  function embedPanel(kind,title,url,description){
    const snippet=iframeSnippet(title,url);
    return `<div class="embed-shell" id="${kind}Embed"><div class="embed-placeholder"><span>🧩</span><b>${title} – ${description}</b><small>Die Originalseite wird nach Auswahl direkt in diesem App-Fenster geladen. Falls your website provider das Einbetten blockiert, bleibt der externe Aufruf verfügbar.</small><button class="app-button" type="button" data-load-frame="${kind}">Originaleinbettung laden</button></div></div><details class="embed-code-details"><summary>Verwendeten HTML-IFrame-Code anzeigen</summary><pre><code>${esc(snippet)}</code></pre><button class="app-button secondary" type="button" data-copy-code="${esc(snippet)}">HTML-Code kopieren</button><p class="embed-provenance">Dies ist der IFrame-Wrapper dieser Webapp, nicht der interne your website provider-Editor-Code. your website provider stellt den ursprünglichen HTML-Embed-Quelltext über die öffentliche Seitenansicht nicht bereit.</p></details>`;
  }
  const pill = text => `<span class="pill">${text}</span>`;
  const projectOpen = (id,icon,title,desc) => `<button class="project-open" type="button" data-app="${id}"><span class="project-icon">${icon}</span><span><b>${title}</b><small>${desc}</small></span><strong>↗</strong></button>`;
  const feedCard = (title,copy,tags='') => `<article class="feed-card"><div class="feed-top"><span class="feed-avatar">💠</span><span><b>Demo Creator</b><small>Öffentlicher Social-Media-Beitrag</small></span></div><h4>${title}</h4><p>${copy}</p>${tags?`<small class="feed-tags">${tags}</small>`:''}</article>`;

  const DEMO_WEBSITE_FOOTER = `<div class="notice">© 2026 Demo project. Alle Rechte vorbehalten. Die zugehörigen AGB, Datenschutzinformationen und das Impressum sind auch auf der Original-Webseite abrufbar.</div>`;

  function renderHome(){
    const featured = HOME_APP_IDS;
    return `${appHero('WILLKOMMEN IN DER DIGITALEN WELT','Demo Creator.','Schön, dass du hier bist! Entdecke Projekte, Technik, Social Media und die kleine Demo environment – alles übersichtlich in einer interaktiven Smartphone-Oberfläche.','💠')}
      <div class="visitor-welcome"><b>Eine Idee. Viele Möglichkeiten. Eine digitale Welt.</b><p>Stöbere durch die Apps, entdecke aktuelle Inhalte und finde die passenden Kontakt- und Projektbereiche.</p></div>
      ${section('Entdecke die Bereiche')}<div class="website-pages">${featured.map(id=>{const a=APPS.find(x=>x.id===id);return `<button type="button" data-app="${id}"><span>${a.icon}</span><b>${localizedAppName(a.id)}</b><small>${localizedAppHint(a)}</small></button>`;}).join('')}</div>
      ${section('Im Spotlight')}<div class="project-list">${projectOpen('projects','🧩','Projektwelt','Alle Projekte und Technikbereiche an einem Ort')}${projectOpen('images','🖼️','Bildergalerie','Öffentliche Bilder der Demo-Website entdecken')}${projectOpen('social','📸','Social-Media-Feed','Öffentliche Beiträge entdecken')}</div>
      ${section('Kontakt')}<div class="project-list">${internalAppButton('contact','Alle Kontaktwege und Möglichkeiten ansehen')}</div>${DEMO_WEBSITE_FOOTER}`;
  }

  function renderAbout(){return `${appHero('ABOUT THE CREATOR','Demo Creator.','A sample profile area for your own introduction, interests and projects.','👤')}
    <p class="body-copy"><b>Welcome to the demo profile.</b></p>
    <p class="body-copy">Replace this text with your own biography, interests, location (optional) and background. Keep private information out of public profile pages unless you intend to publish it.</p>
    <p class="body-copy">Use this section to describe your work, creative interests, technology projects and the tools you enjoy using.</p>
    <p class="body-copy">Add your public social links in the configuration section and remove any channels you do not use.</p>
    ${section('Profile details')}<div class="info-grid">${infoCard('📍','YOUR_CITY','Optional location')}${infoCard('🎂','YOUR_AGE','Optional age or profile detail')}${infoCard('💻','Technology','Websites, apps and digital systems')}${infoCard('🤖','AI & tools','Experiments, learning and development')}${infoCard('🎥','Creator channels','Add your public channels')}${infoCard('🖼️','Demo gallery','Replace the sample images')}</div>
    ${section('Topics')}<div class="pill-row">${['Web development','Apps','Artificial intelligence','Privacy','Digital systems','Design','Creative projects'].map(pill).join('')}</div>
    ${external(URLS.about,'Open profile website',true)}`; }

  function renderSocial(){return `${appHero('SOCIAL MEDIA','Share your work.','A sample social page with configurable links and demo posts.','📸')}
    <div class="link-list">${linkCard('📸','Instagram','@YOUR_USERNAME',URLS.instagram)}${linkCard('🎵','TikTok','@YOUR_USERNAME',URLS.tiktok)}</div>
    ${section('Demo posts')}
    ${feedCard('A new project is online','Use this card to introduce a project, release or update. Add your own image and link when ready.','#Demo #Projects')}
    ${feedCard('Behind the scenes','Share a short update about your current work, tools or creative process.','#Development #BehindTheScenes')}
    ${feedCard('Community update','Add a question or invite visitors to share feedback.','#Community #Feedback')}
    ${feedCard('Showcase','Highlight a feature, demo or finished result.','#Showcase #WebDevelopment')}
    ${section('Social feeds')}<div class="notice">The links above are placeholders. Configure your own public profile URLs before publishing.</div>${external(URLS.social,'Open your social page',true)}`; }

  function renderProjects(){return `${appHero('PROJECTS','Ideas become products.','Use these example cards to showcase your own applications, experiments and websites.','🧩')}
    <div class="project-list">${projectOpen('voiceassistant','🎙️','Voice assistant demo','A configurable voice interface')}${projectOpen('parentsettings','👨‍👩‍👧','Settings demo','A sample settings and timer interface')}${projectOpen('schildi','📱','Smartphone UI demo','A responsive smartphone interface')}${projectOpen('chatgpt','🤖','AI chat demo','A sample AI search and chat interface')}${projectOpen('scratch','🟧','Creative coding demo','A sample coding project')}</div>
    ${section('Additional examples')}<div class="project-list">${projectOpen('clouddemo','☁️','Cloud storage demo','A sample personal cloud interface')}${projectOpen('iptv','📺','Media demo','A sample media dashboard')}${projectOpen('tech','💻','Technology lab','Devices, operating systems and experiments')}</div>
    ${section('Project page')}${embedPanel('projects','Project website',URLS.projects,'Project overview')}
    <div class="notice">Replace the sample projects and external links with your own work. Do not publish private server addresses or access credentials.</div>${external(URLS.projects,'Open project website',true)}`; }

  const PROJECT_DEMOS = {
    voiceassistant:{title:'Voice assistant demo',source:URLS.voiceassistantDemo,embed:URLS.voiceassistantDemo,description:'Example external voice assistant. Add your own public demo URL.'},
    parentsettings:{title:'Settings demo',source:URLS.parentsettingsPen,embed:'https://codepen.io/YOUR_USERNAME/embed/YOUR_PEN_ID_1?default-tab=result&theme-id=dark',description:'Example settings interface. Add your own CodePen project ID.'},
    schildi:{title:'Smartphone UI demo',source:URLS.schildiPen,embed:'https://codepen.io/YOUR_USERNAME/embed/YOUR_PEN_ID_2?default-tab=result&theme-id=dark',description:'Example responsive smartphone interface. Add your own CodePen project ID.'},
    chatgpt:{title:'AI chat demo',source:URLS.chatgptPen,embed:'https://codepen.io/YOUR_USERNAME/embed/YOUR_PEN_ID_3?default-tab=result&theme-id=dark',description:'Example AI chat interface. Add your own CodePen project ID.'}
  };

  function projectFrameMarkup(id){
    const demo=PROJECT_DEMOS[id];
    if(!demo)return '';
    const allow=id==='voiceassistant'?'microphone; autoplay; clipboard-read; clipboard-write':'microphone; autoplay; clipboard-read; clipboard-write';
    // allow-same-origin is needed for the CodePen demos' own localStorage. The iframe is still cross-origin from this OS.
    const sandbox='allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads allow-presentation';
    return `<iframe class="project-runtime-frame" title="${esc(demo.title)}" src="${esc(demo.embed)}" loading="eager" referrerpolicy="strict-origin-when-cross-origin" sandbox="${sandbox}" allow="${allow}" allowfullscreen></iframe>`;
  }

  function projectRuntimePanel(id){
    const demo=PROJECT_DEMOS[id];
    if(!demo)return '';
    const isCodePen=id!=='voiceassistant';
    const frame=projectFrameMarkup(id);
    const needsConsent=id==='chatgpt';
    const lang=currentLanguage();
    const translateUrl=`https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(lang)}&u=${encodeURIComponent(demo.source)}`;
    const translateLabel=lang==='de'?'Projektseite übersetzen':lang==='en'?'Translate project page':'Projectpagina vertalen';
    const liveContent=needsConsent
      ? `<div class="embed-placeholder project-consent-placeholder"><span>🤖</span><b>Eigenes ChatGPT – Originaldemo</b><small>Der Originalcode fordert beim Start einen API-Schlüssel an. Außerdem verwendet die Schlüsselprüfung einen abgeschalteten OpenAI-Endpunkt. Die Demo wird deshalb erst nach bewusster Auswahl geladen.</small><button class="app-button" type="button" data-load-project-demo="chatgpt">Originaldemo jetzt laden</button></div>`
      : frame;
    return `${section('Originalprojekt direkt in dieser App')}
      <div class="project-runtime-card">
        <div class="embedded-frame-head"><b>${esc(demo.title)}</b><span class="runtime-status">${needsConsent?'BEREIT ZUM START':'LIVE-DEMO'}</span></div>
        <div id="projectDemoMount-${id}">${liveContent}</div>
        <p class="body-copy">${esc(demo.description)} Wenn die Plattform das Einbetten verhindert oder die Demo ein eigenes Fenster benötigt, lässt sie sich direkt beim Originalanbieter öffnen.</p>
        <div class="runtime-actions">${external(demo.source,'Originalprojekt öffnen')}${isCodePen?external(demo.source+'?editors=0010','CodePen-Editor öffnen',true):''}<a class="app-button secondary" href="${esc(translateUrl)}" target="_blank" rel="noopener noreferrer">🌐 ${translateLabel}</a></div>
      </div>
      <details class="embed-code-details"><summary>Einbettungs-Code anzeigen</summary><pre><code>${esc(frame)}</code></pre><button class="app-button secondary" type="button" data-copy-code="${esc(frame)}">IFrame-Code kopieren</button><p class="embed-provenance">Dies ist der Einbettungscode für die öffentliche Live-Vorschau. Der ursprüngliche HTML-/CSS-/JavaScript-Quellcode bleibt beim jeweiligen Websim- oder CodePen-Projekt gespeichert. Änderungen dort werden beim erneuten Laden übernommen.</p></details>`;
  }

  function renderProjectDetail(id){
    const data = {
      chatgpt:{icon:'🤖',name:'AI chat demo',intro:'A sample search and chat interface.',body:'Use this page to describe your AI or search project. Explain which services and APIs it uses, what data is processed and whether user input leaves the browser.',tags:['AI interface','Voice input','Search history','Import and export'],source:URLS.chatgptPen,cta:'Open CodePen demo'},
      parentsettings:{icon:'⚙️',name:'Settings demo',intro:'A sample settings interface with optional access controls.',body:'Describe the settings available in your own project. Explain clearly whether any access code is only a visual demo or provides actual security.',tags:['Settings','Access control demo','Timer','Preferences'],source:URLS.parentsettingsPen,cta:'Open CodePen demo'},
      schildi:{icon:'📱',name:'Smartphone UI demo',intro:'A responsive smartphone-style web interface.',body:'Describe the screens, navigation and sample apps included in your own smartphone interface. Do not present browser-only simulations as real device controls or security features.',tags:['Responsive layout','Navigation','App tiles','UI demo'],source:URLS.schildiPen,cta:'Open CodePen demo'},
      voiceassistant:{icon:'🎙️',name:'Voice assistant demo',intro:'A sample voice-enabled web application.',body:'Explain the voice features, hosting provider, permissions and data handling of your own implementation.',tags:['Voice input','Assistant UI','Settings','Demo'],source:URLS.voiceassistantDemo,cta:'Open demo'},
      scratch:{icon:'🟧',name:'Creative coding demo',intro:'A sample project from a visual coding platform.',body:'Replace this description with the details of your own creative coding project.',tags:['Creative coding','Learning','Programming'],source:URLS.scratch,cta:'Open example platform'},
      clouddemo:{icon:'☁️',name:'Cloud storage demo',intro:'An example personal cloud interface.',body:'Describe the storage provider and security model used by your deployment. Do not publish server addresses, tokens or administrative details.',tags:['Cloud storage','Backup','Privacy'],source:null},
      iptv:{icon:'📺',name:'Media dashboard demo',intro:'An example media and streaming interface.',body:'Describe the services you have permission to use. Never include private stream URLs, credentials or subscription tokens.',tags:['Media','Streaming','Dashboard'],source:null}
    }[id];
    if(!data)return '<p class="body-copy">No demo details are configured for this project.</p>';
    const warning=id==='chatgpt'
      ? '<div class="notice warning-notice"><b>Security notice:</b> Never embed private API keys in client-side code. Use a secure backend for secrets and review the provider’s current API guidance.</div>'
      : id==='parentsettings'
        ? '<div class="notice warning-notice"><b>Security notice:</b> A client-side access code or browser localStorage value is not a robust authentication or child-safety mechanism.</div>'
        : '';
    const sourceLink=data.source?external(data.source,data.cta):'<div class="notice">No external demo URL has been configured.</div>';
    return `${appHero('PROJECT DETAIL',data.name,data.intro,data.icon)}
      <p class="body-copy">${data.body}</p>
      ${section('Features')}<div class="pill-row">${data.tags.map(pill).join('')}</div>
      ${warning}
      ${projectRuntimePanel(id)}
      ${section('External demo')}${sourceLink}
      ${section('Project overview')}${internalAppButton('projects','Back to projects')}`;
  }

  function renderStudio(){return `${appHero('CREATOR STUDIO','Your digital presence.','A sample overview for a creator, studio or small digital business.','🚀')}
    ${section('Profile and categories')}<div class="info-grid">${infoCard('🎨','Creative work','Optional category')}${infoCard('📣','Media','Optional category')}${infoCard('🧑‍💻','Software','Optional category')}${infoCard('🌍','Online services','Add your own service area')}</div>
    ${section('Services')}<div class="project-list">${projectCard('🎥','Content creation','Digital content and public presence.')}${projectCard('🧠','Digital solutions','Web apps, automation and AI experiments.')}${projectCard('🖥️','Website design','Planning and building web projects.')}${projectCard('🛍️','Demo shop','A sample online shop or product catalogue.')}</div>
    ${section('Feedback')}<p class="body-copy">Add a link to your own review or feedback page.</p>${external(URLS.googleReview,'Open review page')}`; }

  function renderWebsite(){return `${appHero('DEMO WEBSITE','Your pages in one place.','A sample multi-page website presented through an app-style interface.','🌐')}
    ${section('Demo pages')}<div class="website-pages">${[['websitehome','🏠','Home','Introduction'],['social','📸','Social media','Public channels'],['about','👤','Profile','Background and interests'],['projects','🧩','Projects','Project overview'],['shop','🛍️','Demo shop','Example catalogue'],['websiteinfo','ℹ️','About','Features and information'],['fanapp','📱','App','App description'],['images','🖼️','Gallery','Demo media'],['legal','⚖️','Legal','Placeholder documents']].map(([id,icon,title,desc])=>`<button type="button" data-app="${id}"><span>${icon}</span><b>${title}</b><small>${desc}</small></button>`).join('')}</div>
    ${section('Example features')}<div class="info-grid">${infoCard('🌙','Dark mode','Light and dark themes')}${infoCard('💬','Community','Optional chat and feedback')}${infoCard('👤','Profiles','Optional member profiles')}${infoCard('👥','Groups','Optional community spaces')}${infoCard('🧠','AI assistant','Optional AI integration')}${infoCard('🛒','Shop','Optional external shop')}</div>
    <div class="notice">This is sample content. Configure each link and only advertise features that your own site actually provides.</div>${external(URLS.home,'Open your website',true)}`; }

  function renderWebsiteHome(){return `${appHero('DEMO HOME','Welcome to the demo website.','This page demonstrates how you can connect a website, projects, social channels and legal information.','🏠')}
    <p class="body-copy">Replace this introduction with a short description of your own website or project.</p>
    <div class="site-image-grid"><img loading="lazy" src="../assets/demo/placeholder-wallpaper.svg" alt="Demo background one"><img loading="lazy" src="../assets/demo/placeholder-avatar.svg" alt="Demo profile image"><img loading="lazy" src="../assets/demo/placeholder-wallpaper.svg" alt="Demo background two"></div>
    ${section('Explore the demo')}<div class="website-pages">${[['about','👤','Profile','Demo profile'],['social','📸','Social media','Demo channels'],['projects','🧩','Projects','Sample projects'],['shop','🛍️','Demo shop','Example shop'],['websiteinfo','ℹ️','About this website','Features'],['fanapp','📱','Demo app','App information']].map(([id,icon,title,desc])=>`<button type="button" data-app="${id}"><span>${icon}</span><b>${title}</b><small>${desc}</small></button>`).join('')}</div>
    ${section('External website')}${embedPanel('site','Your website',URLS.home,'Website preview')}
    ${section('Contact and feedback')}<div class="link-list">${linkCard('✉️','Email','your-email@example.com',URLS.email)}${linkCard('🌐','Website','YOUR_WEBSITE_URL',URLS.home)}</div>
    ${section('Legal information')}<div class="link-list">${internalAppButton('legal','Imprint · Privacy · Terms')}</div>${DEMO_WEBSITE_FOOTER}`; }

  function renderShop(){
    const target=URLS.shop;
    const lang=currentLanguage();
    const heading=lang==='de'?'Demo-Shop':lang==='en'?'Demo shop':'Demo-winkel';
    const intro=lang==='de'?'Hier kannst du deinen eigenen Shop oder Produktkatalog einbinden.':lang==='en'?'Embed your own shop or product catalogue here.':'Voeg hier je eigen winkel of productcatalogus in.';
    const fallback=lang==='de'?'Falls dein Anbieter das Einbetten verhindert, öffne den Shop direkt in einem neuen Tab.':lang==='en'?'If your provider blocks embedding, open the shop in a new tab.':'Als de aanbieder insluiten blokkeert, open je de winkel in een nieuw tabblad.';
    const open=lang==='de'?'Shop in neuem Tab öffnen':lang==='en'?'Open shop in new tab':'Winkel openen in nieuw tabblad';
    return `${appHero('DEMO SHOP',heading,intro,'🛍️')}
      <div class="notice">${fallback}</div>
      <div class="shop-runtime-toolbar"><div><b>${heading}</b><small>YOUR_SHOP_URL</small></div><a class="app-button secondary" href="${esc(target)}" target="_blank" rel="noopener noreferrer">${open} ↗</a></div>
      <div class="embed-shell shop-google-sites" id="shopEmbed"><iframe title="Demo shop" src="${esc(target)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="clipboard-read; clipboard-write"></iframe></div>
      <p class="body-copy">${fallback}</p>
      <div class="ssos-form-actions"><a class="app-button" href="${esc(target)}" target="_blank" rel="noopener noreferrer">${open} ↗</a></div>`;
  }

  function renderImages(){
    return `${appHero('FOTOS & VIDEOS','Deine private Mediathek.','Sichere deine eigenen Fotos und Videos in einem getrennten privaten GitHub-Repository. Ordner und Metadaten werden automatisch nach Jahr und Monat sortiert.','📸')}
      <section class="ssos-photos-app" data-photos-app>
        <p class="ssos-photos-status" data-photos-status role="status" aria-live="polite">Deine private Foto- und Video-Cloud wird geprüft …</p>
        <div class="ssos-photos-stats" data-photos-stats></div>
        <label class="ssos-photos-search"><span>⌕</span><input type="search" data-photos-search placeholder="Suche: Urlaub, Strand, Hund, 2026 …" autocomplete="off"></label>
        <div class="ssos-photos-ai-actions"><button class="app-button secondary" type="button" data-photos-ai-enable>✨ Lokale KI aktivieren</button><button class="app-button" type="button" data-photos-ai-search>KI-Suche</button></div>
        <p class="ssos-photos-search-note" data-photos-ai-note>Ohne API-Schlüssel. Auf geeigneten Chrome-Desktopgeräten läuft die KI lokal. Auf anderen Geräten bleibt die Metadatensuche verfügbar.</p>
        <p class="ssos-photos-ai-status" data-photos-ai-status role="status" aria-live="polite"></p>
        <div class="ssos-photos-toolbar">
          <select data-photos-filter aria-label="Medientyp filtern"><option value="all">Alle Medien</option><option value="photo">Fotos</option><option value="video">Videos</option></select>
          <label class="app-button secondary ssos-photos-file-button">＋ Fotos/Videos auswählen<input type="file" data-photos-files accept="image/*,video/*" multiple></label>
        </div>
        <input class="ssos-photos-description" type="text" data-photos-description maxlength="500" placeholder="Beschreibung oder Stichwörter (optional)">
        <button class="app-button" type="button" data-photos-upload disabled>Ausgewählte Medien hochladen</button>
        <p class="ssos-photos-limit">Maximal 50 MiB pro Datei. GitHub ist kein unbegrenzter Medien-Speicher.</p>
        <div data-photos-gallery class="ssos-photos-gallery"><div class="ssos-photos-empty"><span>☁️</span><b>Mediathek wird geladen …</b></div></div>
        <div class="ssos-photos-viewer" data-photos-viewer hidden></div>
      </section>`;
  }
  function renderCamera(){
    return `${appHero('KAMERA','Deine Browser-OS-Kamera.','Nutze die Front- oder Rückkamera, nimm Fotos und Videos auf und lade sie direkt in deine private Foto- und Video-Cloud.','📷')}
      <section class="ssos-camera-app" data-camera-app>
        <div class="ssos-camera-preview-wrap"><video data-camera-preview autoplay muted playsinline></video><span class="ssos-camera-live">LIVE</span></div>
        <p class="ssos-camera-status" data-camera-status role="status" aria-live="polite">Kamera wird vorbereitet …</p>
        <div class="ssos-camera-actions">
          <button class="app-button secondary" type="button" data-camera-start>▶ Kamera starten</button>
          <button class="app-button secondary" type="button" data-camera-switch>↔ Front-/Rückkamera</button>
          <button class="app-button" type="button" data-camera-photo>● Foto aufnehmen</button>
          <button class="app-button secondary" type="button" data-camera-record>◉ Video aufnehmen</button>
          <button class="app-button secondary" type="button" data-camera-stop>■ Kamera stoppen</button>
        </div>
        <p class="ssos-camera-note">Die Kamera benötigt deine ausdrückliche Browserfreigabe. Die Aufnahme wird nach dem Aufnehmen in die private Cloud hochgeladen. Maximal 50 MiB je Datei.</p>
      </section>`;
  }
  function renderWebsiteInfo(){return `${appHero('ABOUT THIS WEBSITE','A flexible starting point.','The demo combines app tiles, configurable pages, optional community features and external services.','ℹ️')}
    <p class="body-copy">Use this page to describe your website, its purpose and the features available to visitors. Remove any feature that you have not implemented.</p>
    ${section('Example features')}<div class="info-grid">${infoCard('🌙','Dark mode','Light and dark appearance')}${infoCard('💬','Community','Optional chat or feedback')}${infoCard('👤','Profiles','Optional member profiles')}${infoCard('👥','Groups','Optional community groups')}${infoCard('🧠','AI assistant','Optional AI feature with privacy information')}${infoCard('🛍️','Shop','Optional shop integration')}${infoCard('🔗','External links','Links to your own services')}</div>
    <div class="notice">Only describe functionality that is actually active in your own deployment. Review privacy and legal implications before enabling third-party services.</div>${external(URLS.website,'Open your website information page',true)}`; }

  function renderFanApp(){return `${appHero('YOUR APP','A home for your community.','Use this demo page to describe an app, its features and installation options.','📱')}
    <p class="body-copy">Welcome to the demo app page. Add a description of your application, its intended audience and the main features it provides.</p>
    ${section('Example features')}<div class="info-grid">${infoCard('📰','Updates','News and project updates')}${infoCard('🧩','Projects','Applications and development work')}${infoCard('📸','Social media','Links to public channels')}${infoCard('💬','Community','Optional chat and feedback')}${infoCard('🔔','Notifications','Optional activity updates')}${infoCard('🛡️','Privacy','Privacy and data protection information')}</div>
    <div class="notice">Do not link to an APK or installer until you have verified its source, publisher, permissions and security.</div>${external(URLS.fanAppDownload,'Open app download page')}`; }

  function renderTech(){return `${appHero('TECH LAB','Technology to explore.','An example overview of tools, platforms and areas of interest.','💻')}
    <div class="project-list">${projectCard('🧩','Web development','HTML, CSS, JavaScript and modern web applications.')}${projectCard('🧠','AI and automation','AI assistants, APIs and workflow experiments.')}${projectCard('📱','Mobile development','Responsive design and mobile web apps.')}${projectCard('🔐','Privacy and security','Privacy-aware design and safe configuration.')}${projectCard('☁️','Cloud services','Self-hosted tools and online storage.')}${projectCard('🍓','Single-board computers','Small computers and embedded experiments.')}</div>
    <div class="notice">Do not include private server addresses, credentials, tokens or internal network details in public documentation.</div>`; }

  function renderContact(){return `${appHero('CONTACT','Get in touch.','Add the public contact methods for your project or business.','✉️')}
    <div class="link-list">${linkCard('✉️','Email','your-email@example.com',URLS.email)}${linkCard('🌐','Website','YOUR_WEBSITE_URL',URLS.home)}${linkCard('📸','Instagram','@YOUR_USERNAME',URLS.instagram)}${linkCard('🎵','TikTok','@YOUR_USERNAME',URLS.tiktok)}</div>
    <div class="notice">Replace every placeholder with a contact method you control. Avoid publishing private phone numbers or personal addresses unless legally required and intended for publication.</div>`; }

  function renderWhatsApp(){return `${appHero('MESSAGING','Contact by message.','Add a public messaging link if you want visitors to contact your project.','💬')}
    <p class="body-copy">This is an optional example contact page. Configure the service URL and describe when and how messages are handled.</p>
    ${infoCard('✍️','Written messages','Explain the contact method and expected response time.')}${external(URLS.whatsapp,'Open messaging link')}
    ${section('Privacy reminder')}<p class="body-copy">Tell visitors which service processes their messages and avoid requesting passwords, verification codes or other secrets.</p>`; }

  function renderEmail(){return `${appHero('EMAIL','Contact by email.','Use a public support or project email address.','📨')}
    <div class="info-card"><span>✉️</span><b>your-email@example.com</b><small>Replace this with your public contact address.</small></div>
    ${external(URLS.email,'Open email app')}
    <div class="notice">For easier routing, suggest a clear subject such as “Project enquiry” or “Support request”.</div>`; }

  function renderGoogle(){return `${appHero('PUBLIC PROFILE','Your public listing.','Add an optional business or public profile link.','⭐')}
    ${external(URLS.googleReview,'Open public profile')}`; }

  const LEGAL = {
    agbs:{icon:'📜',title:'Terms and conditions',intro:'Example terms – review and replace before publishing.',sections:[
      ['Important notice','This is demo text only. It is not a valid set of terms and conditions and must not be published unchanged.'],
      ['Use of the service','Describe the permitted use of your own website or application, including any restrictions that apply.'],
      ['User content','Explain how user-submitted content is handled, moderated, stored and removed.'],
      ['External services','List the third-party services actually used by your deployment and link to their current terms.'],
      ['Contact','Add a monitored public contact address: your-email@example.com']
    ]},
    privacy:{icon:'🔐',title:'Privacy policy',intro:'Example privacy information – not legal advice.',preamble:'This template is only a drafting aid. Adapt it to your real processing activities and obtain appropriate legal review before publication.',sections:[
      ['Controller','[YOUR NAME OR ORGANISATION]\n[YOUR POSTAL ADDRESS]\n[YOUR COUNTRY]\nEmail: your-email@example.com'],
      ['Data collected','Describe the personal data that your website actually collects, the purposes, legal bases and retention periods.'],
      ['Third-party services','List each service that receives personal data, the data shared and the relevant privacy documentation.'],
      ['Cookies and storage','Describe cookies, local storage, analytics and consent choices used by your deployment.'],
      ['Data subject rights','Describe the rights available in your jurisdiction and how users can exercise them.'],
      ['Contact','your-email@example.com']
    ]},
    imprint:{icon:'⚖️',title:'Imprint',intro:'Provider information – complete according to your jurisdiction.',sections:[
      ['Provider','[YOUR NAME OR ORGANISATION]\n[YOUR STREET AND HOUSE NUMBER]\n[YOUR POSTAL CODE AND CITY]\n[YOUR COUNTRY]'],
      ['Contact','Email: your-email@example.com\nPhone: [OPTIONAL PUBLIC BUSINESS PHONE]'],
      ['Responsible person','[PERSON RESPONSIBLE FOR CONTENT, IF REQUIRED]\n[POSTAL ADDRESS]'],
      ['Important notice','This is a placeholder, not a valid legal notice. Check the legal requirements that apply to your location and project.']
    ]}
  };

  function renderLegalDocument(id){
    const original=LEGAL[id] || LEGAL.imprint;
    const lang=currentLanguage();
    const translated=lang==='de'?null:(window.SSOS_LEGAL_TRANSLATIONS?.[lang]?.[id] || null);
    const data=translated?{...original,...translated}:original;
    const toolbar=lang==='de'?'Demo-Rechtstext':lang==='en'?'Demo legal text':'Juridische demotekst';
    const expand=lang==='de'?'Alle Abschnitte öffnen':lang==='en'?'Open all sections':'Alle onderdelen openen';
    const notice=lang==='de'?'Nur ein Platzhalter. Vor der Veröffentlichung anpassen und rechtlich prüfen lassen.':lang==='en'?'Placeholder only. Adapt and obtain legal review before publishing.':'Alleen een placeholder. Pas aan en laat juridisch controleren vóór publicatie.';
    const link=lang==='de'?'Eigene Rechtsseite öffnen':lang==='en'?'Open your legal page':'Open je juridische pagina';
    const questions=lang==='de'?'Fragen zu diesen Angaben?':lang==='en'?'Questions about this information?':'Vragen over deze informatie?';
    const sections=data.sections || original.sections;
    return `<div class="legal-toolbar"><span>${toolbar}</span><button type="button" class="text-button" data-expand-legal>${expand}</button></div>
      <div class="legal-document-heading"><span>${original.icon}</span><div><b>${esc(data.title || original.title)}</b><small>${esc(data.intro || original.intro)}</small></div></div>
      ${data.preamble?`<p class="legal-introduction">${esc(data.preamble)}</p>`:''}
      <div class="legal-sections">${sections.map(([title,body],i)=>`<details class="legal-section" ${i===0?'open':''}><summary>${esc(title)}<span>＋</span></summary><div class="legal-body">${String(body).split(/\n\n/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('')}</div></details>`).join('')}</div>
      <div class="notice">${notice}</div>
      ${external(URLS[id],link,true)}
      <div class="notice">${questions} <a href="mailto:your-email@example.com">your-email@example.com</a></div>`;
  }

  function renderLegalHub(){
    const lang=currentLanguage();
    const title=lang==='de'?'Rechtliches.':lang==='en'?'Legal information.':'Juridische informatie.';
    const intro=lang==='de'?'Impressum, Datenschutzerklärung und Allgemeine Geschäftsbedingungen – vollständig an einem Ort.':lang==='en'?'Imprint, privacy policy and terms and conditions – all in one place.':'Colofon, privacyverklaring en algemene voorwaarden – alles op één plek.';
    const question=lang==='de'?'Welchen Text möchtest du lesen?':lang==='en'?'Which document would you like to read?':'Welk document wil je lezen?';
    const labels=lang==='de'?['Impressum','Datenschutz','Allgemeine Geschäftsbedingungen (AGBs)']:lang==='en'?['Imprint','Privacy policy','Terms and conditions']:['Colofon','Privacyverklaring','Algemene voorwaarden'];
    return `${appHero('LEGAL INFORMATION',title,intro,'⚖️')}
      <label class="legal-select-label" for="legalDocumentSelect">${question}</label>
      <select class="legal-document-select" id="legalDocumentSelect" aria-label="${question}">
        <option value="imprint" ${selectedLegalDocument==='imprint'?'selected':''}>${labels[0]}</option>
        <option value="privacy" ${selectedLegalDocument==='privacy'?'selected':''}>${labels[1]}</option>
        <option value="agbs" ${selectedLegalDocument==='agbs'?'selected':''}>${labels[2]}</option>
      </select>
      <div id="legalDocumentMount">${renderLegalDocument(selectedLegalDocument)}</div>`;
  }

  function renderVpn(){
    const lang=currentLanguage();
    const copy=lang==='en'?{eyebrow:'ANDROID VPN BRIDGE',title:'VPN integration.',desc:'A template screen for a native Android VPN service.',note:'The extension cannot create a system VPN tunnel by itself. Implement the native VpnService, choose a trusted tunnel engine, add your server manifest and current profiles, and handle consent and status in Android.',button:'Open native VPN controls',desktop:'This sample bridge is available only in your Android app.'}:lang==='nl'?{eyebrow:'ANDROID VPN-BRIDGE',title:'VPN-integratie.',desc:'Een voorbeeldscherm voor een native Android-VPN-service.',note:'De Extension kan zelf geen systeembrede VPN-tunnel maken. Implementeer VpnService, kies een betrouwbare tunnel-engine, voeg je servermanifest en actuele profielen toe en beheer toestemming en status in Android.',button:'Native VPN-bediening openen',desktop:'Deze voorbeeldbridge is alleen beschikbaar in je Android-app.'}:{eyebrow:'ANDROID-VPN-BRIDGE',title:'VPN-Integration.',desc:'Eine Vorlage für die Anbindung eines nativen Android-VPN-Dienstes.',note:'Die Extension allein kann keinen systemweiten VPN-Tunnel erstellen. Implementiere VpnService, integriere eine vertrauenswürdige Tunnel-Engine, ergänze Servermanifest und aktuelle Profile und verwalte Berechtigungen sowie Status in Android.',button:'Native VPN-Steuerung öffnen',desktop:'Diese Beispiel-Bridge ist nur in deiner Android-App verfügbar.'};
    const android=/Android/i.test(navigator.userAgent||'');
    return appHero(copy.eyebrow,copy.title,copy.desc,'🛡️')+'<div class="notice warning-notice">'+copy.note+'</div><div class="ssos-form-actions"><button class="app-button" type="button" data-vpn-open '+(android?'':'disabled')+'>'+copy.button+' ↗</button></div>'+(android?'':'<p class="body-copy">'+copy.desktop+'</p>');
  }

  function renderSettings(){return `${appHero('OBERFLÄCHE ANPASSEN','Einstellungen.','Passe das Erscheinungsbild dieser Besucher-App an. Die Änderungen werden lokal in diesem Browser gespeichert.','⚙️')}
    <div class="link-list">${linkCard('🎛️','Kontrollzentrum','Wische vom oberen Bildschirmrand nach unten oder tippe auf die Uhr.','#control')}${linkCard('🌙','Darstellung wechseln','Zwischen heller und dunkler Oberfläche wechseln','#theme')}${linkCard('🔒','Sperrbildschirm','Die Smartphone-Ansicht sperren','#lock')}</div>
    <div class="notice">WLAN, Bluetooth, mobile Daten, Taschenlampe und Rotation werden in dieser Webapp nur optisch simuliert. Ein Browser darf diese Systemfunktionen des Galaxy S24 nicht selbstständig umschalten.</div>
    <div class="language-settings"><h3 class="content-heading">Sprache ändern</h3><div class="language-options setting-language-options"><button class="language-option" type="button" data-set-language="de"><span>🇩🇪</span><b>Deutsch</b></button><button class="language-option" type="button" data-set-language="en"><span>🇬🇧</span><b>English</b></button><button class="language-option" type="button" data-set-language="nl"><span>🇳🇱</span><b>Nederlands</b></button></div></div><button class="app-button" id="resetSettings" type="button">Einstellungen zurücksetzen</button>`;}

  const RENDERERS={
    home:renderHome,about:renderAbout,social:renderSocial,projects:renderProjects,studio:renderStudio,website:renderWebsite,
    websitehome:renderWebsiteHome,shop:renderShop,websiteinfo:renderWebsiteInfo,fanapp:renderFanApp,tech:renderTech,images:renderImages,camera:renderCamera,legal:renderLegalHub,
    contact:renderContact,whatsapp:renderWhatsApp,email:renderEmail,google:renderGoogle,settings:renderSettings,vpn:renderVpn,
    browserstore:()=>window.SSOSPersonalization?.renderStore?.() || '<p class="body-copy">Browser Store konnte nicht geladen werden.</p>',
    chatgpt:()=>renderProjectDetail('chatgpt'),parentsettings:()=>renderProjectDetail('parentsettings'),schildi:()=>renderProjectDetail('schildi'),
    voiceassistant:()=>renderProjectDetail('voiceassistant'),scratch:()=>renderProjectDetail('scratch'),
    clouddemo:()=>renderProjectDetail('clouddemo'),iptv:()=>renderProjectDetail('iptv')
  };

  function showToast(message){els.toast.textContent=message;els.toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>els.toast.classList.remove('show'),2200);}
  function enterOS(){els.intro.classList.add('hidden');els.home.classList.remove('hidden');}
  const DEMO_WEBSITE_FRAME_PAGES={
    about:{url:URLS.about,title:'Über mich'},projects:{url:URLS.projects,title:'Meine Projekte'},
    websiteinfo:{url:URLS.website,title:'Über unsere Webseite'},fanapp:{url:URLS.fanapp,title:'Unsere App'}
  };
  function openApp(id){
    if(['photos','photo','gallery','fotos','bilder','foto','mediathek'].includes(String(id||'').toLowerCase()))id='images';
    if(['kamera','camera-app'].includes(String(id||'').toLowerCase()))id='camera';
    if(['agbs','privacy','imprint'].includes(id)){selectedLegalDocument=id;id='legal';}
    if(PROJECT_CHILD_IDS.includes(id) && !projectHubActive){showToast('Bitte öffne Projekte über die App „Projektwelt“.');id='projects';}
    if(CONTACT_CHILD_IDS.includes(id) && !contactHubActive){showToast('Bitte öffne Kontaktfunktionen über die App „Kontakt“.');id='contact';}
    const app=APPS.find(a=>a.id===id);
    if(!app || typeof RENDERERS[id]!=='function')return;
    if(id==='projects')projectHubActive=true;
    else if(!PROJECT_CHILD_IDS.includes(id))projectHubActive=false;
    if(id==='contact')contactHubActive=true;
    else if(!CONTACT_CHILD_IDS.includes(id))contactHubActive=false;
    activeAppId=id;
    els.title.textContent=localizedAppName(app.id);els.emoji.textContent=app.icon;
    let rendered='';
    try{
      rendered=RENDERERS[id]();
      if(typeof rendered!=='string'||!rendered.trim())throw new Error('The app renderer returned no content.');
      els.appContent.innerHTML=(id==='legal'||id==='browserstore')?rendered:localize(rendered);
    }catch(error){
      console.error('[Browser OS] Could not open app:',id,error);
      if(id==='images'){
        rendered='<div class="app-hero"><p class="eyebrow">FOTOS & GALERIE</p><h2>Bilder aus der Fan-Welt.</h2><p>Die interne Galerieansicht konnte nicht vollständig geladen werden. Du kannst die öffentliche Bildergalerie direkt auf der offiziellen Webseite öffnen.</p><span class="large-emoji">🖼️</span></div><div class="notice">Die Originalgalerie kann externe Inhalte verwenden, die nicht in jedem Browser eingebettet werden dürfen.</div><div class="ssos-form-actions"><a class="app-button" href="'+esc(URLS.social)+'" target="_blank" rel="noopener noreferrer">Fotogalerie öffnen ↗</a></div>';
      }else{
        rendered='<div class="notice warning-notice">Diese App konnte gerade nicht vollständig geladen werden. Kehre zum Startbildschirm zurück und versuche es erneut.</div>';
      }
      els.appContent.innerHTML=(id==='legal'||id==='browserstore')?rendered:localize(rendered);
    }
    $$('[data-set-language]',els.appContent).forEach(b=>b.classList.toggle('selected',b.dataset.setLanguage===currentLanguage()));
    const source=DEMO_WEBSITE_FRAME_PAGES[id];
    if(source){
      els.appContent.insertAdjacentHTML('beforeend',`<h3 class="content-heading">Interaktive Originalansicht</h3><div class="embed-shell" id="pageEmbed"><div class="embed-placeholder"><span>🌐</span><b>${esc(source.title)} – Originalseite</b><small>Die vollständige your website provider-Seite wird erst nach deiner Auswahl geladen. So bleiben externe Inhalte zunächst deaktiviert.</small><button class="app-button" type="button" data-load-frame="${id}">Originalseite hier anzeigen</button></div></div>`);
    }
    els.home.classList.add('hidden');els.panel.classList.add('hidden');els.search.classList.add('hidden');els.app.classList.remove('hidden');
    els.appContent.scrollTop=0;
    window.dispatchEvent(new CustomEvent('ssos-app-opened',{detail:{id:activeAppId}}));
  }
  function goHome(){activeAppId=null;projectHubActive=false;contactHubActive=false;els.app.classList.add('hidden');els.panel.classList.add('hidden');els.search.classList.add('hidden');els.lock.classList.add('hidden');els.home.classList.remove('hidden');window.dispatchEvent(new CustomEvent('ssos-app-opened',{detail:{id:null}}));}
  function openControl(){els.panel.classList.remove('hidden');els.search.classList.add('hidden');syncControl();}
  function openSearch(){els.search.classList.remove('hidden');els.panel.classList.add('hidden');els.searchInput.value='';renderSearch('');setTimeout(()=>els.searchInput.focus(),80);}
  function searchGoogle(){const query=els.searchInput.value.trim();if(!query){showToast('Gib zuerst einen Suchbegriff ein.');els.searchInput.focus();return;}const url='https://www.google.com/search?q='+encodeURIComponent(query);window.open(url,'_blank','noopener');}

  function playClickSound(){if(!state.sounds||state.quiet)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audioContext=audioContext||new C();if(audioContext.state==='suspended')audioContext.resume();const osc=audioContext.createOscillator(),gain=audioContext.createGain(),t=audioContext.currentTime;osc.type='sine';osc.frequency.setValueAtTime(610,t);osc.frequency.exponentialRampToValueAtTime(440,t+.055);gain.gain.setValueAtTime(.018,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.07);osc.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+.075);}catch{}}
  function updateClock(){const now=new Date(),locale=LANGUAGES[currentLanguage()].html,time=now.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});$('#statusTime').textContent=time;$('#lockTime').textContent=time;$('#longDate').textContent=now.toLocaleDateString(locale,{weekday:'long',day:'2-digit',month:'long'}).toUpperCase().replace(',',' ·');$('#lockDate').textContent=now.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long'});}
  function persist(key,value){state[key]=value;try{localStorage.setItem('ssos-'+key,JSON.stringify(value));}catch{}}
  function applySettings(){
    document.body.dataset.wallpaper=state.wallpaper;document.body.dataset.theme=state.theme;
    document.documentElement.style.setProperty('--screen-brightness',String(state.brightness/100));
    document.documentElement.style.setProperty('--glass',state.glass+'%');document.documentElement.style.setProperty('--glass-blur',(state.glass/5)+'px');
    document.body.classList.toggle('reduce-motion',state.reduceMotion);
    $$('.wall-choice').forEach(b=>b.classList.toggle('selected',b.dataset.wall===state.wallpaper));
    const fields=[['brightnessSlider','brightnessOutput',state.brightness],['glassSlider','glassOutput',state.glass],['volumeSlider','volumeOutput',state.volume]];
    fields.forEach(([input,output,value])=>{const el=$('#'+input),out=$('#'+output);if(el)el.value=value;if(out)out.textContent=value+'%';});
  }
  function syncControl(){
    applySettings();
    $$('[data-toggle]').forEach(b=>{const key=b.dataset.toggle,on=!!state[key];b.classList.toggle('active',on);const small=$('small',b);if(small)small.textContent=currentLanguage()==='de'?(on?'Ein':'Aus'):currentLanguage()==='en'?(on?'On':'Off'):(on?'Aan':'Uit');});
  }
  function renderSearch(query){
    const q=query.trim().toLocaleLowerCase(currentLanguage());
    const builtInMatches=APPS.filter(a=>HOME_APP_IDS.includes(a.id)).filter(a=>(a.name+' '+a.hint+' '+a.keys+' '+localizedAppName(a.id)+' '+localizedAppHint(a)).toLocaleLowerCase(currentLanguage()).includes(q));
    const customApps=window.SSOSPersonalization?.getApps?.() || [];
    const customMatches=customApps.filter(app=>{
      let host='';try{host=new URL(app.url).hostname;}catch{}
      return `${app.name} ${app.url} ${host}`.toLocaleLowerCase(currentLanguage()).includes(q);
    });
    const builtInMarkup=builtInMatches.map(app=>`<button class="search-result" type="button" data-search-app="${esc(app.id)}"><span class="search-result-icon">${esc(app.icon)}</span><span class="search-result-copy"><b>${esc(localizedAppName(app.id))}</b><small>${esc(localizedAppHint(app))}</small></span></button>`).join('');
    const customMarkup=customMatches.map(app=>{
      let host=app.url;try{host=new URL(app.url).hostname;}catch{}
      const image=app.iconUrl || (String(app.icon||'').startsWith('data:image/')?app.icon:'');
      const icon=image?`<img src="${esc(image)}" alt="" loading="lazy">`:esc(app.icon||'🌐');
      return `<button class="search-result custom-search-result" type="button" data-search-custom-app="${esc(app.id)}"><span class="search-result-icon">${icon}</span><span class="search-result-copy"><b>${esc(app.name)}</b><small>${esc(host)}</small></span></button>`;
    }).join('');
    const markup=builtInMarkup+customMarkup;
    els.searchResults.innerHTML=markup || `<p class="body-copy">${localize('Keine passende App gefunden. Probiere einen anderen Suchbegriff.')}</p>`;
  }
  function setWallpaper(wall){persist('wallpaper',wall);applySettings();showToast(localize('Hintergrund geändert'));}
  function toggleTheme(){persist('theme',state.theme==='dark'?'light':'dark');applySettings();showToast(localize(state.theme==='dark'?'Dunkle Darstellung':'Helle Darstellung'));}
  function resetSettings(){
    ['wallpaper','theme','brightness','glass','volume','quiet','sounds','wifi','bluetooth','mobile','rotation','flashlight','reduceMotion'].forEach(k=>{try{localStorage.removeItem('ssos-'+k);}catch{}});
    Object.assign(state,{wallpaper:'midnight',theme:'dark',brightness:90,glass:78,volume:35,quiet:false,sounds:true,wifi:true,bluetooth:true,mobile:true,rotation:true,flashlight:false,reduceMotion:false});
    applySettings();syncControl();showToast(localize('Einstellungen zurückgesetzt'));
  }
  function openFrame(kind){
    const extra={about:{url:URLS.about,title:'Über mich'},projects:{url:URLS.projects,title:'Meine Projekte'},websiteinfo:{url:URLS.website,title:'Über unsere Webseite'},fanapp:{url:URLS.fanapp,title:'Unsere App'}};
    const config={tiktok:{url:URLS.tiktok,selector:'#tiktokEmbed',title:'TikTok'},social:{url:URLS.social,selector:'#socialEmbed',title:'Instagram / your website provider-Galerie'},imageFeed:{url:URLS.social,selector:'#imageFeedEmbed',title:'Originale Bildergalerie'},site:{url:URLS.home,selector:'#siteEmbed',title:'Offizielle Demo-Website'},shop:{url:URLS.shop,selector:'#shopEmbed',title:'Demo Shop'},projects:{url:URLS.projects,selector:'#projectsEmbed',title:'Meine Projekte'},...Object.fromEntries(Object.entries(extra).filter(([key])=>key!=='projects').map(([key,value])=>[key,{...value,selector:'#pageEmbed'}]))}[kind];
    if(!config)return;const target=config.url;
    const container=$(config.selector);if(!container)return;
    const lang=currentLanguage();const translateUrl=`https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(lang)}&u=${encodeURIComponent(target)}`;
    const translateLabel=lang==='de'?'Seite übersetzen':lang==='en'?'Translate page':'Pagina vertalen';
    container.innerHTML=`<div class="embedded-frame-wrap"><div class="embedded-frame-head"><b>${localize(config.title)}</b><button type="button" class="text-button" data-close-frame="${kind}">${lang==='de'?'Schließen':lang==='en'?'Close':'Sluiten'}</button></div><iframe title="${esc(config.title)}" src="${esc(target)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe><p class="body-copy">${localize('Falls der Anbieter das Einbetten blockiert, kannst du die Seite direkt beim Anbieter öffnen.')}</p><div class="ssos-form-actions"><a class="app-button secondary" href="${esc(target)}" target="_blank" rel="noopener noreferrer">${lang==='de'?'Extern öffnen':lang==='en'?'Open externally':'Extern openen'} ↗</a><a class="app-button secondary" href="${esc(translateUrl)}" target="_blank" rel="noopener noreferrer">🌐 ${translateLabel}</a></div></div>`;
  }
  function toggleThemeAction(){toggleTheme();}


  // Device detection: phone, tablet or desktop. A preview override is available on wide layouts.
  let detectedDevice='phone'; let deviceOverride=saved('deviceOverride','auto');
  function detectDevice(){
    const w=Math.max(window.innerWidth||0,document.documentElement.clientWidth||0);
    const h=Math.max(window.innerHeight||0,document.documentElement.clientHeight||0);
    const ua=navigator.userAgent||'';
    const tabletUA=/iPad|Tablet|SM-X|Android(?!.*Mobile)/i.test(ua);
    const desktopUA=/(Windows NT|Macintosh|X11;|CrOS)/i.test(ua);
    if(deviceOverride!=='auto')return deviceOverride;
    if(tabletUA)return 'tablet';
    if((desktopUA && w>=900) || w>=1200)return 'desktop';
    if(w>=760 || (Math.min(w,h)>=700 && /Android|iPad/i.test(ua)))return 'tablet';
    return 'phone';
  }
  function deviceLabel(type){return type==='desktop'?'Demo laptop':type==='tablet'?'Demo tablet':'Demo smartphone';}
  function deviceHint(type){return type==='desktop'?'Desktop workspace · laptop layout':type==='tablet'?'Tablet interface · wide touch layout':'Smartphone interface · mobile layout';}
  function renderDevicePreviewButtons(){ $$('[data-preview-device]').forEach(b=>b.classList.toggle('active',b.dataset.previewDevice===deviceOverride)); }
  function updateDevice(){detectedDevice=detectDevice();document.body.dataset.device=detectedDevice;$('#deviceDetectedLabel').textContent=deviceLabel(detectedDevice);$('#deviceDetectedHint').textContent=deviceHint(detectedDevice);$('#deviceModelLabel').textContent=detectedDevice==='desktop'?'GALAXY BOOK6 PRO':detectedDevice==='tablet'?'GALAXY TAB S12 ULTRA':'GALAXY S24';renderDevicePreviewButtons();}
  window.addEventListener('resize',()=>{if(deviceOverride==='auto')updateDevice();});
  $$('[data-preview-device]').forEach(b=>b.addEventListener('click',()=>{deviceOverride=b.dataset.previewDevice;persist('deviceOverride',deviceOverride);updateDevice();}));

  $$('[data-language-choice]').forEach(b=>b.addEventListener('click',()=>chooseLanguage(b.dataset.languageChoice)));
  $('#confirmLanguage').addEventListener('click',confirmLanguage);
  function initializeLanguage(){
    if(LANGUAGES[state.language]){
      selectedLanguage=state.language;
      els.language.classList.add('hidden');
      els.intro.classList.add('hidden');
      els.home.classList.remove('hidden');
    }else{
      selectedLanguage='de';
      els.language.classList.remove('hidden');
      els.intro.classList.add('hidden');
      els.home.classList.add('hidden');
    }
    chooseLanguage(selectedLanguage);applyShellLanguage();
  }
  updateDevice();initializeLanguage();updateClock();

  // Global app navigation and locally embedded social feeds.
  $('#enterOS').addEventListener('click',enterOS);$('#skipIntro').addEventListener('click',enterOS);
  $('#statusTime').addEventListener('click',openControl);$('#closeControl').addEventListener('click',()=>els.panel.classList.add('hidden'));
  $('#openSearch').addEventListener('click',openSearch);$('#closeSearch').addEventListener('click',()=>els.search.classList.add('hidden'));
  $('#clearSearch').addEventListener('click',()=>{els.searchInput.value='';renderSearch('');els.searchInput.focus();});
  $('#searchInput').addEventListener('input',e=>renderSearch(e.target.value));
  $('#googleSearchButton').addEventListener('click',searchGoogle);
  $('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();searchGoogle();}});
  $('#backHome').addEventListener('click',goHome);$('#closeApp').addEventListener('click',goHome);
  $('#gestureBar').addEventListener('click',()=>{if(!els.lock.classList.contains('hidden'))return;if(!els.panel.classList.contains('hidden')){els.panel.classList.add('hidden');return;}if(!els.app.classList.contains('hidden')||!els.search.classList.contains('hidden'))goHome();});
  $('#unlockButton').addEventListener('click',()=>{els.lock.classList.add('hidden');goHome();});
  $('#lockButton').addEventListener('click',()=>{els.panel.classList.add('hidden');els.lock.classList.remove('hidden');});
  $('#themeToggle').addEventListener('click',toggleThemeAction);
  $('#motionToggle').addEventListener('click',()=>{persist('reduceMotion',!state.reduceMotion);applySettings();showToast(localize(state.reduceMotion?'Bewegung reduziert':'Bewegung aktiviert'));});
  $('#brightnessSlider').addEventListener('input',e=>{persist('brightness',Number(e.target.value));applySettings();});
  $('#glassSlider').addEventListener('input',e=>{persist('glass',Number(e.target.value));applySettings();});
  $('#volumeSlider').addEventListener('input',e=>{persist('volume',Number(e.target.value));applySettings();});
  renderHomeAppGrid();
  function playTapFeedback(target){
    const control=target?.closest?.('button,a,[role="button"],input,select,summary');
    if(!control)return;
    if(control.matches('button'))playClickSound();
    // Haptic feedback is best-effort: unsupported browsers and desktop devices simply ignore it.
    try{if(typeof navigator!=='undefined' && typeof navigator.vibrate==='function')navigator.vibrate(10);}catch{}
  }
  document.addEventListener('click',e=>playTapFeedback(e.target),true);
  window.addEventListener('ssos-custom-apps-changed',()=>{
    if(!els.search.classList.contains('hidden'))renderSearch(els.searchInput.value);
  });
  document.addEventListener('click',e=>{
    const vpnOpen=e.target.closest('[data-vpn-open]');if(vpnOpen){if(!/Android/i.test(navigator.userAgent||'')){showToast('This native VPN bridge works only in your Android app.');return;}window.location.href='browseros://vpn';return;}
    const appBtn=e.target.closest('[data-app]');if(appBtn){openApp(appBtn.dataset.app);return;}
    const customResult=e.target.closest('[data-search-custom-app]');if(customResult){window.SSOSPersonalization?.openCustomApp?.(customResult.dataset.searchCustomApp);return;}
    const result=e.target.closest('[data-search-app]');if(result){openApp(result.dataset.searchApp);return;}
    const toggle=e.target.closest('[data-toggle]');if(toggle){const key=toggle.dataset.toggle;persist(key,!state[key]);syncControl();return;}
    const wall=e.target.closest('[data-wall]');if(wall){setWallpaper(wall.dataset.wall);return;}
    const setLang=e.target.closest('[data-set-language]');if(setLang){state.language=setLang.dataset.setLanguage;persist('language',state.language);applyShellLanguage();openApp('settings');showToast(localize('Sprache geändert'));return;}
    const projectDemo=e.target.closest('[data-load-project-demo]');if(projectDemo){const id=projectDemo.dataset.loadProjectDemo;const mount=$(`#projectDemoMount-${id}`,els.appContent);if(mount){mount.innerHTML=projectFrameMarkup(id);projectDemo.disabled=true;}return;}
    const copyCode=e.target.closest('[data-copy-code]');if(copyCode){const code=copyCode.dataset.copyCode;if(navigator.clipboard?.writeText){navigator.clipboard.writeText(code).then(()=>showToast(localize('HTML-Code kopiert'))).catch(()=>showToast(localize('Kopieren nicht verfügbar')));}else{showToast(localize('Kopieren nicht verfügbar'));}return;}
    const frame=e.target.closest('[data-load-frame]');if(frame){openFrame(frame.dataset.loadFrame);return;}
    const closeFrame=e.target.closest('[data-close-frame]');
    if(closeFrame){
      const kind=closeFrame.dataset.closeFrame;
      const reset={
        social:'<div class="embed-placeholder"><span>📲</span><b>Instagram- und TikTok-Galerie</b><small>Externe Feeds werden erst nach deiner Auswahl geladen.</small><button class="app-button" type="button" data-load-frame="social">Instagram-Galerie in dieser App laden</button><button class="app-button secondary" type="button" data-load-frame="tiktok">TikTok-Seite in dieser App laden</button></div>',
        site:'<div class="embed-placeholder"><span>🌐</span><b>Demo-Website innerhalb des OS</b><small>Die Originalseite wird erst geladen, wenn du die Einbettung auswählst.</small><button class="app-button" type="button" data-load-frame="site">Originalseite hier laden</button></div>',
        tiktok:'<div class="embed-placeholder"><span>🎵</span><b>TikTok-Profil</b><small>Originalprofil in dieser App laden.</small><button class="app-button" type="button" data-load-frame="tiktok">TikTok hier laden</button></div>',
        shop:'<div class="embed-placeholder"><span>🛍️</span><b>Original-Shop in dieser App laden</b><small>Der Shop kann Einbettungen durch den your website provider-/YOUR_PRINT_ON_DEMAND_PROVIDER-Anbieter blockieren.</small><button class="app-button" type="button" data-load-frame="shop">Shop hier laden</button></div>',
        imageFeed:'<div class="embed-placeholder"><span>📸</span><b>Originale Bildergalerie</b><small>Die your website provider-/Instagram-Galerie wird nur auf ausdrückliche Auswahl geladen.</small><button class="app-button" type="button" data-load-frame="imageFeed">Galerie laden</button></div>'
      };
      const selector={social:'#socialEmbed',tiktok:'#tiktokEmbed',site:'#siteEmbed',shop:'#shopEmbed',projects:'#projectsEmbed',about:'#pageEmbed',websiteinfo:'#pageEmbed',fanapp:'#pageEmbed',imageFeed:'#imageFeedEmbed'}[kind];
      const shell=selector?$(selector):null;if(shell){shell.innerHTML=reset[kind]||'<div class="embed-placeholder"><span>🌐</span><b>Originalseite erneut laden</b><small>Die externe Seite wird erst nach Auswahl geladen.</small><button class="app-button" type="button" data-load-frame="'+kind+'">Originalseite hier laden</button></div>';}return;
    }
    const actionLink=e.target.closest('a[href="#control"],a[href="#theme"],a[href="#lock"]');
    if(actionLink){e.preventDefault();if(actionLink.hash==='#control')openControl();if(actionLink.hash==='#theme')toggleTheme();if(actionLink.hash==='#lock')els.lock.classList.remove('hidden');return;}
  });
  $('#heroStudio').addEventListener('click',()=>openApp('studio'));
  $('#openProfile').addEventListener('click',()=>openApp('about'));
  $('#showAllApps').addEventListener('click',openSearch);
  $('#openCloud').addEventListener('click',()=>openApp('projects'));

  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
    if(e.key==='Escape'){if(!els.lock.classList.contains('hidden'))els.lock.classList.add('hidden');else if(!els.search.classList.contains('hidden'))els.search.classList.add('hidden');else if(!els.panel.classList.contains('hidden'))els.panel.classList.add('hidden');else if(!els.app.classList.contains('hidden'))goHome();}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='l'){e.preventDefault();els.lock.classList.remove('hidden');}
  });
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-expand-legal]')){$$('.legal-section').forEach(d=>d.open=true);}
    if(e.target.closest('#resetSettings'))resetSettings();
  });
  document.addEventListener('change',e=>{
    if(e.target && e.target.id==='legalDocumentSelect'){
      selectedLegalDocument=['imprint','privacy','agbs'].includes(e.target.value)?e.target.value:'imprint';
      const mount=$('#legalDocumentMount',els.appContent);
      if(mount)mount.innerHTML=renderLegalDocument(selectedLegalDocument);
      els.appContent.scrollTop=0;
    }
  });

  // Pull down from the top edge to open the quick settings; swipe up to dismiss.
  let gestureStart=null;
  els.screen.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    const rect=els.screen.getBoundingClientRect();
    gestureStart={y:e.clientY,x:e.clientX,fromTop:e.clientY-rect.top<82,fromPanel:!els.panel.classList.contains('hidden')};
  },{passive:true});
  window.addEventListener('pointerup',e=>{
    if(!gestureStart)return;
    const dy=e.clientY-gestureStart.y,dx=e.clientX-gestureStart.x;
    if(Math.abs(dx)<90){
      if(gestureStart.fromTop&&dy>48){openControl();}
      else if(gestureStart.fromPanel&&dy<-48){els.panel.classList.add('hidden');}
    }
    gestureStart=null;
  },{passive:true});
  window.addEventListener('pointercancel',()=>{gestureStart=null;},{passive:true});

  applySettings();updateClock();setInterval(updateClock,15000);
})();
