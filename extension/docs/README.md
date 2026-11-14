# Schleim OS – Erweiterungsdokumentation · Version 3.11.0

Schleim OS ist eine Manifest-V3-Erweiterung für kompatible Chromium-Browser. Sie ersetzt den neuen Tab durch einen personalisierbaren Homescreen.

## Funktionen

- Homescreen mit fest eingebauten Apps, benutzerdefinierten Webseiten und Store-Apps
- Frei sortierbare App-Kacheln; die Reihenfolge wird lokal gespeichert
- Personalisierung von Akzentfarbe, Hintergrund und Sperrbildschirm
- Schleim-Store mit Kategorien, Empfehlungen, Suche, Bewertungen und App-Vorschlägen
- Store-Sperre: Zugriff nur nach Anmeldung mit dem Schleim-Konto
- GitHub-App-Anmeldung mit Installationsseite, Gerätecode, automatischem Kopieren und Installationserkennung
- Manuelle Cloud-Sicherung und Wiederherstellung ausschließlich in den Einstellungen
- Deutsch, Englisch und Niederländisch
- Werbefreie Extension-Oberfläche

## Anmeldung und Store-Sperre

Der Schleim-Store bleibt ohne angemeldetes Schleim-Konto gesperrt. Die Store-Kachel und die Store-App-Verknüpfungen werden erst nach erfolgreicher Anmeldung freigegeben. Beim Abmelden wird der Store erneut gesperrt.

Der Anmeldeablauf öffnet zuerst die GitHub-App-Seite. Nach der Installation bestätigt die Person den nächsten Schritt in Schleim OS. Der Gerätecode wird angezeigt und nach kurzer Verzögerung in die Zwischenablage kopiert. Anschließend öffnet sich die GitHub-Gerätefreigabe. Nach der Autorisierung prüft Schleim OS die App-Installation über die GitHub-API.

Die Store-Sperre betrifft die Oberfläche der Erweiterung. Der Katalog und die Bewertungsdateien im öffentlichen GitHub-Repository sind weiterhin öffentlich lesbar.

## Speicherung und Cloud-Backup

Aktive Einstellungen werden lokal im Browserprofil gespeichert. Die Cloud-Sicherung wird nur unter **Einstellungen → Schleim-Konto** gestartet oder wiederhergestellt. Es gibt keine automatische Synchronisierung.

Das aktuelle Backup-Format ist **Version 2**. Es umfasst die gespeicherten `ssos-` Einstellungen und erfasst zusätzlich ausdrücklich:
- die Reihenfolge der App-Kacheln,
- die installierten Store-Apps,
- das System- und benutzerdefinierte Hintergrundbild.

Die Wiederherstellung ersetzt die lokalen Schleim-OS-Einstellungen durch die Backup-Daten. Backups der früheren Formatversion 1 können weiterhin gelesen werden. Lokale JSON-Import- und Export-Schaltflächen gehören nicht mehr zur aktuellen Oberfläche.

## Installation

1. Vollständiges GitHub-Repository über **Code → Download ZIP** herunterladen.
2. ZIP-Datei nicht entpacken.
3. In einem Chromium-Browser mit direktem ZIP-Erweiterungsimport die vollständige Repository-ZIP importieren.
4. Falls nötig, Entwicklermodus einschalten.
5. Erweiterung bestätigen und einen neuen Tab öffnen.

Die Importfunktion ist browser- und plattformabhängig. Chrome für Android unterstützt keine regulären Chrome-Erweiterungen.

## Standalone-Demo

Die Datei `standalone/schleim-os-standalone.html` ist eine separate Demo. Sie kann die Erweiterungsfunktionen, insbesondere GitHub-Konto, Store-Sperre und Cloud-Backup, nicht vollständig ersetzen.

## Versionshinweise

- [Release Notes 3.11.0](RELEASE-NOTES-3.11.0.md)

## Technische Referenzen

- [Installationsanleitung](INSTALLATION.md)
- [Schleim-Konto und Cloud-Sicherung – Deutsch](SCHLEIM-KONTO.md)
- [Schleim account and cloud backup – English](../../docs/Englisch/SCHLEIM-ACCOUNT.md)
- [Schleim-account en cloudback-up – Nederlands](../../docs/Niederländisch/SCHLEIM-ACCOUNT.md)
- [Technische Hinweise](TECHNICAL-NOTES.md)
- [GitHub-Store-Katalog](../../Store/README.md)
- [Store-Anleitungen: Deutsch](../../Store/Deutsch/README.md) · [English](../../Store/Englisch/README.md) · [Nederlands](../../Store/Niederländisch/README.md)
- [Dokumentationsübersicht](../../docs/README.md)

## Konto und Cloud-Sicherung in Leichter Sprache

- [Deutsch](../../docs/Leichte-Sprache/Deutsch/KONTO-CLOUD.md)
- [English](../../docs/Leichte-Sprache/Englisch/ACCOUNT-CLOUD.md)
- [Nederlands](../../docs/Leichte-Sprache/Niederländisch/ACCOUNT-CLOUD.md)

## Store-Anleitungen in Leichter Sprache

- [Deutsch – Schleim-Store](../../docs/Leichte-Sprache/Deutsch/SCHLEIM-STORE.md)
- [English – Schleim-Store](../../docs/Leichte-Sprache/Englisch/SCHLEIM-STORE.md)
- [Nederlands – Schleim-Store](../../docs/Leichte-Sprache/Niederländisch/SCHLEIM-STORE.md)
