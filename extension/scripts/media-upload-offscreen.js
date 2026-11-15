(() => {
  'use strict';

  const DB_NAME = 'ssos-media-upload-queue';
  const DB_VERSION = 1;
  const STORE = 'jobs';
  const API = 'https://api.github.com';
  const TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const CLIENT_ID = 'Iv23lihfJBU95UVCrVt1';
  const REPO_NAME = 'schleim-os-cloud-photos-and-videos';
  const INDEX_PATH = '_metadata/media-index.json';
  const MAX_FILE_BYTES = 50 * 1024 * 1024;
  const SAFE_FILE_BYTES = 49 * 1024 * 1024;
  const activeJobs = new Set();
  let auth = null;

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, {keyPath:'id'});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Upload-Warteschlange kann nicht geöffnet werden.'));
    });
  }
  async function readJob(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      request.onsuccess = () => { db.close(); resolve(request.result || null); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  }
  async function deleteJob(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }
  function tellWorker(type, data) {
    return chrome.runtime.sendMessage(Object.assign({type:type}, data || {})).catch(() => null);
  }
  function progress(jobId, done, total, stage, filename, details) {
    const ratio = Math.max(0, Math.min(1, Number(details?.ratio) || 0));
    const percent = Math.min(99, Math.round(((done + ratio) / Math.max(1,total)) * 100));
    return tellWorker('SSOS_MEDIA_UPLOAD_PROGRESS', {
      jobId:jobId, progress:percent, completed:done, total:total,
      stage:stage, filename:filename || '', message:details?.message || ''
    });
  }
  function base64FromBytes(bytes) {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }
  async function blobToBase64(blob) {
    return base64FromBytes(new Uint8Array(await blob.arrayBuffer()));
  }
  function decodeBase64(value) {
    const binary = atob(String(value || '').replace(/\s/g,''));
    const bytes = new Uint8Array(binary.length);
    for (let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function encodePath(value) {
    return String(value).split('/').map(encodeURIComponent).join('/');
  }
  async function refreshAuth() {
    if (!auth?.accessToken) throw new Error('Kein gültiger GitHub-Zugang vorhanden. Bitte melde dich erneut an.');
    if (!auth.expiresAt || auth.expiresAt > Date.now() + 60000) return;
    if (!auth.refreshToken || (auth.refreshExpiresAt && auth.refreshExpiresAt < Date.now() + 60000)) {
      throw new Error('Die GitHub-Sitzung ist abgelaufen. Bitte melde dich in Schleim OS erneut an.');
    }
    const body = new URLSearchParams({
      client_id:CLIENT_ID,
      grant_type:'refresh_token',
      refresh_token:auth.refreshToken
    });
    const response = await fetch(TOKEN_URL, {
      method:'POST',
      headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},
      body:body.toString(), cache:'no-store', credentials:'omit'
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || 'GitHub-Anmeldung konnte nicht erneuert werden.');
    }
    auth = Object.assign({}, auth, {
      accessToken:data.access_token,
      refreshToken:data.refresh_token || auth.refreshToken,
      expiresAt:Date.now() + (Number(data.expires_in) || 28800) * 1000,
      refreshExpiresAt:Date.now() + (Number(data.refresh_token_expires_in) || 15897600) * 1000
    });
    await tellWorker('SSOS_MEDIA_TOKEN_REFRESHED', {
      tokens:{
        accessToken:auth.accessToken, refreshToken:auth.refreshToken,
        expiresAt:auth.expiresAt, refreshExpiresAt:auth.refreshExpiresAt
      }
    });
  }
  async function apiRequest(path, options) {
    await refreshAuth();
    const response = await fetch(API + path, Object.assign({}, options || {}, {
      headers:Object.assign({
        Accept:'application/vnd.github+json',
        Authorization:'Bearer ' + auth.accessToken,
        'X-GitHub-Api-Version':'2022-11-28'
      }, options?.headers || {}),
      cache:'no-store', credentials:'omit'
    }));
    const raw = await response.text();
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
    if (!response.ok) {
      const error = new Error((typeof data === 'string' ? data : data?.message) || ('GitHub API HTTP ' + response.status));
      error.status = response.status;
      throw error;
    }
    return data;
  }
  async function apiPut(path, payload, onUploadProgress) {
    await refreshAuth();
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', API + path, true);
      xhr.setRequestHeader('Accept','application/vnd.github+json');
      xhr.setRequestHeader('Authorization','Bearer ' + auth.accessToken);
      xhr.setRequestHeader('X-GitHub-Api-Version','2022-11-28');
      xhr.setRequestHeader('Content-Type','application/json');
      xhr.upload.onprogress = event => {
        if (event.lengthComputable && typeof onUploadProgress === 'function') {
          onUploadProgress(Math.max(0, Math.min(1, event.loaded / event.total)));
        }
      };
      xhr.onerror = () => reject(new Error('Netzwerkfehler beim Medien-Upload.'));
      xhr.onabort = () => reject(new Error('Medien-Upload wurde abgebrochen.'));
      xhr.onload = () => {
        let data = null;
        try { data = xhr.responseText ? JSON.parse(xhr.responseText) : null; } catch {}
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(data?.message || ('GitHub API HTTP ' + xhr.status)));
          return;
        }
        resolve(data);
      };
      xhr.send(JSON.stringify(payload));
    });
  }
  async function getIndex() {
    const path = '/repos/' + encodeURIComponent(auth.user.login) + '/' + REPO_NAME + '/contents/' + encodePath(INDEX_PATH);
    try {
      const file = await apiRequest(path);
      const parsed = JSON.parse(decodeBase64(file.content));
      if (parsed?.format !== 'schleim-os-media-index' || Number(parsed.owner?.id) !== Number(auth.user.id)) {
        throw new Error('Die Medien-Metadaten gehören nicht zum angemeldeten Konto.');
      }
      return {items:Array.isArray(parsed.items) ? parsed.items : [], sha:file.sha || null};
    } catch (error) {
      if (error.status === 404) return {items:[],sha:null};
      throw error;
    }
  }
  async function putBlob(path, blob, message, onProgress) {
    if (blob.size > MAX_FILE_BYTES) throw new Error('Die komprimierte Datei überschreitet weiterhin 50 MiB.');
    const payload = {
      message:message,
      content:await blobToBase64(blob),
      branch:auth.repo.default_branch || 'main'
    };
    return apiPut('/repos/' + encodeURIComponent(auth.user.login) + '/' + REPO_NAME + '/contents/' + encodePath(path), payload, onProgress);
  }
  async function updateIndex(items) {
    const existing = await getIndex();
    const index = {
      format:'schleim-os-media-index', schemaVersion:1,
      owner:{id:auth.user.id,login:auth.user.login},
      updatedAt:new Date().toISOString(), items:items
    };
    const payload = {
      message:'Update Schleim OS media library index',
      content:await blobToBase64(new Blob([JSON.stringify(index,null,2) + '\n'],{type:'application/json'})),
      branch:auth.repo.default_branch || 'main'
    };
    if (existing.sha) payload.sha = existing.sha;
    await apiPut('/repos/' + encodeURIComponent(auth.user.login) + '/' + REPO_NAME + '/contents/' + encodePath(INDEX_PATH), payload);
  }
  function readAscii(bytes, offset) {
    return String.fromCharCode(bytes[offset],bytes[offset+1],bytes[offset+2],bytes[offset+3]);
  }
  function isAnimatedImage(file) {
    const type = String(file.type || '').toLowerCase();
    if (type === 'image/gif' || type === 'image/svg+xml') return true;
    return file.slice(0, 2 * 1024 * 1024).arrayBuffer().then(buffer => {
      const bytes = new Uint8Array(buffer);
      if (type === 'image/png') {
        for (let i=8;i+8<bytes.length;) {
          const kind=readAscii(bytes,i+4);
          if (kind==='acTL') return true;
          const len=(bytes[i]*0x1000000)+(bytes[i+1]<<16)+(bytes[i+2]<<8)+bytes[i+3];
          if (kind==='IDAT'||kind==='IEND') return false;
          if (!Number.isFinite(len)||len<0||i+12+len>bytes.length) break;
          i += 12 + len;
        }
        return false;
      }
      if (type === 'image/webp') {
        for (let i=12;i+8<bytes.length;) {
          const kind=readAscii(bytes,i);
          if (kind==='ANIM'||kind==='ANMF') return true;
          const len=bytes[i+4]+(bytes[i+5]<<8)+(bytes[i+6]<<16)+(bytes[i+7]*0x1000000);
          if (kind==='VP8 '||kind==='VP8L') return false;
          if (!Number.isFinite(len)||len<0||i+8+len>bytes.length) break;
          i += 8 + len + (len%2);
        }
      }
      return false;
    });
  }
  async function canvasBlob(canvas, quality) {
    return new Promise(resolve => canvas.toBlob(resolve,'image/webp',quality));
  }
  async function compressPhoto(file, jobId, index, total) {
    if (!file.type.startsWith('image/') || typeof createImageBitmap !== 'function') return {blob:file,optimized:false,width:0,height:0,extension:null};
    if (await isAnimatedImage(file)) {
      if (file.size > MAX_FILE_BYTES) throw new Error('Animierte Bilder über 50 MiB können nicht verlustfrei komprimiert werden.');
      return {blob:file,optimized:false,width:0,height:0,extension:null};
    }
    let bitmap;
    try { bitmap = await createImageBitmap(file,{imageOrientation:'from-image'}); }
    catch { return {blob:file,optimized:false,width:0,height:0,extension:null}; }
    try {
      const profiles=[
        {edge:2560,q:0.88},{edge:2048,q:0.80},{edge:1600,q:0.72},
        {edge:1280,q:0.64},{edge:960,q:0.56},{edge:720,q:0.48}
      ];
      let best=null;
      for (let p=0;p<profiles.length;p++) {
        const scale=Math.min(1,profiles[p].edge/Math.max(bitmap.width,bitmap.height));
        const width=Math.max(1,Math.round(bitmap.width*scale));
        const height=Math.max(1,Math.round(bitmap.height*scale));
        const canvas=document.createElement('canvas');
        canvas.width=width;canvas.height=height;
        const context=canvas.getContext('2d');
        if (!context) break;
        context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
        context.drawImage(bitmap,0,0,width,height);
        const blob=await canvasBlob(canvas,profiles[p].q);
        canvas.width=0;canvas.height=0;
        if (!blob) continue;
        if (!best || blob.size<best.blob.size) best={blob:blob,width:width,height:height};
        await progress(jobId,index,total,'compress',file.name,{ratio:0.12+0.2*((p+1)/profiles.length),message:'Foto wird komprimiert'});
        if (blob.size<=SAFE_FILE_BYTES) {
          if (blob.size<=file.size || file.size>SAFE_FILE_BYTES) {
            return {blob:blob,optimized:true,width:width,height:height,extension:'webp'};
          }
          return {blob:file,optimized:false,width:bitmap.width,height:bitmap.height,extension:null};
        }
      }
      if (best && best.blob.size<=MAX_FILE_BYTES) {
        return {blob:best.blob,optimized:true,width:best.width,height:best.height,extension:'webp'};
      }
      if (file.size<=MAX_FILE_BYTES) return {blob:file,optimized:false,width:bitmap.width,height:bitmap.height,extension:null};
      throw new Error('Das Foto konnte auch mit starker Komprimierung nicht unter 50 MiB gebracht werden.');
    } finally {
      bitmap.close?.();
    }
  }
  async function waitForMedia(video) {
    if (video.readyState >= 1 && Number.isFinite(video.duration)) return;
    await new Promise((resolve,reject) => {
      const timer=setTimeout(()=>reject(new Error('Videodatei konnte nicht dekodiert werden.')),30000);
      video.addEventListener('loadedmetadata',()=>{clearTimeout(timer);resolve();},{once:true});
      video.addEventListener('error',()=>{clearTimeout(timer);reject(new Error('Videodatei wird von diesem Browser nicht unterstützt.'));},{once:true});
    });
  }
  async function compressVideo(file, jobId, index, total) {
    if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) {
      throw new Error('Dieser Browser unterstützt keine lokale Video-Neukodierung. Das Video wurde nicht unkomprimiert hochgeladen.');
    }
    const objectUrl=URL.createObjectURL(file);
    const video=document.createElement('video');
    video.preload='auto';video.playsInline=true;video.muted=false;video.volume=0;
    video.src=objectUrl;
    let recorder=null,raf=0,stream=null;
    try {
      await waitForMedia(video);
      const duration=Number(video.duration);
      if (!Number.isFinite(duration)||duration<=0) throw new Error('Die Videolänge konnte nicht bestimmt werden.');
      const totalBudget=Math.floor((SAFE_FILE_BYTES*8/duration)*0.78);
      if (totalBudget<40000) throw new Error('Dieses Video ist für das 50-MiB-Limit zu lang. Kürze es bitte vor dem Upload.');
      const maxEdge=1280;
      const scale=Math.min(1,maxEdge/Math.max(video.videoWidth,video.videoHeight));
      const width=Math.max(2,Math.round(video.videoWidth*scale/2)*2);
      const height=Math.max(2,Math.round(video.videoHeight*scale/2)*2);
      const canvas=document.createElement('canvas');
      canvas.width=width;canvas.height=height;
      const context=canvas.getContext('2d');
      if (!context) throw new Error('Video-Canvas konnte nicht erstellt werden.');
      const canvasStream=canvas.captureStream(24);
      stream=canvasStream;
      let audioTracks=[];
      if (typeof video.captureStream==='function') {
        try { audioTracks=video.captureStream().getAudioTracks(); } catch {}
      }
      const audioBitrate=audioTracks.length ? Math.min(48000,Math.max(12000,Math.floor(totalBudget*0.12))) : 0;
      const videoBitrate=Math.max(24000,totalBudget-audioBitrate);
      audioTracks.forEach(track=>stream.addTrack(track));
      const mimeTypes=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
      const mimeType=mimeTypes.find(type=>MediaRecorder.isTypeSupported?.(type));
      if (!mimeType) throw new Error('Kein unterstützter WebM-Codec für die Videokomprimierung gefunden.');
      const chunks=[];
      recorder=new MediaRecorder(stream,{
        mimeType:mimeType,
        videoBitsPerSecond:videoBitrate,
        ...(audioBitrate?{audioBitsPerSecond:audioBitrate}:{})
      });
      const stopped=new Promise((resolve,reject)=>{
        recorder.ondataavailable=event=>{if(event.data?.size)chunks.push(event.data);};
        recorder.onerror=event=>reject(event.error||new Error('Video-Neukodierung fehlgeschlagen.'));
        recorder.onstop=()=>resolve(new Blob(chunks,{type:recorder.mimeType||'video/webm'}));
      });
      const draw=()=>{
        if (video.ended || video.paused) return;
        try { context.drawImage(video,0,0,width,height); } catch {}
        const ratio=Math.max(0,Math.min(1,video.currentTime/duration));
        progress(jobId,index,total,'compress',file.name,{ratio:0.32+ratio*0.28,message:'Video wird neu kodiert'});
        raf=requestAnimationFrame(draw);
      };
      recorder.start(1000);
      await video.play();
      draw();
      await new Promise((resolve,reject)=>{
        video.addEventListener('ended',resolve,{once:true});
        video.addEventListener('error',()=>reject(new Error('Fehler beim Lesen des Videos.')),{once:true});
      });
      if (raf) cancelAnimationFrame(raf);
      if (recorder.state!=='inactive') recorder.stop();
      const blob=await stopped;
      if (blob.size>MAX_FILE_BYTES) throw new Error('Das Video bleibt trotz Neu-Kodierung größer als 50 MiB. Bitte kürze es oder wähle eine kürzere Aufnahme.');
      if (!blob.size) throw new Error('Die komprimierte Videodatei ist leer.');
      return {blob:blob,optimized:true,width:width,height:height,extension:'webm'};
    } finally {
      if (raf) cancelAnimationFrame(raf);
      if (recorder && recorder.state!=='inactive') { try { recorder.stop(); } catch {} }
      stream?.getTracks?.().forEach(track=>track.stop());
      video.pause();video.removeAttribute('src');video.load();
      URL.revokeObjectURL(objectUrl);
    }
  }
  async function makeThumbnail(blob) {
    try {
      const bitmap=await createImageBitmap(blob);
      const scale=Math.min(1,420/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(bitmap.width*scale));
      canvas.height=Math.max(1,Math.round(bitmap.height*scale));
      const context=canvas.getContext('2d');
      context.drawImage(bitmap,0,0,canvas.width,canvas.height);
      bitmap.close?.();
      return await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.72));
    } catch { return null; }
  }
  function safeBaseName(value) {
    return String(value||'Medium').normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'Medium';
  }
  function sourceExtension(file) {
    return String(file.name||'').match(/\.([a-z0-9]{1,8})$/i)?.[1]?.toLowerCase() || (file.type.startsWith('video/')?'mp4':'jpg');
  }
  async function uploadOne(jobId, fileRecord, index, total) {
    const file=fileRecord.file;
    const meta=fileRecord.meta||{};
    if (!file || (!file.type?.startsWith('image/')&&!file.type?.startsWith('video/'))) {
      throw new Error('Nur Bild- und Videodateien werden unterstützt.');
    }
    const type=file.type.startsWith('video/')?'video':'photo';
    await progress(jobId,index,total,'compress',file.name,{ratio:0.08,message:'Datei wird vorbereitet'});
    const optimized=type==='video'
      ? await compressVideo(file,jobId,index,total)
      : await compressPhoto(file,jobId,index,total);
    const blob=optimized.blob;
    if (blob.size>MAX_FILE_BYTES) throw new Error('Die Datei überschreitet nach der Komprimierung weiterhin 50 MiB.');
    const capturedAt=new Date(meta.capturedAt||file.lastModified||Date.now());
    const year=String(capturedAt.getFullYear());
    const month=String(capturedAt.getMonth()+1).padStart(2,'0');
    const day=String(capturedAt.getDate()).padStart(2,'0');
    const id=(crypto.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)).replace(/[^a-zA-Z0-9-]/g,'');
    const originalName=String(meta.originalName||file.name||'');
    const extension=optimized.extension||sourceExtension(file);
    const filename=day+'-'+month+'-'+year+'-'+id+'.'+extension;
    const baseName=originalName.replace(/\.[^.]+$/,'')||safeBaseName(filename.replace(/\.[^.]+$/,''));
    const downloadName=optimized.extension ? baseName+'.'+optimized.extension : (originalName||filename);
    const folder=type==='video'?'Videos':'Fotos';
    const path=folder+'/'+year+'/'+year+'-'+month+'/'+filename;
    const progressUpload=ratio=>progress(jobId,index,total,'upload',file.name,{ratio:0.60+ratio*0.32,message:'Datei wird zu GitHub übertragen'});
    const uploaded=await putBlob(path,blob,'Upload '+(type==='video'?'video':'photo')+' to Schleim OS cloud',progressUpload);
    let thumbnailPath='';
    if (type==='photo') {
      const thumb=await makeThumbnail(blob);
      if (thumb) {
        thumbnailPath='Vorschaubilder/'+year+'/'+year+'-'+month+'/'+id+'.jpg';
        try {
          await putBlob(thumbnailPath,thumb,'Create Schleim OS media thumbnail');
        } catch (error) {
          console.warn('[Schleim OS Media Upload] Thumbnail skipped:',error);
          thumbnailPath='';
        }
      }
    }
    const aiDescription=String(meta.aiDescription||'').slice(0,260);
    const aiTags=Array.isArray(meta.aiTags)?meta.aiTags:[];
    const description=String(meta.description||'').trim();
    const combinedDescription=[description,aiDescription].filter(Boolean).join(' · ').slice(0,500);
    const tags=[...new Set([
      ...description.toLowerCase().split(/[ ,\s]+/).filter(Boolean),
      ...aiTags.map(value=>String(value).toLowerCase())
    ])].slice(0,40);
    const item={
      id:id,name:originalName||filename,downloadName:downloadName,
      type:type,mimeType:blob.type||file.type,size:blob.size,originalSize:file.size,
      optimized:!!optimized.optimized,width:optimized.width||0,height:optimized.height||0,
      capturedAt:capturedAt.toISOString(),dateSource:meta.dateSource||'file-last-modified',
      uploadedAt:new Date().toISOString(),path:path,sha:uploaded?.content?.sha||'',
      thumbnailPath:thumbnailPath,description:combinedDescription,
      aiDescription:aiDescription,aiTags:aiTags,tags:tags
    };
    const current=await getIndex();
    current.items.unshift(item);
    await updateIndex(current.items);
    return item;
  }
  async function processJob(message) {
    const jobId=message.jobId;
    if (activeJobs.has(jobId)) return;
    activeJobs.add(jobId);
    auth=message.auth;
    try {
      if (!auth?.user?.login||!auth?.accessToken) throw new Error('Bitte melde dich zuerst unter Einstellungen → Schleim-Konto an.');
      if (auth.repo?.full_name!==auth.user.login+'/'+REPO_NAME || auth.repo?.private!==true) {
        throw new Error('Das private Foto- und Video-Repository ist nicht verknüpft. Öffne zuerst die Fotos-App und verknüpfe den Speicher.');
      }
      const job=await readJob(jobId);
      if (!job || !Array.isArray(job.files) || !job.files.length) throw new Error('Die Upload-Warteschlange ist leer oder nicht mehr verfügbar.');
      const total=job.files.length;
      for (let index=0;index<total;index++) {
        await progress(jobId,index,total,'compress',job.files[index].file?.name,{ratio:0,message:'Datei '+(index+1)+' von '+total+' wird vorbereitet'});
        await uploadOne(jobId,job.files[index],index,total);
        await progress(jobId,index+1,total,'done',job.files[index].file?.name,{ratio:0,message:'Datei '+(index+1)+' von '+total+' abgeschlossen'});
      }
      await deleteJob(jobId);
      await tellWorker('SSOS_MEDIA_UPLOAD_FINISHED',{jobId:jobId,total:total});
    } catch (error) {
      await tellWorker('SSOS_MEDIA_UPLOAD_FAILED',{jobId:jobId,error:String(error?.message||error)});
    } finally {
      activeJobs.delete(jobId);
      auth=null;
    }
  }
  chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if (message?.target!=='offscreen' || message?.type!=='SSOS_MEDIA_UPLOAD_RUN') return false;
    if (!activeJobs.has(message.jobId)) {
      processJob(message);
    }
    sendResponse({ok:true});
    return false;
  });
})();