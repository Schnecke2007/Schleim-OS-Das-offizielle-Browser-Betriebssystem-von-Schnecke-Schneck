# 🧩 Schleim OS – Technical Notes · Version 3.12.0

## Platform and extension format

- **Platform:** Chromium-based browsers with extension support
- **Extension format:** Manifest V3
- **Main entry point:** `pages/newtab.html`
- **New-tab override:** `chrome_url_overrides.newtab`

## Project files

- **Interface and navigation:** `scripts/app.js`
- **Personalization and Schleim-Store:** `scripts/personalization.js`
- **GitHub sign-in and cloud backup:** `scripts/schleim-account.js`
- **Store admin portal:** `scripts/slime-store-admin.js`
- **GitHub update center:** `scripts/update-center.js`
- **Stylesheets:** `styles/main.css` and `styles/personalization.css`
- **Legal-text translations:** `locales/legal-translations.js`
- **Standalone demo:** `standalone/schleim-os-standalone.html`

## Installation

The documented installation imports the release asset `Schleim-OS-Extension.zip` directly into a compatible Chromium-based browser with local ZIP-import support. The archive contains the Extension and its `manifest.json` at the package root and is not extracted before import. ZIP-import availability depends on the browser and platform.

## Storage and cloud backup

Schleim OS stores active settings locally in the browser profile. Cloud backup is started or restored manually under **Settings → Schleim account**. Changes are not synchronized automatically after every edit.

Backup format 2 contains the saved `ssos-` settings and explicitly includes:
- the home-screen tile order (`ssos-personalization-v1.homeOrder`),
- installed Store apps (`ssos-store-v1.installed`),
- the selected system wallpaper (`ssos-wallpaper`),
- a custom wallpaper and its image data or URL.

Format-1 backups can still be restored. The previous local JSON import/export feature is no longer part of the user interface.

## Schleim-Store and sign-in

The Schleim-Store is available only with a signed-in Schleim account. The Store interface checks the authenticated session. When the user signs out, Store content and installed Store tiles are locked or hidden. Files in the public GitHub Store catalogue remain directly visible on GitHub.

## Permissions

The manifest includes, among others, `storage` and `clipboardWrite`. Clipboard permission is used to copy the GitHub device code automatically. Optional host permissions may be requested when a feature needs them. Review permission prompts carefully.

## Update center

The update center is shown in Settings. It reads `extension/manifest.json` from the GitHub default branch through `raw.githubusercontent.com` and compares it with `chrome.runtime.getManifest().version`. If a newer version is found, its download button starts the `Schleim-OS-Extension.zip` release asset. The script does not install files or replace the running extension.

The browser must perform the ZIP import or its own update function. `chrome.runtime.requestUpdateCheck()` is not used as a GitHub installer because that API checks the extension update channel configured by the browser.

## Advertising and external connections

The extension interface contains no advertising iframes, advertising URLs or advertising-related startup lock. External apps and websites may make network requests when opened by the user.

---

[🇩🇪 Deutsche technische Hinweise](../Deutsch/TECHNISCHE-HINWEISE.md) · [🇳🇱 Nederlandse technische opmerkingen](../Niederländisch/TECHNISCHE-OPMERKINGEN.md)
