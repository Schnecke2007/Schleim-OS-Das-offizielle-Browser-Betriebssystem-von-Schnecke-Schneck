# Android-VPN-Bridge in der Extension-Vorlage

Die Vorlage enthält eine **VPN-Bridge-Kachel**. In der Android-App öffnet sie das native VPN-Menü über `browseros://vpn`. Die Android-Integration verwendet OpenVPN for Android als externen Client.

Die Extension kann keinen systemweiten Tunnel selbst aufbauen. Der externe Client stellt den Tunnel über Androids `VpnService` bereit. Die Vorlage enthält keine Anbieter-Profile und keine VPN-Zugangsdaten.

## Vorlage konfigurieren

1. Trage dein GitHub-Repository in `VpnIntegration.kt` ein.
2. Erstelle im Repository eine Datei `vpn/servers.json` nach dem Beispiel im Template.
3. Lege aktuelle, von deinem VPN-Anbieter bereitgestellte `.ovpn`-Profile in `app/src/main/java/com/example/yourbrowser/VPN/Server/` ab.
4. Aktualisiere `configPath` in der Serverliste. Der Pfad ist relativ zum Repository-Root.
5. Installiere OpenVPN for Android auf dem Gerät und importiere das Profil. Der Nutzer muss die VPN-Berechtigung bestätigen und seine Zugangsdaten selbst eingeben.

Die ZIP-Vorlage entfernt aus Sicherheits- und Lizenzgründen die produktiven `.ovpn`-Dateien und setzt ein Beispielmanifest ein. Speichere keine Passwörter, privaten Schlüssel oder persönlichen Zugangsdaten in einem öffentlichen Repository.
