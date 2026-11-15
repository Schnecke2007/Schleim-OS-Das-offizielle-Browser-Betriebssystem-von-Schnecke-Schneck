# Konto und private Cloud

## Beispiel-Konto

Die Vorlage verwendet eine GitHub-App-Anmeldung mit Device Flow. Jede Person muss eine eigene GitHub-App erstellen und installieren.

1. Erstelle eine GitHub App für dein Browser-OS-Projekt.
2. Aktiviere den Device Flow.
3. Trage die öffentliche Client-ID und den App-Link in `scripts/browser-account.js` ein.
4. Erlaube die Berechtigungen, die deine Funktionen brauchen: Repository creation (write), Contents (read/write) und – falls genutzt – Email addresses (read).
5. Installiere die App in deinem GitHub-Konto und melde dich über den angezeigten Gerätecode an.

Das Konto-Modul speichert eine Sicherung der Einstellungen in einem privaten Repository. Der Repository-Name wird in `scripts/browser-account.js` über `REPO_NAME` festgelegt.

## Foto- und Video-Cloud

Die Medien-App verwendet ein zweites privates Repository. Trage denselben Namen in diese vier Stellen ein:

- `scripts/browser-account.js`: `PHOTOS_REPO_NAME`
- `scripts/browser-media-cloud.js`: `REPO_NAME`
- `scripts/media-upload-worker.js`: `MEDIA_REPO_NAME`
- `scripts/media-upload-offscreen.js`: `REPO_NAME`

Die Namen müssen genau übereinstimmen. Ersetze `YOUR_MEDIA_REPOSITORY_NAME` überall durch deinen eigenen Repository-Namen.

Fotos und Videos werden nach Medientyp, Jahr und Monat sortiert. Der Medienindex enthält Metadaten und verweist auf die hochgeladenen Dateien. Das Upload-Limit der Vorlage beträgt 50 MiB pro Datei.

## Datenschutz und Sicherheit

- Das Medien-Repository muss privat sein.
- GitHub-App-Client-Secrets, private Schlüssel und persönliche Zugriffstoken dürfen nicht im Erweiterungscode stehen.
- Browser OS fragt nicht nach deinem GitHub-Passwort. Anmeldung und Gerätefreigabe erfolgen direkt auf GitHub.
- GitHub-Repositories sind versioniert. Gelöschte oder ersetzte Dateien können in der Repository-Historie weiter vorhanden sein.
- Teste die Einrichtung zuerst mit einem eigenen Testkonto.

Die Demo-Webseite verwendet keine echte GitHub-Anmeldung und lädt keine lokalen Medien auf einen Server hoch.
