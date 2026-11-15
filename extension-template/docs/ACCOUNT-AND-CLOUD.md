# Konto und private Cloud einrichten

Die Konto- und Cloud-Funktionen verwenden GitHub Device Flow. Die Vorlage enthält keine fertig eingerichtete GitHub App.

## Vor dem Start
1. Erstelle deine eigene GitHub App und aktiviere Device Flow.
2. Trage die öffentliche Client-ID, den App-Namen und den Installationslink in `scripts/browser-account.js` ein.
3. Trage ein privates Repository für Einstellungs-Sicherungen ein.
4. Trage ein separates privates Repository für Fotos und Videos ein.
5. Verwende denselben Medien-Repository-Namen in `scripts/browser-media-cloud.js` und `scripts/media-upload-offscreen.js`.

## Sicherheit
- Eine Client-ID ist öffentlich.
- Client-Secrets, private Schlüssel, Zugriffstoken und Passwörter gehören nicht in den Erweiterungscode.
- Prüfe, dass die Repositorys privat sind.
- Teste Anmeldung, Sicherung, Wiederherstellung und Medien-Upload mit einem Testkonto.
- Gelöschte Dateien können in der GitHub-Repository-Historie erhalten bleiben.

Die Store- und Update-Einstellungen müssen ebenfalls auf dein eigenes Repository zeigen. Details stehen in [CONFIGURATION.md](../CONFIGURATION.md).