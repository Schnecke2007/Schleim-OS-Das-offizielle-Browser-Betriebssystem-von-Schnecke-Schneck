# 🧩 Schleim OS – Technical Notes

## Platform and extension format

- **Platform:** Chromium-based browsers
- **Extension format:** Manifest V3
- **Main entry point:** `pages/newtab.html`
- **New-tab override:** `chrome_url_overrides.newtab`

## Installation

The documented installation uses direct import of the complete GitHub repository ZIP through the ZIP-import option of a supported Chromium-based browser. The archive contains the extension in the `extension` subfolder and is not extracted before import. ZIP-import availability depends on the browser and platform.

## Project files

- **Local interface scripts:** `scripts/app.js` and `scripts/personalization.js`
- **Stylesheets:** `styles/main.css` and `styles/personalization.css`
- **Locale and legal-text translations:** `locales/legal-translations.js`
- **Standalone version:** `standalone/schleim-os-standalone.html`

## Storage and backups

Schleim OS needs a local working copy in the browser to display and operate the home screen. After GitHub sign-in, this state is backed up to a private repository immediately and then every five minutes through the Manifest V3 background service worker. You must sign in to GitHub again after restarting the browser. Configure a GitHub App with Device Flow and `Contents: Read and write` plus `Metadata: Read-only` permissions. Follow the [GitHub cloud backup setup guide](../../Deutsch/GITHUB-CLOUD-BACKUP.md).

## Advertising and external connections

The extension interface is ad-free. It does not include advertising iframes, advertising reachability checks or an advertising-related startup lock. External apps and websites may still make network requests when opened by the user.

## Permissions

Optional host permissions are declared in the manifest and may be requested by the application when a feature needs them. Review the browser permission prompt carefully before granting access.

---

[🇩🇪 Deutsche technische Hinweise](../Deutsch/TECHNISCHE-HINWEISE.md) · [🇳🇱 Nederlandse technische opmerkingen](../Niederländisch/TECHNISCHE-OPMERKINGEN.md)
