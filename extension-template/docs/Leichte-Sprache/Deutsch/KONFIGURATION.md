# Einstellungen der Vorlage – Leichte Sprache

Die Vorlage hat Beispiel-Daten. Trage deine eigenen Daten ein.

## 1. Name und Profil

- Öffne die Datei `manifest.json`.
- Ändere den Namen und die Beschreibung.
- Ändere die Beispieltexte in `scripts/app.js`.
- Ersetze die Bilder im Ordner `assets/demo/`.

## 2. GitHub einrichten

Du brauchst eine eigene GitHub App.

- Trage deine öffentliche App-ID in `scripts/browser-account.js` ein.
- Trage den Link zu deiner App ein.
- Trage den Namen deines privaten Backup-Repositorys ein.
- Trage deinen GitHub-Namen und Repository-Namen im Update-Center ein.

## 3. Foto- und Video-Cloud

Du brauchst ein zweites privates Repository für Fotos und Videos.

Der Name muss in vier Dateien gleich sein:

- `browser-account.js`
- `browser-media-cloud.js`
- `media-upload-worker.js`
- `media-upload-offscreen.js`

Ersetze dort überall `YOUR_MEDIA_REPOSITORY_NAME`.

## 4. Store

Prüfe die Apps in `data/store-apps.json`. Ändere die Beispiel-Links und Texte.

## Sicherheit

Dein privates GitHub-Geheimnis, private Schlüssel und Zugriffstoken dürfen nicht im Erweiterungscode stehen. Trage dort auch kein Passwort ein.

Die Demo meldet sich nicht bei GitHub an. Sie lädt keine Fotos oder Videos auf einen Server hoch.
