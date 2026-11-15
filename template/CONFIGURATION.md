# Configure your Browser OS template

## Project identity

Edit `manifest.json` (name, short name, description), `assets/icons/icon.svg`, `pages/newtab.html` and `styles/`. Replace `assets/demo/placeholder-avatar.svg` and `placeholder-image.svg` with your own demo or licensed assets.

## GitHub App and cloud features

Create your own GitHub OAuth App, enable Device Flow, and grant the permissions described in [docs/SCHLEIM-KONTO.md](docs/SCHLEIM-KONTO.md). Then configure `scripts/schleim-account.js`:

- `GITHUB_APP_CLIENT_ID`: your OAuth App client ID
- `GITHUB_APP_INSTALL_URL`: your App installation URL
- `GITHUB_APP_SLUG`: your App URL slug
- `REPO_NAME`: private repository for settings backups
- `PHOTOS_REPO_NAME`: private repository for photos and videos

The placeholder client ID and app slug are intentionally nonfunctional. Never place a client secret or private key in extension code.

## Store and update center

In `scripts/update-center.js`, replace `YOUR_GITHUB_USERNAME` and `YOUR_REPOSITORY_NAME`. In `scripts/personalization.js`, update the GitHub issue, catalog and ratings URLs to point to your own repository. Edit sample entries in `data/store-apps.json` and `data/store-ratings.json`.

## Profile and external links

Edit the `URLS` object and demo profile content in `scripts/app.js`. Replace all `example.com`, `your-account`, `your-email@example.com` and `0000000000` values. Review the sample content in `pages/newtab.html` and the standalone demo.

## Legal and privacy content

Legal sections are located in `scripts/app.js` and `locales/legal-translations.js`. Replace all placeholders and write documents appropriate to your own data processing, services and jurisdiction. The included text is only a structural example and must not be published unchanged.

## Test checklist

- Load the unpacked folder in a supported Chromium browser.
- Test language switching, navigation, app tiles, personalization and Store behavior.
- Configure and test GitHub sign-in before enabling cloud functions.
- Test camera and file uploads on target devices.
- Search the entire folder for `YOUR_`, `example.com`, `your-account` and `your-email@example.com` before release.
