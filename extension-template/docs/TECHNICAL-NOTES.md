# Technische Hinweise

## Plattform
Die Vorlage nutzt Manifest V3 und ist für Chromium-basierte Browser mit Erweiterungsunterstützung gedacht. Der Einstiegspunkt ist `pages/newtab.html`.

## Projektstruktur
- `scripts/app.js`: Startseite, Apps und Navigation.
- `scripts/personalization.js`: Darstellung, App-Reihenfolge und Store.
- `scripts/browser-account.js`: GitHub-Anmeldung und private Einstellungs-Sicherung.
- `scripts/browser-media-cloud.js`: Fotos, Videos, Metadaten, Galerie, Suche und Kamera.
- `scripts/browser-photo-ai.js`: optionale lokale Bildanalyse.
- `scripts/browser-store-admin.js`: Verwaltung des Browser Stores.
- `scripts/media-upload-worker.js`: Hintergrund-Warteschlange und Benachrichtigungen.
- `scripts/media-upload-offscreen.js`: lokale Medienverarbeitung und Upload.
- `scripts/update-center.js`: Versionsprüfung und Template-ZIP-Download.
- `standalone/browser-os-standalone.html`: eigenständige Web-Demo.

## Konto und Cloud
Die GitHub-Anmeldung verwendet Device Flow. Du brauchst eine eigene GitHub App. Konto-Sicherung und Medien-Repository sollen getrennt und privat sein. Der Medien-Repositoryname muss in `browser-account.js` (`PHOTOS_REPO_NAME`), `browser-media-cloud.js` (`REPO_NAME`), `media-upload-worker.js` (`MEDIA_REPO_NAME`) und `media-upload-offscreen.js` (`REPO_NAME`) identisch konfiguriert werden. Nur die öffentliche Client-ID darf im Code stehen. Niemals Client-Secrets, private Schlüssel, Zugriffstoken oder Passwörter eintragen.

## Foto- und Video-Cloud
Die Medien-Cloud unterstützt Fotos, Videos, Galerie, Suche und Kamera. Die Upload-Warteschlange wird lokal gespeichert. Der Service Worker hält den Uploadstatus; das Offscreen-Dokument verarbeitet Medien im Hintergrund. Die maximale Dateigröße beträgt 50 MiB pro Datei. Die konkrete Verarbeitung hängt von Browser-Codecs und verfügbaren APIs ab.

## Standalone-Demo
Die Standalone-Datei zeigt ein Beispiel-Konto, lokale Foto-/Video-Vorschau und eine Kamera-Demo. Sie speichert keine echten Cloud-Daten und führt keine echte GitHub-Anmeldung durch. Kamera-Zugriff braucht die Erlaubnis des Browsers und eine sichere Verbindung (HTTPS oder localhost).

## Update-Center
Das Template lädt nur das Release-Asset `Browser-OS-Extension-Template.zip` aus dem konfigurierten Repository. Der Download wird nicht automatisch installiert. Import und Bestätigung erfolgen im Browser.