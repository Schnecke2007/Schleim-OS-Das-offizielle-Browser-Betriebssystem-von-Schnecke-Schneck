const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'scripts/app.js'), 'utf8');
const standaloneSource = fs.readFileSync(path.join(root, 'standalone/browser-os-standalone.html'), 'utf8');
const personalizationSource = fs.readFileSync(path.join(root, 'scripts/personalization.js'), 'utf8');
const accountSource = fs.readFileSync(path.join(root, 'scripts/browser-account.js'), 'utf8');
const uploadWorkerSource = fs.readFileSync(path.join(root, 'scripts/media-upload-worker.js'), 'utf8');
const storeAdminSource = fs.readFileSync(path.join(root, 'scripts/browser-store-admin.js'), 'utf8');
const photosCloudSource = fs.readFileSync(path.join(root, 'scripts/browser-media-cloud.js'), 'utf8');
const photosAISource = fs.readFileSync(path.join(root, 'scripts/browser-photo-ai.js'), 'utf8');
const newtabSource = fs.readFileSync(path.join(root, 'pages/newtab.html'), 'utf8');
const personalizationCss = fs.readFileSync(path.join(root, 'styles/personalization.css'), 'utf8');
const storeCatalog = JSON.parse(fs.readFileSync(path.join(root, 'data/store-apps.json'), 'utf8'));

// $() returns one Element (or null); only $$() returns an iterable array.
// Calling .forEach() on a $() result prevents openApp() from reaching the
// lines that reveal the app window.
const singleQueryThenForEach = /(?<!\$)\$\([^;\n]*?\)\.forEach/g;

test('app navigation never calls forEach on a single querySelector result', () => {
  assert.doesNotMatch(appSource, singleQueryThenForEach);
});

test('app navigation iterates language controls with the all-elements helper', () => {
  assert.match(appSource, /\$\$\('\[data-set-language\]',\s*els\.appContent\)\.forEach/);
});

test('standalone uses the all-elements helper for app launch and tile cleanup', () => {
  assert.doesNotMatch(standaloneSource, singleQueryThenForEach);
  assert.match(standaloneSource, /\$\$\('\[data-set-language\]',\s*els\.appContent\)\.forEach/);
});

test('The obsolete Sonos Worker integration is not part of the repository', () => {
  assert.equal(fs.existsSync(path.join(root, '../integrations/sonos-worker')), false);
});

test('Sonos is included as a standard example Store web app', () => {
  const catalogEntry = storeCatalog.apps.find(app => app.id === 'sonos-control');
  assert.ok(catalogEntry, 'Sonos must exist in the runtime Store catalogue');
  assert.equal(catalogEntry.url, 'https://play.sonos.com/');
  assert.match(personalizationSource, /window\.open\(app\.url,'_blank','noopener,noreferrer'\)/);
  assert.doesNotMatch(personalizationSource, /app\.id==='sonos-control'/);
  assert.doesNotMatch(appSource, /SSOSSonosApp|ssos-open-native-app/);
  assert.doesNotMatch(newtabSource, /sonos-app\.js/);
  assert.doesNotMatch(personalizationCss, /ssos-sonos-/);
});

test('Photos and Camera are first-class Browser OS apps', () => {
  assert.match(appSource, /id:'images',name:'Fotos'/);
  assert.match(appSource, /id:'camera',name:'Kamera'/);
  assert.match(appSource, /camera:renderCamera/);
  assert.match(appSource, /ssos-app-opened/);
  assert.match(newtabSource, /browser-media-cloud\.js/);
});

test('Photo cloud uses a configurable private repository and the Browser OS account', () => {
  assert.match(accountSource, /PHOTOS_REPO_NAME='YOUR_MEDIA_REPOSITORY_NAME'/);
  assert.match(accountSource, /STORAGE_KEY = 'browser-os-account-session-v1'/);
  assert.match(accountSource, /LEGACY_STORAGE_KEY = 'ssos-schleim-account-session-v1'/);
  assert.match(accountSource, /async function ensurePhotosRepository/);
  assert.match(accountSource, /repository\.private!==true/);
  assert.match(accountSource, /private:true/);
  assert.match(accountSource, /requestPhotosRepository/);
  assert.match(uploadWorkerSource, /MEDIA_REPO_NAME = 'YOUR_MEDIA_REPOSITORY_NAME'/);
  assert.match(uploadWorkerSource, /session\.user\.login\+'\/'\+MEDIA_REPO_NAME/);
  assert.doesNotMatch(uploadWorkerSource, /schleim-os-cloud-photos-and-videos/i);
  assert.match(photosCloudSource, /getPhotosRepository/);
  assert.match(photosCloudSource, /ensurePhotosRepository/);
});

test('Media uploads use date folders, metadata and a bounded file size', () => {
  assert.equal(photosCloudSource.includes(String.fromCharCode(92) + 'n  async function getCaptureDate(file)'), false);
  assert.equal(photosCloudSource.includes(String.fromCharCode(10) + '  async function getCaptureDate(file)'), true);
  assert.match(photosCloudSource, /MAX_FILE_BYTES = 50 \* 1024 \* 1024/);
  assert.match(photosCloudSource, /const folder = type === 'video' \? 'Videos' : 'Fotos'/);
  assert.match(photosCloudSource, /year \+ '\/' \+ year \+ '-' \+ month/);
  assert.match(photosCloudSource, /media-index/);
  assert.match(photosCloudSource, /capturedAt/);
  assert.match(photosCloudSource, /dateSource:captureInfo\.source/);
  assert.match(photosCloudSource, /DateTimeOriginal/);
});

