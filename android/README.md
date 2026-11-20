# Schleim OS Android Browser (Alpha 0.1.0-alpha11)

The Android APK bundles the original Schleim OS WebExtension from `extension/` and runs it with Mozilla GeckoView. The Chrome extension source manifest and its files remain unchanged in the repository; GitHub Actions adapts only the packaged copy for GeckoView.

## Integrated Android adapters

- **GitHub account and settings backup:** Uses the original Schleim OS GitHub Device Flow, private backup repository, token refresh and settings export/import. GeckoView's WebExtension storage and native popup/window handling are used.
- **Photo/video cloud:** Uses the original private GitHub media repository and metadata index. The original IndexedDB upload queue and compression page are loaded in a hidden GeckoView session.
- **Background upload:** The Android app starts a foreground `dataSync` service while the hidden media page is processing the queued files. Native Android notifications receive upload progress, completion and failure events. The service is stopped after the queue finishes.
- **Camera:** The Android app now contains its own native CameraX camera screen. It does not launch or resolve Samsung Camera or another external camera app. CameraX owns the live preview, photo capture and video recording. The screen provides front/rear camera switching and requests Android's camera permission; video recording also requests microphone permission. Photos and MP4 videos are written to the app-private cache directory, checked against a 50 MiB size limit, passed to the WebExtension through GeckoView native messaging as Base64, converted to browser `File` objects and sent through the existing private-cloud upload queue. The old `ACTION_IMAGE_CAPTURE` / `ACTION_VIDEO_CAPTURE` intent flow and `FileProvider` handoff have been removed.
- **New tabs and popups:** `TARGET_WINDOW_NEW` is intercepted in `onLoadRequest`. Schleim OS creates and displays the tab itself, rather than switching sessions during GeckoView's popup-session lifecycle. `about:blank` popups are supported so scripts can navigate them after opening.
- **IFrames:** HTTP(S) subframes are allowed by the browser navigation delegate and the Schleim OS app frames request autoplay/fullscreen/clipboard capabilities where relevant.

## Compatibility boundaries

This is a GeckoView port, not Chromium running inside Android. GitHub sign-in and private repositories depend on the existing GitHub App configuration and the user approving device authorization. The photo/video background processor is the original extension page hosted in a native foreground service context; it is not Chrome's Offscreen Documents API.

CameraX is included through the AndroidX CameraX 1.7.0 stable artifacts. The camera preview and capture use cases are bound to the capture Activity lifecycle. Actual camera compatibility and recording behaviour still require validation on physical devices, including the Samsung Galaxy S24.

External sites can still prohibit embedding with their own `X-Frame-Options` or Content-Security-Policy `frame-ancestors` headers. The browser cannot override those server policies; the app's external-open links remain available.

Android may stop foreground data-sync work after its platform time limits or if the user force-stops the app. An upload interrupted by process termination may need to be restarted from the persisted queue when Schleim OS is reopened.

## Build and signing

The Android workflow builds an ARM64 debug APK and uploads it to the latest GitHub Release only after Gradle and APK-content checks pass. Debug signing is not a durable update key; until a private persistent keystore is configured as GitHub Actions secrets, an update may require uninstalling the previous debug build first.

## Alpha 0.1.0-alpha11 camera replacement

- Replaces the external camera-app intent approach with a dedicated in-app CameraX activity.
- Adds CameraX PreviewView, ImageCapture, VideoCapture and Recorder use cases.
- Provides its own preview, photo/video control, front/rear camera switching and permission flow.
- Writes captures to a private temporary cache file and returns the path to MainActivity for the existing GeckoView bridge.
- Preserves the original WebExtension media upload queue and private GitHub photo/video repository.
- Removes camera package discovery, external camera intents and the FileProvider dependency.
