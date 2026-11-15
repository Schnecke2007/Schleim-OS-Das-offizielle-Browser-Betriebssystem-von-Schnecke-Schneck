const STORAGE_KEY = 'ssos-schleim-account-session-v1';
const STATUS_KEY = 'ssos-media-upload-status';
const OFFSCREEN_PATH = 'pages/media-upload.html';
const NOTIFICATION_PREFIX = 'ssos-media-upload-';
let creatingOffscreen = null;

function notificationId(jobId) { return NOTIFICATION_PREFIX + jobId; }
async function storeStatus(status) {
  await chrome.storage.local.set({[STATUS_KEY]:Object.assign({updatedAt:Date.now()},status)});
}
async function ensureOffscreen() {
  const url=chrome.runtime.getURL(OFFSCREEN_PATH);
  if (chrome.runtime.getContexts) {
    const contexts=await chrome.runtime.getContexts({contextTypes:['OFFSCREEN_DOCUMENT'],documentUrls:[url]});
    if (contexts.length) return;
  } else {
    const clients=await self.clients.matchAll();
    if (clients.some(client=>client.url===url)) return;
  }
  if (creatingOffscreen) { await creatingOffscreen; return; }
  creatingOffscreen=chrome.offscreen.createDocument({
    url:OFFSCREEN_PATH,
    reasons:['BLOBS'],
    justification:'Medien aus einer dauerhaft gespeicherten Upload-Warteschlange komprimieren und hochladen, auch wenn der Fotos-Tab geschlossen wird.'
  });
  try { await creatingOffscreen; } finally { creatingOffscreen=null; }
}
async function showProgress(jobId,progress,message) {
  const id=notificationId(jobId);
  const options={
    type:'progress',
    iconUrl:chrome.runtime.getURL('assets/icons/icon-128.png'),
    title:'Schleim OS – Medien-Upload',
    message:message||'Medien werden komprimiert und hochgeladen …',
    progress:Math.max(0,Math.min(100,Math.round(progress||0))),
    priority:1
  };
  try {
    const exists=await chrome.notifications.getAll();
    if (exists[id]) await chrome.notifications.update(id,options);
    else await chrome.notifications.create(id,options);
  } catch (error) {
    console.warn('[Schleim OS] Fortschrittsbenachrichtigung nicht verfügbar:',error);
  }
}
async function showFinished(jobId,total) {
  const id=notificationId(jobId);
  try { await chrome.notifications.clear(id); } catch {}
  try {
    await chrome.notifications.create(id,{
      type:'basic',
      iconUrl:chrome.runtime.getURL('assets/icons/icon-128.png'),
      title:'Schleim OS – Upload abgeschlossen',
      message:(total||0)+' Datei(en) wurden erfolgreich in deine private Medien-Cloud hochgeladen. Tippe hier, um die Fotos-App zu öffnen.',
      priority:2,
      requireInteraction:true
    });
  } catch (error) {
    console.warn('[Schleim OS] Abschlussbenachrichtigung nicht verfügbar:',error);
  }
}
async function showFailed(jobId,error) {
  const id=notificationId(jobId);
  try { await chrome.notifications.clear(id); } catch {}
  try {
    await chrome.notifications.create(id,{
      type:'basic',
      iconUrl:chrome.runtime.getURL('assets/icons/icon-128.png'),
      title:'Schleim OS – Upload nicht abgeschlossen',
      message:String(error||'Beim Medien-Upload ist ein Fehler aufgetreten.').slice(0,180)+' Tippe hier, um die Fotos-App zu öffnen.',
      priority:2,
      requireInteraction:true
    });
  } catch {}
}
async function startUpload(jobId) {
  const stored=await chrome.storage.local.get(STORAGE_KEY);
  const session=stored?.[STORAGE_KEY];
  if (!session?.user?.login || !session?.accessToken) throw new Error('Bitte melde dich zuerst mit deinem Schleim-Konto an.');
  let repo=session.photosRepo;
  if (!repo?.full_name || repo.full_name!==session.user.login+'/schleim-os-cloud-photos-and-videos') {
    throw new Error('Das private Foto- und Video-Repository ist nicht verknüpft. Öffne zuerst die Fotos-App und verknüpfe den Speicher.');
  }
  if (repo.private!==true) throw new Error('Das Foto- und Video-Repository muss privat sein.');
  await storeStatus({jobId:jobId,phase:'progress',progress:0,message:'Upload wird im Hintergrund vorbereitet.',completed:0,total:0});
  await showProgress(jobId,0,'Upload wird im Hintergrund vorbereitet …');
  await ensureOffscreen();
  const result=await chrome.runtime.sendMessage({
    target:'offscreen',type:'SSOS_MEDIA_UPLOAD_RUN',jobId:jobId,
    auth:{
      accessToken:session.accessToken,refreshToken:session.refreshToken||'',
      expiresAt:session.expiresAt||0,refreshExpiresAt:session.refreshExpiresAt||0,
      user:session.user,repo:repo
    }
  });
  if (!result?.ok) throw new Error('Der Hintergrundprozess konnte nicht gestartet werden.');
}
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if (message?.type==='SSOS_MEDIA_UPLOAD_START') {
    startUpload(message.jobId).then(()=>sendResponse({ok:true})).catch(async error=>{
      await storeStatus({jobId:message.jobId,phase:'failed',progress:0,message:String(error?.message||error)});
      await showFailed(message.jobId,error?.message||error);
      sendResponse({ok:false,error:String(error?.message||error)});
    });
    return true;
  }
  if (message?.type==='SSOS_MEDIA_UPLOAD_PROGRESS') {
    const status={
      jobId:message.jobId,phase:'progress',progress:message.progress||0,
      completed:message.completed||0,total:message.total||0,
      stage:message.stage||'',filename:message.filename||'',message:message.message||''
    };
    storeStatus(status);
    showProgress(message.jobId,status.progress,status.filename
      ? status.filename+' · '+status.progress+'% · '+status.message
      : status.progress+'% · '+status.message);
    sendResponse({ok:true});
    return false;
  }
  if (message?.type==='SSOS_MEDIA_TOKEN_REFRESHED') {
    chrome.storage.local.get(STORAGE_KEY).then(result=>{
      const current=result?.[STORAGE_KEY];
      if (!current) return;
      const next=Object.assign({},current,message.tokens||{});
      return chrome.storage.local.set({[STORAGE_KEY]:next});
    }).then(()=>sendResponse({ok:true})).catch(()=>sendResponse({ok:false}));
    return true;
  }
  if (message?.type==='SSOS_MEDIA_UPLOAD_FINISHED') {
    storeStatus({jobId:message.jobId,phase:'complete',progress:100,completed:message.total||0,total:message.total||0,message:'Upload abgeschlossen.'});
    showFinished(message.jobId,message.total||0);
    sendResponse({ok:true});
    return false;
  }
  if (message?.type==='SSOS_MEDIA_UPLOAD_FAILED') {
    storeStatus({jobId:message.jobId,phase:'failed',progress:0,message:message.error||'Upload fehlgeschlagen.'});
    showFailed(message.jobId,message.error);
    sendResponse({ok:true});
    return false;
  }
  if (message?.target==='offscreen') return false;
  return false;
});
chrome.notifications.onClicked.addListener(notificationIdValue=>{
  if (!notificationIdValue.startsWith(NOTIFICATION_PREFIX)) return;
  chrome.tabs.create({url:chrome.runtime.getURL('pages/newtab.html?openApp=images')});
  chrome.notifications.clear(notificationIdValue);
});
chrome.runtime.onStartup.addListener(async()=>{
  const stored=await chrome.storage.local.get(STATUS_KEY);
  const status=stored?.[STATUS_KEY];
  if (status?.phase==='progress') {
    await storeStatus({jobId:status.jobId,phase:'failed',progress:status.progress||0,message:'Browser wurde beendet. Der Upload kann erst fortgesetzt werden, wenn Schleim OS wieder geöffnet wird.'});
  }
});