# Schleim OS 🐌

**The official browser operating system by Schnecke Schneck** – your personal, customizable browser start page with app tiles, personalization and a responsive design for desktop, tablet and smartphone. 🌐✨

![Version](https://img.shields.io/badge/version-3.13.6-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

[🌍 Official website](https://schnecke1.wixsite.com/schnecke-schneck) · [📦 Download the project as ZIP](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/main.zip)

[🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md) · [🧪 Open demo](https://raw.githack.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) · [📖 Easy Language](docs/Leichte-Sprache/Englisch/README.md)

## 👋 About me

Hi! I'm **Schnecke Schneck**, I'm 19 years old and I'm from **Bottrop in North Rhine-Westphalia, Germany**. Online, I go by the name *Schnecke Schneck*, and I'm especially interested in technology and digital ideas.

My hobbies include **programming, web design, and creating websites and apps**. I'm also fascinated by **artificial intelligence (AI), computers, digital systems, and new technologies**. I enjoy trying out new tools, learning new things, and turning my own ideas into projects, both small and large.

What excites me most is turning an idea into something that actually works! I love discovering how technology works behind the scenes, solving problems on my own, and designing digital projects creatively. I also use AI as a tool to help me learn, plan, and develop.

**Schleim OS** is one of my own projects. Through my projects, I want to share my enthusiasm for technology and show what curiosity, creativity, and digital tools can make possible. 🐌💻

## 🧪 Try Schleim OS live

[**Open the demo in a new browser tab**](https://raw.githack.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) – try the standalone version directly. You do not need to install the extension to use the demo.

## 🚀 What is Schleim OS?

Schleim OS is a browser extension that replaces the browser's regular new-tab page with its own interface. Instead of an empty or default tab page, a personal home screen with apps and shortcuts opens.

This project is not a standalone operating system that replaces Windows, Android or Linux. It runs inside a compatible browser and uses that browser's extension features.

## ⭐ Features

- Custom new-tab page for Chrome and compatible Chromium browsers
- Home screen with apps and website shortcuts
- Rearrange app tiles using drag and drop
- Customize the design, accent color and background
- Schleim-Store with recommendations, categories, search, installation and removal of web apps
- Submit app suggestions through a GitHub issue form
- Schleim-Store: access requires signing in with a Schleim account
- Schleim account with GitHub sign-in and private cloud backup of the home screen
- Sonos as a regular web app in the Schleim-Store: opens the official Sonos web app in a new browser tab
- Settings update center: check the GitHub version and download the latest ZIP; the browser handles the final installation
- Multilingual interface: German, English and Dutch
- Separate standalone HTML file included in the project package
- Ad-free extension interface

## 🛍️ Schleim-Store

The **Schleim-Store** is available only after signing in with a Schleim account. Without sign-in, the app catalogue, search, ratings, installations and submissions remain locked. The Store unlocks after successful sign-in. Catalogue files in the public GitHub repository remain directly visible on GitHub.

- **Discover:** Recommendations, new apps, top ratings and categories.
- **Install:** Every Store web app uses the same launch action and opens in a new browser tab.
- **Submit:** Visitors can suggest websites through the public [GitHub submission form](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues/new?template=app-submission.md).
- **Submit local websites:** Imported or previously saved websites appear under “Previously added websites”. Choose “Submit to the Schleim-Store” to copy their details into the submission form. Add a meaningful description and submit the proposal on GitHub for review.
- **Rate:** The star buttons open a GitHub form where visitors can add optional written feedback. After successful processing, the issue is closed automatically. Each rating is stored with the GitHub username and feedback as a JSON file in the public `Bewertungen/` folder. GitHub Actions calculates the published Store average and vote count from these files; the latest rating per GitHub account and app is counted.
- **Review and publish:** Suggestions are not published automatically. Suggestions are reviewed and approved before they are added to the Store.

The public [Store catalogue](Store/README.md) is organized by category. Each approved app receives its own JSON file in the matching category folder. The extension also uses the central runtime catalogue at `extension/data/store-apps.json`.

**Transparency:** The GitHub repository, Store catalogue, ratings and app suggestions submitted as issues are public. Do not submit passwords, private data or confidential information. Sign-in protects the Store interface inside Schleim OS; it does not make files in the public repository private.

## 📥 Download and installation

1. Open the [Schleim OS GitHub repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck).
2. Select **Code → Download ZIP** and download the **complete repository**.
3. **Do not** extract the ZIP file.
4. Open the extension manager in a supported Chromium-based browser.
5. Enable **Developer mode** if required.
6. Choose the ZIP-file import option, for example **“From .zip/.crx/.user.js”**.
7. Select the complete repository ZIP and confirm the installation.

The browser importer detects Schleim OS in the `extension` subfolder. The button label and location may vary by browser and device. The browser must support direct ZIP import.

## Using Schleim OS and its settings

- **Open apps:** Select a tile on the home screen.
- **Rearrange tiles:** Drag a tile with your mouse. On touch devices, press and hold a tile before moving it.
- **Personalize:** Open the settings area in the interface.
- **Discover apps:** Open the Schleim-Store, search for web apps and install or remove the ones you want.
- **Schleim account:** Sign-in starts by opening the GitHub App page. After installation, confirm the next step in Schleim OS. The device code is displayed. Schleim OS tries to copy it after a short delay. If this is not possible, you can copy it manually. The GitHub device authorization page then opens. After approval, Schleim OS checks the app installation and creates your private `schleim-os-cloud` repository if needed.
- **Cloud backup:** Backup and restore are available only under **Settings → Schleim account**. The backup includes saved Schleim OS settings, home-screen app order, installed Store apps and the wallpaper. Changes are not synchronized automatically. See the [Schleim account setup guide](extension/docs/SCHLEIM-KONTO.md). GitHub access tokens and passwords are never written into the backup file.
- **Updates:** Under **Settings → Update Schleim OS**, check the GitHub version and download the latest ZIP. The final installation uses the import or update function supported by your browser. [Update guide](docs/Englisch/UPDATES.md).

# 🛠️ Schleim OS – Troubleshooting

This guide helps solve common problems with direct ZIP import and using Schleim OS.

| Problem | Possible solution |
|---|---|
| **The ZIP-import button is missing.** | Check whether your browser supports importing ZIP extensions. The button may be labelled **“From .zip/.crx/.user.js”**. |
| **The ZIP file does not appear.** | First download the complete repository from GitHub using **Code → Download ZIP**. Then check whether your browser's file picker can access your Downloads folder. |
| **Installation reports an error.** | Make sure you selected the complete repository ZIP and that it has not been modified. Do not select individual files or a different archive. |
| **Schleim OS does not appear in a new tab.** | Check the extension manager to make sure Schleim OS is installed and enabled. Then open a new tab. |
| **Another extension also replaces the new-tab page.** | Temporarily disable other extensions that also override the new-tab page. |
| **Changes are not displayed.** | Open the extension manager and use **Reload** or **Refresh** for Schleim OS, if available. Then open a new tab. |
| **External content is missing or remains blank.** | Check your internet connection. Some providers block their pages from being embedded on other websites. |
| **Settings are missing after switching browsers.** | Open **Settings → Schleim account**, sign in with the same GitHub account and choose **Restore cloud backup**. |
| **Installation does not work in Chrome for Android.** | Chrome for Android does not support regular Chrome extensions. Use an Android browser that supports extensions and direct ZIP import. |

## Need more help?

If the problem continues, report it through [GitHub Issues](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues). Please describe which browser and version you are using and the steps that lead to the problem. Do not share passwords or confidential login details.

---

[🇩🇪 Deutsche Fehlerbehebung](docs/Deutsch/FEHLERBEHEBUNG.md) · [🇳🇱 Nederlandse probleemoplossing](docs/Niederländisch/PROBLEMEN-OPLOSSEN.md)

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
- [Schleim account and cloud backup](docs/Englisch/SCHLEIM-ACCOUNT.md)
- [Store guide](Store/Englisch/README.md)
- [Update guide](docs/Englisch/UPDATES.md)
- [Documentation overview – all languages](docs/README.md)

## 📖 Plain-language documentation

Would you prefer short sentences and simple explanations? Read the [English plain-language documentation](docs/Leichte-Sprache/Englisch/README.md). It also includes simple installation steps, help and explanations of legal topics. The Store has its own [plain-language guide](docs/Leichte-Sprache/Englisch/SCHLEIM-STORE.md). There is also a plain-language guide to [sign-in and cloud backup](docs/Leichte-Sprache/Englisch/ACCOUNT-CLOUD.md) and [updating Schleim OS](docs/Leichte-Sprache/Englisch/UPDATES.md).

## 📁 Project structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
├── Store/
│   ├── Deutsch/
│   ├── Englisch/
│   ├── Niederländisch/
│   ├── ai/
│   ├── communication/
│   ├── knowledge/
│   ├── media/
│   ├── navigation/
│   ├── privacy/
│   ├── productivity/
│   ├── shopping/
│   └── tools/
├── docs/
│   ├── Deutsch/
│   ├── Englisch/
│   ├── Leichte-Sprache/
│   ├── Niederländisch/
│   └── README.md
├── extension/
│   ├── assets/icons/
│   ├── data/
│   ├── docs/
│   ├── locales/
│   ├── pages/newtab.html
│   ├── scripts/
│   │   ├── app.js
│   │   ├── personalization.js
│   │   ├── schleim-account.js
│   │   ├── slime-store-admin.js
│   │   └── update-center.js
│   ├── standalone/schleim-os-standalone.html
│   ├── styles/
│   ├── manifest.json
│   ├── README.md
│   └── SHA256SUMS.txt
├── legal/
│   ├── Deutsch/
│   ├── Englisch/
│   ├── Niederländisch/
│   └── README.md
├── .gitignore
├── README.md
├── README.en.md
└── README.nl.md
```

## 🔐 Privacy and permissions

Schleim OS stores interface and personalization settings locally in the browser profile. The extension uses the permissions listed in `manifest.json`. Opening external apps and websites may connect to their respective providers; their privacy policies also apply.

The extension interface contains no advertising iframes, no advertising reachability checks and no ad-related startup lock. Statements about advertising in adopted legal texts refer to the website described there, not to advertising embedded in the extension.

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
