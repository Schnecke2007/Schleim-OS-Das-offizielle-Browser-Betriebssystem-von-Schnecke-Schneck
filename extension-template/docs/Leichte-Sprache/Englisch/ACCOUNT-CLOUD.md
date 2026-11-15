# Account and cloud

## Sample account

You need your own GitHub App.

- Create a GitHub App for your project.
- Enable Device Flow.
- Add the Client ID and app link in `scripts/browser-account.js`.
- Install the app in your GitHub account.
- Sign in with the device code.

The template saves settings in a private GitHub repository.

## Photo and video cloud

Photos and videos use a second private repository.

Use the same repository name in four places:

- `scripts/browser-account.js` at `PHOTOS_REPO_NAME`
- `scripts/browser-media-cloud.js` at `REPO_NAME`
- `scripts/media-upload-worker.js` at `MEDIA_REPO_NAME`
- `scripts/media-upload-offscreen.js` at `REPO_NAME`

All four names must match.
Replace `YOUR_MEDIA_REPOSITORY_NAME` in every file.

Photos and videos are sorted by year and month.
Each file must be 50 MiB or smaller.

## Important

- The media repository must be private.
- Do not share secret keys.
- Do not put passwords in the code.
- GitHub may keep old file versions.
- Test everything with a test account first.

The demo does not upload local photos or videos to a server.
