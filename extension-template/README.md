# Browser OS – Chromium extension template

A configurable Manifest V3 new-tab extension for Chromium-based browsers.

This neutral template contains demo content, sample artwork and placeholders. It does not include the original creator's profile, contact information, social accounts or GitHub App configuration.

## Included features

- Responsive new-tab dashboard for desktop, tablet and mobile
- App launcher, search, quick settings, themes and personalization
- Multilingual interface and demo profile pages
- Browser Store with sample apps, ratings and suggestions
- Optional GitHub account, private settings backup and media cloud
- Optional local photo analysis through the browser's Prompt API
- Standalone demo page and navigation tests

## Prepare the template

1. Download and extract the **Browser Extension Template** ZIP.
2. Read **CONFIGURATION.md** and replace the placeholders with your own details.
3. Configure your own GitHub App and private repositories before enabling the cloud features.
4. When you are ready to test it as an extension, rename **manifest.template.json** to **manifest.json**.

The manifest file is deliberately not named **manifest.json**. Chrome therefore does not detect or install this template when the complete project ZIP is imported. The original extension in the main repository remains under the separate **extension/** folder.

## Load your customized copy

After renaming the manifest file:

1. Open **chrome://extensions** in a Chromium-based desktop browser.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this template folder (now containing **manifest.json**).

Never put a GitHub App private key, client secret, access token or other secret into extension files.

## Important

The profile, links, legal text, Store entries and images are demo material. Replace them before publishing. The legal-information screens are placeholders, not legal advice or ready-to-use legal notices.

See the [configuration guide](CONFIGURATION.md) and the files in [docs](docs/).
