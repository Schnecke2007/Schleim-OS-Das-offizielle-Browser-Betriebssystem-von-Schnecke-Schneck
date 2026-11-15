# Release Notes – Schleim OS 3.13.5

**Release date:** 14 November 2026

## Sonos embedded desktop view

- Replaced the separate-tab-first Sonos screen with an embedded iframe to the official Sonos web app at https://play.sonos.com/de-de/web-app.
- The iframe uses a 1280 CSS-pixel layout viewport to encourage desktop responsive layouts.
- Added fit-to-screen scaling, 100% desktop-size mode, reload control, loading status and an 18-second slow-load notice.
- Added a separate-tab fallback in case Sonos or browser privacy settings prevent the embedded login or app from working.
- No Sonos credentials, API key or OAuth token are requested or stored by Schleim OS.
- Documented that a 1280px iframe viewport does not override the browser User-Agent or physical screen width, and that Sonos CSP/X-Frame-Options policies cannot be bypassed from the embedding page.

## Validation

- JavaScript syntax and app-navigation regression checks are run by GitHub Actions.
- New tests cover the Sonos iframe URL, desktop viewport dimensions, fit control, loading timeout and frame styles.
- GitHub Actions cannot verify the live Sonos sign-in flow or Sonos' current frame policy. A test in the target browser is still required.
