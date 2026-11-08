# Technical notes

- Platform: Chromium-based browsers
- Extension format: Manifest V3
- Main entry point: `pages/newtab.html`
- Manifest override: `chrome_url_overrides.newtab`
- Local interface scripts: `scripts/app.js` and `scripts/personalization.js`
- Stylesheets: `styles/main.css` and `styles/personalization.css`
- Locale/legal translations: `locales/legal-translations.js`
- Standalone build: `standalone/schleim-os-standalone.html`

Personalization is stored in the browser profile. Export a JSON backup before clearing browser data or moving to another browser profile.

The extension interface is ad-free: it does not include advertising iframes, an advertising reachability check or an advertising-related startup lock. External apps and websites may still make network requests when opened by the user.

Optional host permissions are declared in the manifest and may be requested by the application when a feature needs them. Review the browser permission prompt before granting access.
