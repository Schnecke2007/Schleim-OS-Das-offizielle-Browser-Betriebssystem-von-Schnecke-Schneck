# Schleim OS Android Browser (Alpha 0.1.0-alpha05)

The Android APK bundles the original Schleim OS WebExtension from `extension/` and runs it with Mozilla GeckoView. The Chrome extension source manifest and its files remain unchanged in the repository; GitHub Actions adapts only the packaged copy for GeckoView.

## Integrated Android adapters

- **GitHub account and settings backup:** Uses the original Schleim OS GitHub Device Flow, private backup repository, token refresh and settings export/import. GeckoView's WebExtension storage and native popup/window handling are used.
- **Photo/video cloud:** Uses the original private GitHub media repository and metadata index. The original IndexedDB upload queue and compression page are loaded in a hidden GeckoView session.
- **Background upload:** The Android app starts a foreground `dataSync` service while the hidden media page is processing the queued files. Native Android notifications receive upload progress, completion and failure events. The service is stopped after the queue finishes.
- **Camera:** GeckoView media sources are selected by media type with camera/microphone source preferences. Android camera/microphone runtime permissions are checked and requested before the GeckoView media callback is granted. The camera page retries with simpler constraints when facing-mode or resolution constraints are rejected. The original camera UI uses `getUserMedia` and `MediaRecorder`; file selection is handled by Android's document picker.
- **New tabs and popups:** `TARGET_WINDOW_NEW` is intercepted in `onLoadRequest`. Schleim OS creates and displays the tab itself, rather than switching sessions during GeckoView's popup-session lifecycle. `about:blank` popups are supported so scripts can navigate them after opening.
- **IFrames:** HTTP(S) subframes are allowed by the browser navigation delegate and the Schleim OS app frames request autoplay/fullscreen/clipboard capabilities where relevant.

## Compatibility boundaries

This is a GeckoView port, not Chromium running inside Android. GitHub sign-in and private repositories depend on the existing GitHub App configuration and the user approving device authorization. The photo/video background processor is the original extension page hosted in a native foreground service context; it is not Chrome's Offscreen Documents API.

External sites can still prohibit embedding with their own `X-Frame-Options` or Content-Security-Policy `frame-ancestors` headers. The browser cannot override those server policies; the app's external-open links remain available.

Android may stop foreground data-sync work after its platform time limits or if the user force-stops the app. An upload interrupted by process termination may need to be restarted from the persisted queue when Schleim OS is reopened. Test GitHub authorization, camera capture, new-window navigation, file picking, and longer uploads on a physical Android device before relying on them for important data.

## Build and signing

The Android workflow builds an ARM64 debug APK and uploads it to the latest GitHub Release only after Gradle and APK-content checks pass. Debug signing is not a durable update key; until a private persistent keystore is configured as GitHub Actions secrets, an update may require uninstalling the previous debug build first.


## Alpha 0.1.0-alpha05 fixes

- Routes new-window requests through the app's own tab manager to avoid GeckoView popup-session ownership conflicts.
- Requests camera and microphone permissions before granting a media source and supports fallback source selection by media type.
- Retries camera acquisition with simpler constraints when the requested facing mode or resolution is unavailable.
- Keeps GeckoView 153.0.20260810162159 for this build. GeckoView 160 requires Android API 37 and AGP 9.1; the current project toolchain is Android API 36.1/AGP 8.13. A toolchain upgrade is deliberately deferred rather than shipping an unverified SDK migration.
