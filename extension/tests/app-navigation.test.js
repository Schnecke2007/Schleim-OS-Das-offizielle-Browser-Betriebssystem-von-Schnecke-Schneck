const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'scripts/app.js'), 'utf8');
const standaloneSource = fs.readFileSync(path.join(root, 'standalone/schleim-os-standalone.html'), 'utf8');
const personalizationSource = fs.readFileSync(path.join(root, 'scripts/personalization.js'), 'utf8');
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
