# Schleim Browser VPN-Serverprofile

Dieser Ordner enthält öffentliche WireGuard-Servervorlagen (.conf) für die in Proton VPN Free verfügbaren Standorte.

## Sicherheit und Verwendung

- Die Vorlagen enthalten Server-Endpunkte und öffentliche Peer-Daten, aber **keinen persönlichen WireGuard-PrivateKey**.
- Eine Vorlage ist deshalb nicht direkt verbindungsfähig.
- Erzeuge deine persönliche WireGuard-Konfiguration über dein Proton-Konto und importiere die heruntergeladene .conf-Datei im Schleim Browser unter **Browser-Menü → Schleim VPN → WireGuard-Konfiguration importieren**.
- Schleim Browser speichert importierte Profile lokal verschlüsselt mit AES-GCM und einem Schlüssel aus dem Android-Keystore.
- Persönliche .conf-Dateien mit PrivateKey dürfen niemals in dieses öffentliche Repository oder in eine öffentliche APK hochgeladen werden.

## Serverliste und Free-Tarif

Proton VPN Free bietet aktuell kostenlose Server in zehn Ländern. Bei Free können Serverwechsel durch Proton zufällig zugewiesen werden und es gelten Wechselwartezeiten. Die früher verwendete öffentliche Serverliste-API ist nicht offiziell unterstützt und wurde abgeschaltet. Daher werden hier keine automatischen Änderungen an Server-Endpoints vorgetäuscht.

Die Profile in diesem Verzeichnis sind keine Zugangsdaten und ersetzen keine von Proton für dein Konto erzeugte Konfiguration.

## Alte OpenVPN-Dateien

Die veralteten .ovpn-Dateien wurden aus dem aktuellen Verzeichnis entfernt. Eine separate VPN-APK war in diesem Ordner nicht vorhanden. Schleim VPN ist Bestandteil der Android-App und wird nicht als eigenständige VPN-App ausgeliefert.
