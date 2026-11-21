# Schleim OS 3.18.0 – Context menu, printing and file actions

Schleim Browser improves Android browser controls. The original Chromium Extension remains available separately and is not replaced by the Android app.

## New and improved

- **Long-press context menu:** Long-press a link, image, video or audio item. Schleim Browser opens a native Android context menu with relevant actions.
- **Download links and files:** Links can be opened, opened in a new tab, downloaded or copied as an address.
- **Download media:** Images, videos and audio files can be opened, downloaded or copied as an address when the page exposes a direct HTTP(S) source.
- **Print page:** The context menu also offers **Print page** when you long-press ordinary page content, not just links or media. You can also use **Browser menu → Print** to send the current webpage to Android's native print system. Choose a printer or save the page as a PDF.
- **Open extensions:** The extension manager shows **Open** when an add-on provides an options page or a suitable homepage. The built-in Schleim OS Extension opens the Schleim OS home page.
- **Manage extensions:** Enable, disable and remove actions remain available in the same extension manager.
- **Mozilla Firefox Add-ons:** The extension manager now opens the official [Firefox Add-ons catalog](https://addons.mozilla.org/firefox/) again. Compatible Mozilla-signed XPI files can be downloaded and installed in Schleim Browser.

## Release downloads

- **Schleim-OS-Extension.zip** – the original browser Extension.
- **Browser-OS-Extension-Template.zip** – a neutral Extension template.
- **Schleim-Browser-Android-0.1.0-alpha25.apk** – the standalone Android app.
- **Schleim-Browser-Android-Studio-Template.zip** – the neutral Android Studio project.
- **Schleim-OS-SHA256SUMS.txt** – SHA-256 checksums for release files.

## Notes and known limitations

- File and media downloads require a direct HTTP(S) address. Protected, dynamically generated or blob-based resources and streaming/DRM content may not be downloadable as a single file.
- The **Open** button appears only when an add-on provides an options page or a suitable homepage. Not every extension has an openable page.
- Schleim Browser supports Mozilla-signed XPI extensions. Chrome CRX files cannot be installed directly in GeckoView.
- Android 8.0 or newer and a 64-bit ARM device (arm64-v8a) are required.
- Camera and microphone capture remain disabled in the Android app.
- The APK is a debug build. Due to signing-key differences, installing an update may require uninstalling the previous version first.

## Version information

- Schleim OS Extension: **3.18.0**
- Schleim Browser: **0.1.0-alpha25**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android browser guide](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
