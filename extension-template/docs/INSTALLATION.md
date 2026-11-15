# Browser OS extension template – installation

The template is a functional Manifest V3 extension. The release ZIP contains an active **manifest.json** at the package root and can be imported directly by compatible browsers.

## Download, configure and import the template

1. Download [Schleim-OS-Extension-Template.zip from the latest GitHub release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension-Template.zip).
2. **Do not extract or modify the ZIP file.**
3. Open the extension manager in a browser that supports local ZIP-extension import.
4. Enable **Developer mode** if required.
5. Select **+ (from .zip/.crx/.user.js)** or the equivalent file-import option.
6. Choose **Schleim-OS-Extension-Template.zip** and confirm the import.

To update the template, download the latest Template ZIP and import it through the same browser option. The browser may ask you to confirm the update or replacement. Installation is not performed automatically.

## Customize the template

Use your own working copy or GitHub repository to edit the source files. See [CONFIGURATION.md](../CONFIGURATION.md) for placeholders, GitHub integration, Store settings, privacy and legal information. The default GitHub account, repository names and profile content are placeholders.

After customization, publish a GitHub Release in your repository with the package asset named **Schleim-OS-Extension-Template.zip**. The template's update center is configured to download this Template asset, not the original Extension ZIP.

## Import the original Schleim OS extension

The original extension is provided separately as [Schleim-OS-Extension.zip](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip). It is not changed by the template. **Do not extract this ZIP either.** Import it directly through the same local ZIP-import option if you want the official Schleim OS extension rather than your own template copy.

## Browser compatibility

The direct ZIP-import method depends on the browser. Standard Google Chrome for Android does not support extensions. Desktop Chrome's **Load unpacked** option loads a folder rather than a ZIP file. To install without extracting, use a compatible browser whose extension manager explicitly supports local ZIP import.

## GitHub and security

The GitHub App integration, Store administration, media cloud and update checker are intentionally unconfigured until you set your own values. Use your own GitHub App and private repositories. A GitHub App Client ID is public; never include an App Client Secret, private key or personal access token in extension files.

## Before publishing

Replace the demo profile, links, demo images and sample catalogue. Complete the legal placeholders with information appropriate for your project and jurisdiction. The bundled legal pages are examples only and are not ready for publication.
