# Schleim Browser – Android app

**Version 0.1.0-alpha29 · GeckoView · ARM64**

Schleim Browser is the standalone Android browser of the Schleim OS project. It uses Mozilla GeckoView and bundles the original Schleim OS WebExtension inside the APK.

## Technical architecture

- Native Android interface with address bar, search, tab management and browser menu.
- Mozilla GeckoView as the browser engine.
- Original Schleim OS Extension bundled under `app/src/main/assets/extension` by the release workflow.
- Native Android bridges for document saving, XPI file selection, downloads and notifications.
- Application ID: `de.schneckeschneck.schleimbrowser`.
- Minimum version: Android 8.0 / API 26.
- Target SDK: API 35; build SDK: API 36.
- Target architecture: `arm64-v8a`.
- JDK 17, Gradle 8.13, Android Gradle Plugin 8.13.2 and Kotlin Gradle Plugin 2.3.0.

## Browser features

- Address bar with URL navigation and Google search for search terms.
- Back, Forward, Reload and Home.
- Tab management with a maximum of four retained GeckoView sessions; tabs and the selected tab are saved locally and restored on the next app start.
- Downloads in an app-specific download area.
- Local browsing history with up to 250 entries and a clear-history action.
- A fixed DNS-over-HTTPS resolver in a mode without normal plaintext DNS fallback; Settings only show the secure DNS connection status.
- Long-press links, images, videos and audio to open a context menu with open, download and copy actions when a direct HTTP(S) address is available.
- Send webpages to Android's print dialog from the browser menu or context menu, then print or save as PDF.
- Open installed extensions through an **Open** action when they provide an options page; the built-in Schleim OS Extension opens its home page.
- Android file picker and save dialogs.
- Install, enable, disable and remove Mozilla-signed XPI extensions.
- Open the official Mozilla Firefox Add-ons catalog directly from the extension manager.
- Desktop mode and Android default-browser selection.
- The original Extension provides the Schleim OS home screen, Store, account, personalization and cloud features.

## Android limitations

- Camera and microphone capture are intentionally disabled. Android capture permissions are not requested and GeckoView media permission requests are rejected.
- External websites can block embedding through their own Content Security Policy or X-Frame-Options rules.
- Not every Chromium extension is compatible with GeckoView.
- The release APK deliberately uses Android's standard debug signing. The key can change between GitHub builds. The update dialog offers the APK download and a separate uninstall confirmation; back up important local data before reinstalling.

## Build locally

1. Install JDK 17, Android SDK Platform 36 and Gradle 8.13. The repository's `android/` source folder does not include a Gradle wrapper; the downloadable **Android-App Template** ZIP receives one automatically during packaging.
2. Open the repository in Android Studio and select the `android/` folder as the project.
3. Copy the original Extension to `app/src/main/assets/extension` and prepare the Android GeckoView manifest. GitHub Actions performs these steps automatically.
4. Run the build from the project directory:

   ```bash
   gradle --no-daemon -PgeckoviewVersion=153.0.20260810162159 :app:assembleDebug
   ```

5. The APK is written to `app/build/outputs/apk/debug/app-debug.apk`.

## Release and documentation

The Android app is published alongside the Extension in the consolidated release. User installation, update and troubleshooting guides are available in three languages:

- [Deutsch](../docs/Deutsch/ANDROID-BROWSER.md)
- [English](../docs/Englisch/ANDROID-BROWSER.md)
- [Nederlands](../docs/Niederländisch/ANDROID-BROWSER.md)

The guide and generator are kept in the repository under `Android-App/`. Inside the downloaded ZIP, the complete Android Studio project folder is named **Android-App Template**.

[Download the Android APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha25.apk) · [Android Studio template instructions](../Android-App/README.en.md)
