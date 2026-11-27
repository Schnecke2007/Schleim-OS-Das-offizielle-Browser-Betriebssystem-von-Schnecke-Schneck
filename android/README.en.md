# Schleim Browser – Android app

**Version 0.1.0-alpha32 · GeckoView · ARM64**

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
- Each installed extension has its own **Details** action. The view reads GeckoView metadata such as description, version, developer, options page, required/optional permissions, host access and data collection.
- Optional add-on permissions can be changed individually through GeckoView APIs addOptionalPermissions and removeOptionalPermissions.
- Compatible add-ons can use **Run in private windows**, backed by WebExtensionController.setAllowedInPrivateBrowsing. Manifest declarations that explicitly forbid private use are respected. This permission is stored and restored with the browser profile backup.
- This permission is not a system-wide VPN feature. VPN/proxy add-ons must implement private-session support themselves; the proxy permission is shown when the add-on declares it.
- Android file picker and save dialogs.
- Install, enable, disable and remove Mozilla-signed XPI extensions.
- Open the official Mozilla Firefox Add-ons catalog directly from the extension manager.
- Desktop mode and Android default-browser selection.
- The original Extension provides the Schleim OS home screen, Store, account, personalization and cloud features.



## Browser profile, Guest Mode and account sync

- A skippable welcome screen explains the main browser features on first launch.
- Bookmarks can be saved, opened, edited and deleted.
- The password manager uses GeckoView's login storage API. New credentials are stored only after confirmation; the vault is encrypted with Android Keystore and protected by the device lock.
- Guest Mode uses private GeckoSession instances. History, tab, website and form data are not persistently stored in the regular profile. Account, cloud and add-on management are disabled in Guest Mode.
- The Schleim account is in Settings. Sign-in first opens the GitHub App page in a new tab, then starts the device-code flow. The code is displayed/copied and the GitHub device authorization page opens in another tab.
- Cloud backups are encrypted with AES-256-GCM and stored only in the private schleim-os-cloud repository. Backups include local settings, history, tabs, bookmarks, encrypted logins, add-on metadata and available XPI packages with enabled/disabled state.
- Website cookies, active website sessions, form entries, private add-on data and ordinary downloads are not transferred. Add-ons without a locally available XPI installer cannot be automatically reinstalled on another device.

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

[Download the Android APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha32.apk) · [Android Studio template instructions](../Android-App/README.en.md)
