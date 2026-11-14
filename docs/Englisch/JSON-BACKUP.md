# Cloud backup with the Schleim account

> **Note about older versions:** The previous local JSON import/export feature is no longer available in the Schleim OS 3.11.0 interface. This page explains the current cloud backup and what to do with older files.

## Create a new cloud backup

1. If needed, first install the [Schleim OS Account GitHub App](https://github.com/apps/schleim-os-account).
2. Open **Settings → Schleim account**.
3. Select **Connect with GitHub** and follow the app-installation and device-code steps.
4. After sign-in, select **Back up to cloud now**.

Schleim OS creates or updates `schleim-os-backup.json` in your private GitHub repository named `schleim-os-cloud`.

## What is included?

The current backup format 2 contains saved Schleim OS settings and explicitly includes:
- the home-screen app order,
- installed Store apps,
- the selected system wallpaper,
- a custom wallpaper and its image data or URL.

The backup is started manually under **Settings → Schleim account**. There is no automatic synchronization.

## Restore on another device

Install Schleim OS and sign in under **Settings → Schleim account** with the same GitHub account. Then choose **Restore cloud backup**. The local Schleim OS settings will be replaced by the backup.

## Older JSON files

JSON files created by the previous local export feature cannot be imported through the current interface. Keep those files separately. They are not automatically moved to the cloud.

Older format-1 cloud backups created with the Schleim account can still be restored.

**Security:** The cloud repository must remain private. GitHub passwords and access tokens are never written into the backup file.