test('Photo uploads compress still images before storing them', () => {
  assert.match(photosCloudSource, /const MAX_IMAGE_EDGE = 2560/);
  assert.match(photosCloudSource, /const WEBP_QUALITY = 0\.9/);
  assert.match(photosCloudSource, /bytes\[0\] !== 0x89 \|\| bytes\[1\] !== 0x50/);
  assert.match(photosCloudSource, /async function isAnimatedImage\(file\)/);
  assert.match(photosCloudSource, /chunk === 'acTL'/);
  assert.match(photosCloudSource, /chunk === 'ANIM' \|\| chunk === 'ANMF'/);
  assert.match(photosCloudSource, /async function optimizePhoto\(file\)/);
  assert.match(photosCloudSource, /canvas\.toBlob\(resolve, 'image\/webp', WEBP_QUALITY\)/);
  const uploadBlock = photosCloudSource.slice(
    photosCloudSource.indexOf('async function uploadOne(file, description)'),
    photosCloudSource.indexOf('async function uploadFiles(')
  );
  assert.match(uploadBlock, /await optimizePhoto\(file\)/);
  assert.match(uploadBlock, /await putFile\(path, uploadBlob/);
  assert.match(uploadBlock, /size:uploadBlob\.size, originalSize:file\.size/);
  assert.match(uploadBlock, /getThumbnail\(uploadBlob\)/);
  assert.match(photosCloudSource, /anchor\.download = item\.downloadName \|\| item\.name/);
});

test('Camera uses the browser front/rear camera APIs and video recording', () => {
  assert.match(photosCloudSource, /navigator\.mediaDevices\.getUserMedia/);
  assert.match(photosCloudSource, /facingMode/);
  assert.match(photosCloudSource, /MediaRecorder/);
  assert.match(photosCloudSource, /data-camera-switch/);
});

test('Photo cloud settings observer disconnects before rendering its own mutations', () => {
  const observerBlock = photosCloudSource.slice(
    photosCloudSource.indexOf('const settingsHostSelector'),
    photosCloudSource.indexOf("window.addEventListener('beforeunload'")
  );
  assert.match(observerBlock, /observer\.disconnect\(\)/);
  assert.match(observerBlock, /hostWasAdded/);
  assert.doesNotMatch(observerBlock, /new MutationObserver\(\(\) =>\s*\{\s*if \(\$\(settingsHostSelector\)\) mountSettings\(\)/);
});

test('Photos search combines metadata fallback with optional on-device AI', () => {
  assert.match(photosCloudSource, /function searchItems/);
  assert.match(photosCloudSource, /SYNONYMS/);
  assert.match(photosCloudSource, /item\.description/);
  assert.match(photosCloudSource, /item\.aiDescription/);
  assert.match(photosCloudSource, /getExpandedTerms/);
  assert.match(photosAISource, /api\.availability/);
  assert.match(photosAISource, /api\.create/);
  assert.match(photosAISource, /type:\s*'image'/);
  assert.match(photosAISource, /No API key/i);
  assert.match(newtabSource, /browser-photo-ai\.js/);
  assert.match(appSource, /data-photos-ai-search/);
});

test('Settings include a separate photo and video cloud storage panel', () => {
  assert.match(personalizationSource, /data-ssos-photo-cloud-settings/);
  assert.match(photosCloudSource, /function mountSettings/);
  assert.match(personalizationCss, /ssos-photos-stats/);
});


test('Template background media processing is wired through Manifest V3', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.background.service_worker, 'scripts/media-upload-worker.js');
  assert.ok(manifest.permissions.includes('offscreen'));
  assert.ok(manifest.permissions.includes('notifications'));
  assert.ok(fs.existsSync(path.join(root, 'scripts/media-upload-offscreen.js')));
  assert.match(photosCloudSource, /SSOS_MEDIA_UPLOAD_START/);
  assert.match(newtabSource, /browser-media-cloud\.js/);
});

test('Template documentation is organized in three languages and Easy Language', () => {
  for (const language of ['Deutsch','Englisch','Niederländisch']) {
    assert.ok(fs.existsSync(path.join(root,'docs',language,'README.md')));
  }
  for (const language of ['Deutsch','Englisch','Niederländisch']) {
    assert.ok(fs.existsSync(path.join(root,'docs','Leichte-Sprache',language,'README.md')));
  }
});

test('Template identifiers and Store admin formats are neutral', () => {
  assert.doesNotMatch(appSource, /slimestore|schleimcloud|slime store|schleim-store/i);
  assert.doesNotMatch(standaloneSource, /slimestore|schleimcloud|Schleim-OS|slime store|schleim-store/i);
  assert.doesNotMatch(storeAdminSource, /Slime Store/i);
  assert.match(appSource, /id:'browserstore'/);
  assert.match(appSource, /id:'clouddemo'/);
  assert.match(storeAdminSource, /Browser OS Browser Store Admin Key/);
});

test('Template standalone demo includes account, photo/video and camera areas', () => {
  assert.match(standaloneSource, /id:'images'/);
  assert.match(standaloneSource, /id:'camera'/);
  assert.match(standaloneSource, /camera/i);
  assert.match(standaloneSource, /video/i);
  assert.match(standaloneSource, /account/i);
});
