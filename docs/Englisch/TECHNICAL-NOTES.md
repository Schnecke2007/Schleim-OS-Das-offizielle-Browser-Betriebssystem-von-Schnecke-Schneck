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

Schleim OS needs a local working copy in the browser to operate the home screen. A single button starts the GitHub connection. Schleim OS then creates a private repository automatically, saves immediately and schedules updates every five minutes through the Manifest V3 background service worker. The connection remains in protected extension storage. The project owner must register a GitHub App once with Device Flow enabled, `Repository creation: Write` and `Contents: Read and write`, then add its public Client ID to the source. See the [GitHub cloud backup setup guide](../../Deutsch/GITHUB-CLOUD-BACKUP.md).

## Advertising and external connections

The extension interface is ad-free. It does not include advertising iframes, advertising reachability checks or an advertising-related startup lock. External apps and websites may still make network requests when opened by the user.

## Permissions

Optional host permissions are declared in the manifest and may be requested by the application when a feature needs them. Review the browser permission prompt carefully before granting access.

---

[🇩🇪 Deutsche technische Hinweise](../Deutsch/TECHNISCHE-HINWEISE.md) · [🇳🇱 Nederlandse technische opmerkingen](../Niederländisch/TECHNISCHE-OPMERKINGEN.md)
