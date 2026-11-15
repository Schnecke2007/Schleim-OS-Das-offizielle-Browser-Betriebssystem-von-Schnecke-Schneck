# Account and private cloud

## Sample account

The template uses GitHub App sign-in with Device Flow. Each project owner must create and install their own GitHub App.

1. Create a GitHub App for your Browser OS project.
2. Enable Device Flow.
3. Add the public Client ID and app URL in `scripts/browser-account.js`.
4. Grant the permissions required by your features: Repository creation (write), Contents (read/write) and, if used, Email addresses (read).
5. Install the app in your GitHub account and sign in with the device code.

The account module stores settings backups in a private repository. Set the repository name through `REPO_NAME` in `scripts/browser-account.js`.

## Photo and video cloud

The media app uses a second private repository. Set the same repository name in all four locations:

- `scripts/browser-account.js`: `PHOTOS_REPO_NAME`
- `scripts/browser-media-cloud.js`: `REPO_NAME`
- `scripts/media-upload-worker.js`: `MEDIA_REPO_NAME`
- `scripts/media-upload-offscreen.js`: `REPO_NAME`

All four values must match exactly. Replace `YOUR_MEDIA_REPOSITORY_NAME` everywhere with your own repository name.

Photos and videos are sorted by media type, year and month. The media index stores metadata and paths to uploaded files. The template's upload limit is 50 MiB per file.

## Privacy and security

- The media repository must be private.
- Never put GitHub App client secrets, private keys or personal access tokens in extension source code.
- Browser OS never asks for your GitHub password. Sign-in and device approval happen directly on GitHub.
- GitHub repositories are version-controlled. Deleted or replaced files may remain in repository history.
- Test the setup with your own test account first.

The standalone demo does not perform real GitHub sign-in and does not upload local media to a server.
