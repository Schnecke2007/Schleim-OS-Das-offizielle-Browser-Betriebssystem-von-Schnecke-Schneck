# 🛠️ Schleim OS – Troubleshooting

This guide provides solutions to common problems when installing and using Schleim OS.

| Problem | Possible solution |
|---|---|
| **The new tab remains unchanged.** | Check at `chrome://extensions` whether Schleim OS is installed and enabled. Then open a new tab. |
| **Chrome reports a manifest error.** | Extract the GitHub ZIP archive completely and select the folder containing `manifest.json` directly. |
| **A ZIP file was selected in the “Load unpacked” dialog.** | This function expects a folder. Extract the ZIP archive first, then select the extension folder. |
| **The wrong folder was selected.** | Do not select the parent repository folder. Select the folder where `manifest.json` is located directly. |
| **Another extension also replaces the new-tab page.** | Temporarily disable other extensions that also override the new-tab page. |
| **Changes are not displayed.** | Open `chrome://extensions`, click **Reload** for Schleim OS, and open a new tab. |
| **External content is missing or remains blank.** | Check your internet connection. Some providers block their pages from being embedded on other websites. |
| **Settings are missing after switching browsers.** | Personalization is stored in the relevant browser profile. Export a JSON backup from the old profile and import it into the new profile, when the feature is available. |
| **Installation does not work on Android.** | Chrome for Android does not support regular desktop extensions. Use a separate PWA or a browser that supports extensions instead. |

## Need more help?

If the problem continues, report it through [GitHub Issues](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues). Please describe which browser and version you are using and the steps that lead to the problem. Do not share passwords or confidential login details.

---

[🇩🇪 Deutsche Fehlerbehebung](../Deutsch/TROUBLESHOOTING.md) · [🇳🇱 Nederlandse probleemoplossing](../Niederländisch/PROBLEMEN-OPLOSSEN.md)
