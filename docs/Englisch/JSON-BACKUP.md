# Cloud backup with the Schleim account

> **Note about older versions:** The local JSON import/export feature was replaced by the Schleim account in Schleim OS 3.10.0. This page is now a notice for JSON backup files created by older versions.

## Create a new backup

1. Set up the GitHub App first. See [Set up the Schleim account](../../extension/docs/SCHLEIM-KONTO.md).
2. Open the **Schleim Store** or **Settings**.
3. In the **Schleim account** section, choose **Connect with GitHub**.
4. Confirm the one-time device code directly on GitHub.
5. Select **Back up to cloud now**.

Schleim OS creates or updates `schleim-os-backup.json` in your private GitHub repository named `schleim-os-cloud`.

## Restore on another device

Sign in to the Schleim account on that device with the same GitHub account, then choose **Restore cloud backup**. The current device's settings will be replaced with the saved backup.

## Older JSON files

JSON files exported by earlier Schleim OS versions can no longer be imported through the interface in version 3.10.0. Keep existing files separately. Older files are not automatically migrated to the cloud.

**Security:** The cloud repository must remain private. Schleim OS never stores passwords or access tokens in the backup file.
