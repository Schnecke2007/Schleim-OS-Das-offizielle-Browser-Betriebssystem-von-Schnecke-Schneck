# Browser OS extension template – installation

The template is a separate, directly loadable Manifest V3 Chromium extension. Its ZIP package contains an active **manifest.json** at the package root.

## Download, configure and load the template

1. Download the [Browser Extension Template ZIP from the latest GitHub release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension-Template.zip).
2. Extract the ZIP file to a folder on your computer.
3. Follow [CONFIGURATION.md](../CONFIGURATION.md) and replace the demo content and setup placeholders.
4. Open **chrome://extensions** in a Chromium-based desktop browser.
5. Enable **Developer mode** and select **Load unpacked**.
6. Choose the extracted template folder that directly contains **manifest.json**.

No manifest renaming or source-code download from the repository is required.

## Install the original Schleim OS extension

The original extension is still provided separately as [Schleim-OS-Extension.zip](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip). It is not changed by the template. Extract that ZIP and load the folder containing its **manifest.json** if you want the official Schleim OS extension rather than your own template copy.

Standard Chrome on Android does not support desktop Chrome extensions. Use a compatible desktop Chromium browser to test the extension.

## GitHub and security

The GitHub App integration, Store administration, media cloud and update checker are intentionally unconfigured. Use your own GitHub App and private repositories. A GitHub App Client ID is public; never include an App Client Secret, private key or personal access token in extension files.

## Before publishing

Replace the demo profile, links, demo images and sample catalogue. Complete the legal placeholders with information appropriate for your project and jurisdiction. The bundled legal pages are examples only and are not ready for publication.
