# Schleim VPN in der Android-App

Die Browser-Extension enthält eine **Schleim-VPN-Kachel**. In Schleim Browser für Android öffnet sie über das native Schema `schleimbrowser://vpn` das VPN-Menü der Android-App.

Die Extension selbst kann keinen systemweiten VPN-Tunnel erstellen. Die Android-App steuert OpenVPN for Android als externen Client; dieser verwaltet Androids `VpnService`, die Berechtigung und die Tunnelverbindung.

- Browser-Menü: **Schleim VPN**
- Extension: Startseite → **Schleim VPN** → **VPN-Steuerung öffnen**
- Profile und Serverstandorte werden über das Repository-Manifest bereitgestellt.
- Der externe OpenVPN-Client und aktuelle, gültige OpenVPN-Profile sind erforderlich.

Details, Installation und Hinweise zu den Proton-Free-Profilen: [Android-Browser-Dokumentation](../../docs/Deutsch/ANDROID-BROWSER.md#schleim-vpn--proton-free).
