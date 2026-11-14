# Schleim account, GitHub App and cloud backup

The Schleim account uses your GitHub account for sign-in. Schleim OS never asks for or stores your GitHub password. Sign-in uses GitHub's official device authorization flow.

## 1. GitHub App setup

The **Schleim OS Account** GitHub App has already been created:

- [Open Schleim OS Account](https://github.com/apps/schleim-os-account)
- [Open GitHub App settings](https://github.com/settings/apps)

The app must be **Public** so other Schleim OS users can install it. Enable **Enable Device Flow**.

Required GitHub App permissions:

| Area | Permission | Access |
|---|---|---|
| Account permissions | Email addresses | Read-only |
| Repository permissions | Repository creation | Read and write |
| Repository permissions | Contents | Read and write |

The email permission checks the verified primary GitHub email address. Repository creation allows Schleim OS to create the private cloud repository. Contents allows it to read and write the backup file.

## 2. Client ID and secrets

The public Client ID is configured as `GITHUB_APP_CLIENT_ID` in `extension/scripts/schleim-account.js`.

The Client ID is not a password or a secret. Never put a GitHub App Client Secret or private key in the browser extension.

## 3. Sign-in and app installation

The sign-in panel is available in the Schleim-Store and under **Settings → Schleim account**.

1. Select **Connect with GitHub**.
2. Schleim OS first opens the [Schleim OS Account GitHub App page](https://github.com/apps/schleim-os-account).
3. Install the app for your GitHub account. Return to Schleim OS and select **I installed the app – continue**.
4. Schleim OS requests and displays a one-time device code.
5. After a short delay, Schleim OS attempts to copy the code to the clipboard. You can also use **Copy code**.
6. A few seconds later, the GitHub device authorization page opens. The **Open GitHub device authorization** link remains available.
7. Enter the code on the real GitHub page and approve **Schleim OS Account**.
8. After authorization, Schleim OS checks through the GitHub API whether the app installation is associated with the signed-in account. If GitHub has not listed it yet, Schleim OS checks again for up to five minutes.
9. Schleim OS then finds or creates the private repository `schleim-os-cloud`.

**Technical limitation:** Before the first device authorization, Schleim OS has no GitHub App user access token. It therefore cannot query the installation list through the API before sign-in. The app page is opened first and the user confirms installation. The API check runs after device authorization. GitHub documents this endpoint as [List app installations accessible to the user access token](https://docs.github.com/en/rest/apps/installations?apiVersion=2026-03-10).

If clipboard access is unavailable, the code remains visible and can be copied manually. The links to reopen the GitHub App and device authorization page remain available.

## 4. Store access

The Schleim-Store is available only while a Schleim account is signed in. Without a valid session, the catalogue, search, ratings, installation, removal and suggestion functions remain locked. Signing out locks the Store again.

This protects the Store interface inside Schleim OS. Catalogue and rating files in the public GitHub repository remain publicly readable.

## 5. Cloud backup and restore

Cloud backup is available only under **Settings → Schleim account**. The Store does not contain backup or restore buttons.

- **Back up to cloud now:** Creates or updates `schleim-os-backup.json` in the private `schleim-os-cloud` repository.
- **Restore cloud backup:** Downloads the backup and replaces the local Schleim OS settings. A confirmation is shown first.

The current backup uses **format version 2**. It contains saved Schleim OS settings with the `ssos-` prefix and explicitly records:

- Home-screen app tile order
- Installed Store apps
- Selected system wallpaper
- Custom wallpaper image data and/or its URL

The backup is started manually. Changes are not synchronized automatically.

Older format-1 cloud backups can still be restored. The previous local JSON import/export interface is not part of the current extension.

## 6. Security and sign-out

- The `schleim-os-cloud` repository must remain private. Schleim OS refuses to save if the repository is public.
- GitHub passwords and access tokens are not written into the backup file.
- Access tokens are stored locally in extension storage so the account session can survive browser restarts and be refreshed when required.
- **Sign out** removes the locally stored Schleim account session. It does not automatically revoke the GitHub App authorization.
- To revoke access completely, also remove the app authorization in GitHub under **Settings → Applications**.

Further reading: [Main documentation](../../README.en.md) · [Store guide](../../Store/Englisch/README.md) · [Installation guide](INSTALLATION.md) · [Technical notes](TECHNICAL-NOTES.md)
