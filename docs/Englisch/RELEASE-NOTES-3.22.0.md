# Schleim OS 3.22.0 – Android Alpha 32

## Schleim VPN in the browser
- Native WireGuard integration directly in Schleim Browser; no separate VPN app.
- Browser-menu VPN screen with status, location selection, profile import and disconnect.
- The Free location list is loaded from the Schleim OS repository. It is a reference catalog, not a live Proton availability or load monitor.
- To connect, import a complete personal WireGuard .conf generated in your own Proton account. Profiles are stored locally encrypted with AES-GCM and Android Keystore.
- The tunnel is restricted to Schleim Browser. Other Android apps do not use it.
- Public templates contain no private key. The browser extension cannot start or control the native Android VPN tunnel.

## Universal APK
- One APK bundles GeckoView for ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) and x86_64.
- 32-bit x86 is not supported because the pinned GeckoView build does not provide its native libraries.
- Minimum Android version remains Android 8.0 / API 26. Android 7 is not supported.

Proton VPN Free may assign server changes randomly and apply cooldowns. Proton's public server-list endpoint is not officially supported and has been shut down. The location catalog can only stay current when the repository catalog is maintained.

The fixed NextDNS resolver, brown UI, tabs, history, bookmarks, password manager and add-on features remain unchanged.


## Extension details
- Each add-on has a details view with the metadata and permissions GeckoView provides.
- Optional permissions can be managed individually where GeckoView supports them.
- The run-in-private-windows control appears only when the add-on and GeckoView allow it.

**Security:** Private WireGuard keys were removed from public server files. Because they were previously published, regenerate the affected keys with Proton.
