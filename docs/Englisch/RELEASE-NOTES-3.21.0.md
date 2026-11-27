# Schleim OS 3.21.0 – Extension details and private browsing

## Schleim Browser for Android

- **Details for every add-on:** The extension manager now has a dedicated **Details** button for every installed extension. The detail view is populated from that add-on's actual GeckoView metadata.
- **Add-on information:** Where provided by the add-on, the view shows its name, version, status, description, developer, homepage, Mozilla Add-ons link, options page, rating, required permissions, host access and data-collection information. Missing values are not invented.
- **Extension-specific settings:** When GeckoView reports an options page, it can be opened directly from the detail view. When no options page is provided, the browser says so.
- **Optional permissions:** Optional API permissions, host access and data-collection permissions are shown individually. Users can grant or revoke each item from the detail view.
- **Private windows:** For external add-ons whose manifest does not explicitly forbid private use, the detail view provides **Run in private windows**. It uses GeckoView's setAllowedInPrivateBrowsing function. If the manifest declares not_allowed, the control remains unavailable.
- **VPN and proxy add-ons:** When an extension requests the proxy permission, it is identified as proxy control. Allowing an extension in private windows does not itself create a VPN tunnel. The extension must implement private-session support and be configured correctly. This does not enable system-wide VPN protection.
- **Profile synchronization:** The **Run in private windows** setting is included in the encrypted browser profile backup together with each add-on's enabled/disabled state and is restored on another device.

## Privacy, theme and existing features

- The dark brown **#251205** theme, tabs, local history, bookmarks, password manager, Guest Mode and add-on support remain in place.
- The existing DNS-over-HTTPS/NextDNS configuration is unchanged.
- Guest Mode remains separate from the regular profile and account synchronization.

## Notes and limitations

- GeckoView can show only information actually supplied for an installed add-on. Some extensions provide no options page or developer/rating metadata.
- Not every Firefox extension is compatible with GeckoView. Granting private-window access does not guarantee that every extension feature will work in private sessions.
- The private-window permission is a browser/add-on permission. It is not a replacement for a separate VPN app or Android's system-wide VPN tunnel.

## Versions

- Browser Extension: **3.21.0**
- Schleim Browser for Android: **0.1.0-alpha32**
- Mozilla GeckoView · Android 8.0+ · ARM64

The Android APK uses the standard Android debug signing key. Depending on the build, the old app may need to be uninstalled first. Back up important local data and, when needed, create an encrypted profile backup before uninstalling.


## Android – Alpha 32

- Universal APK for ARMv7, ARM64 and x86_64; current GeckoView does not support 32-bit x86. Android 8.0 (API 26) remains the minimum.
- Schleim VPN adds a browser-menu control and an Extension tile.
- Connections are requested through OpenVPN for Android as an external client. Schleim Browser does not bundle an OpenVPN engine.
- The server list and profiles are loaded from the repository. Repository changes are picked up without an APK update.
- The existing Proton profiles date from 2023 and are not verified as current or active. Use current profiles and separate OpenVPN credentials before connecting.
