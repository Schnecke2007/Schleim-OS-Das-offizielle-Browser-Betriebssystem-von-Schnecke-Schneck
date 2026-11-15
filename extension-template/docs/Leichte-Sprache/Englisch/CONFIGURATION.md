# Template settings – Easy Language

The template contains sample details. Add your own details.

## 1. Name and profile

- Open `manifest.json`.
- Change the name and description.
- Change the sample text in `scripts/app.js`.
- Replace the images in `assets/demo/`.

## 2. Set up GitHub

You need your own GitHub App.

- Add the public App ID in `scripts/browser-account.js`.
- Add the link to your app.
- Add the name of your private backup repository.
- Add your GitHub username and repository name in the update center.

## 3. Photo and video cloud

You need a second private repository for photos and videos.

Use the same repository name in four files:

- `browser-account.js`
- `browser-media-cloud.js`
- `media-upload-worker.js`
- `media-upload-offscreen.js`

Replace `YOUR_MEDIA_REPOSITORY_NAME` in all four files.

## 4. Store

Check the apps in `data/store-apps.json`. Change the sample links and text.

## Security

Never put a GitHub App secret, private key or access token in the extension code. Do not put a password there.

The demo does not sign in to GitHub. It does not upload photos or videos to a server.
