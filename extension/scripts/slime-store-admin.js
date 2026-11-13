(() => {
  'use strict';
  const OWNER='Schnecke2007', REPO='Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck', BRANCH='main';
  const CATALOG='extension/data/store-apps.json', API='https://api.github.com', ITERATIONS=310000;
  const CATEGORIES=['tools','ai','media','knowledge','navigation','productivity','communication','privacy','shopping'];
  const TEXT={
    de:{title:'Schleim-Store · Admin-Portal',intro:'Zugriff nur mit deiner verschlüsselten Admin-Datei und Passphrase.',setup:'Admin-Datei erstellen',setupText:'Dein Fine-grained GitHub-Token wird direkt hier im Browser verschlüsselt.',token:'GitHub-Token',pass:'Passphrase (mindestens 12 Zeichen)',repeat:'Passphrase wiederholen',create:'Verschlüsselte JSON-Datei herunterladen',login:'Mit Admin-Datei anmelden',file:'Verschlüsselte Admin-JSON-Datei',unlock:'Anmelden',refresh:'Einreichungen aktualisieren',logout:'Abmelden',scope:'Token-Rechte: nur dieses Repository; Contents: Read and write; Issues: Read and write.',privacy:'Der entschlüsselte Token bleibt nur im Arbeitsspeicher und wird beim Abmelden oder Neuladen verworfen.',pending:'Offene App-Einreichungen',empty:'Keine offenen Einreichungen gefunden.',choose:'Wähle links einen Vorschlag zur Prüfung.',edit:'App prüfen und veröffentlichen',id:'App-ID',name:'App-Name',url:'Webseiten-URL',category:'Kategorie',icon:'Emoji/Icon',iconUrl:'Icon-Bild-URL (optional)',tags:'Suchbegriffe',featured:'Als Empfehlung hervorheben',de:'Beschreibung Deutsch',en:'Description English',nl:'Beschrijving Nederlands',publish:'Genehmigen und veröffentlichen',reject:'Ablehnen',loading:'Wird geladen …',ok:'Admin-Datei erstellt und heruntergeladen.',logged:'Angemeldet. Einreichungen werden geladen …',published:'App im zentralen Store-Katalog veröffentlicht.',rejected:'Einreichung geschlossen.',bad:'Admin-Datei oder Passphrase ungültig.',repo:'Diese Datei gehört nicht zu diesem Repository.',missing:'Bitte alle drei Beschreibungen ausfüllen.',invalid:'Bitte App-ID, Name und http-/https-URLs prüfen.',created:'Erstellt',approved:'Dein Vorschlag wurde geprüft und im Schleim-Store veröffentlicht. Danke!',denied:'Danke für deinen Vorschlag. Die App wurde diesmal nicht aufgenommen.',session:'Admin-Sitzung aktiv – Token nur im Arbeitsspeicher.',tip:'Nach dem Veröffentlichen wird der Store-Katalog neu geladen.',ratings:'Community-Bewertungen',ratingEmpty:'Noch keine Bewertungen vorhanden.',ratingReplyTitle:'Auf Bewertung antworten',ratingUser:'GitHub-Benutzer',ratingScore:'Sternebewertung',ratingFeedback:'Feedback',ratingReplyPlaceholder:'Schreibe eine öffentliche Antwort …',ratingReopen:'Issue wieder öffnen',ratingAlreadyOpen:'Issue ist bereits offen',ratingSendReply:'Antwort auf GitHub senden',ratingThread:'Bisherige Antworten',ratingOpened:'Bewertungs-Issue wieder geöffnet.',ratingReplied:'Antwort wurde veröffentlicht. Das Issue bleibt geöffnet.',ratingReplyMissing:'Bitte gib eine Antwort ein.',ratingIssueLink:'Issue auf GitHub öffnen'},
    en:{title:'Schleim-Store · Admin portal',intro:'Accessible only with your encrypted admin file and passphrase.',setup:'Create admin file',setupText:'Your fine-grained GitHub token is encrypted in this browser.',token:'GitHub token',pass:'Passphrase (at least 12 characters)',repeat:'Repeat passphrase',create:'Download encrypted JSON file',login:'Sign in with admin file',file:'Encrypted admin JSON file',unlock:'Sign in',refresh:'Refresh submissions',logout:'Sign out',scope:'Token permissions: this repository only; Contents: Read and write; Issues: Read and write.',privacy:'The decrypted token stays in memory only and is discarded on sign-out or reload.',pending:'Open app submissions',empty:'No open submissions found.',choose:'Select a suggestion on the left to review it.',edit:'Review and publish app',id:'App ID',name:'App name',url:'Website URL',category:'Category',icon:'Emoji/icon',iconUrl:'Icon image URL (optional)',tags:'Search terms',featured:'Feature as a recommendation',de:'German description',en:'English description',nl:'Dutch description',publish:'Approve and publish',reject:'Reject',loading:'Loading …',ok:'Admin file created and downloaded.',logged:'Signed in. Loading submissions …',published:'App published in the central Store catalogue.',rejected:'Submission closed.',bad:'Admin file or passphrase is invalid.',repo:'This file belongs to another repository.',missing:'Complete all three descriptions.',invalid:'Check the app ID, name and valid http/https URLs.',created:'Created',approved:'Your suggestion was reviewed and published in the Schleim-Store. Thank you!',denied:'Thank you for your suggestion. The app was not added this time.',session:'Admin session active – token is memory-only.',tip:'The Store catalogue will reload after publishing.',ratings:'Community ratings',ratingEmpty:'No ratings have been submitted yet.',ratingReplyTitle:'Reply to rating',ratingUser:'GitHub user',ratingScore:'Star rating',ratingFeedback:'Feedback',ratingReplyPlaceholder:'Write a public reply …',ratingReopen:'Reopen issue',ratingAlreadyOpen:'Issue is already open',ratingSendReply:'Send reply on GitHub',ratingThread:'Previous replies',ratingOpened:'Rating issue reopened.',ratingReplied:'Your reply was published. The issue remains open.',ratingReplyMissing:'Enter a reply first.',ratingIssueLink:'Open issue on GitHub'},
    nl:{title:'Schleim-Store · Adminportaal',intro:'Alleen toegankelijk met je versleutelde beheerdersbestand en wachtzin.',setup:'Beheerdersbestand maken',setupText:'Je fine-grained GitHub-token wordt in deze browser versleuteld.',token:'GitHub-token',pass:'Wachtzin (minimaal 12 tekens)',repeat:'Wachtzin herhalen',create:'Versleuteld JSON-bestand downloaden',login:'Aanmelden met beheerdersbestand',file:'Versleuteld beheerders-JSON-bestand',unlock:'Aanmelden',refresh:'Inzendingen vernieuwen',logout:'Afmelden',scope:'Tokenrechten: alleen deze repository; Contents: Read and write; Issues: Read and write.',privacy:'Het ontsleutelde token blijft alleen in het geheugen en wordt bij afmelden of vernieuwen gewist.',pending:'Openstaande app-inzendingen',empty:'Geen open inzendingen gevonden.',choose:'Selecteer links een voorstel om te beoordelen.',edit:'App controleren en publiceren',id:'App-ID',name:'App-naam',url:'Website-URL',category:'Categorie',icon:'Emoji/pictogram',iconUrl:'Afbeeldings-URL (optioneel)',tags:'Zoektermen',featured:'Als aanbeveling uitlichten',de:'Duitse beschrijving',en:'Engelse beschrijving',nl:'Nederlandse beschrijving',publish:'Goedkeuren en publiceren',reject:'Afwijzen',loading:'Laden …',ok:'Beheerdersbestand gemaakt en gedownload.',logged:'Aangemeld. Inzendingen worden geladen …',published:'App gepubliceerd in de centrale Store-catalogus.',rejected:'Inzending gesloten.',bad:'Beheerdersbestand of wachtzin is ongeldig.',repo:'Dit bestand hoort bij een andere repository.',missing:'Vul alle drie beschrijvingen in.',invalid:'Controleer app-ID, naam en geldige http-/https-URL’s.',created:'Aangemaakt',approved:'Je voorstel is beoordeeld en gepubliceerd in de Schleim-Store. Bedankt!',denied:'Bedankt voor je voorstel. De app is deze keer niet toegevoegd.',session:'Beheerderssessie actief – token alleen in geheugen.',tip:'De Store-catalogus wordt na publicatie opnieuw geladen.',ratings:'Communitybeoordelingen',ratingEmpty:'Er zijn nog geen beoordelingen.',ratingReplyTitle:'Reageren op beoordeling',ratingUser:'GitHub-gebruiker',ratingScore:'Sterrenbeoordeling',ratingFeedback:'Feedback',ratingReplyPlaceholder:'Schrijf een openbare reactie …',ratingReopen:'Issue opnieuw openen',ratingAlreadyOpen:'Issue is al geopend',ratingSendReply:'Reactie op GitHub plaatsen',ratingThread:'Eerdere reacties',ratingOpened:'Beoordelingsissue opnieuw geopend.',ratingReplied:'Je reactie is gepubliceerd. Het issue blijft geopend.',ratingReplyMissing:'Schrijf eerst een reactie.',ratingIssueLink:'Issue op GitHub openen'}
  };
  const $=(s,r=document)=>r.querySelector(s), lang=()=>document.body.dataset.language||'de', t=k=>TEXT[lang()]?.[k]||TEXT.de[k]||k;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=v=>{try{const u=new URL(String(v||'').trim());return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}};
  let credentials=null, selected=null, issues=[], ratings=[], selectedRating=null, selectedRatingIssue=null, selectedRatingComments=[];
  function status(message,error=false){const el=$('#ssosAdminStatus');if(el){el.textContent=message;el.classList.toggle('is-error',error);}}
  function toB64(bytes){let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(s);}
  function fromB64(s){const b=atob(String(s||'').replace(/\s/g,''));return Uint8Array.from(b,c=>c.charCodeAt(0));}
  async function keyFor(pass,salt,usage){
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,[usage]);
  }
  async function encryptFile(token,pass){
    const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await keyFor(pass,salt,'encrypt');
    const payload={token,owner:OWNER,repository:REPO,branch:BRANCH,createdAt:new Date().toISOString()};
    const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));
    return {format:'Schleim OS Schleim-Store Admin Key',version:1,cipher:'AES-256-GCM',kdf:'PBKDF2-SHA-256',iterations:ITERATIONS,salt:toB64(salt),iv:toB64(iv),ciphertext:toB64(new Uint8Array(cipher))};
  }
  async function decryptFile(file,pass){
    if(!file||file.size>128000)throw new Error(t('bad'));
    const data=JSON.parse(await file.text());
    if(!['Schleim OS Schleim-Store Admin Key','Schleim OS Slime Store Admin Key'].includes(data.format)||data.version!==1||data.cipher!=='AES-256-GCM'||data.kdf!=='PBKDF2-SHA-256'||data.iterations!==ITERATIONS)throw new Error(t('bad'));
    const key=await keyFor(pass,fromB64(data.salt),'decrypt');
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(data.iv)},key,fromB64(data.ciphertext));
    const p=JSON.parse(new TextDecoder().decode(plain));
    if(p.owner!==OWNER||p.repository!==REPO||p.branch!==BRANCH)throw new Error(t('repo'));
    if(typeof p.token!=='string'||!p.token.trim())throw new Error(t('bad'));
    return p;
  }
  function draw(){
    const root=$('#ssosAdminPortal');if(!root)return;root.hidden=false;
    if(credentials){root.innerHTML=dashboard();fetchIssues();fetchRatings();return;}
    root.innerHTML='<header class="ssos-admin-head"><div><p class="eyebrow">SCHLEIM OS · PRIVATE ACCESS</p><h3>'+esc(t('title'))+'</h3><p>'+esc(t('intro'))+'</p></div><span>🔐</span></header>'+
      '<div class="ssos-admin-grid">'+
      '<form id="ssosAdminCreateForm" class="ssos-card ssos-form"><h4>'+esc(t('setup'))+'</h4><p>'+esc(t('setupText'))+'</p>'+
      '<label>'+esc(t('token'))+'<input id="ssosAdminToken" type="password" autocomplete="off" required></label>'+
      '<label>'+esc(t('pass'))+'<input id="ssosAdminPass" type="password" minlength="12" autocomplete="new-password" required></label>'+
      '<label>'+esc(t('repeat'))+'<input id="ssosAdminRepeat" type="password" minlength="12" autocomplete="new-password" required></label>'+
      '<p class="ssos-admin-note">'+esc(t('scope'))+'</p><button class="app-button" type="submit">'+esc(t('create'))+'</button></form>'+
      '<form id="ssosAdminLoginForm" class="ssos-card ssos-form"><h4>'+esc(t('login'))+'</h4>'+
      '<label>'+esc(t('file'))+'<input id="ssosAdminFile" type="file" accept=".json,application/json" required></label>'+
      '<label>'+esc(t('pass'))+'<input id="ssosAdminLoginPass" type="password" autocomplete="current-password" required></label>'+
      '<button class="app-button" type="submit">'+esc(t('unlock'))+'</button></form></div>'+
      '<p class="ssos-admin-note">'+esc(t('privacy'))+'</p><p id="ssosAdminStatus" class="ssos-admin-status" role="status" aria-live="polite"></p>';
  }
  function dashboard(){
    return '<header class="ssos-admin-head"><div><p class="eyebrow">SCHLEIM OS · ADMIN</p><h3>'+esc(t('title'))+'</h3><p>'+esc(t('session'))+'</p></div><span>🔓</span></header>'+
      '<div class="ssos-admin-toolbar"><button id="ssosAdminRefresh" class="app-button secondary" type="button">'+esc(t('refresh'))+'</button><button id="ssosAdminLogout" class="app-button secondary" type="button">'+esc(t('logout'))+'</button></div>'+
      '<p id="ssosAdminStatus" class="ssos-admin-status" role="status" aria-live="polite">'+esc(t('logged'))+'</p>'+
      '<div class="ssos-admin-grid ssos-admin-review-grid">'+
        '<section class="ssos-card"><h4>'+esc(t('pending'))+'</h4><div id="ssosAdminIssues" class="ssos-admin-issue-list"><p>'+esc(t('loading'))+'</p></div></section>'+
        '<section class="ssos-card"><h4>'+esc(t('edit'))+'</h4><p id="ssosAdminHint">'+esc(t('choose'))+'</p><div id="ssosAdminForm"></div></section>'+
      '</div>'+
      '<div class="ssos-admin-grid ssos-admin-review-grid ssos-admin-ratings-grid">'+
        '<section class="ssos-card"><h4>'+esc(t('ratings'))+'</h4><div id="ssosAdminRatings" class="ssos-admin-issue-list"><p>'+esc(t('loading'))+'</p></div></section>'+
        '<section class="ssos-card"><h4>'+esc(t('ratingReplyTitle'))+'</h4><p id="ssosAdminRatingHint">'+esc(t('choose'))+'</p><div id="ssosAdminRatingDetails"></div></section>'+
      '</div>';
  }
  function permissionMessage(error){
    const path=String(error?.apiPath||''),method=String(error?.httpMethod||'GET').toUpperCase();
    const prefix='GitHub verweigert '+method+' '+(path.split('?')[0]||'den API-Zugriff')+'. ';
    if(path.startsWith('/contents/')||path.startsWith('/git/'))return prefix+'Für das Veröffentlichen oder Aktualisieren der Kategorie-Dateien benötigt der Token Repository-Berechtigung Contents: Read and write. Öffne deinen Fine-grained Token, wähle dieses Repository aus und setze Contents auf Read and write. Danach erneut versuchen. Falls du einen neuen Token erstellst, erstelle auch eine neue verschlüsselte Admin-JSON-Datei.';
    if(path.startsWith('/issues'))return prefix+'Für Einreichungen und deren Status benötigt der Token Issues: Read and write für genau dieses Repository. Prüfe die Repository-Auswahl und die Issues-Berechtigung in deinem Fine-grained Token.';
    return error?.message||'GitHub API nicht erreichbar. Prüfe Verbindung, Repository-Auswahl und Token-Berechtigungen.';
  }
  async function api(path,options={}){
    if(!credentials?.token)throw new Error('Not signed in');
    const method=String(options.method||'GET').toUpperCase();
    const res=await fetch(API+'/repos/'+OWNER+'/'+REPO+path,{...options,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+credentials.token,'X-GitHub-Api-Version':'2022-11-28',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})},cache:'no-store'});
    const text=await res.text();let data=null;try{data=text?JSON.parse(text):null;}catch{}
    if(!res.ok){
      const error=new Error(data?.message||('GitHub API '+res.status));
      error.apiPath=path;error.httpMethod=method;error.httpStatus=res.status;
      error.acceptedPermissions=res.headers.get('X-Accepted-GitHub-Permissions')||'';
      throw error;
    }
    return data;
  }
  function categoryLabel(category){
    const labels={tools:'Tools',ai:'KI & Chatbots',media:'Medien',knowledge:'Wissen',navigation:'Navigation',productivity:'Produktivität',communication:'Kommunikation',privacy:'Suche & Datenschutz',shopping:'Shopping & Online-Shops'};
    return labels[category]||category;
  }
  function makeCategoryReadme(category,apps){
    const sorted=[...apps].filter(app=>app.category===category).sort((a,b)=>a.name.localeCompare(b.name,'de'));
    const rows=sorted.length?sorted.map(app=>{
      const description=String(app.description?.de||'').replace(/\s+/g,' ').trim();
      return '- **'+app.name+'** — '+description+' ([JSON](./'+app.id+'.json))';
    }).join('\n'):'Noch keine Apps veröffentlicht.';
    return '# '+categoryLabel(category)+' ('+category+')\n\n'+
      'Öffentliches App-Verzeichnis der Kategorie **'+categoryLabel(category)+'** im Schleim-Store.\n\n'+
      '**Veröffentlichte Apps:** '+sorted.length+'\n\n'+rows+'\n\n'+
      '[Zur Store-Übersicht](../README.md)\n';
  }
  function makeStoreReadme(apps){
    const categories=CATEGORIES.map(category=>{
      const count=apps.filter(app=>app.category===category).length;
      return '| ['+categoryLabel(category)+'](./'+category+'/README.md) | '+category+' | '+count+' |';
    }).join('\n');
    return '# Schleim-Store – öffentlicher App-Katalog 🐌\n\n'+
      'Dieses Verzeichnis enthält die freigegebenen Apps, sortiert nach Kategorie. Jede App besitzt eine eigene JSON-Datei im jeweiligen Kategorieordner.\n\n'+
      '## Kategorien\n\n| Kategorie | Ordner | Apps |\n|---|---|---:|\n'+categories+'\n\n'+
      '## Wie die Ablage funktioniert\n\n'+
      '- Einreichungen werden zunächst als GitHub-Issue eingereicht und von Schnecke Schneck geprüft.\n'+
      '- Erst nach der Genehmigung wird eine App hier veröffentlicht.\n'+
      '- Die App wird automatisch unter Store/<category>/<app-id>.json abgelegt.\n'+
      '- Die jeweilige Kategorie-README und diese Übersicht werden bei jeder Veröffentlichung aktualisiert.\n'+
      '- Der Laufzeitkatalog der Browser-Erweiterung bleibt extension/data/store-apps.json; er wird zusammen mit den Kategorie-Dateien in einem Commit aktualisiert.\n\n'+
      '**Öffentlichkeit:** Alle Dateien in diesem Ordner sind öffentlich einsehbar. Der Schleim-Store in Schleim OS ist ohne Anmeldung nutzbar. Die Katalogdateien dieses öffentlichen Repositorys bleiben auch direkt auf GitHub sichtbar. Keine Tokens, Passwörter oder privaten Sicherungsdaten hier ablegen.\n';
  }
  async function commitStoreFiles(files,message,expectedParentSha){
    const ref=await api('/git/ref/heads/'+BRANCH);
    const parentSha=ref?.object?.sha;
    if(!parentSha)throw new Error('GitHub hat den aktuellen main-Branch nicht zurückgegeben.');
    if(expectedParentSha&&parentSha!==expectedParentSha)throw new Error('Der main-Branch wurde während der Prüfung geändert. Bitte die Einreichung erneut öffnen und noch einmal veröffentlichen.');
    const parent=await api('/git/commits/'+parentSha);
    const treeEntries=[];
    for(const [path,content] of Object.entries(files)){
      if(content===null){
        treeEntries.push({path,mode:'100644',type:'blob',sha:null});
        continue;
      }
      const blob=await api('/git/blobs',{method:'POST',body:JSON.stringify({content,encoding:'utf-8'})});
      treeEntries.push({path,mode:'100644',type:'blob',sha:blob.sha});
    }
    const tree=await api('/git/trees',{method:'POST',body:JSON.stringify({base_tree:parent.tree.sha,tree:treeEntries})});
    const commit=await api('/git/commits',{method:'POST',body:JSON.stringify({message,tree:tree.sha,parents:[parentSha]})});
    await api('/git/refs/heads/'+BRANCH,{method:'PATCH',body:JSON.stringify({sha:commit.sha,force:false})});
    return commit.sha;
  }
  async function createKey(event){
    event.preventDefault();const token=$('#ssosAdminToken').value.trim(),pass=$('#ssosAdminPass').value,repeat=$('#ssosAdminRepeat').value;
    if(!token||pass.length<12||pass!==repeat){status('Token prüfen; Passphrase mindestens 12 Zeichen und beide Eingaben gleich.',true);return;}
    try{
      const file=await encryptFile(token,pass),blob=new Blob([JSON.stringify(file,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download='schleim-store-admin-key.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
      $('#ssosAdminToken').value='';$('#ssosAdminPass').value='';$('#ssosAdminRepeat').value='';status(t('ok'));
    }catch(e){status(t('bad')+' '+e.message,true);}
  }
  async function login(event){
    event.preventDefault();status(t('loading'));
    try{
      const p=await decryptFile($('#ssosAdminFile').files[0],$('#ssosAdminLoginPass').value);
      credentials={token:p.token};await api('');
      draw();status(t('logged'));
    }catch(e){credentials=null;draw();status(e.message==='Failed to fetch'?'GitHub API nicht erreichbar. Verbindung und Berechtigungen prüfen.':e.message,true);}
  }
  function normalizeFieldLabel(value){
    return String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  }
  function field(body,label){
    const aliases={
      name:['name','app name'],
      website:['website','website url','url'],
      category:['category','kategorie','categorie'],
      'icon url':['icon url','icon url optional'],
      icon:['icon','emoji','pictogram'],
      'submission language':['submission language','einreichungssprache'],
      description:['description','app description','beschreibung','beschrijving'],
      notes:['notes','notes optional','additional notes','additional notes optional','weitere hinweise','weitere hinweise optional','opmerkingen','opmerkingen optioneel']
    };
    const wanted=new Set((aliases[String(label||'').toLowerCase()]||[label]).map(normalizeFieldLabel));
    const lines=String(body||'').split(/\r?\n/);
    // Legacy Markdown template: **Name:** value
    for(const line of lines){
      const match=line.match(/^\s*\*\*([^*]+):\*\*\s*(.*)$/);
      if(match&&wanted.has(normalizeFieldLabel(match[1])))return match[2].trim();
    }
    // GitHub issue-form template: ### App-Name, followed by its value.
    for(let i=0;i<lines.length;i++){
      const heading=lines[i].match(/^\s*#{2,6}\s+(.+?)\s*$/);
      if(!heading||!wanted.has(normalizeFieldLabel(heading[1])))continue;
      const value=[];
      for(let j=i+1;j<lines.length&&!/^\s*#{1,6}\s+/.test(lines[j]);j++)value.push(lines[j]);
      return value.join('\n').trim();
    }
    return '';
  }
  function slug(v){return String(v||'').normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'new-app';}
  function category(v){
    const s=normalizeFieldLabel(v);
    const map={
      'ki chatbots':'ai','ai chatbots':'ai','medien':'media','wissen':'knowledge',
      'produktivitat':'productivity','kommunikation':'communication',
      'suche datenschutz':'privacy','search privacy':'privacy','zoeken privacy':'privacy',
      'shopping online shops':'shopping','shopping online stores':'shopping',
      'winkelen webshops':'shopping','sonstiges':'tools'
    };
    const c=map[s]||s;
    return CATEGORIES.includes(c)?c:'tools';
  }
  function parse(issue){
    const body=issue.body||'';
    const title=String(issue.title||'');
    const fallbackName=title.replace(/^\[(?:Schleim-Store|Slime Store)\]\s*/i,'').replace(/^(?:App-Vorschlag|App suggestion|Appvoorstel):\s*/i,'').trim();
    const name=field(body,'Name')||fallbackName;
    const description=field(body,'Description');
    const notes=field(body,'Notes');
    return {
      id:slug(name),
      name,
      url:safeUrl(field(body,'Website')),
      category:category(field(body,'Category')),
      iconUrl:safeUrl(field(body,'Icon URL')),
      icon:(field(body,'Icon')||'🌐').trim().slice(0,8),
      lang:['de','en','nl'].includes(field(body,'Submission language'))?field(body,'Submission language'):'de',
      description:[description,notes?('Weitere Hinweise:\n'+notes):''].filter(Boolean).join('\n\n')
    };
  }
  async function fetchIssues(){
    const root=$('#ssosAdminIssues');if(!root||!credentials)return;root.innerHTML='<p>'+esc(t('loading'))+'</p>';
    try{
      const data=await api('/issues?state=open&per_page=100&sort=created&direction=desc');
      issues=(Array.isArray(data)?data:[]).filter(x=>!x.pull_request&&/^\[(?:Schleim-Store|Slime Store)\]/i.test(x.title||''));
      root.innerHTML=issues.length?issues.map(x=>'<button type="button" class="ssos-admin-issue'+(selected?.number===x.number?' selected':'')+'" data-admin-issue="'+x.number+'"><b>'+esc(x.title)+'</b><small>#'+x.number+' · '+esc(t('created'))+' '+esc(new Date(x.created_at).toLocaleDateString())+'</small></button>').join():'<p>'+esc(t('empty'))+'</p>';
    }catch(e){const message=permissionMessage(e);root.innerHTML='<p class="ssos-admin-error">'+esc(message)+'</p>';status(message,true);}
  }
  async function fetchRatings(){
    const root=$('#ssosAdminRatings');if(!root||!credentials)return;
    root.innerHTML='<p>'+esc(t('loading'))+'</p>';
    try{
      const listing=await api('/contents/Bewertungen?ref='+encodeURIComponent(BRANCH));
      const files=(Array.isArray(listing)?listing:[]).filter(item=>item.type==='file'&&/^\\d+\\.json$/i.test(item.name));
      const loaded=await Promise.all(files.map(async item=>{
        const payload=await api('/contents/'+item.path.split('/').map(encodeURIComponent).join('/')+'?ref='+encodeURIComponent(BRANCH));
        const value=JSON.parse(new TextDecoder().decode(fromB64(payload.content)));
        return {...value,issueNumber:Number(value.issueNumber||item.name.replace(/\\.json$/i,''))};
      }));
      ratings=loaded.filter(item=>Number.isInteger(item.issueNumber)&&item.issueNumber>0&&item.githubUsername&&Number(item.rating)>=1&&Number(item.rating)<=5);
      ratings.sort((a,b)=>new Date(b.submittedAt||0)-new Date(a.submittedAt||0));
      root.innerHTML=ratings.length?ratings.map(item=>
        '<button type="button" class="ssos-admin-issue'+(selectedRating?.issueNumber===item.issueNumber?' selected':'')+'" data-admin-rating="'+item.issueNumber+'">'+
          '<b>'+esc(item.appName||item.appId)+' · '+('★'.repeat(Number(item.rating)))+('☆'.repeat(5-Number(item.rating)))+'</b>'+
          '<small>@'+esc(item.githubUsername)+' · #'+item.issueNumber+' · '+esc(new Date(item.submittedAt).toLocaleDateString())+'</small></button>'
      ).join(''):'<p class="ssos-admin-empty">'+esc(t('ratingEmpty'))+'</p>';
    }catch(e){
      ratings=[];
      const message=e.httpStatus===404?t('ratingEmpty'):permissionMessage(e);
      root.innerHTML='<p class="'+(e.httpStatus===404?'ssos-admin-empty':'ssos-admin-error')+'">'+esc(message)+'</p>';
      if(e.httpStatus!==404)status(message,true);
    }
  }
  function renderRatingReview(record,issue,comments){
    const rating=Number(record.rating);
    const thread=comments.length?comments.map(comment=>
      '<article class="ssos-admin-rating-comment"><b>'+esc(comment.user?.login||'GitHub')+' · '+esc(new Date(comment.created_at).toLocaleString())+'</b><p>'+esc(comment.body||'')+'</p></article>'
    ).join(''):'<p class="ssos-admin-note">—</p>';
    const state=issue.state==='open'?t('ratingAlreadyOpen'):'Geschlossen';
    const issueUrl=issue.html_url||record.issueUrl||'';
    return '<div class="ssos-admin-rating-record">'+
      '<p><b>'+esc(t('ratingUser'))+':</b> @'+esc(record.githubUsername)+'</p>'+
      '<p><b>'+esc(t('ratingScore'))+':</b> <span class="ssos-admin-rating-stars">'+('★'.repeat(rating))+('☆'.repeat(5-rating))+'</span> ('+rating+'/5)</p>'+
      '<p><b>'+esc(t('ratingFeedback'))+':</b></p><div class="ssos-admin-rating-feedback">'+esc(record.feedback||'—')+'</div>'+
      '<p><b>Issue #'+record.issueNumber+'</b> · '+esc(state)+' · <a href="'+esc(issueUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(t('ratingIssueLink'))+' ↗</a></p>'+
      '<h5>'+esc(t('ratingThread'))+'</h5><div class="ssos-admin-rating-thread">'+thread+'</div>'+
      '<label for="ssosAdminRatingReply">'+esc(t('ratingReplyTitle'))+'</label>'+
      '<textarea id="ssosAdminRatingReply" rows="5" maxlength="4000" placeholder="'+esc(t('ratingReplyPlaceholder'))+'"></textarea>'+
      '<div class="ssos-form-actions">'+
        '<button id="ssosAdminReopenRating" class="app-button secondary" type="button" '+(issue.state==='open'?'disabled':'')+'>'+esc(t('ratingReopen'))+'</button>'+
        '<button id="ssosAdminSendRatingReply" class="app-button" type="button">'+esc(t('ratingSendReply'))+'</button>'+
      '</div></div>';
  }
  async function chooseRating(number){
    selectedRating=ratings.find(item=>item.issueNumber===Number(number))||null;
    selectedRatingIssue=null;selectedRatingComments=[];
    const details=$('#ssosAdminRatingDetails'),hint=$('#ssosAdminRatingHint');
    if(!selectedRating){if(details)details.innerHTML='';if(hint)hint.textContent=t('choose');return;}
    if(hint)hint.textContent=(selectedRating.appName||selectedRating.appId)+' · @'+selectedRating.githubUsername;
    if(details)details.innerHTML='<p>'+esc(t('loading'))+'</p>';
    try{
      selectedRatingIssue=await api('/issues/'+selectedRating.issueNumber);
      selectedRatingComments=await api('/issues/'+selectedRating.issueNumber+'/comments?per_page=100');
      if(details)details.innerHTML=renderRatingReview(selectedRating,selectedRatingIssue,Array.isArray(selectedRatingComments)?selectedRatingComments:[]);
      await fetchRatings();
    }catch(e){if(details)details.innerHTML='<p class="ssos-admin-error">'+esc(permissionMessage(e))+'</p>';status(permissionMessage(e),true);}
  }
  async function reopenRatingIssue(){
    if(!selectedRating)return;
    try{
      selectedRatingIssue=await api('/issues/'+selectedRating.issueNumber,{method:'PATCH',body:JSON.stringify({state:'open',state_reason:'reopened'})});
      selectedRatingComments=await api('/issues/'+selectedRating.issueNumber+'/comments?per_page=100');
      const details=$('#ssosAdminRatingDetails');if(details)details.innerHTML=renderRatingReview(selectedRating,selectedRatingIssue,Array.isArray(selectedRatingComments)?selectedRatingComments:[]);
      status(t('ratingOpened'));await fetchRatings();
    }catch(e){status(permissionMessage(e),true);}
  }
  async function sendRatingReply(){
    if(!selectedRating)return;
    const reply=$('#ssosAdminRatingReply')?.value.trim().slice(0,4000)||'';
    if(!reply){status(t('ratingReplyMissing'),true);return;}
    try{
      const current=await api('/issues/'+selectedRating.issueNumber);
      if(current.state!=='open'){
        await api('/issues/'+selectedRating.issueNumber,{method:'PATCH',body:JSON.stringify({state:'open',state_reason:'reopened'})});
      }
      await api('/issues/'+selectedRating.issueNumber+'/comments',{method:'POST',body:JSON.stringify({body:reply})});
      status(t('ratingReplied'));
      await chooseRating(selectedRating.issueNumber);
    }catch(e){status(permissionMessage(e),true);}
  }
  function review(issue){
    const p=parse(issue),descs={de:p.lang==='de'?p.description:'',en:p.lang==='en'?p.description:'',nl:p.lang==='nl'?p.description:''};
    const options=CATEGORIES.map(x=>'<option value="'+esc(x)+'" '+(p.category===x?'selected':'')+'>'+esc(categoryLabel(x))+'</option>').join('');
    return '<form id="ssosAdminPublishForm" class="ssos-form" data-issue="'+issue.number+'">'+
      '<label>'+esc(t('id'))+'<input id="adminAppId" value="'+esc(p.id)+'" maxlength="60" required></label>'+
      '<label>'+esc(t('name'))+'<input id="adminAppName" value="'+esc(p.name)+'" maxlength="60" required></label>'+
      '<label>'+esc(t('url'))+'<input id="adminAppUrl" type="url" value="'+esc(p.url)+'" required></label>'+
      '<label>'+esc(t('category'))+'<select id="adminAppCategory">'+options+'</select></label>'+
      '<label>'+esc(t('icon'))+'<input id="adminAppIcon" maxlength="8" value="'+esc(p.icon||'🌐')+'"></label>'+
      '<label>'+esc(t('iconUrl'))+'<input id="adminAppIconUrl" type="url" value="'+esc(p.iconUrl)+'"></label>'+
      '<label>'+esc(t('tags'))+'<input id="adminAppTags" maxlength="400" value="'+esc(slug(p.name).replace(/-/g,' '))+'"></label>'+
      '<label class="ssos-admin-check"><input id="adminAppFeatured" type="checkbox"> '+esc(t('featured'))+'</label>'+
      '<label>'+esc(t('de'))+'<textarea id="adminDescDe" rows="3" required>'+esc(descs.de)+'</textarea></label>'+
      '<label>'+esc(t('en'))+'<textarea id="adminDescEn" rows="3" required>'+esc(descs.en)+'</textarea></label>'+
      '<label>'+esc(t('nl'))+'<textarea id="adminDescNl" rows="3" required>'+esc(descs.nl)+'</textarea></label>'+
      '<p class="ssos-admin-note">'+esc(t('tip'))+'</p><div class="ssos-form-actions"><button class="app-button" type="submit">'+esc(t('publish'))+'</button><button id="ssosAdminReject" class="app-button secondary" type="button">'+esc(t('reject'))+'</button></div></form>';
  }
  async function chooseIssue(number){
    selected=issues.find(x=>x.number===Number(number))||null;
    const form=$('#ssosAdminForm'),hint=$('#ssosAdminHint');
    if(!selected){if(form)form.innerHTML='';if(hint)hint.textContent=t('choose');return;}
    if(hint)hint.textContent=selected.title;if(form)form.innerHTML=review(selected);
    await fetchIssues();
  }
  async function publish(event){
    event.preventDefault();if(!credentials||!selected)return;
    const id=$('#adminAppId').value.trim().toLowerCase(),name=$('#adminAppName').value.trim(),url=safeUrl($('#adminAppUrl').value),iconUrl=safeUrl($('#adminAppIconUrl').value),category=$('#adminAppCategory').value;
    const de=$('#adminDescDe').value.trim(),en=$('#adminDescEn').value.trim(),nl=$('#adminDescNl').value.trim();
    if(!/^[a-z0-9][a-z0-9-]{1,59}$/.test(id)||!name||!url||!CATEGORIES.includes(category)){status(t('invalid'),true);return;}
    if(!de||!en||!nl){status(t('missing'),true);return;}
    const button=$('#ssosAdminPublishForm button[type="submit"]');if(button){button.disabled=true;button.textContent=t('loading');}
    try{
      const branch=await api('/git/ref/heads/'+BRANCH);
      const baseSha=branch?.object?.sha;
      if(!baseSha)throw new Error('GitHub hat den aktuellen main-Branch nicht zurückgegeben.');
      const current=await api('/contents/'+CATALOG+'?ref='+encodeURIComponent(baseSha));
      const decoded=new TextDecoder().decode(fromB64(current.content)),old=JSON.parse(decoded),apps=Array.isArray(old)?old:(Array.isArray(old.apps)?old.apps:[]);
      const app={id,name,url,category,icon:($('#adminAppIcon').value.trim()||'🌐').slice(0,8),iconUrl:iconUrl||'',tags:$('#adminAppTags').value.trim().slice(0,400),addedAt:new Date().toISOString().slice(0,10),featured:$('#adminAppFeatured').checked,description:{de,en,nl}};
      const at=apps.findIndex(x=>x.id===id),previous=at>=0?apps[at]:null;
      if(at>=0)apps[at]=app;else apps.push(app);
      const next={schemaVersion:1,updatedAt:new Date().toISOString().slice(0,10),apps};
      const files={};
      files[CATALOG]=JSON.stringify(next,null,2)+'\n';
      files['Store/'+category+'/'+id+'.json']=JSON.stringify(app,null,2)+'\n';
      files['Store/'+category+'/README.md']=makeCategoryReadme(category,apps);
      if(previous&&previous.category&&previous.category!==category&&CATEGORIES.includes(previous.category)){
        files['Store/'+previous.category+'/'+id+'.json']=null;
        files['Store/'+previous.category+'/README.md']=makeCategoryReadme(previous.category,apps);
      }
      files['Store/README.md']=makeStoreReadme(apps);
      await commitStoreFiles(files,'Schleim-Store: publish '+name,baseSha);
      status(t('published'));await window.SSOSPersonalization?.refreshStoreCatalog?.();
      try{await api('/issues/'+selected.number+'/comments',{method:'POST',body:JSON.stringify({body:t('approved')})});await api('/issues/'+selected.number,{method:'PATCH',body:JSON.stringify({state:'closed',state_reason:'completed'})});}
      catch(e){status(t('published')+' '+permissionMessage(e)+' Der Katalog und das Kategorie-Verzeichnis sind bereits veröffentlicht; nur das Kommentieren/Schließen der Einreichung ist fehlgeschlagen.',true);}
      selected=null;const f=$('#ssosAdminForm'),h=$('#ssosAdminHint');if(f)f.innerHTML='';if(h)h.textContent=t('choose');await fetchIssues();
    }catch(e){status(permissionMessage(e),true);}
    finally{if(button&&button.isConnected){button.disabled=false;button.textContent=t('publish');}}
  }
  async function reject(){
    if(!credentials||!selected)return;
    try{await api('/issues/'+selected.number+'/comments',{method:'POST',body:JSON.stringify({body:TEXT[lang()]?.denied||TEXT.de.denied})});await api('/issues/'+selected.number,{method:'PATCH',body:JSON.stringify({state:'closed',state_reason:'not_planned'})});selected=null;const f=$('#ssosAdminForm'),h=$('#ssosAdminHint');if(f)f.innerHTML='';if(h)h.textContent=t('choose');status(t('rejected'));await fetchIssues();}
    catch(e){status('Fehler: '+e.message,true);}
  }
  function signOut(){credentials=null;selected=null;issues=[];ratings=[];selectedRating=null;selectedRatingIssue=null;selectedRatingComments=[];draw();status(t('logout'));}
  document.addEventListener('click',e=>{
    if(e.target.closest('#ssosOpenAdmin')){draw();return;}
    if(e.target.closest('#ssosAdminRefresh')){fetchIssues();fetchRatings();return;}
    if(e.target.closest('#ssosAdminLogout')){signOut();return;}
    const issue=e.target.closest('[data-admin-issue]');if(issue){chooseIssue(issue.dataset.adminIssue);return;}
    const rating=e.target.closest('[data-admin-rating]');if(rating){chooseRating(rating.dataset.adminRating);return;}
    if(e.target.closest('#ssosAdminReopenRating')){reopenRatingIssue();return;}
    if(e.target.closest('#ssosAdminSendRatingReply')){sendRatingReply();return;}
    if(e.target.closest('#ssosAdminReject')){reject();return;}
  });
  document.addEventListener('submit',e=>{
    if(e.target?.id==='ssosAdminCreateForm')createKey(e);
    if(e.target?.id==='ssosAdminLoginForm')login(e);
    if(e.target?.id==='ssosAdminPublishForm')publish(e);
  });
})();