# Schleim OS 🐌

**The official browser operating system by Schnecke Schneck** – your personal, customizable browser start page with app tiles, personalization and a responsive design for desktop, tablet and smartphone. 🌐✨

[🌍 Official website](https://schnecke1.wixsite.com/schnecke-schneck) · [📦 Download the project as ZIP](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/main.zip) · [🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md)

![Version](https://img.shields.io/badge/version-3.4.1-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

## 👋 About me

Hi! I'm **Schnecke Schneck**, I'm 19 years old and I'm from **Bottrop in North Rhine-Westphalia, Germany**. Online, I go by the name *Schnecke Schneck*, and I'm especially interested in technology and digital ideas.

My hobbies include **programming, web design, and creating websites and apps**. I'm also fascinated by **artificial intelligence (AI), computers, digital systems, and new technologies**. I enjoy trying out new tools, learning new things, and turning my own ideas into projects, both small and large.

What excites me most is turning an idea into something that actually works! I love discovering how technology works behind the scenes, solving problems on my own, and designing digital projects creatively. I also use AI as a tool to help me learn, plan, and develop.

**Schleim OS** is one of my own projects. Through my projects, I want to share my enthusiasm for technology and show what curiosity, creativity, and digital tools can make possible. 🐌💻

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
- [Installation guide](docs/Englisch/INSTALLATION.md)
- [Troubleshooting](docs/Englisch/TROUBLESHOOTING.md)
- [Technical notes](docs/Englisch/TECHNICAL-NOTES.md)
- [Documentation overview – all languages](docs/README.md)

## ⚖️ Legal information

- [Terms and conditions & community guidelines](legal/Englisch/TERMS-AND-COMMUNITY-GUIDELINES.md)
- [Privacy policy](legal/Englisch/PRIVACY-POLICY.md)
- [Imprint](legal/Englisch/IMPRINT.md)

## 📬 Contact and support

Do you have questions about Schleim OS, need help with installation, or want to report a problem? You can contact me directly:

- **WhatsApp:** [Send me a message](https://wa.me/491773988636) at **+49 177 3988636**.
- **Email:** [info.schnecke.schneck@gmail.com](mailto:info.schnecke.schneck@gmail.com).

To help me assist you as effectively as possible, please briefly describe your request. For technical issues, it also helps to include your browser and version, along with the steps that led to the problem. Never send passwords or other confidential login details.

## 💬 Feedback

Your feedback matters to me! I welcome reviews, suggestions for improvements, ideas and bug reports. You can share your feedback in any of these ways:

- **GitHub:** [Submit feedback, questions or bug reports as an issue](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues).
- **Google Business Profile:** [Review Schnecke-Schneck Creator Studio](https://g.page/r/CfqIlATGmPYUEBM/review).
- **Email:** [Send feedback by email](mailto:info.schnecke.schneck@gmail.com).
- **WhatsApp:** [Send feedback directly on WhatsApp](https://wa.me/491773988636).

Thank you for taking the time to support Schleim OS and my work! ❤️

## 📱 Follow me on social media

Would you like to see more of my projects and updates? I’d be happy if you followed me on Instagram and TikTok:

- **Instagram:** [@schnecke_schneck2007](https://www.instagram.com/schnecke_schneck2007/)
- **TikTok:** [@schnecke_schneck2007](https://www.tiktok.com/@schnecke_schneck2007)

---

## 🤝 Contributors & Credits

- **Project development and ownership:** Schnecke Schneck.
- **AI assistance:** [ChatGPT by OpenAI](https://chatgpt.com/) – assistance with brainstorming, planning, programming, troubleshooting, documentation and translations.

*Note: ChatGPT is an AI assistant, not a human person or an independent GitHub contributor. The project idea, decisions and responsibility for Schleim OS belong to Schnecke Schneck.*

---

**Schleim OS** is developed and maintained by **Schnecke Schneck**.

© 2026 Schnecke Schneck.

