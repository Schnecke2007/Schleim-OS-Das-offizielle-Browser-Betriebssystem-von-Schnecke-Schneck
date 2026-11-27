# Schleim VPN

Die VPN-Steuerung in Schleim Browser verwendet OpenVPN for Android als externen Tunnel-Client. Der Client erstellt und verwaltet Androids `VpnService`.

- Serverliste: Repository-Manifest `vpn/servers.json`
- Profile: Unterordner `Server/`
- Import: Profil wird beim Import aus dem Repository geladen und über FileProvider an den OpenVPN-Client übergeben
- Verbindung: OpenVPN for Android verwaltet Zugangsdaten, Android-Bestätigung, Tunnel und Status
- Tarif: Die Integration ist für Proton VPN Free vorgesehen; Serververfügbarkeit und Nutzungsbedingungen legt Proton fest.

Die Profile in `Server/` sind älter und nicht als aktuell bestätigt. Sie müssen durch aktuelle Anbieterprofile ersetzt werden. Die Serverliste wird automatisch aus dem Repository aktualisiert, sobald das Manifest oder die Profil-Dateien dort geändert werden. Eine automatische Aktualisierung direkt aus Protons Serverdaten ist nicht implementiert.
