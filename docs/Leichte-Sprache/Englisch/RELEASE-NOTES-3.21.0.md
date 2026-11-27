# Schleim OS 3.21.0 – New extension details

## Schleim Browser for Android

- **Details:** Every extension now has its own **Details** button.
- **Information:** You can see the information the browser has for that extension. For example, its name, version, description and permissions.
- **Settings:** When an extension has its own settings page, you can open it. When it has no page, the browser tells you.
- **Permissions:** You can allow or remove optional permissions one at a time.
- **Private windows:** For supported extensions, you can turn on **Run in private windows**. The extension must not forbid private use in its manifest.
- **VPN:** This setting alone does not create a VPN. A VPN extension must support private windows itself. The browser does not start an Android system-wide VPN tunnel.
- **Backup:** The private-window setting is saved in the encrypted browser profile. You can restore it on another device.

## What stays the same?

The brown **#251205** design, tabs, history, bookmarks, password manager, Guest Mode and NextDNS stay the same. The DNS setting is not changed.

## Important notes

Not every extension has its own settings page. Not every extension works with GeckoView. The browser shows only information it actually gets from the extension.

## Versions

- Browser Extension: **3.21.0**
- Schleim Browser: **0.1.0-alpha32**

You may need to uninstall the old app before installing a new one. Back up important data first.


## Android – Alpha 32

- The new APK supports ARMv7, ARM64 and x86_64. 32-bit x86 is not supported by current GeckoView.
- Android 8.0 or newer is still required.
- Schleim Browser now has a VPN menu.
- The Extension has a VPN tile.
- OpenVPN for Android is also needed for the VPN connection.
- The old Proton files are from 2023. They are not checked. Use new VPN files and your own OpenVPN login details.
