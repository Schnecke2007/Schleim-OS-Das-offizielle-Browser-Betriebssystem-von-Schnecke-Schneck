# Update Schleim OS

This guide applies from **Schleim OS 3.12.0**. The Settings page contains an update center. It checks the version on GitHub and offers the current project download when a newer version is available.

## After the first installation

You do not need to find the full GitHub project manually every time.

1. Open **Settings** in Schleim OS.
2. Find **Update Schleim OS**.
3. Select **Check for updates**.
4. Schleim OS compares the installed version with the version in `extension/manifest.json` on the GitHub default branch.
5. If a newer version is found, select **Download the latest ZIP version**.

## Finish the update in your browser

The download is not the installation.

1. Open your browser's extension manager.
2. Use the ZIP import or update function supported by your browser.
3. Select the downloaded complete repository ZIP.
4. Confirm the update if your browser asks.
5. Reload Schleim OS or open a new tab. Check the installed version in the update center.

**Important:** Do not extract the ZIP file if your browser uses the same direct ZIP-import method as the initial installation. Exact steps depend on the browser. Not every Chromium browser has this import feature.

## Why does the button not install the update automatically?

Chrome does not allow an extension to download an arbitrary ZIP file from the internet and silently replace itself with that file. The `chrome.runtime.requestUpdateCheck()` API checks the update channel configured for the browser; it does not install an arbitrary GitHub ZIP.

Automatic updates outside the Chrome Web Store require a different distribution method: an update URL with an XML update manifest and a signed CRX package. The CRX must be signed with the same private key as the already-installed extension. Chrome also restricts self-hosted installations depending on the operating system and management policy.

Official information:
- [Chrome: Extension update lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle)
- [Chrome: Distribute your extension](https://developer.chrome.com/docs/extensions/how-to/distribute)
- [Chrome: Self-hosting extensions on Linux](https://developer.chrome.com/docs/extensions/how-to/distribute/host-on-linux)

## Important notes

- The update check reads the version from the GitHub default branch. Code changes without a version increase are not detected as a new release.
- Increase the version in `extension/manifest.json` before every release.
- The update center only downloads the public ZIP file. It does not receive GitHub sign-in credentials.
- Your browser controls installation, replacement and confirmation.
- If you remove and reinstall Schleim OS and local settings are lost, you can restore them from your private cloud backup under **Settings → Schleim account**.

[Documentation overview](../README.md) · [Installation guide](INSTALLATION.md) · [Plain-language guide](../Leichte-Sprache/Englisch/UPDATES.md)
