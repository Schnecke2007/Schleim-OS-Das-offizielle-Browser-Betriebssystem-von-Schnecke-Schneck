# Schleim OS 🐌

**The official browser operating system by Schnecke Schneck.** A customizable browser start page with app tiles, personal settings and a responsive layout for desktop, tablet and mobile screens.

[🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md)

## What is Schleim OS?

Schleim OS is a browser extension that replaces the browser's default new-tab page with its own interface. It provides a personal home screen with app shortcuts and customization options.

It is not a standalone operating system and does not replace Windows, Android or Linux. It runs inside a compatible browser and uses the browser's extension platform.

## Features

- Custom new-tab page for Chrome and compatible Chromium browsers
- Home screen with apps and website shortcuts
- Rearrange app tiles using drag and drop
- Customize the appearance, accent color and background
- App editor and local JSON backup/restore
- German, English and Dutch interface
- Separate standalone HTML version included in the project package
- Ad-free extension interface

## Installation

### Google Chrome

1. Download the ZIP package from the **Releases** section (or use the project package from this repository).
2. Extract the ZIP archive completely.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode**.
5. Select **Load unpacked**.
6. Choose the `schleim-os-browser-extension` folder. The `manifest.json` file must be directly inside that folder.
7. Open a new tab. Schleim OS should now appear.

### Microsoft Edge and Brave

- Edge: open `edge://extensions`.
- Brave: open `brave://extensions`.
- Enable Developer mode, choose **Load unpacked**, and select the same extension folder containing `manifest.json`.

> The ZIP file cannot be installed directly. Extract it first.

## Using Schleim OS

- **Open apps:** Select an app tile on the home screen.
- **Rearrange tiles:** Drag a tile with your mouse. On touch screens, press and hold a tile before moving it.
- **Customize:** Open the settings or app editor in the interface.
- **Back up settings:** Use the JSON export/import option to save or restore personal settings.

Personal settings are stored locally in the browser profile. Keep exported JSON backups somewhere safe.

## Troubleshooting

| Issue | What to try |
|---|---|
| Schleim OS does not appear in a new tab | Check that the extension is enabled and that you loaded the folder containing `manifest.json`. |
| Chrome reports an invalid manifest | Extract the ZIP again and select the folder where `manifest.json` is directly located. |
| Another new-tab extension is active | Temporarily disable the other extension. Only one extension can control the new-tab page at a time. |
| Changes do not appear | Open `chrome://extensions`, click **Reload** for Schleim OS, then open a new tab. |
| An external page or embed is blank | Check your internet connection. Some providers block embedding on third-party pages. |
| Settings are missing in another browser | Settings belong to the local browser profile. Export a JSON backup in the old browser and import it in the new one. |
| Installation does not work on Android | Chrome for Android does not support regular desktop Chrome extensions. Use a separate PWA or a browser that supports extensions. |

## Privacy and permissions

Schleim OS stores interface and personalization settings locally in the browser profile. The extension uses the permissions listed in `manifest.json`. Opening external apps or websites may connect to their respective providers; their privacy policies also apply.

The extension interface contains no advertising iframes, advertising reachability checks or ad-related startup lock.

## Notes

- Schleim OS replaces the new-tab page, not the entire browser interface.
- Incognito windows may have separate restrictions.
- Google Chrome for Android does not support regular desktop extensions.
- External content may require an internet connection.

## Documentation

- [Deutsch](README.md)
- [English – this page](README.en.md)
- [Nederlands](README.nl.md)
- [Installation guide](docs/INSTALLATION.md)
- [Technical notes](docs/TECHNICAL-NOTES.md)

---

Developed and maintained by **Schnecke Schneck**.

© 2026 Schnecke Schneck.
