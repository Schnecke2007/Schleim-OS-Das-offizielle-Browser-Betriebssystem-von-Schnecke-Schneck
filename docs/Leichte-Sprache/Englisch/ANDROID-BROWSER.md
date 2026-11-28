# Schleim Browser – Android app

Schleim Browser is an app for Android.
The app uses Mozilla GeckoView.
It includes the Schleim OS home page.

## Download

[Download Schleim Browser Alpha 33](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha33.apk).

## Install the app

1. Open the downloaded APK file.
2. Android may ask whether this source can install apps.
3. Allow this only when you trust the source.
4. Tap **Install**.
5. Open **Schleim Browser**.

## Use the browser

- Enter a website address or a search term.
- Use Back, Forward and Reload.
- Use the tab icon to switch between tabs.
- The browser menu has Downloads, History, Extensions and Settings.
- You can open up to four tabs at once.
- Press and hold a link or image to see more actions.
- You can print a webpage or save it as a PDF.

## New features

- **History:** Open **History** in the menu. You can see websites you visited. You can open a page again. You can also clear the history.
- **Secure DNS:** The browser uses one fixed DNS server. The connection is encrypted. You cannot change the DNS server. Settings only say that a secure DNS connection is used.
- **Save tabs:** The browser saves your last four tabs. It also saves which tab was active. The tabs open again when you start the app.

- **Welcome:** The app shows a short guide when you start it for the first time. You can go forward or back. You can also skip it.
- **Bookmarks:** You can save websites. You can open them later, edit them or delete them.
- **Password manager:** A new password is saved only after you agree. Passwords are encrypted. You need your Android device's secure screen lock to open the manager.
- **Guest Mode:** You can browse privately. Your visited pages, forms, tabs, bookmarks and passwords are not saved in the normal profile. There is no cloud backup. Your normal profile stays separate.
- **Schleim account:** The account is in Settings. You must sign in to GitHub before you can use backup.
- **Sign-in:** First, the GitHub App page opens in a new tab. Install **Schleim OS Account** there. Then return to Settings → Schleim account and tap Continue. The device code is shown and copied. GitHub's approval page opens in another tab.
- **Cloud backup:** The backup is encrypted and saved in a private GitHub repository. You need your GitHub account and backup password to restore it on another device.
- **Extension details:** Every extension has a **Details** button. You can see the information the browser has for that extension. For example, its name, version and permissions. You can open its own settings page when it has one.
- **Private tabs:** For supported extensions, you can turn on **Run in private windows**. The extension must support private tabs. This setting alone does not create a VPN. It is saved in the browser backup.


## Updates

The Android app has its own updates.

1. Open the browser menu.
2. Open **Settings**.
3. Tap **Check for updates**.
4. When an update is ready, download the APK first.
5. Return to the update window.
6. Tap **Uninstall old app**.
7. Confirm the uninstall request in Android.
8. Open the downloaded APK and install it.

## Important

- History and tabs are saved on your device.
- Uninstalling the app can delete this data.
- Back up important data before uninstalling.
- Camera and microphone capture are turned off in the Android app.
- The Android app and the browser Extension have separate updates.

## Help

Read the [full Android browser guide](../../Englisch/ANDROID-BROWSER.md).

[Back to the plain-language English guide](README.md)

## Schleim VPN and devices

- Schleim Browser has WireGuard VPN inside the browser.
- You need your own complete .conf file from your Proton account.
- The server list is loaded from the Schleim OS repository. It does not show live Proton data.
- Only Schleim Browser uses the tunnel. The Extension can open the VPN panel, but it does not create the tunnel.
- The APK supports ARMv7, ARM64 and x86_64. 32-bit x86 does not work.
- Android 8 or newer is required. Android 7 does not work.

- The VPN shows download and upload in Mbit/s.
- You can choose other imported VPN profiles.
- Your profiles are stored only on the device and encrypted.
- The private key is still required. The VPN provider may link it to your account.
