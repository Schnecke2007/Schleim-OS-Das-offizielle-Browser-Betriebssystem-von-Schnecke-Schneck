(() => {
  'use strict';

  // Public identifier only. Set this after creating the Schleim OS GitHub App.
  // Never put a GitHub App private key or client secret in this extension.
  const GITHUB_APP_CLIENT_ID = 'Iv23lihfJBU95UVCrVt1';
  const GITHUB_APP_INSTALL_URL = 'https://github.com/apps/schleim-os-account';
  const GITHUB_APP_SLUG = 'schleim-os-account';
  const API = 'https://api.github.com';
  const DEVICE_CODE_URL = 'https://github.com/login/device/code';
  const TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const REPO_NAME = 'schleim-os-cloud';
  const BACKUP_PATH = 'schleim-os-backup.json';
  const STORAGE_KEY = 'ssos-schleim-account-session-v1';
  const API_VERSION = '2022-11-28';

  const TEXT = {
    de: {
      title:'Schleim-Konto', intro:'Verbinde dein GitHub-Konto und sichere deine Schleim-OS-Einstellungen in einem privaten Repository.',
      login:'Mit GitHub verbinden', connected:'Verbunden als', email:'Verifizierte E-Mail', repository:'Privates Cloud-Repository',
      save:'Jetzt in der Cloud sichern', restore:'Cloud-Sicherung wiederherstellen', logout:'Abmelden',
      notConfigured:'Die Schleim-OS-GitHub-App ist noch nicht eingerichtet. Die Client-ID fehlt.',
      setup:'GitHub-App installieren', installApp:'GitHub-App bei GitHub installieren', setupNote:'Für Nutzerkonten anderer Personen muss deine App öffentlich sein. Aktiviere Device Flow und richte die Berechtigungen laut Anleitung ein.',
      device:'Öffne GitHub und gib diesen einmaligen Code ein:', openGitHub:'GitHub-Gerätefreigabe öffnen', cancel:'Abbrechen', waiting:'Warte auf die Bestätigung bei GitHub …',
      created:'Schleim-Konto verbunden. Dein privates Backup-Repository ist bereit.',
      saved:'Cloud-Sicherung erfolgreich gespeichert.', restored:'Cloud-Sicherung geladen. Schleim OS wird neu gestartet …',
      confirmRestore:'Die lokale Schleim-OS-Konfiguration wird durch die Cloud-Sicherung ersetzt. Fortfahren?',
      noBackup:'In deinem privaten Repository wurde noch keine Sicherungsdatei gefunden.',
      emailMissing:'Dein GitHub-Konto hat keine verifizierte primäre E-Mail-Adresse. Bitte bestätige sie zuerst direkt bei GitHub.',
      repoPublic:'Das Repository schleim-os-cloud ist nicht privat. Aus Sicherheitsgründen wird dort keine Sicherung gespeichert.',
      repoPermission:'GitHub hat den Zugriff verweigert. Prüfe die App-Berechtigungen: Repository creation (write), Contents (read/write) und Email addresses (read).',
      cancelled:'Anmeldung abgebrochen.', expired:'Der GitHub-Code ist abgelaufen. Starte die Anmeldung erneut.',
      authError:'GitHub-Anmeldung fehlgeschlagen.', backupError:'Cloud-Sicherung fehlgeschlagen.',
      accountNotice:'Dein GitHub-Passwort gibst du nur direkt bei GitHub ein. Schleim OS fragt es nicht ab und speichert es nicht. Prüfe bei der Gerätefreigabe, dass GitHub tatsächlich „Schleim OS Account“ anzeigt.',
      privacy:'Das Backup-Repository ist privat. Zugriffstokens werden lokal in den Erweiterungsdaten gespeichert und niemals in das Backup-Repository geschrieben. Du kannst die App-Berechtigung jederzeit in deinen GitHub-Einstellungen widerrufen.',
      signOutConfirm:'Möchtest du dich vom Schleim-Konto abmelden? Die private Sicherung auf GitHub bleibt erhalten.',
      signingIn:'GitHub-Anmeldung wird vorbereitet …', creating:'Privates Backup-Repository wird gesucht oder erstellt …',
      noPermission:'GitHub-App-Berechtigungen fehlen oder die App wurde nicht auf diesem Konto installiert.',
      ownerMismatch:'Das gefundene Repository gehört nicht zum angemeldeten GitHub-Konto.',
      retry:'Erneut versuchen', help:'Einrichtungsanleitung öffnen', lastBackup:'Letzte Cloud-Sicherung',
      notYet:'Noch keine Sicherung auf diesem Gerät', account:'GitHub-Konto',
      installFirst:'Installiere zuerst die GitHub-App.', installIntro:'Die GitHub-App-Seite wurde geöffnet. Installiere Schleim OS Account in deinem GitHub-Konto und fahre danach hier fort.',
      continueAfterInstall:'Ich habe die App installiert – weiter', checkingInstallation:'Prüfe die GitHub-App-Installation …', waitingForInstallation:'Warte, bis GitHub die Installation deinem Konto zuordnet …',
      installationMissing:'Die GitHub-App wurde noch nicht erkannt. Installiere sie auf deinem GitHub-Konto und versuche es erneut.',
      codeCopied:'Der Gerätecode wurde in die Zwischenablage kopiert.', copyCode:'Code kopieren', copyFailed:'Automatisches Kopieren nicht möglich. Kopiere den angezeigten Code manuell.',
      installAgain:'GitHub-App öffnen', installPendingTitle:'Installation wird geprüft', installPendingIntro:'GitHub hat die Anmeldung bestätigt. Schleim OS wartet jetzt darauf, dass die GitHub-App in deinem Konto erkannt wird.'
    },
    en: {
      title:'Schleim account', intro:'Connect your GitHub account and back up your Schleim OS settings in a private repository.',
      login:'Connect with GitHub', connected:'Connected as', email:'Verified email', repository:'Private cloud repository',
      save:'Back up to cloud now', restore:'Restore cloud backup', logout:'Sign out',
      notConfigured:'The Schleim OS GitHub App has not been configured yet. The client ID is missing.',
      setup:'Install GitHub App', installApp:'Install GitHub App on GitHub', setupNote:'Your app must be public for other users to connect. Enable Device Flow and configure the permissions in the setup guide.',
      device:'Open GitHub and enter this one-time code:', openGitHub:'Open GitHub device authorization', cancel:'Cancel', waiting:'Waiting for confirmation on GitHub …',
      created:'Schleim account connected. Your private backup repository is ready.',
      saved:'Cloud backup saved successfully.', restored:'Cloud backup restored. Schleim OS is restarting …',
      confirmRestore:'Your local Schleim OS configuration will be replaced with the cloud backup. Continue?',
      noBackup:'No backup file was found in your private repository.',
      emailMissing:'Your GitHub account has no verified primary email address. Verify it directly on GitHub first.',
      repoPublic:'The schleim-os-cloud repository is not private. No backup will be saved there for security reasons.',
      repoPermission:'GitHub denied access. Check the app permissions: Repository creation (write), Contents (read/write), and Email addresses (read).',
      cancelled:'Sign-in cancelled.', expired:'The GitHub code expired. Start sign-in again.',
      authError:'GitHub sign-in failed.', backupError:'Cloud backup failed.',
      accountNotice:'Enter your GitHub password only on GitHub. Schleim OS never asks for or stores it. When approving the device code, verify that GitHub identifies the app as “Schleim OS Account”.',
      privacy:'The backup repository is private. Access tokens are stored locally in the extension data and are never written to the backup repository. You can revoke the app authorization in your GitHub settings at any time.',
      signOutConfirm:'Sign out of the Schleim account? Your private GitHub backup will remain.',
      signingIn:'Preparing GitHub sign-in …', creating:'Looking for or creating your private backup repository …',
      noPermission:'GitHub App permissions are missing, or the app has not been installed on this account.',
      ownerMismatch:'The repository found does not belong to the signed-in GitHub account.',
      retry:'Try again', help:'Open setup guide', lastBackup:'Last cloud backup',
      notYet:'No backup on this device yet', account:'GitHub account',
      installFirst:'Install the GitHub App first.', installIntro:'The GitHub App page has opened. Install Schleim OS Account in your GitHub account, then continue here.',
      continueAfterInstall:'I installed the app – continue', checkingInstallation:'Checking the GitHub App installation …', waitingForInstallation:'Waiting for GitHub to associate the installation with your account …',
      installationMissing:'The GitHub App has not been detected yet. Install it on your GitHub account and try again.',
      codeCopied:'The device code was copied to the clipboard.', copyCode:'Copy code', copyFailed:'Automatic copying is unavailable. Copy the displayed code manually.',
      installAgain:'Open GitHub App', installPendingTitle:'Checking installation', installPendingIntro:'GitHub confirmed the sign-in. Schleim OS is now waiting for the GitHub App to be detected in your account.'
    },
    nl: {
      title:'Schleim-account', intro:'Verbind je GitHub-account en maak een back-up van je Schleim OS-instellingen in een privérepository.',
      login:'Verbinden met GitHub', connected:'Verbonden als', email:'Geverifieerd e-mailadres', repository:'Privé-cloudrepository',
      save:'Nu opslaan in de cloud', restore:'Cloudback-up herstellen', logout:'Afmelden',
      notConfigured:'De Schleim OS GitHub-app is nog niet ingesteld. De client-ID ontbreekt.',
      setup:'GitHub-app installeren', installApp:'GitHub-app op GitHub installeren', setupNote:'Je app moet openbaar zijn zodat andere gebruikers kunnen verbinden. Schakel Device Flow in en stel de machtigingen uit de handleiding in.',
      device:'Open GitHub en voer deze eenmalige code in:', openGitHub:'GitHub-apparaatmachtiging openen', cancel:'Annuleren', waiting:'Wachten op bevestiging bij GitHub …',
      created:'Schleim-account verbonden. Je privéback-uprepository is klaar.',
      saved:'Cloudback-up succesvol opgeslagen.', restored:'Cloudback-up hersteld. Schleim OS wordt opnieuw gestart …',
      confirmRestore:'Je lokale Schleim OS-configuratie wordt vervangen door de cloudback-up. Doorgaan?',
      noBackup:'Er is nog geen back-upbestand gevonden in je privérepository.',
      emailMissing:'Je GitHub-account heeft geen geverifieerd primair e-mailadres. Verifieer het eerst rechtstreeks bij GitHub.',
      repoPublic:'De repository schleim-os-cloud is niet privé. Om veiligheidsredenen wordt daar geen back-up opgeslagen.',
      repoPermission:'GitHub heeft de toegang geweigerd. Controleer de app-machtigingen: Repository creation (write), Contents (read/write) en Email addresses (read).',
      cancelled:'Aanmelding geannuleerd.', expired:'De GitHub-code is verlopen. Start de aanmelding opnieuw.',
      authError:'GitHub-aanmelding mislukt.', backupError:'Cloudback-up mislukt.',
      accountNotice:'Voer je GitHub-wachtwoord alleen op GitHub in. Schleim OS vraagt het niet en slaat het niet op. Controleer bij het goedkeuren van de apparaatcode of GitHub de app „Schleim OS Account“ toont.',
      privacy:'De back-uprepository is privé. Toegangstokens worden lokaal in de extensiegegevens opgeslagen en nooit in de back-uprepository geplaatst. Je kunt de app-machtiging op elk moment intrekken in je GitHub-instellingen.',
      signOutConfirm:'Afmelden bij het Schleim-account? Je privéback-up op GitHub blijft behouden.',
      signingIn:'GitHub-aanmelding voorbereiden …', creating:'Privéback-uprepository zoeken of maken …',
      noPermission:'GitHub-appmachtigingen ontbreken of de app is niet op dit account geïnstalleerd.',
      ownerMismatch:'De gevonden repository is niet van het aangemelde GitHub-account.',
      retry:'Opnieuw proberen', help:'Installatiehandleiding openen', lastBackup:'Laatste cloudback-up',
      notYet:'Nog geen back-up op dit apparaat', account:'GitHub-account',
      installFirst:'Installeer eerst de GitHub-app.', installIntro:'De GitHub-app-pagina is geopend. Installeer Schleim OS Account in je GitHub-account en ga daarna hier verder.',
      continueAfterInstall:'Ik heb de app geïnstalleerd – verder', checkingInstallation:'De GitHub-app-installatie controleren …', waitingForInstallation:'Wachten totdat GitHub de installatie aan je account koppelt …',
      installationMissing:'De GitHub-app is nog niet herkend. Installeer de app in je GitHub-account en probeer het opnieuw.',
      codeCopied:'De apparaatcode is naar het klembord gekopieerd.', copyCode:'Code kopiëren', copyFailed:'Automatisch kopiëren is niet beschikbaar. Kopieer de getoonde code handmatig.',
      installAgain:'GitHub-app openen', installPendingTitle:'Installatie controleren', installPendingIntro:'GitHub heeft de aanmelding bevestigd. Schleim OS wacht nu totdat de GitHub-app in je account wordt herkend.'
    }
  };

  const language = () => document.body?.dataset.language || 'de';
  const t = key => TEXT[language()]?.[key] || TEXT.de[key] || key;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  let session = null;
  let deviceFlow = null;
  let polling = false;
  let observer = null;
  let accountReady = false;
  let installationStage = false;
  let installationPending = false;
  let verificationWindow = null;

  function notifyAccountState() {
    window.dispatchEvent(new Event('ssos-account-state-changed'));
  }

  function storageGet() {
    return new Promise((resolve, reject) => {
      const area = globalThis.chrome?.storage?.local;
      if (!area) return reject(new Error('Extension storage is unavailable.'));
      area.get(STORAGE_KEY, result => {
        const error = chrome.runtime?.lastError;
        if (error) reject(new Error(error.message));
        else resolve(result?.[STORAGE_KEY] || null);
      });
    });
  }
  function storageSet(value) {
    return new Promise((resolve, reject) => {
      const area = globalThis.chrome?.storage?.local;
      if (!area) return reject(new Error('Extension storage is unavailable.'));
      area.set({[STORAGE_KEY]:value}, () => {
        const error = chrome.runtime?.lastError;
        if (error) reject(new Error(error.message));
        else resolve();
      });
    });
  }
  function storageRemove() {
    return new Promise((resolve, reject) => {
      const area = globalThis.chrome?.storage?.local;
      if (!area) return reject(new Error('Extension storage is unavailable.'));
      area.remove(STORAGE_KEY, () => {
        const error = chrome.runtime?.lastError;
        if (error) reject(new Error(error.message));
        else resolve();
      });
    });
  }

  function setStatus(message, isError=false) {
    document.querySelectorAll('[data-ssos-cloud-status]').forEach(node => {
      node.textContent = message || '';
      node.classList.toggle('is-error', !!isError);
    });
  }
  function renderPanel(panel) {
    if (!panel) return;
    const loginOnly = panel.dataset.ssosCloudMode === 'login';
    if (!GITHUB_APP_CLIENT_ID || GITHUB_APP_CLIENT_ID === 'GITHUB_APP_CLIENT_ID_HERE') {
      panel.innerHTML =
        '<div class="ssos-cloud-card"><div class="ssos-cloud-title"><span>☁️</span><div><h3>'+esc(t('title'))+'</h3><p>'+esc(t('intro'))+'</p></div></div>'+
        '<p class="ssos-cloud-note">'+esc(t('notConfigured'))+'</p>'+
        '<a class="app-button secondary" href="'+esc(GITHUB_APP_INSTALL_URL)+'" target="_blank" rel="noopener noreferrer">'+esc(t('setup'))+' ↗</a>'+
        '<a class="ssos-cloud-help" href="https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/blob/main/extension/docs/SCHLEIM-KONTO.md" target="_blank" rel="noopener noreferrer">'+esc(t('help'))+' ↗</a>'+
        '<p class="ssos-cloud-note">'+esc(t('accountNotice'))+'</p><p class="ssos-cloud-note">'+esc(t('privacy'))+'</p>'+
        '<p class="ssos-cloud-status" data-ssos-cloud-status role="status" aria-live="polite"></p></div>';
      return;
    }
    if (deviceFlow) {
      panel.innerHTML =
        '<div class="ssos-cloud-card"><div class="ssos-cloud-title"><span>🐙</span><div><h3>'+esc(t('title'))+'</h3><p>'+esc(t('device'))+'</p></div></div>'+
        '<div class="ssos-cloud-device-code">'+esc(deviceFlow.userCode)+'</div>'+
        '<button class="app-button secondary" type="button" data-ssos-cloud-copy>📋 '+esc(t('copyCode'))+'</button>'+
        '<a class="app-button" href="'+esc(deviceFlow.verificationUri)+'" target="_blank" rel="noopener noreferrer">'+esc(t('openGitHub'))+' ↗</a>'+
        '<a class="ssos-cloud-help" href="'+esc(GITHUB_APP_INSTALL_URL)+'" target="_blank" rel="noopener noreferrer">'+esc(t('installAgain'))+' ↗</a>'+
        '<p class="ssos-cloud-status" data-ssos-cloud-status role="status" aria-live="polite">'+esc(t('waiting'))+'</p>'+
        '<button class="app-button secondary" type="button" data-ssos-cloud-cancel>'+esc(t('cancel'))+'</button></div>';
      return;
    }
    if (installationStage) {
      panel.innerHTML =
        '<div class="ssos-cloud-card"><div class="ssos-cloud-title"><span>🐙</span><div><h3>'+esc(t('title'))+'</h3><p>'+esc(t('installFirst'))+'</p></div></div>'+
        '<p class="ssos-cloud-note">'+esc(t('installIntro'))+'</p>'+
        '<a class="app-button secondary" href="'+esc(GITHUB_APP_INSTALL_URL)+'" target="_blank" rel="noopener noreferrer">'+esc(t('installApp'))+' ↗</a>'+
        '<button class="app-button" type="button" data-ssos-cloud-install-continue>'+esc(t('continueAfterInstall'))+'</button>'+
        '<p class="ssos-cloud-status" data-ssos-cloud-status role="status" aria-live="polite"></p></div>';
      return;
    }
    if (installationPending) {
      panel.innerHTML =
        '<div class="ssos-cloud-card"><div class="ssos-cloud-title"><span>⏳</span><div><h3>'+esc(t('installPendingTitle'))+'</h3><p>'+esc(t('installPendingIntro'))+'</p></div></div>'+
        '<a class="app-button secondary" href="'+esc(GITHUB_APP_INSTALL_URL)+'" target="_blank" rel="noopener noreferrer">'+esc(t('installAgain'))+' ↗</a>'+
        '<p class="ssos-cloud-status" data-ssos-cloud-status role="status" aria-live="polite">'+esc(t('checkingInstallation'))+'</p>'+
        '<button class="app-button secondary" type="button" data-ssos-cloud-cancel>'+esc(t('cancel'))+'</button></div>';
      return;
    }
    if (!session?.user) {
      panel.innerHTML =
        '<div class="ssos-cloud-card"><div class="ssos-cloud-title"><span>☁️</span><div><h3>'+esc(t('title'))+'</h3><p>'+esc(t('intro'))+'</p></div></div>'+
        '<button class="app-button" type="button" data-ssos-cloud-login>🐙 '+esc(t('login'))+'</button>'+
        '<a class="ssos-cloud-help" href="'+esc(GITHUB_APP_INSTALL_URL)+'" target="_blank" rel="noopener noreferrer">'+esc(t('installApp'))+' ↗</a>'+
        '<p class="ssos-cloud-note">'+esc(t('accountNotice'))+'</p>'+
        '<p class="ssos-cloud-note">'+esc(t('privacy'))+'</p>'+
        '<p class="ssos-cloud-status" data-ssos-cloud-status role="status" aria-live="polite"></p></div>';
      return;
    }
    if(loginOnly){
      panel.innerHTML='<div class="ssos-cloud-card"><div class="ssos-cloud-title"><span>🐌</span><div><h3>'+esc(t('title'))+'</h3><p>'+esc(t('connected'))+' <b>@'+esc(session.user.login)+'</b></p></div><span class="ssos-cloud-connected">●</span></div><p class="ssos-cloud-note">'+esc(t('created'))+'</p></div>';
      return;
    }
    const repoUrl = session.repo?.html_url || ('https://github.com/'+session.user.login+'/'+REPO_NAME);
    panel.innerHTML =
      '<div class="ssos-cloud-card"><div class="ssos-cloud-title"><span>🐌</span><div><h3>'+esc(t('title'))+'</h3><p>'+esc(t('connected'))+' <b>@'+esc(session.user.login)+'</b></p></div><span class="ssos-cloud-connected">●</span></div>'+
      '<div class="ssos-cloud-meta"><span>'+esc(t('email'))+'</span><b>'+esc(session.user.email||'—')+'</b><span>'+esc(t('repository'))+'</span><a href="'+esc(repoUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(session.repo?.full_name||session.user.login+'/'+REPO_NAME)+' ↗</a></div>'+
      '<div class="ssos-cloud-actions"><button class="app-button" type="button" data-ssos-cloud-save>☁️ '+esc(t('save'))+'</button><button class="app-button secondary" type="button" data-ssos-cloud-restore>↩ '+esc(t('restore'))+'</button></div>'+
      '<p class="ssos-cloud-note">'+esc(session.lastBackupAt ? t('lastBackup')+': '+new Date(session.lastBackupAt).toLocaleString() : t('notYet'))+'</p>'+
      '<button class="ssos-cloud-logout" type="button" data-ssos-cloud-logout>'+esc(t('logout'))+'</button>'+
      '<p class="ssos-cloud-note">'+esc(t('privacy'))+'</p><p class="ssos-cloud-status" data-ssos-cloud-status role="status" aria-live="polite"></p></div>';
  }
  function mountPanels() {
    document.querySelectorAll('[data-ssos-cloud-account]').forEach(renderPanel);
  }
  function formBody(values) {
    return new URLSearchParams(values).toString();
  }
  async function oauthPost(url, values) {
    const response = await fetch(url, {
      method:'POST',
      headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},
      body:formBody(values),
      cache:'no-store',
      credentials:'omit'
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error_description || data.message || ('GitHub HTTP '+response.status));
    return data;
  }
  async function requestDeviceCode() {
    const data = await oauthPost(DEVICE_CODE_URL, {
      client_id:GITHUB_APP_CLIENT_ID,
      scope:'offline_access'
    });
    if (!data.device_code || !data.user_code || !data.verification_uri) {
      throw new Error(data.error_description || data.error || t('authError'));
    }
    return {
      deviceCode:data.device_code,
      userCode:data.user_code,
      verificationUri:data.verification_uri,
      interval:Math.max(5,Number(data.interval)||5),
      expiresAt:Date.now()+(Math.max(60,Number(data.expires_in)||900)*1000)
    };
  }
  async function startLogin() {
    if (!GITHUB_APP_CLIENT_ID || GITHUB_APP_CLIENT_ID === 'GITHUB_APP_CLIENT_ID_HERE') {
      setStatus(t('notConfigured'),true); return;
    }
    installationStage=true;
    try { window.open(GITHUB_APP_INSTALL_URL,'_blank','noopener,noreferrer'); } catch {}
    mountPanels();
    setStatus(t('installFirst'));
  }
  async function startDeviceFlow() {
    installationStage=false;
    try {
      // Open a blank tab directly from the button click so later navigation is not blocked as a popup.
      try { verificationWindow=window.open('about:blank','_blank'); } catch { verificationWindow=null; }
      setStatus(t('signingIn'));
      const flow=await requestDeviceCode();
      deviceFlow=flow;
      mountPanels();
      setTimeout(async()=>{
        if(deviceFlow!==flow)return;
        try {
          if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');
          await navigator.clipboard.writeText(flow.userCode);
          if(deviceFlow===flow)setStatus(t('codeCopied'));
        } catch { if(deviceFlow===flow)setStatus(t('copyFailed'),true); }
      },1800);
      setTimeout(()=>{
        if(deviceFlow!==flow)return;
        try {
          if(verificationWindow&&!verificationWindow.closed){verificationWindow.location.href=flow.verificationUri;verificationWindow=null;}
          else window.open(flow.verificationUri,'_blank','noopener,noreferrer');
        } catch {}
      },3900);
      pollForAuthorization(flow);
    } catch (error) {
      deviceFlow=null;installationStage=false;mountPanels();setStatus(error.message||t('authError'),true);
    }
  }
  async function appInstallationDetected() {
    const data=await githubApi('/user/installations?per_page=100');
    return (Array.isArray(data?.installations)?data.installations:[]).some(item=>item?.app_slug===GITHUB_APP_SLUG);
  }
  async function waitForAppInstallation() {
    installationPending=true;mountPanels();setStatus(t('checkingInstallation'));
    for(let attempt=0;attempt<60&&installationPending;attempt++){
      if(await appInstallationDetected()){installationPending=false;mountPanels();return true;}
      setStatus(t('waitingForInstallation'));
      await pause(5000);
    }
    if(!installationPending)throw new Error(t('cancelled'));
    installationPending=false;
    throw new Error(t('installationMissing'));
  }
  async function copyDeviceCode() {
    if(!deviceFlow?.userCode)return;
    await navigator.clipboard.writeText(deviceFlow.userCode);
    setStatus(t('codeCopied'));
  }
  async function pollForAuthorization(flow) {
    if (polling) return;
    polling=true;
    let interval=flow.interval;
    try {
      while (deviceFlow===flow && Date.now()<flow.expiresAt) {
        await pause(interval*1000);
        if (deviceFlow!==flow) return;
        const data=await oauthPost(TOKEN_URL,{
          client_id:GITHUB_APP_CLIENT_ID,
          device_code:flow.deviceCode,
          grant_type:'urn:ietf:params:oauth:grant-type:device_code'
        });
        if (data.error==='authorization_pending') continue;
        if (data.error==='slow_down') { interval+=5; continue; }
        if (data.error==='access_denied') throw new Error(t('cancelled'));
        if (data.error==='expired_token') throw new Error(t('expired'));
        if (data.error) throw new Error(data.error_description||data.error);
        if (!data.access_token) throw new Error(t('authError'));
        deviceFlow=null;
        await completeLogin(data);
        return;
      }
      if (deviceFlow===flow) {
        deviceFlow=null;mountPanels();setStatus(t('expired'),true);
      }
    } catch (error) {
      deviceFlow=null;installationPending=false;installationStage=false;session=null;storageRemove().catch(()=>{});mountPanels();setStatus(error.status===403?t('repoPermission'):(error.message||t('authError')),true);notifyAccountState();
    } finally {
      polling=false;
    }
  }
  async function githubApi(path, options={}) {
    await ensureFreshToken();
    const response=await fetch(API+path,{
      ...options,
      headers:{
        Accept:'application/vnd.github+json',
        Authorization:'Bearer '+session.accessToken,
        'X-GitHub-Api-Version':API_VERSION,
        ...(options.body?{'Content-Type':'application/json'}:{}),
        ...(options.headers||{})
      },
      cache:'no-store',
      credentials:'omit'
    });
    const raw=await response.text();
    let data=null;try{data=raw?JSON.parse(raw):null;}catch{}
    if(!response.ok){
      const error=new Error(data?.message||('GitHub API HTTP '+response.status));
      error.status=response.status;error.data=data;
      throw error;
    }
    return data;
  }
  async function ensureFreshToken() {
    if (!session?.accessToken) throw new Error(t('authError'));
    if (!session.expiresAt || session.expiresAt>Date.now()+60000) return;
    if (!session.refreshToken || (session.refreshExpiresAt && session.refreshExpiresAt<Date.now()+60000)) {
      await storageRemove();session=null;mountPanels();notifyAccountState();throw new Error(t('authError')+' Please connect again.');
    }
    const data=await oauthPost(TOKEN_URL,{
      client_id:GITHUB_APP_CLIENT_ID,
      grant_type:'refresh_token',
      refresh_token:session.refreshToken
    });
    if (!data.access_token) throw new Error(data.error_description||data.error||t('authError'));
    session={
      ...session,
      accessToken:data.access_token,
      refreshToken:data.refresh_token||session.refreshToken,
      expiresAt:Date.now()+(Number(data.expires_in)||28800)*1000,
      refreshExpiresAt:Date.now()+(Number(data.refresh_token_expires_in)||15897600)*1000
    };
    await storageSet(session);
  }
  async function completeLogin(tokens) {
    session={
      accessToken:tokens.access_token,
      refreshToken:tokens.refresh_token||'',
      expiresAt:Date.now()+(Number(tokens.expires_in)||28800)*1000,
      refreshExpiresAt:Date.now()+(Number(tokens.refresh_token_expires_in)||0)*1000,
      user:null,
      repo:null,
      lastBackupAt:null
    };
    setStatus(t('creating'));
    const user=await githubApi('/user');
    const emails=await githubApi('/user/emails?per_page=100');
    const primary=(Array.isArray(emails)?emails:[]).find(item=>item.primary===true&&item.verified===true);
    if (!primary?.email) {
      session=null;mountPanels();throw new Error(t('emailMissing'));
    }
    session.user={id:user.id,login:user.login,name:user.name||user.login,email:primary.email};
    await waitForAppInstallation();
    await ensureCloudRepository();
    await storageSet(session);
    mountPanels();setStatus(t('created'));notifyAccountState();
  }
  async function ensureCloudRepository() {
    if (!session?.user?.login) throw new Error(t('authError'));
    let repository;
    try {
      repository=await githubApi('/repos/'+encodeURIComponent(session.user.login)+'/'+REPO_NAME);
    } catch (error) {
      if (error.status!==404) throw error;
      repository=await githubApi('/user/repos',{
        method:'POST',
        body:JSON.stringify({
          name:REPO_NAME,
          description:'Privater Schleim-OS-Cloudspeicher für persönliche Geräteeinstellungen und Backups.',
          private:true,
          auto_init:true,
          has_issues:false,
          has_projects:false,
          has_wiki:false
        })
      });
    }
    if (Number(repository.owner?.id)!==Number(session.user.id)) throw new Error(t('ownerMismatch'));
    if (repository.private!==true) throw new Error(t('repoPublic'));
    session.repo={
      id:repository.id,
      full_name:repository.full_name,
      html_url:repository.html_url,
      default_branch:repository.default_branch||'main'
    };
  }
  function encodeBase64Utf8(value) {
    const bytes=new TextEncoder().encode(value);
    let binary='';
    for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
    return btoa(binary);
  }
  function decodeBase64Utf8(value) {
    const binary=atob(String(value||'').replace(/\s/g,''));
    const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  function collectPreferences() {
    const preferences={};
    for(let index=0;index<localStorage.length;index++){
      const key=localStorage.key(index);
      if(!key||!/^ssos-[a-zA-Z0-9_-]{1,64}$/.test(key))continue;
      if(key===STORAGE_KEY||key.startsWith('ssosGithubCloud'))continue;
      try{preferences[key]=JSON.parse(localStorage.getItem(key));}
      catch{preferences[key]=localStorage.getItem(key);}
    }
    const design=window.SSOSPersonalization?.getCloudBackupDesign?.();
    if(design){
      preferences['ssos-personalization-v1']=design.personalization;
      preferences['ssos-store-v1']=design.store;
      preferences['ssos-wallpaper']=design.wallpaper.system;
    }
    return preferences;
  }
  async function saveCloudBackup() {
    if(!session?.user||!session?.repo)throw new Error(t('authError'));
    setStatus(t('creating'));
    const design=window.SSOSPersonalization?.getCloudBackupDesign?.()||null;
    const backup={
      format:'schleim-os-cloud-backup',
      schemaVersion:2,
      exportedAt:new Date().toISOString(),
      owner:{id:session.user.id,login:session.user.login},
      design:design?{homeAppOrder:design.homeAppOrder,installedStoreApps:design.installedStoreApps,wallpaper:design.wallpaper}:null,
      preferences:collectPreferences()
    };
    if(!Object.keys(backup.preferences).length)throw new Error('No Schleim OS settings were found to back up.');
    const path='/repos/'+session.repo.full_name+'/contents/'+BACKUP_PATH;
    let sha;
    try{
      const current=await githubApi(path+'?ref='+encodeURIComponent(session.repo.default_branch));
      sha=current.sha;
    }catch(error){if(error.status!==404)throw error;}
    const body={
      message:'Schleim OS cloud backup',
      content:encodeBase64Utf8(JSON.stringify(backup,null,2)+'\n'),
      ...(sha?{sha}:{})
    };
    await githubApi(path,{method:'PUT',body:JSON.stringify(body)});
    session.lastBackupAt=backup.exportedAt;
    await storageSet(session);
    mountPanels();setStatus(t('saved'));
  }
  async function restoreCloudBackup() {
    if(!session?.user||!session?.repo)throw new Error(t('authError'));
    if(!confirm(t('confirmRestore')))return;
    const path='/repos/'+session.repo.full_name+'/contents/'+BACKUP_PATH+'?ref='+encodeURIComponent(session.repo.default_branch);
    let file;
    try{file=await githubApi(path);}
    catch(error){if(error.status===404){setStatus(t('noBackup'),true);return;}throw error;}
    const backup=JSON.parse(decodeBase64Utf8(file.content));
    if(backup?.format!=='schleim-os-cloud-backup'||![1,2].includes(backup.schemaVersion)||
       Number(backup.owner?.id)!==Number(session.user.id)||
       !backup.preferences||typeof backup.preferences!=='object'||Array.isArray(backup.preferences)||
       (backup.schemaVersion===2&&(!backup.design||!Array.isArray(backup.design.homeAppOrder)||!Array.isArray(backup.design.installedStoreApps)||!backup.design.wallpaper))){
      throw new Error('The cloud backup is invalid or belongs to another GitHub account.');
    }
    const restoredPreferences={...backup.preferences};
    if(backup.schemaVersion===2){
      const personal={...(restoredPreferences['ssos-personalization-v1']||{})};
      personal.homeOrder=[...backup.design.homeAppOrder];
      personal.wallpaperUrl=String(backup.design.wallpaper.customUrl||'');
      if(!backup.design.wallpaper.customImageIncluded)personal.wallpaperData='';
      restoredPreferences['ssos-personalization-v1']=personal;
      const store={...(restoredPreferences['ssos-store-v1']||{})};
      store.installed=[...backup.design.installedStoreApps];
      restoredPreferences['ssos-store-v1']=store;
      restoredPreferences['ssos-wallpaper']=backup.design.wallpaper.system??'midnight';
    }
    const entries=Object.entries(restoredPreferences).filter(([key])=>
      /^ssos-[a-zA-Z0-9_-]{1,64}$/.test(key)&&key!==STORAGE_KEY&&!key.startsWith('ssosGithubCloud')
    );
    if(!entries.length)throw new Error('The cloud backup does not contain Schleim OS settings.');
    for(let index=localStorage.length-1;index>=0;index--){
      const key=localStorage.key(index);
      if(key?.startsWith('ssos-')&&key!==STORAGE_KEY&&!key.startsWith('ssosGithubCloud'))localStorage.removeItem(key);
    }
    for(const [key,value] of entries)localStorage.setItem(key,JSON.stringify(value));
    setStatus(t('restored'));
    setTimeout(()=>window.location.reload(),900);
  }
  async function signOut() {
    if(!confirm(t('signOutConfirm')))return;
    deviceFlow=null;installationStage=false;installationPending=false;session=null;
    try{verificationWindow?.close();}catch{} verificationWindow=null;
    await storageRemove();
    mountPanels();setStatus(t('cancelled'));notifyAccountState();
  }
  async function handleAction(action) {
    const button=action.closest('button');
    if(button)button.disabled=true;
    try{
      if(action.matches('[data-ssos-cloud-login]'))await startLogin();
      else if(action.matches('[data-ssos-cloud-install-continue]'))await startDeviceFlow();
      else if(action.matches('[data-ssos-cloud-copy]'))await copyDeviceCode();
      else if(action.matches('[data-ssos-cloud-cancel]')){deviceFlow=null;installationStage=false;installationPending=false;try{verificationWindow?.close();}catch{} verificationWindow=null;session=null;await storageRemove();mountPanels();setStatus(t('cancelled'));notifyAccountState();}
      else if(action.matches('[data-ssos-cloud-save]'))await saveCloudBackup();
      else if(action.matches('[data-ssos-cloud-restore]'))await restoreCloudBackup();
      else if(action.matches('[data-ssos-cloud-logout]'))await signOut();
    }catch(error){
      const friendly=error.status===403||error.status===404? t('repoPermission') : (error.message||t('backupError'));
      setStatus(friendly,true);
    }finally{if(button?.isConnected)button.disabled=false;}
  }
  function init() {
    mountPanels();
    storageGet().then(async value=>{
      if(value?.accessToken&&value?.user&&value?.repo){
        session=value;
        try { if(!await appInstallationDetected()){session=null;await storageRemove();} }
        catch { session=null;await storageRemove(); }
      }
      accountReady=true;
      mountPanels();
      notifyAccountState();
    }).catch(error=>{
      session=null;
      accountReady=true;
      mountPanels();
      setStatus(error.message,true);
      notifyAccountState();
    });
    document.addEventListener('click',event=>{
      const action=event.target.closest('[data-ssos-cloud-login],[data-ssos-cloud-install-continue],[data-ssos-cloud-copy],[data-ssos-cloud-cancel],[data-ssos-cloud-save],[data-ssos-cloud-restore],[data-ssos-cloud-logout]');
      if(action){event.preventDefault();handleAction(action);}
    });
    if(document.body&&!observer){
      observer=new MutationObserver(records=>{
        const addedPanel=records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&(node.matches?.('[data-ssos-cloud-account]')||node.querySelector?.('[data-ssos-cloud-account]'))));
        if(addedPanel)mountPanels();
      });
      observer.observe(document.body,{childList:true,subtree:true});
    }
  }
  window.SSOSCloudAccount=Object.freeze({
    mount:mountPanels,
    getAccount:()=>session?.user?{...session.user,repository:session.repo?.full_name||null}:null,
    getState:()=>({ready:accountReady,authenticated:accountReady&&!installationStage&&!installationPending&&!!(session?.accessToken&&session?.user&&session?.repo)})
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();