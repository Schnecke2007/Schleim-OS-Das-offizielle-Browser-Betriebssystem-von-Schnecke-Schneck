# Release Notes – Schleim OS 3.13.6

**Release date:** 14 November 2026

## Sonos uses the standard Store web-app flow

- Removed the dedicated Sonos in-app screen and its embedded iframe.
- Removed the Sonos-only renderer, script, system-app entry and iframe styles.
- Kept the existing Store app ID `sonos-control`, so installations remain recognized after updating.
- Sonos remains listed in **Schleim-Store → Medien** and points to the official site `https://play.sonos.com/`.
- The standard Store launcher now opens Sonos in a new browser tab, exactly like other Store web apps.
- The sign-in process remains on Sonos. Schleim OS does not ask for or store Sonos credentials.

## Validation

- JavaScript syntax checks cover the main app and Store launcher.
- Regression tests verify the Sonos catalogue entry and the generic new-tab launcher.
- JSON validation covers the extension manifest, runtime Store catalogue and public Sonos Store record.
