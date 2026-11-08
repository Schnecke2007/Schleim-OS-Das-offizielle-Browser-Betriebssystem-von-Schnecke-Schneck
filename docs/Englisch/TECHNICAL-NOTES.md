# 🧩 Schleim OS – Technical Notes

## Platform and extension format

- **Platform:** Chromium-based browsers
- **Extension format:** Manifest V3
- **Main entry point:** `pages/newtab.html`
- **New-tab override:** `chrome_url_overrides.newtab`

## Project files

- **Local interface scripts:** `scripts/app.js` and `scripts/personalization.js`
- **Stylesheets:** `styles/main.css` and `styles/personalization.css`
- **Locale and legal-text translations:** `locales/legal-translations.js`
- **Standalone version:** `standalone/schleim-os-standalone.html`

## Storage and backups

Personalization settings are stored in the relevant browser profile. Export a JSON backup before clearing browser data or moving to another browser profile.

## Advertising and external connections

The extension interface is ad-free. It does not include advertising iframes, advertising reachability checks or an advertising-related startup lock. External apps and websites may still make network requests when opened by the user.

## Permissions

Optional host permissions are declared in the manifest and may be requested by the application when a feature needs them. Review the browser permission prompt carefully before granting access.

---

[🇩🇪 Deutsche technische Hinweise](../Deutsch/TECHNISCHE-HINWEISE.md) · [🇳🇱 Nederlandse technische opmerkingen](../Niederländisch/TECHNISCHE-OPMERKINGEN.md)
