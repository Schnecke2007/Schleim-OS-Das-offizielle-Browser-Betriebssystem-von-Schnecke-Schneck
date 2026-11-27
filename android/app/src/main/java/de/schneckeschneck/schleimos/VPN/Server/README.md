# Schleim VPN – OpenVPN-Serverprofile

Dieser Ordner enthält OpenVPN-Konfigurationen für die Schleim-VPN-Integration. Die Android-App lädt die ausgewählte Datei beim Import aus diesem Repository und übergibt sie an **OpenVPN for Android**.

**Status der vorhandenen Profile:** Die Dateien stammen aus einem älteren Konfigurationsbestand. Sie wurden nicht als aktuell oder aktiv bestätigt und dürfen nicht als funktionierende Serverliste beworben werden. Proton kann Server und Profile jederzeit ändern oder entfernen. Ersetze sie durch aktuelle, aus deinem Proton-Konto heruntergeladene Free-Server-Profile, bevor du sie verwendest.

Die zugehörige Liste befindet sich in `vpn/servers.json`. Für jeden Eintrag müssen `fileName`, `profileName` und `configPath` stimmen. Der Pfad ist relativ zum Repository-Root.

Keine Zugangsdaten, Passwörter oder privaten Schlüssel in öffentliche Dateien eintragen. Proton benötigt separate OpenVPN-Zugangsdaten; das normale Konto-Passwort ist nicht dafür vorgesehen.

Der Browser steuert den externen OpenVPN-Client. Er enthält derzeit keine eingebettete OpenVPN-Engine und bietet keinen eigenen VPN-Serverdienst.
