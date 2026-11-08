# Schleim OS 🐌

**The official browser operating system by Schnecke Schneck** – your personal, customizable browser start page with app tiles, personalization and a responsive design for desktop, tablet and smartphone. 🌐✨

[🌍 Official website](https://schnecke1.wixsite.com/schnecke-schneck) · [📦 Download the project as ZIP](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/main.zip) · [🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md)

![Version](https://img.shields.io/badge/version-3.4.1-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

## 🚀 What is Schleim OS?

Schleim OS is a browser extension that replaces the browser's regular new-tab page with its own interface. Instead of an empty or default tab page, a personal home screen with apps and shortcuts opens.

This project is not a standalone operating system that replaces Windows, Android or Linux. It runs inside a compatible browser and uses that browser's extension features.

## ⭐ Features

- Custom new-tab page for Chrome and compatible Chromium browsers
- Home screen with apps and website shortcuts
- Rearrange app tiles using drag and drop
- Customize the design, accent color and background
- App editor and local JSON backup and restore
- Multilingual interface: German, English and Dutch
- Separate standalone HTML file included in the project package
- Ad-free extension interface

## 📥 Download and installation

### 1. Download the project as a ZIP file

1. Open this GitHub repository.
2. Click the green **Code** button near the top.
3. Select **Download ZIP** from the menu.
4. Save the ZIP file to your device.
5. Extract the ZIP archive completely.
6. In the extracted files, find the extension folder that contains the `manifest.json` file directly. This is the folder you will select later – not the ZIP file and not a parent folder.

### 2. Set up Google Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the extracted extension folder. The `manifest.json` file must be directly inside it.
5. Open a new tab. Schleim OS should now appear. 🎉

### Microsoft Edge and Brave

- **Edge:** Open `edge://extensions`.
- **Brave:** Open `brave://extensions`.
- Enable Developer mode, select **Load unpacked**, and then choose the extracted extension folder containing `manifest.json` directly.

> ⚠️ **Important – ZIP or folder?** The **Load unpacked** button expects a folder, not a ZIP file. For local installation through the browser's developer mode, you must first extract the ZIP archive downloaded from GitHub. Then select the folder that contains `manifest.json` directly.

## Using Schleim OS and its settings

- **Open apps:** Select a tile on the home screen.
- **Rearrange tiles:** Drag a tile with your mouse. On touch devices, press and hold a tile before moving it.
- **Personalize:** Open the settings or app editor in the interface.
- **Back up settings:** Use the available JSON feature to export or import your personal settings.

Personal settings are stored locally in the browser profile. Keep your JSON backup in a safe place.

## 🛠️ Troubleshooting

| Issue | Possible solution |
|---|---|
| Schleim OS does not appear in a new tab | Check whether the extension is enabled and whether the extracted extension folder containing `manifest.json` was loaded. |
| Chrome reports an invalid manifest | Extract the ZIP file completely and select the folder where `manifest.json` is located directly. |
| A ZIP file was selected in the Load unpacked dialog | Extract the ZIP archive first. Then select the extension folder inside it. |
| The wrong folder was selected | Select the folder containing `manifest.json` directly, not the parent repository folder. |
| Another new-tab extension is active | Temporarily disable the other extension. Multiple extensions cannot replace the same new-tab page at the same time. |
| Changes are not displayed | Open `chrome://extensions`, click **Reload** for Schleim OS, and open a new tab. |
| An external website or embed remains blank | Check your internet connection. Some providers block embedding on other websites. |
| Settings are missing after switching browsers | The browser profile is stored locally. Export the JSON backup in the old browser and import it in the new one. |
| Installation does not work on Android | Chrome for Android does not support regular desktop Chrome extensions. A separate PWA or a browser with extension support is required. |

## 📁 Project structure

```text
schleim-os-browser-extension/
├── manifest.json
├── pages/
│   └── newtab.html
├── scripts/
│   ├── app.js
│   └── personalization.js
├── styles/
│   ├── main.css
│   └── personalization.css
├── locales/
│   └── legal-translations.js
├── assets/
│   └── icons/
├── docs/
├── standalone/
│   └── schleim-os-standalone.html
└── README.md
```

## 🔐 Privacy and permissions

Schleim OS stores interface and personalization settings locally in the browser profile. The extension uses the permissions listed in `manifest.json`. Opening external apps and websites may connect to their respective providers; their privacy policies also apply.

The extension interface contains no advertising iframes, no advertising reachability checks and no ad-related startup lock. Statements about advertising in adopted legal texts refer to the website described there, not to advertising embedded in the extension.

## 💡 Notes

- Schleim OS replaces the new-tab page, not the entire browser interface.
- Incognito windows may have their own restrictions.
- Google Chrome for Android does not support regular desktop extensions.
- External content may require an internet connection.

## 🌐 Languages and documentation

- [Deutsch – main documentation](README.md)
- [English – main documentation](README.en.md)
- [Nederlands – documentatie](README.nl.md)
- [Installation guide](docs/INSTALLATION.md)
- [Technical notes](docs/TECHNICAL-NOTES.md)

---

**Schleim OS** is developed and maintained by **Schnecke Schneck**.

© 2026 Schnecke Schneck.
