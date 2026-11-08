# 📥 Schleim OS – Installation Guide

This guide explains how to install the Schleim OS browser extension in compatible Chromium-based browsers on Android and desktop.

## 1. Download the complete GitHub repository

1. Open the [Schleim OS GitHub repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck).
2. Click the green **Code** button near the top.
3. Select **Download ZIP**.
4. Save the ZIP archive to your device.

Download the **entire repository** this way. The browser extension is located inside its `extension` subfolder. You do **not** need to extract the archive first when your browser supports direct ZIP import.

## 2. Install the ZIP file directly in the browser (Android and desktop)

Some supported Chromium-based browsers provide an import option for ZIP files in their extension manager. This works on Android or desktop when the browser offers this feature.

1. Open your browser's extension manager.
2. Enable **Developer mode** if required.
3. Tap or click the file import/install button. It may be labelled **“From .zip/.crx/.user.js”**, **“Install from ZIP”**, or something similar.
4. Select the **complete GitHub repository ZIP** you downloaded. You do not need to extract the ZIP file first.
5. The browser should detect Schleim OS in the repository's `extension` subfolder. Follow the prompts and confirm the installation.

> 💡 **Tip:** Select the complete repository archive for ZIP import, not individual files. The exact button label and location may vary depending on the browser and device.

> ⚠️ **Note:** Not every Chromium-based browser supports direct ZIP import. If your browser does not offer this option, use the alternative installation method below.

## 3. Alternative: Install using “Load unpacked”

Use this method with browsers that do not offer direct ZIP import but support loading a local extension folder.

1. Extract the complete GitHub ZIP archive you downloaded.
2. Open the extracted repository folder.
3. Open its **`extension`** subfolder. This is the folder that contains the `manifest.json` file.
4. Open your browser's extension manager and enable **Developer mode**.
5. Choose **“Load unpacked”**.
6. Select the **`extension`** folder – not the parent repository folder.
7. Open a new tab. Schleim OS should now start. 🎉

### Google Chrome, Microsoft Edge and Brave

- **Google Chrome:** Open `chrome://extensions`.
- **Microsoft Edge:** Open `edge://extensions`.
- **Brave:** Open `brave://extensions`.

Enable Developer mode and choose **“Load unpacked”**. Select the extracted `extension` folder containing the `manifest.json` file.

## 4. After installation

Open a new browser tab. If Schleim OS does not appear, check the browser's extension manager and follow the [troubleshooting guide](TROUBLESHOOTING.md).

---

[🇩🇪 Deutsche Installationsanleitung](../Deutsch/INSTALLATION.md) · [🇳🇱 Nederlandse installatiehandleiding](../Niederländisch/INSTALLATIE.md)
