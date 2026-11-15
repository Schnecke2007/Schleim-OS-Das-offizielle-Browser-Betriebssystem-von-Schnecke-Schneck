# Konfiguration

1. Öffne `manifest.json`. Ändere Name, Kurzname, Beschreibung und Version.
2. Passe in `scripts/app.js` den Beispielnamen, Profiltext und die Beispiel-Links an.
3. Ersetze die Bilder in `assets/demo/` und `assets/icons/`.
4. Trage in `scripts/update-center.js` deinen GitHub-Benutzernamen und Repository-Namen ein.
5. Passe in `scripts/browser-account.js` die GitHub-App-ID, den App-Link und die Namen deiner privaten Sicherungs-Repositories an.
6. Trage in `scripts/browser-media-cloud.js` denselben Namen für das Medien-Repository ein.
7. Prüfe die Einträge in `data/store-apps.json` und die Store-Links.

Verwende eigene private Repositories für persönliche Sicherungen und Medien. GitHub-App-Geheimnisse, private Schlüssel und Zugriffstoken gehören niemals in den Erweiterungscode. Teste die Funktionen mit einem Testkonto.