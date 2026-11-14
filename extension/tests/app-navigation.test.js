const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'scripts/app.js'), 'utf8');
const standaloneSource = fs.readFileSync(path.join(root, 'standalone/schleim-os-standalone.html'), 'utf8');
const sonosSource = fs.readFileSync(path.join(root, 'scripts/sonos-app.js'), 'utf8');
const personalizationCss = fs.readFileSync(path.join(root, 'styles/personalization.css'), 'utf8');

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

test('Sonos stays inside Schleim OS and uses the official Sonos web app', () => {
  assert.match(sonosSource, /<iframe[^>]+id="ssosSonosFrame"/);
  assert.match(sonosSource, /https:\/\/play\.sonos\.com\/de-de\/web-app/);
  assert.match(sonosSource, /width="1280"/);
  assert.match(sonosSource, /height="900"/);
  assert.match(sonosSource, /data-sonos-action="fit"/);
  assert.match(sonosSource, /setTimeout\(\(\) => \{[\s\S]*?18000/);
});

test('Sonos desktop viewport has frame sizing and scroll styles', () => {
  assert.match(personalizationCss, /\.ssos-sonos-frame-viewport/);
  assert.match(personalizationCss, /\.ssos-sonos-frame-canvas iframe/);
  assert.match(personalizationCss, /width:1280px/);
  assert.match(personalizationCss, /height:900px/);
});
