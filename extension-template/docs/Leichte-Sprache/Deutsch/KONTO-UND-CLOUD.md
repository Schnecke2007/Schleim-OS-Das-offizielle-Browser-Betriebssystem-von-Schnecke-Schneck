# Konto und Cloud

## Beispiel-Konto

Du brauchst eine eigene GitHub App.

- Erstelle eine GitHub App für dein Projekt.
- Aktiviere Device Flow.
- Trage die Client-ID und den App-Link in `scripts/browser-account.js` ein.
- Installiere die App in deinem GitHub-Konto.
- Melde dich mit dem Gerätecode an.

Die Vorlage speichert Einstellungen in einem privaten GitHub-Repository.

## Foto- und Video-Cloud

Die Fotos und Videos liegen in einem zweiten privaten Repository.

Trage denselben Repository-Namen an vier Stellen ein:

- `scripts/browser-account.js` bei `PHOTOS_REPO_NAME`
- `scripts/browser-media-cloud.js` bei `REPO_NAME`
- `scripts/media-upload-worker.js` bei `MEDIA_REPO_NAME`
- `scripts/media-upload-offscreen.js` bei `REPO_NAME`

Alle Namen müssen gleich sein.
Ersetze `YOUR_MEDIA_REPOSITORY_NAME` überall.

Fotos und Videos werden nach Jahr und Monat sortiert.
Eine Datei darf höchstens 50 MiB groß sein.

## Wichtig

- Das Medien-Repository muss privat sein.
- Teile keine geheimen Schlüssel.
- Schreibe keine Passwörter in den Code.
- GitHub kann alte Dateiversionen behalten.
- Teste alles zuerst mit einem Testkonto.

Die Demo lädt keine lokalen Bilder oder Videos auf einen Server hoch.
