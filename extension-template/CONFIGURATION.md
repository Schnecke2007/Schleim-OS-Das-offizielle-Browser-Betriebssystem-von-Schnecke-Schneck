# Konfigurationsanleitung

Diese Vorlage ist neutral. Persönliche Profile, Kontaktdaten, App-Zugangsdaten und Repository-Namen sind Platzhalter.

## Grunddaten

Ändere in `manifest.json` den Namen, Kurzname, die Beschreibung und die Version. Passe die Beispieltexte und Links in `scripts/app.js` an. Ersetze die Beispielbilder in `assets/demo/` und `assets/icons/`.

## GitHub und Update-Center

Trage in `scripts/update-center.js` deinen GitHub-Benutzernamen und Repository-Namen ein. Der Update-Center lädt ausschließlich `Browser-OS-Extension-Template.zip` aus dem neuesten Release dieses Repositorys.

## Konto und Cloud

Konfiguriere deine GitHub-App in `scripts/browser-account.js`. Trage dort die öffentliche Client-ID, App-Kennung und die Namen deiner privaten Repositorys ein. Der Name des Foto-/Video-Repositorys muss an vier Stellen exakt übereinstimmen: `PHOTOS_REPO_NAME` in `scripts/browser-account.js`, `REPO_NAME` in `scripts/browser-media-cloud.js`, `MEDIA_REPO_NAME` in `scripts/media-upload-worker.js` und `REPO_NAME` in `scripts/media-upload-offscreen.js`. Ersetze überall `YOUR_MEDIA_REPOSITORY_NAME` durch denselben eigenen Repository-Namen.

Die Hintergrundverarbeitung liegt in `scripts/media-upload-worker.js` und `scripts/media-upload-offscreen.js`. Die Dateien verwenden dieselbe Konto-Sitzung wie das Konto-Modul. Ältere Template-Sitzungen werden beim ersten Start automatisch auf den neutralen Speicherschlüssel migriert.

## Browser Store

Bearbeite `data/store-apps.json`. Prüfe die Links und Beispieltexte. Store-Administration und Katalog müssen auf dein eigenes Repository zeigen.

## Sicherheit

Nur die öffentliche GitHub-App-Client-ID darf in der Erweiterung stehen. Niemals Client-Secrets, private Schlüssel, persönliche Zugriffstoken oder Passwörter eintragen. Sicherungs- und Medien-Repositorys müssen privat sein. Teste alle Funktionen mit einem Testkonto.

## Dokumentation

Die übersetzten Anleitungen befinden sich in `docs/Deutsch/`, `docs/Englisch/`, `docs/Niederländisch/` und `docs/Leichte-Sprache/`.
