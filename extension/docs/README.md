# Schleim OS – Erweiterungsdokumentation · Version 3.15.0

Schleim OS ist eine Manifest-V3-Erweiterung für kompatible Chromium-Browser. Sie ersetzt den neuen Tab durch einen personalisierbaren Homescreen.

## Funktionen

- Homescreen mit fest eingebauten Apps, benutzerdefinierten Webseiten und Store-Apps
- Frei sortierbare App-Kacheln; die Reihenfolge wird lokal gespeichert
- Personalisierung von Akzentfarbe, Hintergrund und Sperrbildschirm
- Schleim-Store mit Kategorien, Empfehlungen, Suche, Bewertungen und App-Vorschlägen
- Store-Sperre: Zugriff nur nach Anmeldung mit dem Schleim-Konto
- GitHub-App-Anmeldung mit Installationsseite, Gerätecode, versuchtem automatischem Kopieren und Installationserkennung
- Private Foto-/Video-Cloud mit Kamera-App, Upload, Mediathek und Speicherübersicht
- Hintergrund-Upload nach dem Schließen des Fotos-Tabs über ein Chrome-Offscreen-Dokument
- Live-Fortschrittsbenachrichtigung und Abschlussmeldung mit direktem Sprung zur Fotos-App
- Lokale WebP-Komprimierung statischer Bilder und lokale Video-Neukodierung als WebM
- Front-/Rückkamera für Foto- und Videoaufnahmen über Browser-Medien-APIs
- Ordner nach Jahr und Monat; EXIF-Aufnahmedatum bei unterstützten JPEG-Fotos
- Metadatensuche mit Synonymen sowie optionale lokale KI-Bildbeschreibung und semantische Suche (Chrome Prompt API, kein API-Schlüssel)
- Manuelle Cloud-Sicherung und Wiederherstellung ausschließlich in den Einstellungen
- Update-Center zum Prüfen der GitHub-Version und Herunterladen der aktuellen Repository-ZIP
- Deutsch, Englisch und Niederländisch
- Werbefreie Extension-Oberfläche

## Anmeldung und Store-Sperre

Der feste Store-Einstieg auf dem Homescreen bleibt sichtbar. Ohne angemeldetes Schleim-Konto öffnet er nur den Anmeldebereich; Katalog, Suche, Bewertungen, Installationen, Deinstallationen und Vorschläge bleiben gesperrt. Bereits installierte Store-App-Kacheln werden beim Abmelden ausgeblendet und nach der nächsten erfolgreichen Anmeldung wieder angezeigt.

Der Anmeldeablauf öffnet zuerst die GitHub-App-Seite. Nach der Installation bestätigt die Person den nächsten Schritt in Schleim OS. Der Gerätecode wird angezeigt. Schleim OS versucht, ihn nach kurzer Verzögerung in die Zwischenablage zu kopieren; manuelles Kopieren bleibt möglich. Anschließend öffnet sich die GitHub-Gerätefreigabe. Nach der Autorisierung prüft Schleim OS die App-Installation über die GitHub-API.

Die Store-Sperre betrifft die Oberfläche der Erweiterung. Der Katalog und die Bewertungsdateien im öffentlichen GitHub-Repository sind weiterhin öffentlich lesbar.

## Foto- und Video-Cloud

Die Erweiterung verwendet zusätzlich zum Einstellungs-Backup-Repository `schleim-os-cloud` das separate private Repository `schleim-os-cloud-photos-and-videos`. Es wird nach der Anmeldung unter **Einstellungen → Schleim-Konto → Schleim OS Foto Video Cloud Speicher** gesucht und bei Bedarf nach Auswahl privat angelegt. Medien liegen unter `Fotos/JJJJ/JJJJ-MM/` bzw. `Videos/JJJJ/JJJJ-MM/`; `_metadata/media-index.json` enthält Typ, Datum, Dateigröße, Dateiname, Beschreibung und Stichwörter. JPEG-Dateien können ihr EXIF-Aufnahmedatum liefern. Für andere Formate gilt als Fallback der Datei-Zeitstempel.

Beim Start eines Uploads werden die ausgewählten Dateien zunächst in einer lokalen IndexedDB-Warteschlange gespeichert. Ein separates Chrome-Offscreen-Dokument übernimmt anschließend Komprimierung und GitHub-Upload; dadurch läuft der Vorgang weiter, wenn der Fotos-Tab geschlossen oder Chrome minimiert wird. Chrome selbst muss geöffnet bleiben. Die Erweiterung zeigt eine Fortschrittsbenachrichtigung mit Prozentwert. Nach Abschluss erscheint eine eigene Benachrichtigung; ein Klick darauf öffnet Schleim OS direkt in der Fotos-App. Benachrichtigungen müssen im Browser und Betriebssystem zugelassen sein.

Statische, vom Browser dekodierbare Fotos werden lokal als WebP optimiert. Wenn die WebP-Datei größer wäre und das Original bereits unter der Grenze liegt, bleibt das Original erhalten. Animierte GIF-, APNG- und WebP-Dateien werden nicht verändert, damit die Animation erhalten bleibt. Videos werden lokal als WebM neu kodiert; die Zielgröße liegt unter 50 MiB. Sehr lange Videos oder nicht unterstützte Quellformate können trotz Komprimierung abgewiesen werden. Die Neukodierung kann je nach Videolänge spürbar Zeit und Rechenleistung benötigen.

