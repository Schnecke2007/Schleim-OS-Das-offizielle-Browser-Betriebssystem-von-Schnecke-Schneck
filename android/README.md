# Schleim OS Android Browser (Alpha 0.1.0-alpha06)

The Android APK bundles the original Schleim OS WebExtension from `extension/` and runs it with Mozilla GeckoView. The Chrome extension source manifest and its files remain unchanged in the repository; GitHub Actions adapts only the packaged copy for GeckoView.

## Integrated Android adapters

- **GitHub account and settings backup:** Uses the original Schleim OS GitHub Device Flow, private backup repository, token refresh and settings export/import. GeckoView's WebExtension storage and native popup/window handling are used.
- **Photo/video cloud:** Uses the original private GitHub media repository and metadata index. The original IndexedDB upload queue and compression page are loaded in a hidden GeckoView session.
- **Background upload:** The Android app starts a foreground `dataSync` service while the hidden media page is processing the queued files. Native Android notifications receive upload progress, completion and failure events. The service is stopped after the queue finishes.
- **Camera:** Android serves a small camera host page from a random-port HTTP server bound only to `127.0.0.1`. The app embeds this trusted loopback-origin page with explicit `camera`/`microphone` iframe permissions. It uses GeckoView's media permission delegate; captured photo/video `Blob` data is sent back to the extension page with `postMessage` and continues through the existing private-cloud upload queue. The local server closes with the activity.
- **New tabs and popups:** `TARGET_WINDOW_NEW` is intercepted in `onLoadRequest`. Schleim OS creates and displays the tab itself, rather than switching sessions during GeckoView's popup-session lifecycle. `about:blank` popups are supported so scripts can navigate them after opening.
- **IFrames:** HTTP(S) subframes are allowed by the browser navigation delegate and the Schleim OS app frames request autoplay/fullscreen/clipboard capabilities where relevant.

## Compatibility boundaries

This is a GeckoView port, not Chromium running inside Android. GitHub sign-in and private repositories depend on the existing GitHub App configuration and the user approving device authorization. The photo/video background processor is the original extension page hosted in a native foreground service context; it is not Chrome's Offscreen Documents API.

External sites can still prohibit embedding with their own `X-Frame-Options` or Content-Security-Policy `frame-ancestors` headers. The browser cannot override those server policies; the app's external-open links remain available.

Android may stop foreground data-sync work after its platform time limits or if the user force-stops the app. An upload interrupted by process termination may need to be restarted from the persisted queue when Schleim OS is reopened. Test GitHub authorization, camera capture, new-window navigation, file picking, and longer uploads on a physical Android device before relying on them for important data.

## Build and signing

The Android workflow builds an ARM64 debug APK and uploads it to the latest GitHub Release only after Gradle and APK-content checks pass. Debug signing is not a durable update key; until a private persistent keystore is configured as GitHub Actions secrets, an update may require uninstalling the previous debug build first.


## Alpha 0.1.0-alpha06 fixes

- Routes new-window requests through the app's own tab manager to avoid GeckoView popup-session ownership conflicts.
- Requests camera and microphone permissions before granting a media source and supports fallback source selection by media type.
- Retries camera acquisition with simpler constraints when the requested facing mode or resolution is unavailable.
- Keeps GeckoView 153.0.20260810162159 for this build. GeckoView 160 requires Android API 37 and AGP 9.1; the current project toolchain is Android API 36.1/AGP 8.13. A toolchain upgrade is deliberately deferred rather than shipping an unverified SDK migration.


## Alpha 0.1.0-alpha06 camera workaround

- Mozilla has a public report for Firefox Android/GeckoView where `getUserMedia()` fails from a WebExtension page although it works in a regular website context.
- The camera is therefore hosted in a local `http://127.0.0.1` page, a potentially trustworthy loopback origin under secure-context rules. The server binds only to loopback, uses a random port and per-run token, and exposes only the camera host document.
- The embedded page requests camera access under the local origin and transfers captured photo/video Blobs back to Schleim OS through a source- and origin-checked `postMessage` channel. Upload continues through the existing private repository queue.
- This is a compatibility workaround and still requires camera/iframe permission testing on the physical target device.
