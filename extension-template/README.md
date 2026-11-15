# Browser OS – Chromium extension template

A configurable Manifest V3 extension for Chromium-based browsers. **Template version: 3.14.5.**

Download the [Template ZIP from the latest Schleim OS GitHub release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension-Template.zip). The package is prepared for direct import in compatible browsers.

This neutral template contains demo content, sample artwork and placeholders. It does not include the original creator's profile, contact information, social accounts or GitHub App configuration.

## Included features

- Responsive new-tab dashboard for desktop, tablet and mobile
- App launcher, search, quick settings, themes and personalization
- Multilingual interface and demo profile pages
- Browser Store with sample apps, ratings and suggestions
- Optional GitHub account, private settings backup and media cloud
- Optional local photo analysis through the browser's Prompt API
- Standalone demo page and navigation tests

## Install or update the template

1. Download **Schleim-OS-Extension-Template.zip** from the [latest release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension-Template.zip).
2. **Do not extract or modify the ZIP file.**
3. Open the extension manager in a Chromium-based browser that supports local ZIP-extension import.
4. Enable **Developer mode** if required.
5. Select **+ (from .zip/.crx/.user.js)** or the equivalent import option in your browser.
6. Choose **Schleim-OS-Extension-Template.zip** and confirm the import.

To update the template later, download the latest Template ZIP and import it using the same option. The browser may ask you to confirm an update or replacement. The download does not install the update by itself.

## Customize the template

Use a separate working copy of the source files in your own GitHub repository. You can edit the source files in GitHub or work from a Git checkout. Do not use the downloaded Release ZIP as an extracted working folder.

Read **CONFIGURATION.md** and replace the placeholders with your own details. Configure your own GitHub App and private repositories before enabling the cloud features.

Edit **manifest.json** to change the extension name, short name, description or version. The project already contains an active Manifest V3 file named **manifest.json**.

### Template update center

In **scripts/update-center.js**, set:

- `OWNER`: your GitHub username or organization
- `REPOSITORY`: your repository name

The template updater is deliberately set to download **Schleim-OS-Extension-Template.zip** from the latest release of that configured repository. It does not download the original Schleim OS Extension ZIP. When publishing your own release, use the exact asset name **Schleim-OS-Extension-Template.zip**.

Never put a GitHub App private key, client secret, access token or other secret into extension files.

## Browser compatibility

Direct ZIP import depends on the browser. Standard Google Chrome for Android does not support extensions. Desktop Chrome's **Load unpacked** option loads a folder rather than a ZIP file. To install without extracting, use a compatible browser whose extension manager explicitly supports local ZIP import.

For desktop development with Chrome's **Load unpacked** function, use a checked-out source folder that directly contains **manifest.json**. This is a separate development method; it does not require extracting the Release ZIP.

## Important

The profile, links, legal text, Store entries and images are demo material. Replace them before publishing. The legal-information screens are placeholders, not legal advice or ready-to-use legal notices.

See the [configuration guide](CONFIGURATION.md), the [Template 3.14.5 release notes](docs/RELEASE-NOTES-3.14.5.md) and the files in [docs](docs/).
