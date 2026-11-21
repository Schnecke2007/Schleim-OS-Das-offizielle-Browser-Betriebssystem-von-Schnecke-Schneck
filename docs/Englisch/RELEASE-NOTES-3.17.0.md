# Schleim OS 3.17.0 – Context menu, printing and extensions

Schleim Browser receives new browser features for Android. The Chromium browser Extension remains available separately.

## New in Schleim Browser

- **Long-press context menu:** Long-press a link, image, video or audio element to open the relevant browser actions.
- **Links:** Open in a new tab, download, or copy the address.
- **Files and media:** Open or download images, videos and audio files, or copy their addresses when the website exposes a direct HTTP(S) resource URL.
- **Print:** Send the current webpage to Android's native printing system from the browser menu or the context menu. Choose a printer or save the page as a PDF.
- **Open extensions:** The extension manager now displays an additional **Open** button for add-ons that declare an options page. The built-in Schleim OS Extension opens the Schleim OS home page.

## Release downloads

- Schleim-OS-Extension.zip: regular browser Extension.
- Schleim-Browser-Android-0.1.0-alpha23.apk: Android browser.
- Browser-OS-Extension-Template.zip: neutral Extension template.
- Schleim-Browser-Android-Studio-Template.zip: neutral Android Studio project.
- Schleim-OS-SHA256SUMS.txt: SHA-256 checksums for release files.

## Notes and known limitations

- Link and media downloads require a direct HTTP(S) address. Protected, dynamically generated or blob-based resources and streaming/DRM content may be restricted.
- An **Open** button is shown only when an extension provides an options page, or when it is the built-in Schleim OS Extension.
- Android 8.0 or newer and a 64-bit ARM device (arm64-v8a) are required.
- Camera and microphone capture remain disabled in the Android app.
- The APK is a debug build. Due to signing-key differences, installing an update may require uninstalling the previous version first.

## Version information

- Schleim OS Extension: **3.17.0**
- Schleim Browser: **0.1.0-alpha23**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android browser guide](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
