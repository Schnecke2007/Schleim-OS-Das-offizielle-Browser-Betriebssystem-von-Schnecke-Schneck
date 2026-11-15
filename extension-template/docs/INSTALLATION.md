# Browser OS extension template – installation

This guide applies to the neutral template copy. The extension must be loaded from the extracted template directory, not from the original project repository.

## Load the extension

1. Download the [Browser Extension Template ZIP](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/archive/refs/heads/browser-extension-template.zip).
2. Extract the ZIP file to a folder on your computer.
3. Open `chrome://extensions` in a Chromium-based desktop browser.
4. Enable **Developer mode**.
5. Select **Load unpacked**.
6. Choose the extracted template folder (the folder containing `manifest.json`).
7. Open a new tab to view the demo dashboard.

The exact extension installation process varies by browser. Standard Chrome on Android does not support desktop Chrome extensions. Use a compatible desktop Chromium browser to test the extension.

## Configure GitHub features

The GitHub App integration, Store administration, media cloud and update checker are intentionally unconfigured. Follow [CONFIGURATION.md](../CONFIGURATION.md) before testing these features. A GitHub App Client ID is public; never include an App Client Secret, private key or personal access token in extension files.

## Before publishing

Replace the demo profile, links, demo images and sample catalogue. Complete the legal placeholders with information appropriate for your own project and jurisdiction. The bundled legal pages are examples only and are not ready for publication.
