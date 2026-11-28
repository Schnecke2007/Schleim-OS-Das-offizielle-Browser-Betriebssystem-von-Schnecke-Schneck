(() => {
  'use strict';

  const REPO_NAME = 'schleim-os-cloud';
  const MEDIA_ROOT = 'Foto- und Video-Cloud';
  const INDEX_PATH = '_metadata/media-index.json';
  const MAX_FILE_BYTES = 50 * 1024 * 1024;
  const MAX_IMAGE_EDGE = 2560;
  const WEBP_QUALITY = 0.9;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const state = {
    repository: null, items: [], indexSha: null, view: 'all', query: '',
    objectUrls: [], busy: false, backgroundBusy: false, migrating: false,
    cameraStream: null, cameraStarted: false,
    cameraRecorder: null, cameraChunks: [], cameraRecording: false,
    facingMode: 'environment', activeApp: null
  };

  const TEXT = {
    de: {
      notSignedIn: 'Bitte melde dich zuerst unter Einstellungen → Schleim-Konto an.',
      noRepo: 'Dein privater Foto- und Videospeicher ist noch nicht verknüpft.',
      link: 'Privaten Cloud-Speicher jetzt verknüpfen',
      linking: 'Privates Foto- und Video-Repository wird gesucht oder erstellt …',
      linked: 'Privater Foto- und Videospeicher ist verbunden.',
      repoPublic: 'Das Foto-Repository ist öffentlich. Aus Sicherheitsgründen wird es nicht verwendet.',
      empty: 'Noch keine Fotos oder Videos hochgeladen.',
      loadError: 'Die Mediathek konnte nicht geladen werden.',
      search: 'Intelligent suchen: Urlaub, Strand, 2026, Screenshot …',
      upload: 'Fotos und Videos auswählen',
      description: 'Beschreibung oder Stichwörter (optional)',
      uploadNow: 'Ausgewählte Medien hochladen',
      uploading: 'Upload läuft …',
      backgroundQueued: 'Upload wurde gestartet. Er läuft im Hintergrund weiter; du kannst diesen Tab schließen.',
      backgroundProgress: 'Hintergrund-Upload',
      backgroundComplete: 'Upload im Hintergrund abgeschlossen.',
      backgroundAlreadyRunning: 'Es läuft bereits ein Hintergrund-Upload. Warte, bis er abgeschlossen ist.',
      uploaded: 'Upload abgeschlossen.',
      tooLarge: 'Die Datei ist größer als 50 MiB. Bitte eine kleinere Datei auswählen.',
      unsupported: 'Nur Bild- und Videodateien werden unterstützt.',
      stats: 'Cloud-Speicher',
      photos: 'Fotos',
      videos: 'Videos',
      mediaSize: 'Belegte Mediendaten',
      repoSize: 'GitHub-Repository insgesamt',
      all: 'Alle',
      photoFilter: 'Fotos',
      videoFilter: 'Videos',
      open: 'Ansehen',
      download: 'Herunterladen',
      remove: 'Aus Mediathek entfernen',
      removeConfirm: 'Medium aus der aktuellen Mediathek entfernen? GitHub behält ältere Dateiversionen in der Repository-Historie.',
      removed: 'Medium aus der aktuellen Mediathek entfernt.',
      localSearchNote: 'Die Suche funktioniert ohne API-Schlüssel. Auf unterstützten Chrome-Desktopgeräten kann Gemini Nano Fotos direkt auf dem Gerät beschreiben und Suchbegriffe erweitern. Auf anderen Geräten nutzt sie Dateinamen, Datum, Beschreibungen, Stichwörter und Synonyme.',
      cameraHint: 'Nutze die Vorder- oder Rückkamera. Aufnahmen werden direkt in deine private Foto- und Video-Cloud geladen.',
      startCamera: 'Kamera starten',
      stopCamera: 'Kamera deaktivieren',
      switchCamera: 'Kamera wechseln',
      takePhoto: 'Foto aufnehmen',
      record: 'Video aufnehmen',
      stopRecord: 'Aufnahme beenden',
      cameraUnavailable: 'Kamera wird von diesem Browser oder Gerät nicht unterstützt.',
      cameraDenied: 'Kamerazugriff wurde verweigert. Prüfe die Browser-Berechtigungen für diese Website oder Erweiterung.',
      androidCameraUnsupported: 'Foto- und Videoaufnahmen werden in der Android-Anwendung nicht unterstützt. Die Kamerafunktion ist dort deaktiviert.',
      cameraStartHint: 'Tippe auf „Kamera starten“, um den Kamerazugriff freizugeben.',
      cameraMissing: 'Keine Kamera erkannt. Prüfe, ob dein Gerät eine Kamera besitzt und ob sie nicht von einer anderen Anwendung verwendet wird.',
      cameraBusy: 'Die Kamera ist gerade nicht verfügbar. Schließe andere Apps, die die Kamera verwenden, und versuche es erneut.',
      cameraSecureContext: 'Der Kamerazugriff ist in diesem Browser-Kontext nicht verfügbar. Verwende die Original-Extension in einem Browser mit sicherem Kamerazugriff (HTTPS oder Erweiterungsseite).',
      cameraReady: 'Webkamera bereit. Wähle Foto oder Video.',
      cameraOpening: 'Webkamera wird geöffnet …',
      recording: 'Videoaufnahme läuft …',
      recordingDone: 'Videoaufnahme beendet. Upload wird vorbereitet …',
      selectFiles: 'Wähle zuerst mindestens eine Datei aus.',
      noMedia: 'Keine passenden Medien gefunden.',
      backCamera: 'Rückkamera',
      frontCamera: 'Frontkamera',
      settingsTitle: 'Schleim OS Foto Video Cloud Speicher',
      unlinked: 'Noch nicht verknüpft',
      connectedTo: 'Verbunden mit',
      connectHint: 'Bei älteren Schleim-OS-Versionen wird dieses zweite private Repository noch nicht automatisch angelegt. Verknüpfe es einmalig hier.',
      accountRequired: 'Für die Verknüpfung ist ein angemeldetes Schleim-Konto erforderlich.',
      originalLimit: 'Upload-Limit: 50 MiB pro Datei. Deine Medien liegen im privaten Schleim-Cloud-Repository unter Foto- und Video-Cloud. GitHub ist ein versionsbasiertes Repository und kein unbegrenzter Medien- oder Backup-Dienst.',
      migrationInfo: 'Ein bisheriger separater Medien-Speicher wurde gefunden. Alle Originaldateien, Vorschaubilder und Metadaten können in das gemeinsame Schleim-Cloud-Repository kopiert und geprüft werden.',
      migrationButton: 'Alte Mediathek in Schleim-Cloud übernehmen',
      migrationProgress: 'Mediathek wird geprüft und übertragen',
      migrationDone: 'Alle Dateien wurden übertragen und anhand ihrer Git-Datei-Prüfsummen geprüft. Das alte Repository bleibt vorerst als Sicherheitskopie erhalten.',
      migrationConflict: 'Eine Datei mit abweichendem Inhalt liegt bereits im Ziel. Es wurde nichts überschrieben; der Vorgang kann nach Klärung erneut gestartet werden.',
      migrationMissing: 'Das bisherige Foto-/Video-Repository wurde nicht gefunden.',
      migrationArchive: 'Die Übernahme ist bereits abgeschlossen. Das frühere Repository wird nicht mehr für neue Uploads verwendet; es bleibt als Sicherheitskopie bestehen.',
      noCapture: 'Kameraansicht nicht verfügbar. Starte die Webkamera erneut.'
    },
    en: {
      notSignedIn: 'Sign in first under Settings → Schleim account.',
      noRepo: 'Your private photo and video storage is not linked yet.',
      link: 'Link private cloud storage now',
      linking: 'Checking or creating the private photo and video repository …',
      linked: 'Private photo and video storage is connected.',
      repoPublic: 'The photo repository is public. It will not be used for security reasons.',
      empty: 'No photos or videos uploaded yet.',
      loadError: 'The media library could not be loaded.',
      search: 'Smart search: travel, beach, 2026, screenshot …',
      upload: 'Choose photos and videos',
      description: 'Description or tags (optional)',
      uploadNow: 'Upload selected media',
      uploading: 'Uploading …',
      backgroundQueued: 'Upload started. It will continue in the background; you can close this tab.',
      backgroundProgress: 'Background upload',
      backgroundComplete: 'Background upload completed.',
      backgroundAlreadyRunning: 'A background upload is already running. Wait until it has finished.',
      uploaded: 'Upload completed.',
      tooLarge: 'The file is larger than 50 MiB. Choose a smaller file.',
      unsupported: 'Only image and video files are supported.',
      stats: 'Cloud storage',
      photos: 'Photos',
      videos: 'Videos',
      mediaSize: 'Stored media data',
      repoSize: 'Total GitHub repository',
      all: 'All',
      photoFilter: 'Photos',
      videoFilter: 'Videos',
      open: 'View',
      download: 'Download',
      remove: 'Remove from library',
      removeConfirm: 'Remove this item from the current library? GitHub keeps previous file versions in the repository history.',
      removed: 'Item removed from the current library.',
      localSearchNote: 'Search works without an API key. On supported Chrome desktop devices, Gemini Nano can describe photos on-device and expand search terms. Other devices use filenames, dates, descriptions, tags and synonyms.',
      cameraHint: 'Use the front or rear camera. Captures are uploaded directly to your private photo and video cloud.',
      startCamera: 'Start camera',
      stopCamera: 'Turn camera off',
      switchCamera: 'Switch camera',
      takePhoto: 'Take photo',
      record: 'Record video',
      stopRecord: 'Stop recording',
      cameraUnavailable: 'Camera access is not supported by this browser or device.',
      cameraDenied: 'Camera access was denied. Check this website or extension’s camera permission in your browser.',
      androidCameraUnsupported: 'Photo and video capture are not supported in the Android application. The camera feature is disabled there.',
      cameraStartHint: 'Tap “Start camera” to request camera access.',
      cameraMissing: 'No camera detected. Check that the device has a camera and that another application is not using it.',
      cameraBusy: 'The camera is currently unavailable. Close other apps using the camera and try again.',
      cameraSecureContext: 'Camera access is unavailable in this browser context. Use the original extension in a browser that supports camera access in a secure context (HTTPS or an extension page).',
      cameraReady: 'Webcam ready. Choose photo or video.',
      cameraOpening: 'Opening webcam …',
      recording: 'Video recording is in progress …',
      recordingDone: 'Recording finished. Preparing upload …',
      selectFiles: 'Choose at least one file first.',
      noMedia: 'No matching media found.',
      backCamera: 'Rear camera',
      frontCamera: 'Front camera',
      settingsTitle: 'Schleim OS Photo Video Cloud Storage',
      unlinked: 'Not linked yet',
      connectedTo: 'Connected to',
      connectHint: 'Older Schleim OS versions do not create this second private repository automatically. Link it here once.',
      accountRequired: 'A signed-in Schleim account is required.',
      originalLimit: 'Upload limit: 50 MiB per file. Media is stored in the private Schleim cloud repository under Foto- und Video-Cloud. GitHub is a version-controlled repository, not an unlimited media or backup service.',
      migrationInfo: 'A separate legacy media repository was found. All original files, thumbnails and metadata can be copied and verified in the unified Schleim cloud repository.',
      migrationButton: 'Move existing media library into Schleim Cloud',
      migrationProgress: 'Checking and transferring the media library',
      migrationDone: 'All files were transferred and verified using their Git blob checksums. The old repository is retained as a safety copy for now.',
      migrationConflict: 'A target file with different content already exists. Nothing was overwritten; resolve the conflict before retrying.',
      migrationMissing: 'The previous photo and video repository was not found.',
      migrationArchive: 'The migration is complete. The previous repository is no longer used for new uploads and is retained as a safety copy.',
      noCapture: 'Camera view unavailable. Start the webcam again.'
    },
    nl: {
      notSignedIn: 'Meld je eerst aan via Instellingen → Schleim-account.',
      noRepo: 'Je privéopslag voor foto’s en video’s is nog niet gekoppeld.',
      link: 'Privécloudopslag nu koppelen',
      linking: 'Privérepository voor foto’s en video’s controleren of aanmaken …',
      linked: 'Privéopslag voor foto’s en video’s is verbonden.',
      repoPublic: 'De fotorepository is openbaar. Om veiligheidsredenen wordt deze niet gebruikt.',
      empty: 'Er zijn nog geen foto’s of video’s geüpload.',
      loadError: 'De mediabibliotheek kon niet worden geladen.',
      search: 'Slim zoeken: vakantie, strand, 2026, screenshot …',
      upload: 'Foto’s en video’s kiezen',
      description: 'Beschrijving of tags (optioneel)',
      uploadNow: 'Geselecteerde media uploaden',
      uploading: 'Uploaden …',
      backgroundQueued: 'Upload gestart. Het gaat op de achtergrond verder; je kunt dit tabblad sluiten.',
      backgroundProgress: 'Upload op de achtergrond',
      backgroundComplete: 'Upload op de achtergrond voltooid.',
      backgroundAlreadyRunning: 'Er loopt al een upload op de achtergrond. Wacht tot deze is voltooid.',
      uploaded: 'Upload voltooid.',
      tooLarge: 'Het bestand is groter dan 50 MiB. Kies een kleiner bestand.',
      unsupported: 'Alleen afbeeldings- en videobestanden worden ondersteund.',
      stats: 'Cloudopslag',
      photos: 'Foto’s',
      videos: 'Video’s',
      mediaSize: 'Opgeslagen mediagegevens',
      repoSize: 'Totale GitHub-repository',
      all: 'Alles',
      photoFilter: 'Foto’s',
      videoFilter: 'Video’s',
      open: 'Bekijken',
      download: 'Downloaden',
      remove: 'Uit bibliotheek verwijderen',
      removeConfirm: 'Dit item uit de huidige bibliotheek verwijderen? GitHub bewaart oudere bestandsversies in de repositorygeschiedenis.',
      removed: 'Item uit de huidige bibliotheek verwijderd.',
      localSearchNote: 'Zoeken werkt zonder API-sleutel. Op ondersteunde Chrome-desktopapparaten kan Gemini Nano foto’s lokaal beschrijven en zoektermen uitbreiden. Andere apparaten gebruiken bestandsnamen, datums, beschrijvingen, tags en synoniemen.',
      cameraHint: 'Gebruik de voor- of achtercamera. Opnamen worden direct naar je privéfoto- en videocloud geüpload.',
      startCamera: 'Camera starten',
      stopCamera: 'Camera uitschakelen',
      switchCamera: 'Camera wisselen',
      takePhoto: 'Foto maken',
      record: 'Video opnemen',
      stopRecord: 'Opname stoppen',
      cameraUnavailable: 'Cameratoegang wordt niet ondersteund door deze browser of dit apparaat.',
      cameraDenied: 'Cameratoegang is geweigerd. Controleer de cameratoestemming voor deze website of extensie in je browser.',
      androidCameraUnsupported: 'Foto- en video-opnamen worden niet ondersteund in de Android-app. De camerafunctie is daar uitgeschakeld.',
      cameraStartHint: 'Tik op “Camera starten” om cameratoegang aan te vragen.',
      cameraMissing: 'Geen camera gevonden. Controleer of het apparaat een camera heeft en of een andere app deze niet gebruikt.',
      cameraBusy: 'De camera is momenteel niet beschikbaar. Sluit andere apps die de camera gebruiken en probeer het opnieuw.',
      cameraSecureContext: 'Cameratoegang is niet beschikbaar in deze browsercontext. Gebruik de originele extensie in een browser met cameraondersteuning in een beveiligde context (HTTPS of een extensiepagina).',
      cameraReady: 'Webcamera gereed. Kies foto of video.',
      cameraOpening: 'Webcamera wordt geopend …',
      recording: 'Video-opname bezig …',
      recordingDone: 'Opname voltooid. Upload wordt voorbereid …',
      selectFiles: 'Kies eerst ten minste één bestand.',
      noMedia: 'Geen overeenkomende media gevonden.',
      backCamera: 'Achtercamera',
      frontCamera: 'Frontcamera',
      settingsTitle: 'Schleim OS Foto Video Cloud-opslag',
      unlinked: 'Nog niet gekoppeld',
      connectedTo: 'Verbonden met',
      connectHint: 'Oudere Schleim OS-versies maken deze tweede privérepository nog niet automatisch aan. Koppel deze hier eenmalig.',
      accountRequired: 'Een aangemeld Schleim-account is vereist.',
      originalLimit: 'Uploadlimiet: 50 MiB per bestand. Media wordt opgeslagen in de privé-Schleim-cloudrepository onder Foto- und Video-Cloud. GitHub is een repository met versiebeheer en geen onbeperkte media- of back-updienst.',
      migrationInfo: 'Er is een aparte oude mediarepository gevonden. Alle originele bestanden, miniaturen en metadata kunnen worden gekopieerd en gecontroleerd in de gezamenlijke Schleim-cloudrepository.',
      migrationButton: 'Bestaande mediabibliotheek naar Schleim Cloud verplaatsen',
      migrationProgress: 'Mediabibliotheek controleren en overzetten',
      migrationDone: 'Alle bestanden zijn overgezet en gecontroleerd met hun Git blob-controlesommen. De oude repository blijft voorlopig als reservekopie bestaan.',
      migrationConflict: 'Er bestaat al een doelbestand met andere inhoud. Er is niets overschreven; los het conflict op voordat je opnieuw probeert.',
      migrationMissing: 'De vorige foto- en videorepository is niet gevonden.',
      migrationArchive: 'De migratie is voltooid. De vorige repository wordt niet meer gebruikt voor nieuwe uploads en blijft als reservekopie bestaan.',
      noCapture: 'Cameraweergave niet beschikbaar. Start die webcamera opnieuw.'
    }
  };

  const lang = () => document.body?.dataset.language || 'de';
  const t = key => TEXT[lang()]?.[key] || TEXT.de[key] || key;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const account = () => window.SSOSCloudAccount;
  const encodePath = value => String(value).split('/').map(encodeURIComponent).join('/');
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

  function formatBytes(bytes) {
    const size = Math.max(0, Number(bytes) || 0);
    if (size >= 1024 ** 3) return (size / (1024 ** 3)).toFixed(2) + ' GB';
    if (size >= 1024 ** 2) return (size / (1024 ** 2)).toFixed(2) + ' MB';
    if (size >= 1024) return (size / 1024).toFixed(1) + ' KB';
    return size + ' B';
  }
  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(lang() === 'en' ? 'en-GB' : lang() === 'nl' ? 'nl-NL' : 'de-DE', {dateStyle:'medium',timeStyle:'short'});
  }
  function cleanupUrls() {
    state.objectUrls.forEach(url => { try { URL.revokeObjectURL(url); } catch {} });
    state.objectUrls = [];
  }
  function accountReady() {
    return !!account()?.getState?.().authenticated;
  }
  function isAndroidGeckoView() {
    try {
      const runtime=globalThis.browser?.runtime||globalThis.chrome?.runtime;
      return runtime?.getManifest?.()?.browser_specific_settings?.gecko?.id==='schleim-os-android@schneckeschneck.de';
    } catch { return false; }
  }
  function setStatus(selector, message, isError = false) {
    $$(selector).forEach(node => {
      node.textContent = message || '';
      node.classList.toggle('is-error', !!isError);
    });
  }
  function makeStats(items) {
    return {
      photos: items.filter(item => item.type === 'photo').length,
      videos: items.filter(item => item.type === 'video').length,
      bytes: items.reduce((sum, item) => sum + (Number(item.size) || 0), 0)
    };
  }
  function bytesFromRepo(repo) {
    return Math.max(0, Number(repo?.size) || 0) * 1024;
  }
  function renderStats(host, items, repo) {
    if (!host) return;
    const stats = makeStats(items);
    host.innerHTML =
      '<div class="ssos-photos-stat"><small>' + esc(t('photos')) + '</small><b>' + stats.photos + '</b></div>' +
      '<div class="ssos-photos-stat"><small>' + esc(t('videos')) + '</small><b>' + stats.videos + '</b></div>' +
      '<div class="ssos-photos-stat"><small>' + esc(t('mediaSize')) + '</small><b>' + esc(formatBytes(stats.bytes)) + '</b><em>' + esc((stats.bytes / (1024 ** 3)).toFixed(3)) + ' GB</em></div>' +
      '<div class="ssos-photos-stat"><small>' + esc(t('repoSize')) + '</small><b>' + esc(formatBytes(bytesFromRepo(repo))) + '</b></div>';
  }

  async function getIndex() {
    let file;
    try {
      file = await account().requestPhotosRepository('/contents/' + encodePath(INDEX_PATH));
    } catch (error) {
      if (error.status === 404) return {items:[], sha:null};
      throw error;
    }
    let parsed;
    try {
      const binary = atob(String(file.content || '').replace(/\s/g, ''));
      const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      parsed = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new Error('Die Medien-Metadaten sind beschädigt oder nicht lesbar.');
    }
    if (parsed?.format !== 'schleim-os-media-index' || Number(parsed.owner?.id) !== Number(account().getAccount()?.id)) {
      throw new Error('Die Medien-Metadaten sind ungültig oder gehören zu einem anderen Schleim-Konto.');
    }
    return {items:Array.isArray(parsed.items) ? parsed.items : [], sha:file.sha || null};
  }

  function encodeBase64(bytes) {
    let binary = '';
    const chunk = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunk) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
    }
    return btoa(binary);
  }
  async function blobToBase64(blob) {
    return encodeBase64(new Uint8Array(await blob.arrayBuffer()));
  }
  async function putFile(path, blob, message) {
    if (blob.size > MAX_FILE_BYTES) throw new Error(t('tooLarge'));
    const payload = {
      message:message || 'Upload media to Schleim OS cloud',
      content:await blobToBase64(blob),
      branch:state.repository?.default_branch || 'main'
    };
    const result = await account().requestPhotosRepository('/contents/' + encodePath(path), {
      method:'PUT', body:JSON.stringify(payload)
    });
    return result?.content || {};
  }
  async function updateIndex(items) {
    const existing = await getIndex();
    const owner = account().getAccount();
    const index = {
      format:'schleim-os-media-index',
      schemaVersion:1,
      owner:{id:owner.id,login:owner.login},
      updatedAt:new Date().toISOString(),
      items:items
    };
    const payload = {
      message:'Update Schleim OS media library index',
      content:await blobToBase64(new Blob([JSON.stringify(index,null,2) + '\n'], {type:'application/json'})),
      branch:state.repository?.default_branch || 'main',
      ...(existing.sha ? {sha:existing.sha} : {})
    };
    await account().requestPhotosRepository('/contents/' + encodePath(INDEX_PATH), {
      method:'PUT', body:JSON.stringify(payload)
    });
  }
  async function getThumbnail(file) {
    if (!file.type?.startsWith('image/') || typeof createImageBitmap !== 'function') return null;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 420 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.72));
  }
  function readAscii(bytes, offset) {
    return String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
  }
  function readUint32BE(bytes, offset) {
    return bytes[offset] * 0x1000000 + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
  }
  function readUint32LE(bytes, offset) {
    return bytes[offset] + (bytes[offset + 1] << 8) + (bytes[offset + 2] << 16) + bytes[offset + 3] * 0x1000000;
  }
  async function isAnimatedImage(file) {
    const type = String(file.type || '').toLowerCase();
    if (type === 'image/gif' || type === 'image/svg+xml') return true;
    if (type !== 'image/png' && type !== 'image/webp') return false;
    try {
      const bytes = new Uint8Array(await file.slice(0, 4 * 1024 * 1024).arrayBuffer());
      if (type === 'image/png') {
        if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) return true;
        let offset = 8;
        while (offset + 12 <= bytes.length) {
          const length = readUint32BE(bytes, offset);
          const chunk = readAscii(bytes, offset + 4);
          if (chunk === 'acTL') return true;
          if (chunk === 'IDAT' || chunk === 'IEND') return false;
          if (offset + 12 + length > bytes.length) return true;
          offset += 12 + length;
        }
        return true;
      }
      if (readAscii(bytes, 8) !== 'WEBP') return true;
      let offset = 12;
      while (offset + 8 <= bytes.length) {
        const chunk = readAscii(bytes, offset);
        const length = readUint32LE(bytes, offset + 4);
        if (chunk === 'ANIM' || chunk === 'ANMF') return true;
        if (chunk === 'VP8 ' || chunk === 'VP8L') return false;
        if (offset + 8 + length > bytes.length) return true;
        offset += 8 + length + (length % 2);
      }
    } catch {
      return true;
    }
    return true;
  }
  async function optimizePhoto(file) {
    const unchanged = {blob:file,optimized:false,width:0,height:0,originalSize:file.size};
    if (!file?.type?.startsWith('image/') || typeof createImageBitmap !== 'function') return unchanged;
    if (await isAnimatedImage(file)) return unchanged;
    let bitmap;
    try {
      bitmap = await createImageBitmap(file, {imageOrientation:'from-image'});
    } catch {
      return unchanged;
    }
    try {
      if (!bitmap.width || !bitmap.height) return unchanged;
      const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return unchanged;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(bitmap, 0, 0, width, height);
      const compressed = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY));
      if (!compressed || compressed.type !== 'image/webp' || compressed.size >= file.size) return unchanged;
      return {
        blob:compressed,
        optimized:true,
        width:width,
        height:height,
        originalSize:file.size
      };
    } catch (error) {
      console.warn('[Schleim OS Photos] Image optimization skipped:', error);
      return unchanged;
    } finally {
      bitmap.close?.();
    }
  }
  function extensionFor(file) {
    const named = String(file.name || '').match(/\.([a-z0-9]{1,8})$/i)?.[1]?.toLowerCase();
    if (named) return named;
    const mime = String(file.type || '').toLowerCase();
    const known = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/heic':'heic','video/mp4':'mp4','video/webm':'webm','video/quicktime':'mov'};
    return known[mime] || (mime.startsWith('video/') ? 'mp4' : 'jpg');
  }
  function safeBaseName(value) {
    return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40) || 'Medium';
  }
  // Read the EXIF DateTimeOriginal tag (0x9003) when a JPEG contains it.
  async function getCaptureDate(file) {
    const fallback = new Date(file.lastModified || Date.now());
    if (!/^image\/(jpeg|jpg)$/i.test(file.type || '')) return {date:fallback,source:'file-last-modified'};
    try {
      const buffer = await file.slice(0, 4 * 1024 * 1024).arrayBuffer();
      const view = new DataView(buffer);
      let offset = 2;
      while (offset + 4 < view.byteLength && view.getUint8(offset) === 0xff) {
        const marker = view.getUint8(offset + 1);
        const length = view.getUint16(offset + 2, false);
        const payload = offset + 4;
        if (length < 2 || payload + length - 2 > view.byteLength) break;
        if (marker === 0xe1 && view.getUint8(payload) === 0x45 && view.getUint8(payload + 1) === 0x78 &&
            view.getUint8(payload + 2) === 0x69 && view.getUint8(payload + 3) === 0x66 &&
            view.getUint8(payload + 4) === 0 && view.getUint8(payload + 5) === 0) {
          const tiff = payload + 6;
          const little = view.getUint8(tiff) === 0x49 && view.getUint8(tiff + 1) === 0x49;
          const u16 = position => view.getUint16(position, little);
          const u32 = position => view.getUint32(position, little);
          const readTag = (ifdOffset, tagId) => {
            const directory = tiff + ifdOffset;
            if (directory + 2 > view.byteLength) return null;
            const count = u16(directory);
            for (let i = 0; i < count; i++) {
              const entry = directory + 2 + i * 12;
              if (entry + 12 > view.byteLength) break;
              if (u16(entry) !== tagId) continue;
              const type = u16(entry + 2), size = u32(entry + 4);
              if (type === 4) return u32(entry + 8);
              if (type !== 2 || !size || size > 64) return null;
              const valueAt = size <= 4 ? entry + 8 : tiff + u32(entry + 8);
              if (valueAt + size > view.byteLength) return null;
              let value = '';
              for (let j = 0; j < size && view.getUint8(valueAt + j); j++) value += String.fromCharCode(view.getUint8(valueAt + j));
              return value;
            }
            return null;
          };
          if (u16(tiff + 2) !== 42) return {date:fallback,source:'file-last-modified'};
          const ifd0 = u32(tiff + 4);
          const exifPointer = readTag(ifd0, 0x8769);
          if (typeof exifPointer === 'number') {
            const original = readTag(exifPointer, 0x9003) || readTag(exifPointer, 0x9004);
            const match = String(original || '').match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
            if (match) {
              const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6]));
              if (!Number.isNaN(date.getTime())) return {date,source:'exif'};
            }
          }
          break;
        }
        offset = payload + length - 2;
      }
    } catch {}
    return {date:fallback,source:'file-last-modified'};
  }
  async function uploadOne(file, description) {
    if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) throw new Error(t('unsupported'));
    if (file.size > MAX_FILE_BYTES) throw new Error(t('tooLarge'));
    const captureInfo = await getCaptureDate(file);
    const capturedAt = captureInfo.date;
    const year = String(capturedAt.getFullYear());
    const month = String(capturedAt.getMonth() + 1).padStart(2,'0');
    const day = String(capturedAt.getDate()).padStart(2,'0');
    const stamp = capturedAt.getTime().toString(36);
    const id = (crypto.randomUUID?.() || (stamp + '-' + Math.random().toString(36).slice(2,10))).replace(/[^a-zA-Z0-9-]/g,'');
    const type = file.type.startsWith('video/') ? 'video' : 'photo';
    let aiResult = null;
    if (type === 'photo' && window.SSOSPhotoAI?.isReady?.()) {
      try { aiResult = await window.SSOSPhotoAI.describeImage(file); }
      catch (error) { console.warn('[Schleim OS Photos] Local AI description skipped:', error); }
    }
    const optimization = type === 'photo'
      ? await optimizePhoto(file)
      : {blob:file,optimized:false,width:0,height:0,originalSize:file.size};
    const uploadBlob = optimization.blob;
    const originalName = String(file.name || '');
    const extension = optimization.optimized ? 'webp' : extensionFor(file);
    const filename = day + '-' + month + '-' + year + '-' + id + '.' + extension;
    const downloadName = optimization.optimized
      ? (originalName.replace(/\.[^.]+$/, '') || safeBaseName(filename.replace(/\.[^.]+$/, ''))) + '.webp'
      : (originalName || filename);
    const folder = type === 'video' ? 'Videos' : 'Fotos';
    const path = folder + '/' + year + '/' + year + '-' + month + '/' + filename;
    const fileSha = await putFile(path, uploadBlob, 'Upload ' + (type === 'video' ? 'video' : 'photo') + ' to Schleim OS cloud');
    let thumbnailPath = '';
    if (type === 'photo') {
      try {
        const thumb = await getThumbnail(uploadBlob);
        if (thumb) {
          thumbnailPath = 'Vorschaubilder/' + year + '/' + year + '-' + month + '/' + id + '.jpg';
          await putFile(thumbnailPath, thumb, 'Create Schleim OS media thumbnail');
        }
      } catch (error) {
        console.warn('[Schleim OS Photos] Thumbnail skipped:', error);
      }
    }
    const aiDescription = String(aiResult?.description || '').slice(0,260);
    const aiTags = Array.isArray(aiResult?.keywords) ? aiResult.keywords : [];
    const combinedDescription = [String(description || '').trim(), aiDescription].filter(Boolean).join(' · ').slice(0,500);
    const tags = [...new Set([
      ...String(description || '').toLowerCase().split(/[ ,\s]+/).filter(Boolean),
      ...aiTags.map(value => String(value).toLowerCase())
    ])].slice(0,40);
    const item = {
      id:id, name:originalName || filename, downloadName:downloadName,
      type:type, mimeType:uploadBlob.type || file.type || (type === 'video' ? 'video/mp4' : 'image/jpeg'),
      size:uploadBlob.size, originalSize:file.size, optimized:optimization.optimized,
      width:optimization.width || 0, height:optimization.height || 0,
      capturedAt:capturedAt.toISOString(), dateSource:captureInfo.source,
      uploadedAt:new Date().toISOString(), path:path, sha:fileSha.sha || '',
      thumbnailPath:thumbnailPath, description:combinedDescription, aiDescription:aiDescription,
      aiTags:aiTags, tags:tags
    };
    state.items.unshift(item);
    await updateIndex(state.items);
    return item;
  }
  const UPLOAD_DB_NAME = 'ssos-media-upload-queue';
  const UPLOAD_DB_VERSION = 1;
  function openUploadDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(UPLOAD_DB_NAME, UPLOAD_DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('jobs')) request.result.createObjectStore('jobs', {keyPath:'id'});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Upload-Warteschlange ist nicht verfügbar.'));
    });
  }
  async function saveUploadJob(job) {
    const db = await openUploadDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('jobs','readwrite');
      tx.objectStore('jobs').put(job);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error('Upload konnte nicht für den Hintergrund gespeichert werden.')); };
      tx.onabort = () => { db.close(); reject(tx.error || new Error('Speichern der Upload-Warteschlange wurde abgebrochen.')); };
    });
  }
  async function deleteUploadJob(jobId) {
    const db = await openUploadDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('jobs','readwrite');
      tx.objectStore('jobs').delete(jobId);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }
  async function uploadFiles(files, description, statusSelector) {
    if (state.busy) return;
    if (state.backgroundBusy) throw new Error(t('backgroundAlreadyRunning'));
    if (!files?.length) throw new Error(t('selectFiles'));
    if (!accountReady()) throw new Error(t('notSignedIn'));
    if (!state.repository) state.repository = await account().getPhotosRepository();
    if (!state.repository?.private) throw new Error(t('noRepo'));
    const target = statusSelector || '[data-photos-status]';
    if (isAndroidGeckoView()) {
      state.busy = true;
      let completed = 0;
      try {
        for (const file of files) {
          setStatus(target,t('uploading')+' ('+(completed+1)+'/'+files.length+')');
          await uploadOne(file,description);
          completed += 1;
        }
        await refreshMediaApp();
        setStatus(target,t('uploaded'));
      } catch (error) {
        if (completed > 0) await refreshMediaApp().catch(() => {});
        throw error;
      } finally {
        state.busy = false;
      }
      return;
    }
    const currentUpload = await chrome.storage.local.get('ssos-media-upload-status');
    if (currentUpload?.['ssos-media-upload-status']?.phase === 'progress') {
      state.backgroundBusy = true;
      throw new Error(t('backgroundAlreadyRunning'));
    }
    state.busy = true;
    try {
      const queuedFiles = [];
      for (const file of files) {
        if (!file?.type?.startsWith('image/') && !file?.type?.startsWith('video/')) throw new Error(t('unsupported'));
        const captureInfo = file.type.startsWith('image/') ? await getCaptureDate(file) : {date:new Date(file.lastModified || Date.now()),source:'file-last-modified'};
        let aiResult = null;
        if (file.type.startsWith('image/') && window.SSOSPhotoAI?.isReady?.()) {
          try { aiResult = await window.SSOSPhotoAI.describeImage(file); }
          catch (error) { console.warn('[Schleim OS Photos] Local AI description skipped:', error); }
        }
        queuedFiles.push({
          file:file,
          meta:{
            originalName:String(file.name || ''),
            description:String(description || ''),
            capturedAt:captureInfo.date.toISOString(),
            dateSource:captureInfo.source,
            aiDescription:String(aiResult?.description || '').slice(0,260),
            aiTags:Array.isArray(aiResult?.keywords) ? aiResult.keywords : []
          }
        });
      }
      const jobId = crypto.randomUUID?.() || (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,10));
      await saveUploadJob({id:jobId,createdAt:Date.now(),files:queuedFiles});
      let result;
      try {
        result = await chrome.runtime.sendMessage({type:'SSOS_MEDIA_UPLOAD_START',jobId:jobId});
      } catch (error) {
        await deleteUploadJob(jobId).catch(() => {});
        throw error;
      }
      if (!result?.ok) {
        await deleteUploadJob(jobId).catch(() => {});
        throw new Error(result?.error || 'Der Hintergrund-Upload konnte nicht gestartet werden.');
      }
      state.backgroundBusy = true;
      const uploadButton = $('[data-photos-upload]');
      if (uploadButton) uploadButton.disabled = true;
      setStatus(target,t('backgroundQueued'));
      const input = $('[data-photos-files]');
      if (input) input.value = '';
    } finally {
      state.busy = false;
    }
  }
  function displayBackgroundUploadStatus(status) {
    if (!status) return;
    state.backgroundBusy = status.phase === 'progress';
    const uploadButton = $('[data-photos-upload]');
    if (uploadButton) uploadButton.disabled = state.backgroundBusy || !($('[data-photos-files]')?.files?.length);
    const message = status.phase === 'complete'
      ? t('backgroundComplete')
      : status.phase === 'failed'
        ? (status.message || t('loadError'))
        : t('backgroundProgress') + ': ' + (status.progress || 0) + '% · ' + (status.filename || status.message || t('uploading'));
    setStatus('[data-photos-status]',message,status.phase === 'failed');
    if (status.phase === 'complete') {
      refreshMediaApp().then(() => setStatus('[data-photos-status]',t('backgroundComplete'))).catch(() => {});
    }
  }

  const SYNONYMS = {
    urlaub:['reise','ferien','trip','travel','vacation'], vacation:['urlaub','reise','ferien'],
    strand:['meer','beach','wasser','sand','küste'], beach:['strand','meer','sand','coast'],
    hund:['dog','tier','haustier','welpe'], dog:['hund','pet','puppy'],
    katze:['cat','tier','haustier'], cat:['katze','pet'],
    essen:['food','restaurant','mahlzeit'], food:['essen','mahlzeit','restaurant'],
    selfie:['portrait','gesicht','person'], portrait:['selfie','portraitfoto'],
    auto:['car','fahrzeug'], car:['auto','fahrzeug'],
    screenshot:['bildschirm','screen','capture'], screen:['bildschirm','screenshot'],
    video:['film','clip','aufnahme'], film:['video','clip'],
    foto:['bild','photo','picture'], photo:['foto','bild','picture'],
    sonnenuntergang:['abendrot','sunset'], sunset:['sonnenuntergang','abendrot'],
    berg:['mountain','gebirge','wandern'], mountain:['berg','gebirge'],
    schnee:['snow','winter'], snow:['schnee','winter'],
    geburtstag:['party','feier','kuchen'], party:['geburtstag','feier']
  };
  const SEARCH_STOP_WORDS = new Set(['am','an','auf','aus','bei','das','dem','den','der','des','die','ein','eine','einer','eines','im','in','mit','und','von','vom','zu','zum','zur','the','a','an','and','for','in','of','on','to','with','de','het','een','en','van','voor','op']);
  function searchItems(items, query, view) {
    const needle = String(query || '').toLocaleLowerCase(lang() === 'en' ? 'en' : lang() === 'nl' ? 'nl' : 'de').trim();
    const tokens = needle.split(/[\s,.;:!?]+/).filter(token => token && !SEARCH_STOP_WORDS.has(token));
    const groups = tokens.map(token => [token, ...(SYNONYMS[token] || [])]);
    const aiTerms = (window.SSOSPhotoAI?.getExpandedTerms?.() || []).map(value => String(value).toLowerCase()).filter(Boolean);
    return items.map(item => {
      if (view === 'photo' && item.type !== 'photo') return null;
      if (view === 'video' && item.type !== 'video') return null;
      const haystack = [
        item.name,item.description,item.aiDescription,(item.tags || []).join(' '),(item.aiTags || []).join(' '),item.path,item.type,
        item.mimeType,item.capturedAt,item.uploadedAt
      ].join(' ').toLocaleLowerCase();
      if (!groups.length && !aiTerms.length) return {item, score:0};
      const directMatches = groups.filter(group => group.some(term => haystack.includes(term))).length;
      const aiMatches = aiTerms.filter(term => haystack.includes(term)).length;
      const requiredMatches = groups.length <= 2 ? 1 : Math.max(1, Math.ceil(groups.length * 0.5));
      if (directMatches < requiredMatches && aiMatches === 0) return null;
      return {item, score:directMatches * 4 + aiMatches};
    }).filter(Boolean).sort((a,b) => b.score - a.score || String(b.item.capturedAt).localeCompare(String(a.item.capturedAt))).map(entry => entry.item);
  }
  function renderGallery() {
    const host = $('[data-photos-gallery]');
    if (!host) return;
    cleanupUrls();
    const items = searchItems(state.items, state.query, state.view);
    if (!items.length) {
      host.innerHTML = '<div class="ssos-photos-empty"><span>🗂️</span><b>' + esc(state.query ? t('noMedia') : t('empty')) + '</b></div>';
      return;
    }
    host.innerHTML = '<div class="ssos-photos-grid">' + items.map(item => {
      const visual = item.type === 'photo'
        ? '<div class="ssos-photos-thumb" data-photo-thumb="' + esc(item.id) + '"><span>🖼️</span></div>'
        : '<div class="ssos-photos-thumb ssos-photos-video"><span>▶</span><small>VIDEO</small></div>';
      return '<article class="ssos-photos-item">' +
        '<button type="button" class="ssos-photos-preview" data-photo-open="' + esc(item.id) + '" aria-label="' + esc(t('open')) + '">' + visual + '</button>' +
        '<div class="ssos-photos-item-copy"><b>' + esc(item.name) + '</b><small>' + esc(formatDate(item.capturedAt)) + ' · ' + esc(formatBytes(item.size)) + '</small>' +
        (item.description ? '<small>' + esc(item.description) + '</small>' : '') +
        '<div class="ssos-photos-item-actions"><button type="button" data-photo-download="' + esc(item.id) + '">' + esc(t('download')) + '</button><button type="button" data-photo-delete="' + esc(item.id) + '">' + esc(t('remove')) + '</button></div></div></article>';
    }).join('') + '</div>';
    loadThumbnails(items);
  }
  async function loadThumbnails(items) {
    const imageItems = items.filter(item => item.type === 'photo' && item.thumbnailPath).slice(0,36);
    for (const item of imageItems) {
      const target = $('[data-photo-thumb="' + CSS.escape(item.id) + '"]');
      if (!target || target.querySelector('img')) continue;
      try {
        const blob = await account().requestPhotosRepository('/contents/' + encodePath(item.thumbnailPath), {
          headers:{Accept:'application/vnd.github.raw'}, responseType:'blob'
        });
        const url = URL.createObjectURL(blob);
        state.objectUrls.push(url);
        target.innerHTML = '<img loading="lazy" src="' + url + '" alt="' + esc(item.name) + '">';
      } catch (error) {
        console.warn('[Schleim OS Photos] Thumbnail unavailable:', error);
      }
    }
  }
  async function readOriginal(item) {
    const blob = await account().requestPhotosRepository('/contents/' + encodePath(item.path), {
      headers:{Accept:'application/vnd.github.raw'}, responseType:'blob'
    });
    const url = URL.createObjectURL(blob);
    state.objectUrls.push(url);
    return url;
  }
  async function openMedia(id, downloadOnly = false) {
    const item = state.items.find(record => record.id === id);
    if (!item) return;
    setStatus('[data-photos-status]', t('uploading'));
    try {
      const url = await readOriginal(item);
      if (downloadOnly) {
        const anchor = document.createElement('a');
        anchor.href = url;anchor.download = item.downloadName || item.name || ('schleim-os-media.' + extensionFor({name:item.path}));
        document.body.appendChild(anchor);anchor.click();anchor.remove();
      } else {
        const viewer = $('[data-photos-viewer]');
        if (viewer) {
          const media = item.type === 'video'
            ? '<video controls autoplay playsinline src="' + url + '"></video>'
            : '<img src="' + url + '" alt="' + esc(item.name) + '">';
          viewer.innerHTML = '<div class="ssos-photos-viewer-panel"><button type="button" data-photo-close aria-label="Close">×</button>' + media + '<small>' + esc(item.name) + '</small></div>';
          viewer.hidden = false;
        }
      }
      setStatus('[data-photos-status]', '');
    } catch (error) {
      setStatus('[data-photos-status]', error.message || t('loadError'), true);
    }
  }
  async function removeMedia(id) {
    const item = state.items.find(record => record.id === id);
    if (!item || !confirm(t('removeConfirm'))) return;
    try {
      await account().requestPhotosRepository('/contents/' + encodePath(item.path), {
        method:'DELETE',
        body:JSON.stringify({message:'Remove media from Schleim OS active library',sha:item.sha,branch:state.repository?.default_branch || 'main'})
      });
      if (item.thumbnailPath) {
        try {
          const thumb = await account().requestPhotosRepository('/contents/' + encodePath(item.thumbnailPath));
          await account().requestPhotosRepository('/contents/' + encodePath(item.thumbnailPath), {
            method:'DELETE',
            body:JSON.stringify({message:'Remove Schleim OS thumbnail',sha:thumb.sha,branch:state.repository?.default_branch || 'main'})
          });
        } catch {}
      }
      state.items = state.items.filter(record => record.id !== id);
      await updateIndex(state.items);
      renderGallery();
      renderAllStats();
      setStatus('[data-photos-status]', t('removed'));
    } catch (error) {
      setStatus('[data-photos-status]', error.message || t('loadError'), true);
    }
  }

  function renderAllStats() {
    const items = state.items;
    const repo = state.repository;
    renderStats($('[data-photos-stats]'), items, repo);
    renderStats($('[data-settings-photo-stats]'), items, repo);
    $$('[data-photos-repo-size]').forEach(node => node.textContent = formatBytes(bytesFromRepo(repo)));
  }
  async function refreshMediaApp() {
    const host = $('[data-photos-app]');
    if (!host) return;
    const status = $('[data-photos-status]', host);
    if (!accountReady()) {
      status.textContent = t('notSignedIn');
      $('[data-photos-gallery]', host).innerHTML = '<div class="notice">' + esc(t('notSignedIn')) + '</div>';
      return;
    }
    status.textContent = t('linking');
    try {
      const repo = await account().getPhotosRepository();
      if (!repo) {
        state.repository = null;
        status.textContent = t('noRepo');
        $('[data-photos-gallery]', host).innerHTML = '<div class="ssos-photos-empty"><p>' + esc(t('connectHint')) + '</p><button class="app-button" type="button" data-photos-link>' + esc(t('link')) + '</button></div>';
        renderAllStats();
        return;
      }
      state.repository = repo;
      const index = await getIndex();
      state.items = index.items;
      state.indexSha = index.sha;
      renderAllStats();renderGallery();
      status.textContent = t('linked') + ' · ' + repo.full_name;
    } catch (error) {
      status.textContent = error.message || t('loadError');
      status.classList.add('is-error');
    }
  }
  async function mountSettings() {
    const host = $('[data-ssos-photo-cloud-settings]');
    if (!host) return;
    const accountState = account()?.getState?.();
    if (!accountState?.ready) {
      host.innerHTML = '<p>' + esc(t('linking')) + '</p>';
      return;
    }
    if (!accountState.authenticated) {
      host.innerHTML = '<p>' + esc(t('accountRequired')) + '</p><button type="button" class="app-button secondary" data-photo-open-settings>Schleim-Konto öffnen</button>';
      return;
    }
    host.innerHTML = '<p>' + esc(t('linking')) + '</p>';
    try {
      const repo = await account().getPhotosRepository();
      if (!repo?.private) throw new Error('Das gemeinsame Schleim-Cloud-Repository ist nicht privat oder nicht verfügbar.');
      state.repository = repo;
      const index = await getIndex();
      state.items = index.items;
      renderStats(host, state.items, repo);
      host.insertAdjacentHTML('beforeend','<p class="ssos-photos-repo-link"><a href="' + esc(repo.html_url) + '" target="_blank" rel="noopener noreferrer">' + esc(t('connectedTo')) + ' ' + esc(repo.full_name) + ' ↗</a></p><p>' + esc(t('originalLimit')) + '</p>');
      const legacy = await account().getLegacyPhotosRepository();
      if (legacy) {
        let migrated = false;
        try {
          await account().requestPhotosRepository('/contents/_metadata/migration-complete.json');
          migrated = true;
        } catch (error) {
          if (error.status !== 404) throw error;
        }
        const section = document.createElement('section');
        section.className = 'ssos-photos-migration';
        const message = document.createElement('p');
        message.textContent = migrated ? t('migrationArchive') : t('migrationInfo');
        section.appendChild(message);
        if (!migrated) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'app-button';
          button.dataset.photosMigrate = 'true';
          button.textContent = t('migrationButton');
          section.appendChild(button);
        }
        const progress = document.createElement('p');
        progress.dataset.photosMigrationStatus = 'true';
        progress.setAttribute('role','status');
        section.appendChild(progress);
        host.appendChild(section);
      }
    } catch (error) {
      host.innerHTML = '<p class="is-error">' + esc(error.message || t('loadError')) + '</p>';
    }
  }

  async function gitBlobSha(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const header = new TextEncoder().encode('blob ' + bytes.byteLength + '\0');
    const payload = new Uint8Array(header.length + bytes.length);
    payload.set(header,0);
    payload.set(bytes,header.length);
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-1',payload));
    return [...digest].map(value=>value.toString(16).padStart(2,'0')).join('');
  }
  async function migrateLegacyRepository(button) {
    if (state.migrating) return;
    if (!accountReady()) throw new Error(t('notSignedIn'));
    state.migrating = true;
    if (button) button.disabled = true;
    const status = $('[data-photos-migration-status]');
    const showProgress = message => { if (status) status.textContent = message; };
    let completed = 0, skipped = 0, totalBytes = 0;
    try {
      const legacy = await account().getLegacyPhotosRepository();
      if (!legacy) throw new Error(t('migrationMissing'));
      const branch = legacy.default_branch || 'main';
      const tree = await account().requestLegacyPhotosRepository('/git/trees/' + encodeURIComponent(branch) + '?recursive=1');
      if (tree.truncated) throw new Error('GitHub hat den alten Dateibaum abgeschnitten. Die Migration wurde aus Sicherheitsgründen gestoppt.');
      const files = (tree.tree || []).filter(entry => entry.type === 'blob').sort((a,b)=>a.path.localeCompare(b.path));
      if (!files.length) throw new Error(t('migrationMissing'));
      for (let index=0;index<files.length;index++) {
        const entry = files[index];
        if (!entry.path || entry.path.startsWith('/') || entry.path.split('/').some(part=>part==='..')) {
          throw new Error('Die alte Mediathek enthält einen ungültigen Dateipfad: ' + String(entry.path || 'unbekannt'));
        }
        showProgress(t('migrationProgress') + ' · ' + (index+1) + '/' + files.length + ' · ' + entry.path);
        let existing = null;
        try {
          existing = await account().requestPhotosRepository('/contents/' + encodePath(entry.path));
        } catch (error) {
          if (error.status !== 404) throw error;
        }
        if (existing?.sha === entry.sha) {
          skipped++;
          totalBytes += Number(entry.size) || 0;
          continue;
        }
        if (existing) throw new Error(t('migrationConflict') + ' (' + entry.path + ')');
        const raw = await account().requestLegacyPhotosRepository(
          '/contents/' + encodePath(entry.path) + '?ref=' + encodeURIComponent(branch),
          {headers:{Accept:'application/vnd.github.raw'},responseType:'blob'}
        );
        if (!(raw instanceof Blob) || raw.size !== Number(entry.size)) {
          throw new Error('Die Quelldatei konnte nicht vollständig gelesen werden: ' + entry.path);
        }
        const sourceSha = await gitBlobSha(raw);
        if (sourceSha !== entry.sha) throw new Error('Prüfsummenfehler in der Quelldatei: ' + entry.path);
        const uploaded = await putFile(entry.path, raw, 'Migrate legacy Schleim media into unified cloud');
        if (uploaded.sha !== entry.sha) throw new Error('Die Zieldatei wurde nicht identisch gespeichert: ' + entry.path);
        completed++;
        totalBytes += raw.size;
      }
      const report = {
        format:'schleim-unified-media-migration',
        schemaVersion:1,
        sourceRepository:legacy.full_name,
        destinationRepository:repoName(),
        files:files.length,
        copied:completed,
        alreadyPresent:skipped,
        bytes:totalBytes,
        completedAt:new Date().toISOString(),
        verification:'git-blob-sha1'
      };
      await putFile('_metadata/migration-complete.json',new Blob([JSON.stringify(report,null,2)+'\n'],{type:'application/json'}),'Verify unified Schleim media migration');
      showProgress(t('migrationDone') + ' · ' + files.length + ' Dateien');
      await refreshMediaApp();
      await mountSettings();
    } catch (error) {
      showProgress((error.message || t('loadError')) + ' · Bereits übertragene Dateien bleiben erhalten; erneut starten setzt die Migration fort.');
      throw error;
    } finally {
      state.migrating = false;
      if (button?.isConnected) button.disabled = false;
    }
  }
  function repoName() {
    return account()?.getAccount?.()?.repository || REPO_NAME;
  }

  async function linkRepository() {
    if (!accountReady()) throw new Error(t('notSignedIn'));
    setStatus('[data-photos-status]', t('linking'));
    const repo = await account().ensurePhotosRepository();
    state.repository = repo;
    state.items = [];
    await refreshMediaApp();
    await mountSettings();
  }
  function mountCamera() {
    const root = $('[data-camera-app]');
    if (!root) return;
    const runtime = globalThis.browser?.runtime;
    const isAndroidApplication = /Android/i.test(navigator.userAgent || '') &&
      typeof runtime?.sendNativeMessage === 'function';
    const androidNotice = $('[data-android-camera-notice]',root);
    const browserPanel = $('[data-browser-camera-panel]',root);
    if (androidNotice) androidNotice.hidden = !isAndroidApplication;
    if (browserPanel) browserPanel.hidden = isAndroidApplication;
    if (isAndroidApplication) {
      stopBrowserCamera();
      setStatus('[data-camera-status]',t('androidCameraUnsupported'));
      return;
    }
    setStatus('[data-camera-status]',t('cameraStartHint'));
  }

  async function startBrowserCamera() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error(t('cameraUnavailable'));
    stopBrowserCamera();
    const attempts = [
      {audio:true,video:{facingMode:{ideal:state.facingMode},width:{ideal:1920},height:{ideal:1080}}},
      {audio:true,video:{facingMode:{ideal:state.facingMode}}},
      {audio:false,video:true}
    ];
    let lastError = null;
    for (let i=0;i<attempts.length;i++) {
      try { state.cameraStream = await navigator.mediaDevices.getUserMedia(attempts[i]); break; }
      catch (error) { lastError = error; if (!['NotFoundError','OverconstrainedError','ConstraintNotSatisfiedError','TypeError'].includes(error?.name) || i === attempts.length-1) throw error; }
    }
    if (!state.cameraStream) throw lastError || new Error(t('cameraUnavailable'));
    const preview = $('[data-camera-preview]');
    if (preview) { preview.srcObject = state.cameraStream; await preview.play(); }
    state.cameraStarted = true;
    setStatus('[data-camera-status]',t('cameraReady'));
  }

  function stopBrowserCamera() {
    if (state.cameraRecorder && state.cameraRecorder.state !== 'inactive') { try { state.cameraRecorder.stop(); } catch {} }
    state.cameraRecorder = null; state.cameraChunks = []; state.cameraRecording = false; state.cameraStarted = false;
    state.cameraStream?.getTracks?.().forEach(track=>track.stop()); state.cameraStream = null;
    const preview = $('[data-camera-preview]'); if (preview) preview.srcObject = null;
  }

  async function takeBrowserPhoto() {
    if (!state.cameraStarted) throw new Error(t('noCapture'));
    const preview = $('[data-camera-preview]');
    if (!preview?.videoWidth) throw new Error(t('noCapture'));
    const canvas = document.createElement('canvas'); canvas.width = preview.videoWidth; canvas.height = preview.videoHeight;
    const context = canvas.getContext('2d'); if (!context) throw new Error(t('noCapture'));
    context.drawImage(preview,0,0,canvas.width,canvas.height);
    const blob = await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.92));
    canvas.width = 0; canvas.height = 0;
    if (!blob) throw new Error(t('noCapture'));
    const now = new Date();
    const file = new File([blob],'Schleim-Kamera-' + now.toISOString().replace(/[:.]/g,'-') + '.jpg',{type:'image/jpeg',lastModified:now.getTime()});
    await uploadFiles([file],'Kameraaufnahme','[data-camera-status]');
  }

  async function startBrowserRecording() {
    if (!state.cameraStarted) await startBrowserCamera();
    if (typeof MediaRecorder === 'undefined') throw new Error(t('cameraUnavailable'));
    const stream = state.cameraStream;
    const mimeType = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(type=>MediaRecorder.isTypeSupported?.(type));
    state.cameraChunks = [];
    state.cameraRecorder = new MediaRecorder(stream,mimeType ? {mimeType} : undefined);
    state.cameraRecorder.addEventListener('dataavailable',event=>{if(event.data?.size)state.cameraChunks.push(event.data);});
    state.cameraRecorder.start(1000); state.cameraRecording = true;
    setStatus('[data-camera-status]',t('recording'));
  }

  async function stopBrowserRecording() {
    const recorder = state.cameraRecorder;
    if (!recorder || recorder.state === 'inactive') return;
    const blob = await new Promise((resolve,reject)=>{
      recorder.addEventListener('error',event=>reject(event.error || new Error(t('cameraUnavailable'))),{once:true});
      recorder.addEventListener('stop',()=>resolve(new Blob(state.cameraChunks,{type:recorder.mimeType || 'video/webm'})),{once:true});
      recorder.stop();
    });
    state.cameraRecorder = null; state.cameraChunks = []; state.cameraRecording = false;
    if (!blob.size) throw new Error(t('noCapture'));
    const now = new Date(); const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const file = new File([blob],'Schleim-Kamera-Video-' + now.toISOString().replace(/[:.]/g,'-') + '.' + ext,{type:blob.type || 'video/webm',lastModified:now.getTime()});
    await uploadFiles([file],'Kamera-Video','[data-camera-status]');
  }

  function stopCamera() { stopBrowserCamera(); }
  async function handleClick(event) {
    const migrationButton = event.target.closest('[data-photos-migrate]');
    if (migrationButton) {
      migrationButton.disabled = true;
      try { await migrateLegacyRepository(migrationButton); }
      catch (error) { setStatus('[data-photos-status]',error.message || t('loadError'),true); }
      finally { if (migrationButton.isConnected && !state.migrating) migrationButton.disabled = false; }
      return;
    }
    const link = event.target.closest('[data-photos-link]');
    if (link) {
      link.disabled = true;
      try { await linkRepository(); }
      catch (error) { setStatus('[data-photos-status]',error.message || t('loadError'),true); }
      finally { if (link.isConnected) link.disabled = false; }
      return;
    }
    if (event.target.closest('[data-photo-open]')) { await openMedia(event.target.closest('[data-photo-open]').dataset.photoOpen,false);return; }
    if (event.target.closest('[data-photo-download]')) { await openMedia(event.target.closest('[data-photo-download]').dataset.photoDownload,true);return; }
    if (event.target.closest('[data-photo-delete]')) { await removeMedia(event.target.closest('[data-photo-delete]').dataset.photoDelete);return; }
    if (event.target.closest('[data-photo-close]')) {
      const viewer=$('[data-photos-viewer]');if(viewer){viewer.hidden=true;viewer.innerHTML='';}return;
    }
    if (event.target.closest('[data-photos-upload]')) {
      const input=$('[data-photos-files]'), files=[...(input?.files || [])];
      const description=$('[data-photos-description]')?.value || '';
      try { await uploadFiles(files,description);if(input)input.value=''; }
      catch (error) { setStatus('[data-photos-status]',error.message || t('loadError'),true); }
      return;
    }
    if (event.target.closest('[data-camera-start]')) {
      try { await startBrowserCamera(); } catch (error) { setStatus('[data-camera-status]',error.message || t('cameraDenied'),true); }
      return;
    }
    if (event.target.closest('[data-camera-stop]')) { stopCamera();setStatus('[data-camera-status]',t('stopCamera'));return; }
    if (event.target.closest('[data-camera-switch]')) {
      state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
      try { await startBrowserCamera(); } catch (error) { setStatus('[data-camera-status]',error.message || t('cameraDenied'),true); }
      return;
    }
    if (event.target.closest('[data-camera-photo]')) {
      try { await takeBrowserPhoto(); } catch (error) { setStatus('[data-camera-status]',error.message || t('loadError'),true); }
      return;
    }
    if (event.target.closest('[data-camera-record]')) {
      const button = event.target.closest('[data-camera-record]');
      try {
        if (state.cameraRecording) {
          await stopBrowserRecording();
          button.textContent=t('record');
        } else {
          await startBrowserRecording();
          button.textContent=t('stopRecord');
        }
      } catch (error) {
        button.textContent=t('record');
        setStatus('[data-camera-status]',error.message || t('loadError'),true);
      }
      return;
    }
    if (event.target.closest('[data-photo-open-settings]')) {
      $('[data-ssos-cloud-account] [data-ssos-cloud-login]')?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
  }
  function handleInput(event) {
    if (event.target.matches('[data-photos-search]')) {
      window.SSOSPhotoAI?.clearExpandedTerms?.();
      state.query=event.target.value;
      renderGallery();
    }
  }
  function handleChange(event) {
    if (event.target.matches('[data-photos-filter]')) {
      state.view=event.target.value;
      renderGallery();
    }
    if (event.target.matches('[data-photos-files]')) {
      const button=$('[data-photos-upload]');
      if (button) button.disabled=state.backgroundBusy || !(event.target.files?.length);
    }
  }
  function refreshOpenViews() {
    renderGallery();
    renderAllStats();
  }
  function handleAppOpen(event) {
    const id=event.detail?.id;
    state.activeApp=id || null;
    if (id === 'images') refreshMediaApp();
    if (id === 'camera') mountCamera();
    if (id === 'settings') mountSettings();
    if (id !== 'camera') stopCamera();
  }
  function init() {
    document.addEventListener('click',handleClick);
    document.addEventListener('input',handleInput);
    document.addEventListener('change',handleChange);
    window.addEventListener('ssos-app-opened',handleAppOpen);
    window.addEventListener('ssos-photos-updated',refreshOpenViews);
    if (!isAndroidGeckoView() && globalThis.chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes,area) => {
        if (area === 'local' && changes['ssos-media-upload-status']?.newValue) {
          displayBackgroundUploadStatus(changes['ssos-media-upload-status'].newValue);
        }
      });
      chrome.storage.local.get('ssos-media-upload-status').then(result => {
        if (result?.['ssos-media-upload-status']?.phase === 'progress') displayBackgroundUploadStatus(result['ssos-media-upload-status']);
      }).catch(() => {});
    }
    window.addEventListener('ssos-photo-ai-terms-updated',renderGallery);
    window.addEventListener('ssos-account-state-changed',() => {
      if (state.activeApp === 'images') refreshMediaApp();
      if (state.activeApp === 'settings') mountSettings();
    });
    // Wait only for the settings mount to be inserted. Observing the whole
    // document while mountSettings() changes host.innerHTML causes our own
    // mutations to retrigger mountSettings forever and freeze the extension.
    const settingsHostSelector = '[data-ssos-photo-cloud-settings]';
    if ($(settingsHostSelector)) {
      mountSettings();
    } else {
      const observer = new MutationObserver(records => {
        const hostWasAdded = records.some(record => Array.from(record.addedNodes).some(node =>
          node.nodeType === 1 && (node.matches(settingsHostSelector) || node.querySelector(settingsHostSelector))
        ));
        if (!hostWasAdded) return;
        observer.disconnect();
        mountSettings();
      });
      observer.observe(document.body,{childList:true,subtree:true});
    }
    window.addEventListener('beforeunload',stopCamera);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  window.SSOSPhotosCloud = Object.freeze({
    mountSettings:mountSettings,
    refresh:refreshMediaApp,
    formatBytes:formatBytes,
    getRepoName:() => REPO_NAME
  });
})();