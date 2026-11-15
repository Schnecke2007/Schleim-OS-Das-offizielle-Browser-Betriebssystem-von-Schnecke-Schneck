# Technical notes

## Platform and extension format

- Platform: Chromium-based browsers with extension support
- Extension format: Manifest V3
- New-tab entry point: `pages/newtab.html`
- New-tab override: `chrome_url_overrides.newtab`

## Project structure

- `pages/` contains the extension interface.
- `scripts/app.js` controls apps and navigation.
- `scripts/personalization.js` manages personalization, home-screen order and Store UI.
- `scripts/schleim-account.js` manages GitHub App sign-in, device authorization, installation checks, settings backup and private media repository access.
- `scripts/schleim-photos-cloud.js` manages photo/video uploads, metadata, metadata search, camera, gallery and storage statistics.
- `scripts/schleim-photo-ai.js` optionally uses the Chrome Prompt API for local image descriptions and AI-assisted search expansion.
- `scripts/slime-store-admin.js` provides the Store admin portal.
- `scripts/update-center.js` compares the installed version with the configured public GitHub manifest and displays a ZIP download.
- `styles/` contains stylesheets.
- `locales/legal-translations.js` contains demo translations for placeholder legal documents.
- `data/store-apps.json` and `data/store-ratings.json` contain the runtime catalogue and ratings.

## GitHub configuration and permissions

The GitHub account flow uses Device Flow and requires your own GitHub App. Configure the App Client ID, slug, installation URL and repository names as described in [CONFIGURATION.md](../CONFIGURATION.md).

The account backup repository and media repository are separate. Both are intended to be private. The account module checks that the media repository belongs to the signed-in user and is private before using it.

Only the public Client ID may be placed in extension code. Do not include a GitHub App Client Secret, private key, access token or password in this repository.

## Photo and video cloud

The media repository name is configured in both `scripts/schleim-account.js` and `scripts/schleim-photos-cloud.js`. Keep the two values identical. The module creates the repository when the user explicitly links the private media cloud.

Files are organized by media type, capture year and month. JPEG EXIF `DateTimeOriginal` is used where available; otherwise the file modification date is used. Metadata search works without external services. Optional local image descriptions and semantic query expansion use the Chrome Prompt API where supported. Videos currently use metadata and filenames for search.

Still images are optimized locally before upload: the longest edge is limited to 2,560 pixels and WebP quality is 90%. The optimized version is used only when smaller than the original. Animated images and videos are not re-encoded. Uploads are limited to 50 MiB per file.

GitHub repository versioning is not designed as unlimited media storage. Deleted files may remain in repository history. Review repository retention and privacy requirements before using it for important personal data.

## Storage and backup

Personalization and home-screen order are stored locally in the browser profile. Cloud backup is a manual action. It does not synchronize every change automatically.

## Update center

The version check reads the root-level `manifest.json` from the configured GitHub repository branch through `raw.githubusercontent.com`. It compares the numeric manifest version and offers a ZIP download when a newer version is available. The extension does not replace its own files or silently install downloaded packages; users must complete installation through the browser's supported extension-management flow.

## Store and external services

The Store catalogue is a public JSON file in the configured repository. The account sign-in protects the Store interface; it does not make public repository files private. Ratings and app suggestions may be submitted through GitHub, depending on the configuration.

External apps and websites may establish network connections when opened. Review the permissions and privacy policies of any service you add.
