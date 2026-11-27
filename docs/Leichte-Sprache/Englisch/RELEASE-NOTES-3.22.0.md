# Schleim OS 3.22.0 – Android Alpha 32

## Schleim VPN
- Schleim Browser now has a VPN.
- The VPN is inside the browser. You do not need a separate VPN app.
- It uses WireGuard.
- You can choose a location and import your own WireGuard file.
- The file is encrypted on your device.
- Only Schleim Browser uses the VPN. Other Android apps use their normal internet connection.
- The browser extension cannot turn on the Android VPN.

## Server list
- The list comes from the Schleim OS repository.
- You can refresh the list. It does not show live Proton server data.
- To connect, you need your own complete .conf file from your Proton account.
- Public templates do not have a private key.

## One APK for several devices
The APK supports ARMv7, ARM64 and x86_64. 32-bit x86 is not supported because GeckoView does not provide the needed library.

The browser needs Android 8 or newer. Android 7 does not work. The NextDNS server and existing browser features stay the same.
