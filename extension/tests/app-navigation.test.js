const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'scripts/app.js'), 'utf8');
const standaloneSource = fs.readFileSync(path.join(root, 'standalone/schleim-os-standalone.html'), 'utf8');
const personalizationSource = fs.readFileSync(path.join(root, 'scripts/personalization.js'), 'utf8');
const accountSource = fs.readFileSync(path.join(root, 'scripts/schleim-account.js'), 'utf8');
const photosCloudSource = fs.readFileSync(path.join(root, 'scripts/schleim-photos-cloud.js'), 'utf8');
const photosAISource = fs.readFileSync(path.join(root, 'scripts/schleim-photo-ai.js'), 'utf8');
const newtabSource = fs.readFileSync(path.join(root, 'pages/newtab.html'), 'utf8');
const personalizationCss = fs.readFileSync(path.join(root, 'styles/personalization.css'), 'utf8');
const storeCatalog = JSON.parse(fs.readFileSync(path.join(root, 'data/store-apps.json'), 'utf8'));
const sonosStoreRecord = JSON.parse(fs.readFileSync(path.join(root, '../Store/media/sonos-control.json'), 'utf8'));

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
  assert.match(standaloneSource, /\$\$\('\.ssos-custom-tile',\s*grid\)\.forEach/);
});

test('The obsolete Sonos Worker integration is not part of the repository', () => {
  assert.equal(fs.existsSync(path.join(root, '../integrations/sonos-worker')), false);
});

test('Sonos is a standard Store web app opened in a new browser tab', () => {
  const catalogEntry = storeCatalog.apps.find(app => app.id === 'sonos-control');
  assert.ok(catalogEntry, 'Sonos must exist in the runtime Store catalogue');
  assert.equal(catalogEntry.url, 'https://play.sonos.com/');
  assert.equal(sonosStoreRecord.id, 'sonos-control');
  assert.equal(sonosStoreRecord.url, catalogEntry.url);
  assert.match(personalizationSource, /window\.open\(app\.url,'_blank','noopener,noreferrer'\)/);
  assert.doesNotMatch(personalizationSource, /app\.id==='sonos-control'/);
  assert.doesNotMatch(appSource, /SSOSSonosApp|ssos-open-native-app/);
  assert.doesNotMatch(newtabSource, /sonos-app\.js/);
  assert.doesNotMatch(personalizationCss, /ssos-sonos-/);
});

test('Photos and Camera are first-class Schleim OS apps', () => {
  assert.match(appSource, /id:'images',name:'Fotos'/);
  assert.match(appSource, /id:'camera',name:'Kamera'/);
  assert.match(appSource, /camera:renderCamera/);
  assert.match(appSource, /ssos-app-opened/);
  assert.match(newtabSource, /schleim-photos-cloud\.js/);
});

test('Photo cloud uses a separate private repository and the existing Schleim account', () => {
  assert.match(accountSource, /PHOTOS_REPO_NAME='schleim-os-cloud-photos-and-videos'/);
  assert.match(accountSource, /async function ensurePhotosRepository/);
  assert.match(accountSource, /repository\.private!==true/);
  assert.match(accountSource, /private:true/);
  assert.match(accountSource, /requestPhotosRepository/);
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

test('Camera uses the browser front/rear camera APIs and video recording', () => {
  assert.match(photosCloudSource, /navigator\.mediaDevices\.getUserMedia/);
  assert.match(photosCloudSource, /facingMode/);
  assert.match(photosCloudSource, /MediaRecorder/);
  assert.match(photosCloudSource, /data-camera-switch/);
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
  assert.match(newtabSource, /schleim-photo-ai\.js/);
  assert.match(appSource, /data-photos-ai-search/);
});

test('Settings include a separate photo and video cloud storage panel', () => {
  assert.match(personalizationSource, /data-ssos-photo-cloud-settings/);
  assert.match(photosCloudSource, /function mountSettings/);
  assert.match(personalizationCss, /ssos-photos-stats/);
});
