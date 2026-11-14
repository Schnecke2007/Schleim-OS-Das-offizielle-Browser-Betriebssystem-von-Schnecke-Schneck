const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'scripts/app.js'), 'utf8');
const standaloneSource = fs.readFileSync(path.join(root, 'standalone/schleim-os-standalone.html'), 'utf8');

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
