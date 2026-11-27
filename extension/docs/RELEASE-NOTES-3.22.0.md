# Schleim OS 3.22.0

- Updated the Extension release version to 3.22.0.
- Declared the native-messaging permission for compatible host integrations.
- The native WireGuard VPN remains an Android-app feature. The Extension does not create a VPN tunnel or change the device network route.
- See the Android Alpha 32 release notes for profile import, location catalog refresh and ABI support.


- Added a new-tab VPN tile that requests the native Android VPN panel through the GeckoView bridge.
- Desktop browsers show a fallback message; the extension does not implement a VPN tunnel.
- Extension details and permission controls remain host/browser-dependent.
