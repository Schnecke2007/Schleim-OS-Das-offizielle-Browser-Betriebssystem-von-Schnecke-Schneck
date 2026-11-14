# Schleim OS 3.11.0 – Schleim-Konto, Store-Sperre und Cloud-Backup

**Release:** 3.11.0  
**Erweiterungsformat:** Chromium Manifest V3  
**Dokumentationsstand:** 14. November 2026

## Schleim-Store

- Der Schleim-Store ist nur nach Anmeldung mit einem Schleim-Konto verfügbar.
- Ohne gültige Sitzung bleiben der Katalog, die Suche, Bewertungen, Installation, Deinstallation und App-Vorschläge gesperrt.
- Installierte Store-Kacheln werden während der Abmeldung ausgeblendet und nach einer erneuten Anmeldung wieder angezeigt.
- Der öffentliche GitHub-Katalog und die Bewertungsdateien bleiben direkt auf GitHub öffentlich lesbar. Die Anmeldung schützt die Store-Oberfläche, nicht das öffentliche Repository.

## GitHub-App-Anmeldung

- Der Anmeldeablauf öffnet zuerst die GitHub-App-Seite **Schleim OS Account**.
- Nach der Installation bestätigt die Person in Schleim OS den nächsten Schritt.
- Schleim OS fordert einen einmaligen Gerätecode an und zeigt ihn an.
- Das Skript versucht nach kurzer Verzögerung, den Code automatisch in die Zwischenablage zu kopieren. Eine manuelle Kopierfunktion bleibt verfügbar.
- Anschließend öffnet sich die GitHub-Gerätefreigabe. Der Link kann auch manuell geöffnet werden.
- Nach der Geräteautorisierung prüft Schleim OS über die GitHub-API, ob die App-Installation dem Konto zugeordnet ist. Die Prüfung kann bis zu fünf Minuten dauern.

## Cloud-Sicherung

- Cloud-Sicherung und Wiederherstellung sind ausschließlich unter **Einstellungen → Schleim-Konto** verfügbar.
- Im Schleim-Store gibt es keine Sicherungs- oder Wiederherstellungssteuerung.
- Die Sicherung wird manuell gestartet; es gibt keine automatische Synchronisierung nach jeder Änderung.
- Das Backup-Format 2 umfasst die gespeicherten Schleim-OS-Einstellungen und erfasst zusätzlich ausdrücklich:
  - die Reihenfolge der App-Kacheln auf dem Startbildschirm,
  - installierte Store-Apps,
  - das ausgewählte System-Hintergrundbild,
  - ein eigenes Hintergrundbild einschließlich seiner gespeicherten Bilddaten und/oder Bild-URL.
- Cloud-Backups im älteren Format 1 können weiterhin wiederhergestellt werden.
- GitHub-Passwörter und Zugriffstokens werden nicht in das Backup geschrieben. Das Repository `schleim-os-cloud` muss privat bleiben.

## Store-Katalog und Dokumentation

- Die Store-Katalogbeschreibungen sind für Deutsch, Englisch und Niederländisch verfügbar.
- Die Beschreibung von Claude wurde präzisiert: Die Claude-Webseite öffnet in einem neuen Browser-Tab und läuft nicht innerhalb der Schleim-OS-Oberfläche.
- Der Instagram-Kataloglink verwendet HTTPS.
- Store-Anleitungen gibt es jetzt in normaler Sprache und in Leichter Sprache für Deutsch, Englisch und Niederländisch.
- Die Konto- und Cloud-Backup-Anleitungen sind ebenfalls auf Deutsch, Englisch und Niederländisch sowie in Leichter Sprache verfügbar.

## Wichtige technische Hinweise

- Vor der ersten Geräteautorisierung besitzt Schleim OS noch kein GitHub-App-Benutzertoken. Deshalb kann die Installationsliste nicht schon vor dem ersten OAuth-/Device-Flow per API abgefragt werden. Die Prüfung erfolgt nach der Geräteautorisierung.
- Der automatische Zwischenablagezugriff benötigt die Manifest-Berechtigung `clipboardWrite`.
- Die Standalone-Demo ist eine separate HTML-Datei und ersetzt nicht die vollständige Erweiterung mit GitHub-Konto, Store-Sperre und Cloud-Backup.

## Dokumentation

- [Schleim-Konto und Cloud-Sicherung – Deutsch](SCHLEIM-KONTO.md)
- [Schleim account and cloud backup – English](../../docs/Englisch/SCHLEIM-ACCOUNT.md)
- [Schleim-account en cloudback-up – Nederlands](../../docs/Niederländisch/SCHLEIM-ACCOUNT.md)
- [Store-Anleitungen in drei Sprachen](../../Store/README.md)
- [Dokumentationsübersicht](../../docs/README.md)