Die normale Suche nutzt lokal Dateinamen, Datum, Medientyp, Beschreibungen, Stichwörter und Synonyme. Optional kann die Fotos-App in unterstützten Chrome-Desktop-Erweiterungen die Chrome Prompt API mit Gemini Nano aktivieren: Neue Fotos werden auf dem Gerät beschrieben, und die KI erweitert Suchanfragen um passende Begriffe. Dafür ist kein API-Schlüssel nötig; Fotos für diese Analyse werden nicht an einen externen KI-Dienst gesendet. Beim ersten Start muss Chrome das Modell herunterladen. Die Verfügbarkeit hängt von Chrome-Version, Betriebssystem und Hardware ab. Ist die API nicht verfügbar, funktioniert die Metadatensuche weiter. Die Bildbeschreibung ist derzeit für Fotos vorgesehen, Videos bleiben über Metadaten durchsuchbar.

Das Medien-Repository wird beim erstmaligen Verknüpfen nach ausdrücklichem Klick auf **Privaten Cloud-Speicher jetzt verknüpfen** im angemeldeten GitHub-Konto erstellt. Es muss `private=true` haben und dem angemeldeten Konto gehören. Die installierte GitHub-App benötigt dazu die Berechtigung zur Repository-Erstellung sowie Contents-Lese-/Schreibzugriff. Dateien sind derzeit auf 50 MiB pro Upload begrenzt. GitHub ist versionsbasierter Repository-Speicher und kein unbegrenzter Foto-Cloud-Anbieter; entfernte Dateien können in der Git-Historie erhalten bleiben.

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

## Updates

Das Update-Center vergleicht die lokal installierte Version mit der Manifest-Version auf GitHub und bietet bei einer neueren Version den ZIP-Download an. Es installiert die ZIP-Datei nicht selbst; die Browser-Import- oder Update-Funktion muss anschließend verwendet werden.

- [Update-Anleitung – Deutsch](../../docs/Deutsch/UPDATES.md)
- [Update guide – English](../../docs/Englisch/UPDATES.md)
- [Updatehandleiding – Nederlands](../../docs/Niederländisch/UPDATES.md)

## Versionshinweise

- [Release Notes 3.15.0](RELEASE-NOTES-3.15.0.md)
- [Release Notes 3.14.1](RELEASE-NOTES-3.14.1.md)
- [Release Notes 3.13.7](RELEASE-NOTES-3.13.7.md)
- [Release Notes 3.13.6](RELEASE-NOTES-3.13.6.md)
- [Release Notes 3.13.5](RELEASE-NOTES-3.13.5.md)
- [Release Notes 3.13.4](RELEASE-NOTES-3.13.4.md)
- [Release Notes 3.13.3](RELEASE-NOTES-3.13.3.md)
- [Release Notes 3.13.2](RELEASE-NOTES-3.13.2.md)
- [Release Notes 3.13.1](RELEASE-NOTES-3.13.1.md)
- [Release Notes 3.13.0](RELEASE-NOTES-3.13.0.md)
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

## Updates in Leichter Sprache

- [Deutsch](../../docs/Leichte-Sprache/Deutsch/UPDATES.md)
- [English](../../docs/Leichte-Sprache/Englisch/UPDATES.md)
- [Nederlands](../../docs/Leichte-Sprache/Niederländisch/UPDATES.md)

## Konto und Cloud-Sicherung in Leichter Sprache

- [Deutsch](../../docs/Leichte-Sprache/Deutsch/KONTO-CLOUD.md)
- [English](../../docs/Leichte-Sprache/Englisch/ACCOUNT-CLOUD.md)
- [Nederlands](../../docs/Leichte-Sprache/Niederländisch/ACCOUNT-CLOUD.md)

## Store-Anleitungen in Leichter Sprache

- [Deutsch – Schleim-Store](../../docs/Leichte-Sprache/Deutsch/SCHLEIM-STORE.md)
- [English – Schleim-Store](../../docs/Leichte-Sprache/Englisch/SCHLEIM-STORE.md)
- [Nederlands – Schleim-Store](../../docs/Leichte-Sprache/Niederländisch/SCHLEIM-STORE.md)


## Sonos-App

- [Sonos-App einrichten](./SONOS-APP.md)


## Release notes 3.13.7

- [Release Notes 3.13.7](./RELEASE-NOTES-3.13.7.md)
- [Release Notes 3.13.6](./RELEASE-NOTES-3.13.6.md)
- [Release Notes 3.13.5](./RELEASE-NOTES-3.13.5.md)
- [Release Notes 3.13.4](./RELEASE-NOTES-3.13.4.md)
- [Release Notes 3.13.3](./RELEASE-NOTES-3.13.3.md)
- [Release Notes 3.13.2](./RELEASE-NOTES-3.13.2.md)
- [Release Notes 3.13.1](./RELEASE-NOTES-3.13.1.md)
- [Sonos-App einrichten](./SONOS-APP.md)

## Previous release notes

- [Release Notes 3.13.0](./RELEASE-NOTES-3.13.0.md)
