# Schleim Browser – Android app

Schleim OS is now available in two separate variants:

- **Browser Extension:** The original Schleim OS new-tab interface for compatible Chromium browsers.
- **Schleim Browser:** A standalone Android app based on Mozilla GeckoView. It bundles the Schleim OS Extension and combines it with a native browser toolbar, tabs and Android file features.

The Android app does not replace Android. It is a browser that runs on Android.

## Download

Open the [GitHub Releases page](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) and download **Schleim-Browser-Android-0.1.0-alpha32.apk**.

Direct download: [Schleim Browser for Android – APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha32.apk)

## System requirements

- Android 8.0 or newer (API 26+)
- ARMv7 (armeabi-v7a), ARM64 (arm64-v8a), x86_64 (32-bit x86 is not supported by current GeckoView)
- Internet access for websites, Extension content and online features
- About 200 MB of free storage for the APK and additional app data

The app is built with Android SDK 36. Its minimum runtime version remains Android 8.0 (API 26). The universal APK contains GeckoView native libraries for all three CPU architectures listed above; Android uses the matching ABI during installation. ARMv7/ARMv8 are CPU architectures, not Android OS versions.

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

- Up to four browser tabs are kept open at once. When more tabs are opened, an older background tab is removed to limit memory and resource use.
- The Android app supports file uploads and the Android save-file dialog for exported files.
- Mozilla-signed XPI extensions can be installed from the browser menu.
- **Mozilla Firefox Add-ons:** The button in the extension manager opens the official [Firefox Add-ons catalog](https://addons.mozilla.org/firefox/) again. Compatible Mozilla-signed XPI files can be downloaded and then installed with **Install XPI file**.
- **Context menu:** Long-press a link, image, video or audio element. The menu offers relevant actions to open, download or copy its address. Downloads work when a direct HTTP(S) address is available.
- **Print:** Send the current webpage to Android's print dialog from the browser menu or context menu. Choose a printer or select **Save as PDF**.
- **Open extensions:** The extension manager shows an **Open** button for add-ons with a declared options page. The built-in Schleim OS Extension opens its home page.
- **Per-extension details:** Every installed extension has its own **Details** button. The detail view displays only information GeckoView reports for that add-on: description, version, developer, homepage, options page, required and optional permissions, and host access. Optional permissions can be granted or revoked individually. An available options page can be opened directly.
- **Private windows:** When an extension's manifest does not explicitly forbid private use, its details include **Run in private windows**. This uses GeckoView's setAllowedInPrivateBrowsing API and is included in browser profile backup/restore. It is not a system-wide VPN feature: a VPN/proxy extension must itself support private sessions and be configured correctly. The proxy permission is identified when the add-on requests it.
- Camera and microphone capture are intentionally disabled in the Android app. The Camera tile explains this limitation. The JavaScript webcam in the original browser Extension remains separate.
- Some websites block embedding in other pages. Such content may appear blank or need to be opened directly.
- Not every desktop Chrome extension is compatible with GeckoView.

## Schleim VPN – Proton Free

The browser menu contains **Schleim VPN**. It displays locations from the repository's server manifest and can import a profile, request a connection, or request disconnection.

**Implementation:** Schleim Browser controls the free companion client **OpenVPN for Android**. That separate client provides Android's `VpnService` tunnel and manages the system VPN permission, credentials and connection state. Schleim Browser does not currently bundle an OpenVPN engine and is not itself a VPN provider.

1. Install [OpenVPN for Android from F-Droid](https://f-droid.org/packages/de.blinkt.openvpn/).
2. Open **Browser menu → Schleim VPN** and choose a location.
3. Tap **Import profile**. Schleim Browser downloads the profile from the repository and opens it in the OpenVPN client.
4. Import it there. Keep the profile name shown in the dialog and enter your **Proton OpenVPN credentials**. Your regular Proton account password is not the correct credential.
5. Choose **Connect**. Android may show a VPN consent dialog. Use **Disconnect** in the browser menu or the OpenVPN client to stop the tunnel.

The server list is refreshed from `vpn/servers.json` whenever the VPN panel opens. The selected profile is downloaded from the repository at import time. Changes to the repository list and profile files therefore appear without an APK update.

**Important limitation:** This refreshes the Schleim Browser repository's list and files, not Proton's upstream server inventory automatically. Proton can rotate or retire servers and manual profiles. The profiles currently in the repository are from an older configuration set and are not verified as current or active. Proton states that manual OpenVPN configurations downloaded before September 2023 are no longer supported after the end of February 2026. Replace the repository profiles with current files downloaded from Proton before treating them as working profiles. [Proton: update old OpenVPN configs](https://protonvpn.com/blog/old-ovpn-configs) · [OpenVPN credentials](https://protonvpn.com/support/vpn-auth-fail-solution)

The Proton Free plan is free; Schleim Browser does not charge a VPN fee for this integration. Availability of individual locations remains controlled by Proton.

## History, DNS and automatic tab saving

- **History:** Open **History** from the browser menu. It lists successfully visited HTTP and HTTPS pages with their title, address and visit time. History is stored locally, keeps up to 250 entries and can be removed with **Clear history**.
- **Secure DNS connection:** Schleim Browser uses a fixed DNS-over-HTTPS resolver for normal DNS lookups. The connection is encrypted over HTTPS. This configuration cannot be changed. Settings only show **Secure DNS connection**; the server address and provider name are not displayed there.
- **Automatically saved tabs:** Up to four open tabs and the selected tab are saved automatically. The tabs are restored with their last opened address the next time the app starts. The full Back/Forward page-navigation state is not saved.
- History and tabs are stored in local app data. Uninstalling the app can delete this data.

## Welcome screen, Guest Mode and Schleim account

On the first launch, Schleim Browser displays a short introduction. Use **Next** and **Back** to move between the main features. You can skip the introduction or start browsing immediately.

- **Bookmarks:** Save a webpage, open it later, and edit or delete saved entries.
- **Password manager:** New credentials are saved only after you confirm. Passwords are encrypted and protected by the Android Keystore. The device's secure screen lock is required to open the password manager. You can enable login suggestions and autofill in its settings.
- **Guest Mode:** Start a private session from the introduction or browser menu. Guest tabs use private GeckoView sessions. History, tabs, bookmarks, passwords, form data and website data are not copied into the regular profile or synchronized to the cloud. Account sign-in and add-on management are also disabled. Your normal browser profile remains unchanged. Guest tabs are not saved for the next app launch.
- **Open your account:** Schleim account is under **Browser menu → Settings → Schleim account**. Cloud backup and restore remain locked until sign-in succeeds.
- **First sign-in:** Select **Open Schleim OS Account**. The GitHub App page opens in a new browser tab. Install the GitHub app named **Schleim OS Account** there. You may close that tab and return to **Settings → Schleim account**. Then select **Continue – show device code**.
- **Approve the device code:** The one-time code appears in the browser and is copied to the clipboard automatically. GitHub's device authorization page opens in another tab. You can copy the code again or use **Back** to return to the previous tab. The app checks the authorization automatically. Enter your GitHub password only on GitHub itself.
- **Private cloud backup:** After sign-in, the app uses the private repository schleim-os-cloud and creates it during the first sign-in when needed. Browser backups are encrypted with AES-256-GCM before upload. To restore on another device, use the same GitHub account and your backup password. Automatic backup is optional and can be enabled in the account screen.

The browser profile backup includes local settings, history, saved tabs, bookmarks, the encrypted password vault and add-on metadata. XPI installer packages are included when they are present in the app storage and can be reinstalled during restore. Website cookies and active website sessions, form entries, private data belonging to individual add-ons and ordinary downloads are not included. Full per-page Back/Forward navigation state is not transferred either.

## Updates


The Android app is updated separately from the browser Extension. Open **Browser menu → Settings → Check for updates**. When an update is available, use the update dialog to download the APK first. Then choose **Uninstall old app**. Android will show its own confirmation prompt. Finally, install the downloaded APK from your Downloads folder.

The release APK uses Android's standard debug key. This key can change between builds. A direct in-place update is therefore not guaranteed, and the old app must be removed before installing the new APK. Back up important data first. Uninstalling can delete history, saved tabs and other local app data.

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
- APK architecture: universal (armeabi-v7a, arm64-v8a and x86_64)

[Main documentation](../../README.en.md) · [Browser Extension installation](INSTALLATION.md) · [Troubleshooting](TROUBLESHOOTING.md) · [Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
