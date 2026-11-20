# Schleim OS 3.16.0 – Android-Browser-Veröffentlichung

## Neue Android-App: Schleim Browser

- Schleim OS wird zusätzlich zur Browser-Extension als eigenständige Android-App angeboten.
- **Schleim Browser** basiert auf Mozilla GeckoView und bündelt die originale Schleim-OS-Extension.
- Die Android-App enthält eine native Browserleiste mit Adress-/Suchfeld, Zurück, Vorwärts, Neu laden, Startseite, Tabs und Browser-Menü.
- Das Browser-Menü bietet Downloads, XPI-Erweiterungsverwaltung, Desktop-Modus und Android-Einstellungen.
- Android-Dateiauswahl und Speicherdialoge sind in den Browser integriert.
- Die Android-App ist für ARM64-Geräte und Android 8.0 oder neuer vorgesehen.
- Kamera- und Mikrofonaufnahme bleiben in der Android-App absichtlich deaktiviert.

## Android-Studio-Vorlage

- Das Release enthält zusätzlich ein vollständiges Android-Studio-Projekt als ZIP.
- Die Vorlage bündelt die GeckoView-App und eine Beispiel-Extension.
- Innerhalb des Ordners Android-App werden persönliche Daten, Paket-ID, GitHub-Repository, Website, Kontakte und App-Branding durch neutrale Platzhalter ersetzt.
- Die produktive Android-App und die originale Extension außerhalb des Template-Ordners bleiben unverändert.
- Die Vorlage enthält keine privaten Signaturschlüssel oder Zugangsdaten.

## Dokumentation

- Installations-, Update- und Fehlerbehebungsanleitungen wurden um die Android-App ergänzt.
- Die Android-Dokumentation ist auf Deutsch, Englisch und Niederländisch verfügbar.
- Die bestehende Browser-Extension bleibt weiterhin als eigenes ZIP-Paket verfügbar.

## Hinweise

- Die Android-App wird aktuell als Debug-APK veröffentlicht. Bis ein dauerhaftes privates Signatur-Schlüsselpaar eingerichtet ist, kann ein direktes Update eine Deinstallation der vorherigen Version erfordern.
- Externe Webseiten können das Einbetten ihrer Inhalte blockieren.
- Nicht alle Chrome-Erweiterungen sind mit GeckoView kompatibel.
