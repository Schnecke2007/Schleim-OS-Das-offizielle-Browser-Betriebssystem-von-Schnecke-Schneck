# Schleim OS Android Browser (Alpha)

This is the first native Android browser foundation using Mozilla GeckoView. It is a separate Android application; the original Chromium extension under `extension/` is not modified.

## Current scope

- GeckoView-based web browser with address/search field.
- Handles incoming HTTP(S) links and declares Android's browser intent filters.
- Requests Android's `ROLE_BROWSER` so the user can choose Schleim OS as default browser.
- Creates a native notification channel and requests Android 13+ notification permission.
- Packages the existing standalone HTML demo as the initial local start page.

## Compatibility status — important

This is an initial Android browser shell, **not yet a complete port of the Chrome extension**. The existing extension uses Chromium Manifest V3 APIs including an extension service worker, `chrome.offscreen`, `chrome.storage` and `chrome.notifications`. GeckoView supports bundled WebExtensions, but the existing MV3 background/offscreen implementation has not yet been adapted and validated for GeckoView. Therefore this APK does not claim that the account, private GitHub cloud, media background worker, store authentication, or extension notifications are fully functional in Android.

The standalone page is a demo and uses its own browser-local demo behavior. Native notification testing is provided separately by the Android shell.

## Build

The GitHub Actions workflow resolves the latest published `geckoview-stable` artifact from Mozilla Maven metadata, copies `extension/standalone/schleim-os-standalone.html` into the APK assets as `start.html`, runs Gradle checks, and assembles a debug APK.

The initial artifact is debug-signed by the Android build system. It is installable, but future updates cannot be installed over it reliably until a persistent private release keystore is configured as GitHub Actions secrets. Never commit a keystore or its passwords to the repository.

## Next porting phases

1. Audit each extension API and GeckoView WebExtension compatibility.
2. Adapt the MV3 service worker/offscreen media pipeline to supported GeckoView APIs and Android background execution.
3. Port GitHub device authorization and private cloud flows, then verify them against a test repository.
4. Integrate native camera/media pickers, upload progress notifications, and persistent WorkManager uploads.
5. Configure a private signing key and publish a stable release APK only after device-level tests.


The generated debug APK is uploaded to the current GitHub Release only after the APK build and package validation steps pass.
