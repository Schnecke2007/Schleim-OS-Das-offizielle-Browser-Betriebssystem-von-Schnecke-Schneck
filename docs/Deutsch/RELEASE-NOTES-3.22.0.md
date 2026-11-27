# Schleim OS 3.22.0 – Android Alpha 32

## Schleim VPN im Browser
- Native WireGuard-Integration direkt im Schleim Browser; keine separate VPN-App.
- VPN-Oberfläche im Browser-Menü mit Status, Standortauswahl, Import und Trennen.
- Die Free-Standortliste wird aus dem Schleim-OS-Repository geladen. Sie ist ein Referenzkatalog, keine Live-Verfügbarkeits- oder Auslastungsanzeige von Proton.
- Für eine Verbindung muss eine vollständige persönliche WireGuard-\.conf aus dem eigenen Proton-Konto importiert werden. Profile werden lokal mit AES-GCM und Android-Keystore verschlüsselt.
- Der Tunnel ist auf Schleim Browser beschränkt. Andere Android-Apps werden nicht durch den Tunnel geleitet.
- Öffentliche Vorlagen enthalten keinen privaten Schlüssel. Die Browser-Extension kann den nativen Android-VPN-Tunnel nicht starten oder steuern.

## Universal-APK
- Eine APK bündelt GeckoView für ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) und x86_64.
- 32-Bit-x86 wird von der gepinnten GeckoView-Version nicht mit nativen Bibliotheken geliefert und ist daher nicht unterstützt.
- Mindestversion bleibt Android 8.0 / API 26. Android 7 wird nicht unterstützt.

Proton VPN Free kann Serverwechsel zufällig zuweisen und mit Wartezeiten begrenzen. Der öffentliche Proton-Serverlisten-Endpunkt ist nicht offiziell unterstützt und wurde abgeschaltet. Die Standortliste kann nur dann automatisch aktuell sein, wenn der Repository-Katalog gepflegt wird.

Der NextDNS-Resolver, das dunkelbraune UI, Tabs, Verlauf, Lesezeichen, Passwort-Manager und Add-on-Funktionen bleiben erhalten.
