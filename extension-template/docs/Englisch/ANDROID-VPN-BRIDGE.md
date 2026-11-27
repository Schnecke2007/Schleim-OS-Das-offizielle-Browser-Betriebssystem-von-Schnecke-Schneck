# Android VPN bridge in the Extension template

The template includes a **VPN bridge tile**. In the Android app it opens the native VPN menu through `browseros://vpn`. The Android integration uses OpenVPN for Android as an external client.

The Extension cannot create a system tunnel on its own. The external client provides the tunnel through Android's `VpnService`. The template does not include provider profiles or VPN credentials.

## Configure the template

1. Set your GitHub repository in `VpnIntegration.kt`.
2. Create `vpn/servers.json` in your repository using the template example.
3. Place current `.ovpn` profiles supplied by your VPN provider in `app/src/main/java/com/example/yourbrowser/VPN/Server/`.
4. Update `configPath` in the server manifest. The path is relative to the repository root.
5. Install OpenVPN for Android on the device and import the profile. The user must approve Android's VPN permission and enter their credentials themselves.

For security and licensing reasons, the generated ZIP excludes production `.ovpn` files and provides an example manifest. Never store passwords, private keys or personal credentials in a public repository.
