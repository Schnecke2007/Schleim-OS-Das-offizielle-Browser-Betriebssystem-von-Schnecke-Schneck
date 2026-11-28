# Schleim OS 3.22.1 – Android Alpha 33

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


## New extension details
- Every extension now has a details page.
- The page shows information and permissions supplied by the extension.
- Some extra permissions can be switched on or off one by one.
- The VPN tile in the extension opens the VPN menu in the Android app.
- The extension does not make a VPN tunnel itself.
- An extension can run in private windows only if it allows this.

## Important VPN key note
Private VPN keys were public before. They were removed from the files. Please create new keys and new configuration files in Proton.


## Release 3.22.1

- There is a new Android version: Alpha 33.
- The APK was built and checked again.
- The ZIP files for the browser and Extension were also rebuilt.
- A file checks the SHA-256 checksums.
- The old 3.22.0 release notes stay available.
