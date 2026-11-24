# Schleim OS 3.20.0 – Welcome screen, Guest Mode and browser cloud backup

## Schleim Browser for Android

- **Welcome screen:** On first launch, a short, skippable introduction explains the main areas: Schleim OS home screen, tabs and history, bookmarks and password manager, add-ons, account/cloud and Guest Mode. Previous/next controls guide the user, and browsing can start immediately.
- **Private Guest Mode:** Guest tabs use private GeckoView sessions. History, tabs, bookmarks, passwords, form data and website data are not written to the regular browser profile or uploaded to the cloud. Account and sync functions, as well as add-on management, are disabled in Guest Mode. The regular profile remains separate and unchanged.
- **Bookmarks:** Webpages can be saved, reopened, edited and deleted.
- **Password manager:** GeckoView detects login forms. New or changed credentials are stored only after explicit user confirmation. The password vault is encrypted and protected by Android Keystore. Opening the manager requires the device's secure screen lock; login suggestions and autofill can be enabled.
- **Schleim account in Settings:** The account area is now under **Browser menu → Settings → Schleim account**. Backup and restore stay locked until GitHub sign-in succeeds.
- **GitHub device sign-in:** The first step opens the GitHub App page for **Schleim OS Account** in a new browser tab. The tab can be closed after installation. Select **Continue – show device code** to start the device flow. The code appears in the browser, is copied automatically, and GitHub's device authorization page opens in another tab. Sign-in is checked automatically.
- **Encrypted profile synchronization:** The browser uses the private repository schleim-os-cloud. It is created during the first successful sign-in if it does not exist. The profile backup is encrypted with AES-256-GCM before upload. It includes local browser settings, history, saved tabs, bookmarks, the password vault, add-on metadata and available XPI installer packages with enabled/disabled state. Automatic backup is optional. Restoring on another device requires the same GitHub account and the backup password.

## Fixes and technical notes

- Profile restore now reconciles the add-on list, reinstalls saved XPI packages and restores enabled/disabled state when the matching installer was backed up.
- Profile changes made while an upload is running are queued for another automatic backup.
- Desktop-mode preference is restored from the saved profile settings.
- The existing dark brown UI theme is retained.
- The existing DNS-over-HTTPS/NextDNS configuration has not been changed. Settings continue to show only a generic secure DNS connection status.

## Profile sync limitations

Website cookies and active website sessions, form entries, private data belonging to individual extensions and ordinary downloads are not included in this browser backup. XPI packages can be restored only when the installer file is locally available and included in the backup. Full per-page Back/Forward navigation state is not transferred.

## Versions

- Browser Extension: **3.20.0**
- Schleim Browser for Android: **0.1.0-alpha30**
- Mozilla GeckoView · Android 8.0+ · ARM64

The Android APK continues to use the standard Android debug signing key. Depending on the build, the old app may need to be uninstalled before installing the new APK. Back up local data before removing the old app.
