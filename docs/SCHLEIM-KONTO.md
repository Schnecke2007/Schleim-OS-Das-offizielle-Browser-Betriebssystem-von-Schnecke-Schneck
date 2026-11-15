# GitHub account and private cloud setup

The optional account and cloud functions use GitHub Device Flow. This template does not include a preconfigured GitHub App.

## Before you start

1. Create your own GitHub App and enable Device Flow.
2. Configure the repository and account permissions required by the features you want to use.
3. Set its public Client ID, app slug and installation URL in `scripts/schleim-account.js`.
4. Set `REPO_NAME` to a private repository name for settings backups.
5. Set `PHOTOS_REPO_NAME` to a separate private repository name for photos and videos.
6. In `scripts/schleim-photos-cloud.js`, set `REPO_NAME` to exactly the same media repository name as `PHOTOS_REPO_NAME`.

The media repository is created when a signed-in user explicitly links the private media cloud. Keep the settings-backup and media repositories separate.

## Security

- A GitHub App Client ID is public and may be included in the extension.
- Never add a GitHub App Client Secret, private key, personal access token, OAuth token or password to this repository.
- Confirm that both repositories are private before storing user data.
- Test sign-in, installation checks, backup, restore and media upload with a separate test account.
- Consider GitHub repository history and retention when storing personal media. Deleted files may remain in commit history.

The Store, update checker and account integration also contain repository placeholders. Configure each feature separately as described in [CONFIGURATION.md](../CONFIGURATION.md).
