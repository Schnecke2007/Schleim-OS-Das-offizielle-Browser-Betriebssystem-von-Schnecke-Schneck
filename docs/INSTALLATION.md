# Browser OS extension template – installation

The template is deliberately not directly installable when first downloaded. Its manifest is named **manifest.template.json**, not **manifest.json**. This prevents Chromium from recognizing it as an extension while the original project is installed from the separate **extension/** folder.

## Prepare and load your own template

1. Download the [Browser Extension Template ZIP](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/browser-extension-template.zip).
2. Extract the ZIP file to a folder on your computer.
3. Follow [CONFIGURATION.md](../CONFIGURATION.md) and replace the demo content and setup placeholders.
4. When ready to test the customized template, rename **manifest.template.json** to **manifest.json**.
5. Open **chrome://extensions** in a Chromium-based desktop browser.
6. Enable **Developer mode** and select **Load unpacked**.
7. Choose the template folder that now contains **manifest.json**.

## Install the original project extension

When using the complete project ZIP, load only the original **extension/** folder. It contains the active **manifest.json**. The **extension-template/** folder intentionally does not contain an active Chrome manifest, so it is not detected as another extension.

Standard Chrome on Android does not support desktop Chrome extensions. Use a compatible desktop Chromium browser to test the extension.

## GitHub and security

The GitHub App integration, Store administration, media cloud and update checker are intentionally unconfigured. Use your own GitHub App and private repositories. A GitHub App Client ID is public; never include an App Client Secret, private key or personal access token in extension files.

## Before publishing

Replace the demo profile, links, demo images and sample catalogue. Complete the legal placeholders with information appropriate for your project and jurisdiction. The bundled legal pages are examples only and are not ready for publication.
