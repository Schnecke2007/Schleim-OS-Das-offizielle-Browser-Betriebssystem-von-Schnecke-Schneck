# Schleim OS 3.22.0 – Android Alpha 32

## Schleim VPN
- Schleim Browser hat jetzt ein VPN.
- Das VPN ist direkt im Browser. Du brauchst keine extra VPN-App.
- Das VPN nutzt WireGuard.
- Du kannst einen Standort auswählen.
- Du kannst deine eigene WireGuard-Datei importieren.
- Die Datei wird verschlüsselt auf deinem Gerät gespeichert.
- Nur Schleim Browser nutzt das VPN. Andere Android-Apps nutzen das normale Internet.
- Die Browser-Erweiterung kann das Android-VPN nicht einschalten.

## Server-Liste
- Die Liste kommt aus dem Schleim-OS-Repository.
- Du kannst die Liste neu laden.
- Die Liste zeigt keine Live-Daten von Proton.
- Für eine Verbindung brauchst du eine eigene vollständige .conf-Datei von deinem Proton-Konto.
- Öffentliche Vorlagen haben keinen privaten Schlüssel.

## Eine APK für mehrere Geräte
Die APK unterstützt ARMv7, ARM64 und x86_64. 32-Bit-x86 wird nicht unterstützt. GeckoView liefert dafür keine passende Bibliothek.

Der Browser braucht Android 8 oder neuer. Android 7 funktioniert nicht. Der NextDNS-Server und die bisherigen Browser-Funktionen bleiben gleich.


## Neue Erweiterungs-Details
- Jede Erweiterung hat jetzt eine Detail-Seite.
- Dort stehen Informationen und Rechte der Erweiterung.
- Manche zusätzlichen Rechte kannst du einzeln erlauben oder ausschalten.
- Die VPN-Kachel in der Extension öffnet das VPN-Menü in der Android-App.
- Die Extension macht selbst keinen VPN-Tunnel.
- Eine Erweiterung darf nur dann in privaten Fenstern laufen, wenn sie das erlaubt.

## Wichtig zu VPN-Schlüsseln
Private VPN-Schlüssel waren vorher öffentlich. Sie wurden aus den Dateien entfernt. Bitte erstelle bei Proton neue Schlüssel und neue Dateien.
