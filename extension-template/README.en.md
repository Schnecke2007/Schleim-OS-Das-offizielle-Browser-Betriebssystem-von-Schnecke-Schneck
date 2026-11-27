# Browser OS – Extension Template

**Template version: 3.14.9**

Browser OS is a neutral, multilingual Manifest V3 template for Chromium-based browsers. It uses demo content, sample artwork and placeholders instead of personal data from the original project.

## Features

- New-tab dashboard with app launcher, search, quick settings and themes
- German, English and Dutch language selection
- Sample account using GitHub Device Flow and private settings backup
- Photo and video cloud with gallery, search and camera app
- Background uploads with progress and notifications
- Browser Store with sample apps, ratings and suggestions
- Optional on-device image analysis through the Prompt API
- Standalone HTML demo for web hosting

## Download and install

Download [Browser-OS-Extension-Template.zip from the latest release of your own GitHub repository](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/releases/latest/download/Browser-OS-Extension-Template.zip). **Do not extract the ZIP file.** Open the extension manager in a browser that supports local ZIP import, select the ZIP file and confirm the import. Downloading does not install anything automatically.

Standard Google Chrome for Android does not support extensions. Desktop Chrome can load a folder in Developer mode, but cannot directly import ZIP files.

## Create your own version

Use a separate Git repository for your working source. Customize `manifest.json`, profile, links, Store content and placeholders in the scripts. Configure your own GitHub App and private repositories before using account or cloud features.

The update-center placeholder downloads only **Browser-OS-Extension-Template.zip** from the latest release of your configured repository. Publish your package using that exact asset name.

## Documentation

- [Deutsch](docs/Deutsch/README.md)
- [English](docs/Englisch/README.md)
- [Nederlands](docs/Niederländisch/README.md)
- [Easy Language – German](docs/Leichte-Sprache/Deutsch/README.md)
- [Easy Language – English](docs/Leichte-Sprache/Englisch/README.md)
- [Easy Language – Dutch](docs/Leichte-Sprache/Niederländisch/README.md)
- [Documentation language index](docs/README.md)
- [Configuration](docs/Englisch/CONFIGURATION.md)
- [Account and private cloud](docs/Englisch/ACCOUNT-AND-CLOUD.md)
- [Technical notes](docs/Englisch/TECHNICAL-NOTES.md)

All profiles, images, accounts, repositories and legal texts are examples. Replace them before publishing.


## Optional Android VPN bridge

The template includes a Schleim VPN tile on the new-tab page. In an Android GeckoView host that registers the `browser` native-message bridge, the tile requests opening the host's native VPN panel. Desktop browsers show a fallback notice because extensions cannot directly start Android's `VpnService`.

The native Android template includes WireGuard tunnel support and encrypted local profile storage. Import a current personal `.conf` file in the app; never bundle a private WireGuard key in the extension or public repository. The VPN tunnel is intended to be limited to the browser package.
