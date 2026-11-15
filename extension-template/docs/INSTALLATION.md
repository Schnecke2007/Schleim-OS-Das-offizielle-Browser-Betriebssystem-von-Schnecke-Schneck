# Browser OS extension template – installation

The template is a functional Manifest V3 extension. The release ZIP contains an active **manifest.json** at the package root and can be imported directly in compatible browsers.

## Download and import

1. Download **Browser-OS-Extension-Template.zip** from the latest release of your configured repository.
2. **Do not extract or modify the ZIP file.**
3. Open the extension manager in a browser that supports local ZIP-extension import.
4. Enable Developer mode if the browser requires it.
5. Select **+ (from .zip/.crx/.user.js)** or the equivalent local ZIP import option.
6. Choose the Template ZIP and confirm the import.

The download does not install the template automatically. You must confirm the import or update in the browser.

## Configure the template

Use [CONFIGURATION.md](../CONFIGURATION.md) and the translated guides in `docs/Deutsch/`, `docs/Englisch/` and `docs/Niederländisch/`. Set up your own GitHub App and private repositories before using account, backup or media-cloud features.

The template update center downloads only **Browser-OS-Extension-Template.zip** from the latest release of your configured repository. Use this exact asset name when publishing your own package.

## Browser compatibility

Direct ZIP import depends on the browser. Standard Google Chrome for Android does not support extensions. Desktop Chrome's Developer mode loads folders, not ZIP files. For ZIP import without extraction, use a Chromium-based browser whose extension manager explicitly supports local ZIP import.

## Privacy and security

The standalone demo uses sample data only. It does not sign in to GitHub and does not upload local media. The installable extension needs your own GitHub App configuration. Never place app secrets, private keys or access tokens in extension files.

The bundled legal and profile content is sample material. Replace it before publishing.
