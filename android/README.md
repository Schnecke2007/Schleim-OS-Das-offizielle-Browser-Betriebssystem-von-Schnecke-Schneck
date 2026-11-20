# Schleim OS Android Browser (Alpha 0.1.0-alpha12)

The Android APK bundles the original Schleim OS WebExtension from `extension/` and runs it with Mozilla GeckoView. The Chrome extension source manifest and its files remain unchanged in the repository; GitHub Actions adapts only the packaged copy for GeckoView.

## Integrated Android adapters

- **GitHub account and settings backup:** Uses the original Schleim OS GitHub Device Flow, private backup repository, token refresh and settings export/import. GeckoView's WebExtension storage and native popup/window handling are used.
- **Photo/video cloud:** Uses the original private GitHub media repository and metadata index. The original IndexedDB upload queue and compression page are loaded in a hidden GeckoView session.
- **Background upload:** The Android app starts a foreground `dataSync` service while the hidden media page is processing the queued files. Native Android notifications receive upload progress, completion and failure events. The service is stopped after the queue finishes.
- **Camera:** Replaces the previous CameraX and external-camera approaches with a separate Android System WebView using JavaScript `navigator.mediaDevices.getUserMedia()` and `MediaRecorder`. The local camera page is served through AndroidX `WebViewAssetLoader` at the reserved HTTPS origin `https://appassets.androidplatform.net`, so it runs in a secure browser context. `WebChromeClient.onPermissionRequest` checks that exact origin, requests Android `CAMERA` and `RECORD_AUDIO` permissions as needed, and grants only WebView's video/audio capture resources. The page automatically opens the live preview, supports rear/front camera switching, takes JPEG photos with canvas, and records audio/video with MediaRecorder. Captures are transferred to a private cache file in bounded Base64 chunks through a narrowly scoped JavaScript bridge, checked against 50 MiB, then passed through GeckoView native messaging to the existing private-cloud upload queue. No CameraX, FileProvider, loopback HTTP server, external camera intent, or remote camera page is used.
- **New tabs and popups:** `TARGET_WINDOW_NEW` is intercepted in `onLoadRequest`. Schleim OS creates and displays the tab itself, rather than switching sessions during GeckoView's popup-session lifecycle. `about:blank` popups are supported so scripts can navigate them after opening.
- **IFrames:** HTTP(S) subframes are allowed by the browser navigation delegate and the Schleim OS app frames request autoplay/fullscreen/clipboard capabilities where relevant.

## Camera security and compatibility

The camera page uses the Android-reserved `appassets.androidplatform.net` HTTPS origin through `WebViewAssetLoader`; it does not enable file-URL access or content-URL access. The JavaScript bridge is attached only to this local page, and the WebView blocks navigation away from its camera asset. Camera and microphone permissions are requested separately, so photo capture does not require microphone permission. Video uses the WebView's installed Chromium media stack; codec support depends on the Android System WebView version. The page prefers WebM/VP8/Opus and falls back to supported MP4 when available.

Actual hardware access, codecs and recording behaviour still require validation on physical devices, including the Samsung Galaxy S24.

## Compatibility boundaries

This is a GeckoView port, not Chromium running inside Android. GitHub sign-in and private repositories depend on the existing GitHub App configuration and the user approving device authorization. The photo/video background processor is the original extension page hosted in a native foreground service context; it is not Chrome's Offscreen Documents API.

External sites can still prohibit embedding with their own `X-Frame-Options` or Content-Security-Policy `frame-ancestors` headers. The browser cannot override those server policies; the app's external-open links remain available.

Android may stop foreground data-sync work after its platform time limits or if the user force-stops the app. An upload interrupted by process termination may need to be restarted from the persisted queue.

## Build and signing

The Android workflow builds an ARM64 debug APK and uploads it to the latest GitHub Release only after Gradle and APK-content checks pass. Debug signing is not a durable update key; until a private persistent keystore is configured as GitHub Actions secrets, an update may require uninstalling the previous debug build first.

## Alpha 0.1.0-alpha12 camera replacement

- Removes CameraX and the external camera-app intent approach.
- Adds a dedicated local HTTPS camera page displayed in Android System WebView.
- Opens the live camera automatically using JavaScript `getUserMedia()`.
- Uses WebView's own permission request callback plus Android camera/microphone runtime permissions.
- Captures photos with HTML canvas and records videos with browser `MediaRecorder`.
- Transfers captured data in small chunks to an app-private temporary file to avoid one large Base64 bridge call.
- Keeps the existing GeckoView native messaging and private GitHub media upload queue.
