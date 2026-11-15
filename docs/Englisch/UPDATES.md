# Update Schleim OS

The update center in Schleim OS downloads the original Extension directly from the latest [GitHub release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest). You do not need to open the Releases page yourself to start the download.

## Download the update

1. Open **Settings → Update Schleim OS** in Schleim OS.
2. Select **Check for updates**.
3. When a newer version is available, select **Download original Extension ZIP**.
4. The browser downloads **Schleim-OS-Extension.zip** directly from the latest release. Alternatively, you can [download the original Extension directly from Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip).

## Install the update in your browser

1. **Do not extract the ZIP file.** Keep the archive unchanged.
2. Open the extension manager in a browser that supports importing local ZIP extensions.
3. Enable Developer mode if required.
4. Select **+ (from .zip/.crx/.user.js)** or your browser's equivalent import option.
5. Choose the downloaded **Schleim-OS-Extension.zip** file.
6. Confirm the import or update in your browser.

Schleim OS starts the download for you. For security reasons, installation is not automatic: you must manually start the ZIP import and confirm it in the browser.

## Browser compatibility

This no-extraction guide applies to browsers whose extension manager offers local ZIP import. Standard Google Chrome for Android does not support extensions. Desktop Chrome does not offer direct ZIP import; **Load unpacked** loads a folder. A browser without ZIP import cannot install the ZIP using this method.

## Important notes

- The version check reads `extension/manifest.json` from the GitHub default branch. Code changes without a version increase are not detected as a new update.
- Before publishing a new original Extension release, increase the version in `extension/manifest.json` and add matching release notes.
- The update center downloads only the public original Extension ZIP. It does not receive GitHub sign-in credentials.
- Browser confirmation remains manual. Downloading a ZIP alone does not install the update.
- If you completely remove Schleim OS and lose local settings, you can restore them from your private cloud backup under **Settings → Schleim account**.

[GitHub Releases page](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) · [Installation guide](INSTALLATION.md) · [Plain-language guide](../Leichte-Sprache/Englisch/UPDATES.md)
