# Schleim VPN in the Android app

The browser Extension includes a **Schleim VPN tile**. In Schleim Browser for Android it opens the native VPN menu through the `schleimbrowser://vpn` URI scheme.

The Extension cannot create a system-wide VPN tunnel by itself. The Android app controls OpenVPN for Android as an external client; that client manages Android's `VpnService`, consent and the tunnel.

- Browser menu: **Schleim VPN**
- Extension: Home screen → **Schleim VPN** → **Open VPN controls**
- Profiles and server locations are supplied by the repository manifest.
- The external OpenVPN client and current valid OpenVPN profiles are required.

See setup and profile caveats in the [Android browser documentation](../../docs/Englisch/ANDROID-BROWSER.md#schleim-vpn--proton-free).
