# Schleim OS 3.19.0 – History, secure DNS and saved tabs

Schleim Browser adds three important browser features. The Android app remains a standalone GeckoView app. The browser Extension is still available separately.

## New and improved

- **Browsing history:** The browser menu now has a **History** item. It lists successfully visited HTTP and HTTPS pages with their title, address and visit time. History is stored locally on the device. Up to 250 entries can be kept, and the history can be cleared at any time.
- **Fixed secure DNS resolver:** Schleim Browser uses a built-in DNS-over-HTTPS resolver for normal DNS lookups. The connection is encrypted over HTTPS. The DNS mode is fixed and cannot be changed in the app. Settings only show that a secure DNS connection is being used.
- **Automatic tab saving:** The latest up to four open tabs and the selected tab are saved locally. Schleim Browser restores these tabs at the next start. Each tab saves its last address; the complete back/forward navigation state of a page is not restored.

## Notes

- History and saved tabs are stored locally in the app data.
- Uninstalling Schleim Browser can delete this data. Back up anything important first.
- The release APK uses Android debug signing. With a new build, Android may require the old app to be uninstalled before the new APK can be installed.
- GeckoView may handle certain system-required or local name lookups outside the DoH service. The fixed DoH mode applies to normal browser DNS lookups.

## Version information

- Schleim OS Extension: **3.19.0**
- Schleim Browser: **0.1.0-alpha29**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android browser guide](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
