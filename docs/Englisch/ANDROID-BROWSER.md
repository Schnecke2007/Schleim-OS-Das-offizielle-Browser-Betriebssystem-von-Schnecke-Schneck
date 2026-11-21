# Schleim Browser – Android app

Schleim OS is now available in two separate variants:

- **Browser Extension:** The original Schleim OS new-tab interface for compatible Chromium browsers.
- **Schleim Browser:** A standalone Android app based on Mozilla GeckoView. It bundles the Schleim OS Extension and combines it with a native browser toolbar, tabs and Android file features.

The Android app does not replace Android. It is a browser that runs on Android.

## Download

Open the [GitHub Releases page](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) and download **Schleim-Browser-Android-0.1.0-alpha24.apk**.

Direct download: [Schleim Browser for Android – APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha24.apk)

## System requirements

- Android 8.0 or newer (API 26+)
- 64-bit ARM device (arm64-v8a)
- Internet access for websites, Extension content and online features
- About 200 MB of free storage for the APK and additional app data

The app is built with Android SDK 36. Its minimum runtime version remains Android 8.0 (API 26).

## Installation

1. Download the APK from the release.
2. Open the downloaded APK using Android's file manager.
3. Android may ask you to allow **Install unknown apps** for the browser or file manager you used. Grant this only to a source you trust.
4. Return to the APK and select **Install**.
5. Start **Schleim Browser**.

Android may display a warning because the APK is distributed outside Google Play. Before installing, verify that the download comes from the official GitHub repository.

## Getting started

- **Address or search:** Enter a web address or search term in the address bar.
- **Navigation:** Use Back, Forward and Reload.
- **Home:** Opens the bundled Schleim OS interface.
- **Tabs:** Use the tab icon to switch between pages, close tabs and open new ones.
- **Browser menu:** Includes Downloads, Extensions, Desktop mode and Settings.
- **Default browser:** Settings can ask Android to set Schleim Browser as the default browser.
- **Downloads and files:** Downloaded files are stored in the app's own download area. Android handles file pickers and save dialogs.

## Features and limitations

The Android app bundles the Schleim OS Extension inside GeckoView. It includes the home screen, apps, personalization, Schleim-Store, Schleim account and cloud features.

- Up to six browser tabs are kept open at once. When more tabs are opened, an older background tab is removed to limit memory and resource use.
- The Android app supports file uploads and the Android save-file dialog for exported files.
- Mozilla-signed XPI extensions can be installed from the browser menu.
- **Context menu:** Long-press a link, image, video or audio element. The menu offers relevant actions to open, download or copy its address. Downloads work when a direct HTTP(S) address is available.
- **Print:** Send the current webpage to Android's print dialog from the browser menu or context menu. Choose a printer or select **Save as PDF**.
- **Open extensions:** The extension manager shows an **Open** button for add-ons with a declared options page. The built-in Schleim OS Extension opens its home page.
- Camera and microphone capture are intentionally disabled in the Android app. The Camera tile explains this limitation. The JavaScript webcam in the original browser Extension remains separate.
- Some websites block embedding in other pages. Such content may appear blank or need to be opened directly.
- Not every desktop Chrome extension is compatible with GeckoView.

## Updates

Android apps are not updated through the Extension update center. Download the latest APK from the newest GitHub Release and install it.

**Current debug-signing note:** The release APK is currently built as a debug build. Until a persistent private signing key is configured, Android may reject an in-place update. In that case, back up important local settings, check that your private cloud backup is current, uninstall the previous app version and install the new APK. Uninstalling can remove local app data.

## Android Studio template

The release also provides **Schleim-Browser-Android-Studio-Template.zip**. The archive contains a complete Android Studio project with Android source code and a bundled example Extension. Personal details, application ID, GitHub repository, website and contact details are replaced with neutral placeholders inside the template only. The production app in the repository is not changed.

1. Download and extract the template ZIP.
2. Open the contained project folder **Android-App Template** in Android Studio.
3. Customize the application ID, app name, Extension, links and placeholders.
4. Sync Gradle and build your own test APK.
5. Configure your own persistent signing key before publishing.

[Download Android Studio template](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-Studio-Template.zip) · [Template instructions](../../Android-App/README.en.md)

## Troubleshooting

| Problem | Solution |
|---|---|
| Android blocks the installation. | Allow unknown-app installation only for the file manager or browser you used, then open the APK again. |
| “App not installed” appears during an update. | Debug signing can differ between builds. Back up your data, uninstall the old app and install the new APK. |
| Pages are slow or the app says it is not responding. | Close unused tabs, reload the page and restart the app. For repeated ANRs, report the Android version, device model and steps through GitHub Issues. |
| An Extension cannot be installed. | Mozilla-signed XPI files are supported. ZIP, CRX and unpacked project folders are not XPI files. |
| Camera or microphone do not work. | Capture features are intentionally disabled in the Android app. |
| A website does not embed. | Open it directly or use another website. Embedding can be blocked by the provider. |

## Technical information

- Engine: Mozilla GeckoView
- Application ID: de.schneckeschneck.schleimbrowser
- Minimum Android version: API 26
- Target SDK: API 35
- Build SDK: API 36
- Target architecture: ARM64

[Main documentation](../../README.en.md) · [Browser Extension installation](INSTALLATION.md) · [Troubleshooting](TROUBLESHOOTING.md) · [Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
