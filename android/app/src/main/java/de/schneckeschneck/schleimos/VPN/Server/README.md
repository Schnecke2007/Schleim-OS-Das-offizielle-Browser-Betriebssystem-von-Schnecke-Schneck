# Schleim Browser VPN – Serverkatalog

Dieser Ordner enthält öffentliche Standort-Metadaten für die WireGuard-Integration. Er enthält **keine nutzbaren privaten VPN-Schlüssel**.

- `servers.json` ist der öffentliche Standortkatalog, den die Android-App beim Öffnen des VPN-Bereichs neu abruft.
- Die `.conf`-Dateien sind bereinigte Serverprofile/Metadaten. Die `PrivateKey`-Zeilen wurden entfernt; diese Dateien sind deshalb nicht direkt verbindungsfähig.
- Für eine Verbindung muss jede Person eine aktuelle WireGuard-Konfiguration aus dem eigenen Proton-VPN-Konto importieren. Schleim Browser speichert importierte Profile verschlüsselt mit Android Keystore (AES-GCM).
- Der Tunnel wird auf das Paket von Schleim Browser beschränkt; andere Android-Apps werden nicht durch diesen Browser-VPN-Tunnel geleitet.
- Die alte OpenVPN-Dateisammlung (`.ovpn`) wurde entfernt. Es wurde keine separate VPN-APK im VPN-Verzeichnis gefunden.

**Sicherheitsmaßnahme:** Die zuvor veröffentlichten WireGuard-Konfigurationen enthielten private Schlüssel. Die Schlüsselzeilen wurden aus den aktuellen Dateien entfernt. Das reicht nicht, um bereits veröffentlichte Schlüssel zu widerrufen: Erzeuge/aktualisiere die Konfigurationen in Proton VPN und verwende die alten Schlüssel nicht weiter.

**Automatische Aktualisierung:** Die App ruft den Standortkatalog direkt aus diesem Repository ab. Änderungen an `servers.json` erscheinen daher beim nächsten Abruf. Proton hat den früher öffentlich verwendeten Server-API-Endpunkt für unauthentifizierte Anfragen abgeschaltet; der Katalog kann deshalb nicht zuverlässig live direkt von Proton synchronisiert werden. Die aktuellen persönlichen Konfigurationsdateien müssen aus dem eigenen Proton-Konto kommen.

Die Verfügbarkeit einzelner Standorte im Proton-Free-Tarif kann sich ändern und wird nicht durch Schleim Browser garantiert.
