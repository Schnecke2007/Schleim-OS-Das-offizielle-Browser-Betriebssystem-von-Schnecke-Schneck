# Update Schleim OS

The [GitHub Releases page](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) contains the current version and both download packages. The update center compares the installed version with the version in `extension/manifest.json` on GitHub and offers the standalone Extension download.

## Download the update

1. Open **Settings → Update Schleim OS** in Schleim OS.
2. Select **Check for updates**.
3. When a newer version is available, select **Download the latest ZIP version**. The button downloads **Schleim-OS-Extension.zip** from the latest release.
4. You can also [download the Extension directly from the latest release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip).

## Finish the update in your browser

1. Extract the downloaded ZIP file.
2. Copy its contents into the same local folder that contains your current extension, overwriting the existing files.
3. Open your browser's extension manager (`chrome://extensions` in Chrome).
4. Select **Reload** for Schleim OS.
5. Open a new tab and check the installed version in the update center.

Where possible, keep using the same folder as your existing installation. Do not remove the extension if you want to keep using the current local installation.

## Why does the button not install the update automatically?

Chrome does not allow an extension to download an arbitrary ZIP file from the internet and silently replace itself with that file. The download is therefore a manual step. The extension manager loads the updated files after you select **Reload**.

Automatic updates outside the Chrome Web Store require a different distribution method: an update URL with an XML update manifest and a signed CRX package. The CRX must be signed with the same private key as the already-installed extension. Chrome also restricts self-hosted installations depending on the operating system and management policy.

Official information:
- [Chrome: Extension update lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle)
- [Chrome: Distribute your extension](https://developer.chrome.com/docs/extensions/how-to/distribute)
- [Chrome: Self-hosting extensions on Linux](https://developer.chrome.com/docs/extensions/how-to/distribute/host-on-linux)

## Important notes

- The update check reads the version from the GitHub default branch. Code changes without a version increase are not detected as a new update.
- Increase the version in `extension/manifest.json` and add matching release notes before every release.
- The update center only downloads the public Extension ZIP file. It does not receive GitHub sign-in credentials.
- The browser does not silently install the update; reload it through the extension manager.
- If you remove and reinstall Schleim OS and local settings are lost, you can restore them from your private cloud backup under **Settings → Schleim account**.

[GitHub Releases page](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) · [Installation guide](INSTALLATION.md) · [Plain-language guide](../Leichte-Sprache/Englisch/UPDATES.md)
