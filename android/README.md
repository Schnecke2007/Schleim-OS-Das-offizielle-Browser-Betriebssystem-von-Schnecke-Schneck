# Schleim OS Android Browser (Alpha 0.1.0-alpha09)

The Android APK bundles the original Schleim OS WebExtension from `extension/` and runs it with Mozilla GeckoView. The Chrome extension source manifest and its files remain unchanged in the repository; GitHub Actions adapts only the packaged copy for GeckoView.

## Integrated Android adapters

- **GitHub account and settings backup:** Uses the original Schleim OS GitHub Device Flow, private backup repository, token refresh and settings export/import. GeckoView's WebExtension storage and native popup/window handling are used.
- **Photo/video cloud:** Uses the original private GitHub media repository and metadata index. The original IndexedDB upload queue and compression page are loaded in a hidden GeckoView session.
- **Background upload:** The Android app starts a foreground `dataSync` service while the hidden media page is processing the queued files. Native Android notifications receive upload progress, completion and failure events. The service is stopped after the queue finishes.
- **Camera:** The Android build uses the installed camera activity through Android's `ACTION_IMAGE_CAPTURE` and `ACTION_VIDEO_CAPTURE` intents. It requests `CAMERA` before photos and both `CAMERA` and `RECORD_AUDIO` before videos, on the Android UI thread. It selects Samsung Camera first on Galaxy devices and otherwise selects the first installed camera handler found through Android package visibility queries. A private AndroidX `FileProvider` URI points to a temporary cache file; the returned media is transferred to the WebExtension through GeckoView native messaging, converted to a browser `File`, and uploaded through the existing private-cloud queue. Permanently denied permissions open the app-permission settings. No local HTTP camera server, loopback page, or camera iframe is used.
- **New tabs and popups:** `TARGET_WINDOW_NEW` is intercepted in `onLoadRequest`. Schleim OS creates and displays the tab itself, rather than switching sessions during GeckoView's popup-session lifecycle. `about:blank` popups are supported so scripts can navigate them after opening.
- **IFrames:** HTTP(S) subframes are allowed by the browser navigation delegate and the Schleim OS app frames request autoplay/fullscreen/clipboard capabilities where relevant.

## Compatibility boundaries

This is a GeckoView port, not Chromium running inside Android. GitHub sign-in and private repositories depend on the existing GitHub App configuration and the user approving device authorization. The photo/video background processor is the original extension page hosted in a native foreground service context; it is not Chrome's Offscreen Documents API.

External sites can still prohibit embedding with their own `X-Frame-Options` or Content-Security-Policy `frame-ancestors` headers. The browser cannot override those server policies; the app's external-open links remain available.

Android may stop foreground data-sync work after its platform time limits or if the user force-stops the app. An upload interrupted by process termination may need to be restarted from the persisted queue when Schleim OS is reopened. Test GitHub authorization, camera capture, new-window navigation, file picking, and longer uploads on a physical Android device before relying on them for important data.

## Build and signing

The Android workflow builds an ARM64 debug APK and uploads it to the latest GitHub Release only after Gradle and APK-content checks pass. Debug signing is not a durable update key; until a private persistent keystore is configured as GitHub Actions secrets, an update may require uninstalling the previous debug build first.


## Alpha 0.1.0-alpha09 fixes

- Replaces the local loopback camera workaround with native Android photo/video capture intents.
- Uses Android runtime permissions and a private FileProvider cache URI for the resulting capture file.
- Transfers the completed media file from MainActivity to the WebExtension through GeckoView native messaging, then reuses the existing private-cloud upload queue.
- Retains the direct browser camera fallback for browsers outside the Android GeckoView app.
- Removes the local camera HTTP server and camera-host asset from the Android project.
- Keeps GeckoView 153.0.20260810162159 for this build. GeckoView 160 requires Android API 37 and AGP 9.1; the current project toolchain is Android API 36.1/AGP 8.13. A toolchain upgrade is deliberately deferred rather than shipping an unverified SDK migration.

## Alpha 0.1.0-alpha09 native Android camera

- Adds Android package-visibility queries for standard photo and video capture activities so the installed camera handler can be discovered before launch.
- Serializes permission and camera launches on the UI thread, avoids duplicate capture requests, and surfaces a settings action when Android has permanently denied a permission.


- Opens the installed Android camera app with `MediaStore.ACTION_IMAGE_CAPTURE` for photos and `MediaStore.ACTION_VIDEO_CAPTURE` for videos.
- Requests the app's Android camera permission before photo capture and camera plus microphone permissions before video capture. The camera app itself owns the live preview and recording controls.
- Supplies a private cache-file URI through AndroidX `FileProvider` and explicit temporary read/write URI grants. No shared storage permission is required.
- Reads the returned image/video file, enforces a 50 MiB capture limit, passes it to the extension through the existing GeckoView native-messaging delegate, and uploads it through the existing private media repository.
- Runs permission requests and camera activity launches on Android's UI thread, resolves an actual installed handler, and explicitly grants/revokes the temporary `FileProvider` URI permissions.
