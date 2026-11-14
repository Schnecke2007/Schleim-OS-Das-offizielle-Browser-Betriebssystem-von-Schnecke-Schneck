# Schleim OS 3.12.0 – Update-Center

**Release:** 3.12.0  
**Erweiterungsformat:** Chromium Manifest V3  
**Dokumentationsstand:** 14. November 2026

## Neues Update-Center

- Die Einstellungen enthalten jetzt den Bereich **Schleim OS aktualisieren**.
- Nutzer können die aktuelle Versionsnummer auf dem GitHub-Hauptzweig prüfen.
- Der Versionsvergleich verwendet die lokal installierte Manifest-Version und die entfernte `extension/manifest.json`.
- Wenn GitHub eine höhere Version meldet, erscheint ein direkter Download-Link zur vollständigen Repository-ZIP.
- Der Download-Link wird nur nach einem erfolgreichen Versionsvergleich mit neuerer Version angezeigt.
- Der Update-Check verwendet öffentliche GitHub-Dateien und benötigt keine Anmeldung.

## Installationsgrenze

- Das Update-Center installiert die ZIP-Datei nicht selbst.
- Chrome erlaubt einer Erweiterung nicht, beliebige heruntergeladene ZIP-Dateien still zu installieren oder sich selbst damit zu ersetzen.
- `chrome.runtime.requestUpdateCheck()` prüft den vom Browser eingerichteten Update-Kanal und ist kein allgemeiner GitHub-ZIP-Installer.
- Für automatische Updates außerhalb des Chrome Web Stores ist eine andere Verteilung erforderlich: Update-URL, XML-Update-Manifest, signiertes CRX-Paket und derselbe Signaturschlüssel wie bei der bestehenden Installation. Chrome beschränkt selbst gehostete Installationen zusätzlich nach Betriebssystem und Verwaltungsrichtlinie.
- Nach dem ZIP-Download schließt der Nutzer die Installation mit der vom Browser unterstützten Import- oder Aktualisierungsfunktion ab.

## Dokumentation

- [Update-Anleitung – Deutsch](../../docs/Deutsch/UPDATES.md)
- [Update guide – English](../../docs/Englisch/UPDATES.md)
- [Updatehandleiding – Nederlands](../../docs/Niederländisch/UPDATES.md)
- [Leichte Sprache – Deutsch](../../docs/Leichte-Sprache/Deutsch/UPDATES.md)
- [Plain language – English](../../docs/Leichte-Sprache/Englisch/UPDATES.md)
- [Eenvoudige taal – Nederlands](../../docs/Leichte-Sprache/Niederländisch/UPDATES.md)
