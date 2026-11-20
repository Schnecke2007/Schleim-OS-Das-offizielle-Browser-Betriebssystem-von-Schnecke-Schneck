# Schleim OS Android Browser (Alpha 0.1.0-alpha14)

The Android APK bundles the original Schleim OS WebExtension from `extension/` and runs it with Mozilla GeckoView. The Chrome extension source manifest and its files remain unchanged in the repository; GitHub Actions adapts only the packaged copy for GeckoView.

## Integrated Android adapters

- **GitHub account and settings backup:** Uses the original Schleim OS GitHub Device Flow, private backup repository, token refresh and settings export/import. GeckoView's WebExtension storage and native popup/window handling are used.
- **Photo/video cloud:** Uses the original private GitHub media repository and metadata index. The original IndexedDB upload queue and compression page are loaded in a hidden GeckoView session.
- **Background upload:** The Android app starts a foreground `dataSync` service while the hidden media page is processing the queued files. Native Android notifications receive upload progress, completion and failure events. The service is stopped after the queue finishes.
- **Camera:** Camera and microphone capture are deliberately not supported in the Android application. The Android APK contains no camera capture Activity, no camera asset, and requests neither Android `CAMERA` nor `RECORD_AUDIO` permission. GeckoView's media-permission callbacks explicitly reject capture requests, so the app does not display camera or microphone permission prompts. The Android-specific camera section explains this limitation. The original browser extension remains separate and retains its normal JavaScript webcam, live preview, front/rear switch, photo button, video recording button and camera-off control in browsers that support `getUserMedia()` and `MediaRecorder`.
- **New tabs and popups:** `TARGET_WINDOW_NEW` is intercepted in `onLoadRequest`. Schleim OS creates and displays the tab itself, rather than switching sessions during GeckoView's popup-session lifecycle. `about:blank` popups are supported so scripts can navigate them after opening.
- **IFrames:** HTTP(S) subframes are allowed by the browser navigation delegate and the Schleim OS app frames request autoplay/fullscreen/clipboard capabilities where relevant.

## Camera separation

The Android application intentionally has no camera or microphone capture capability. It does not request camera/microphone permissions and explicitly rejects GeckoView media-capture permission requests. In the Android-specific camera section, the user sees a clear notice that photo and video capture are not supported in the app.

The original browser extension continues to use the normal JavaScript Web Camera API. It keeps the live preview, camera start/deactivate controls, front/rear camera switching, photo capture and video recording. This browser functionality is not replaced by or bundled with an Android-native camera implementation.

## Compatibility boundaries

This is a GeckoView port, not Chromium running inside Android. GitHub sign-in and private repositories depend on the existing GitHub App configuration and the user approving device authorization. The photo/video background processor is the original extension page hosted in a native foreground service context; it is not Chrome's Offscreen Documents API.

External sites can still prohibit embedding with their own `X-Frame-Options` or Content-Security-Policy `frame-ancestors` headers. The browser cannot override those server policies; the app's external-open links remain available.

Android may stop foreground data-sync work after its platform time limits or if the user force-stops the app. An upload interrupted by process termination may need to be restarted from the persisted queue.

## Build and signing

The Android workflow builds an ARM64 debug APK and uploads it to the latest GitHub Release only after Gradle and APK-content checks pass. Debug signing is not a durable update key; until a private persistent keystore is configured as GitHub Actions secrets, an update may require uninstalling the previous debug build first.

## Alpha 0.1.0-alpha14 camera separation

- Removes the Android camera Activity and its local WebView camera page.
- Removes Android camera and microphone permissions and the WebView camera dependency.
- Explicitly rejects media-capture permission requests inside the Android app.
- Adds a separate Android-application notice: photo and video capture are not supported in the Android app.
- Restores the normal JavaScript webcam panel exclusively for the original browser extension, including preview and all camera controls.
- Keeps the existing private photo/video cloud library, manual uploads and background upload queue.


## Alpha 0.1.0-alpha14 – getrennte Kamera-Bereiche

- Die Kamera-Seite enthält zwei ausdrücklich getrennte Bereiche: einen Android-Hinweis und die Webkamera der Original-Extension.
- In der Android-Anwendung wird ausschließlich der Hinweis angezeigt, dass Foto- und Videoaufnahmen nicht unterstützt werden.
- Die Android-App fordert keine Kamera- oder Mikrofonberechtigungen an und startet keine Kamera.
- Die Original-Extension behält ihre JavaScript-Webkamera mit Live-Vorschau, Kamera starten/deaktivieren, Front-/Rückkamera wechseln, Foto aufnehmen und Video aufnehmen.
- Die GitHub-Actions-Prüfung kontrolliert jetzt ausdrücklich, dass die Android-App den Hinweisbereich und die Browser-Extension den Webkamera-Bereich einblendet.
