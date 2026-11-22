# Schleim OS 3.19.0 – Android browser history, secure DNS and saved tabs

## Schleim Browser for Android

- **Browsing history:** The Android browser now includes a local History view for successfully visited HTTP and HTTPS pages. Up to 250 entries can be kept and cleared by the user.
- **Fixed secure DNS:** GeckoView uses the configured DNS-over-HTTPS resolver in TRR-only mode for normal browser DNS lookups. The resolver is fixed in the app. Settings only display a generic secure DNS connection status; the resolver address and provider are not shown in the UI.
- **Automatic tab restoration:** Up to four open tabs and the selected tab are saved locally. The browser restores their last URLs on the next start. Full per-page Back/Forward session state is not persisted.

## Notes and limitations

- History and tab data are stored in local app preferences and can be removed when the app is uninstalled.
- GeckoView may handle certain system-required or local name lookups outside the DoH resolver.
- The Android release APK uses the standard debug signing key. A new GitHub build can use a different key, so Android may require uninstalling the old app before installing a new APK. The update dialog provides separate download and uninstall actions.
- The original Chromium Extension remains separate and is not affected by the Android browser history, tab or DNS settings.

## Versions

- Chromium Extension: **3.19.0**
- Schleim Browser for Android: **0.1.0-alpha29**
- Mozilla GeckoView · Android 8.0+ · ARM64
