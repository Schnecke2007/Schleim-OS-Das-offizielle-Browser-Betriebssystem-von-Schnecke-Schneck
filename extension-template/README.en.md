# Browser OS – Extension Template

**Template version: 3.14.7**

Browser OS is a neutral, multilingual Manifest V3 template for Chromium-based browsers. It uses sample content and placeholders instead of personal data from the original project.

## Features

- New-tab dashboard with app launcher, search, quick settings and themes
- German, English and Dutch language selection
- Sample account using GitHub Device Flow and private settings backup
- Photo and video cloud with gallery, search and camera app
- Browser Store with sample apps, ratings and suggestions
- Optional on-device image analysis through the Prompt API
- Standalone HTML demo for web hosting

## Download and install

Download [Schleim-OS-Extension-Template.zip from the latest release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension-Template.zip). **Do not extract the ZIP file.** Open the extension manager in a browser that supports local ZIP import, select the ZIP file and confirm the import. Downloading does not install anything automatically.

Standard Google Chrome for Android does not support extensions. Desktop Chrome can load a folder in Developer mode, but cannot directly import ZIP files.

## Create your own version

Use a separate Git repository for your working source. Customize `manifest.json`, profile, links, Store content and placeholders in the scripts. Configure your own GitHub App and private repositories before using account or cloud features.

The update-center placeholder downloads only `Schleim-OS-Extension-Template.zip` from the latest release of your configured repository. Publish your package using that exact asset name.

## Documentation

- [Deutsch](docs/Deutsch/README.md)
- [English](docs/Englisch/README.md)
- [Nederlands](docs/Niederländisch/README.md)
- [Easy language](docs/Leichte-Sprache/Englisch/README.md)
- [Configuration](CONFIGURATION.md)
- [Account and private cloud](docs/ACCOUNT-AND-CLOUD.md)
- [Technical notes](docs/TECHNICAL-NOTES.md)

All profiles, images, accounts, repositories and legal texts are examples. Replace them before publishing.