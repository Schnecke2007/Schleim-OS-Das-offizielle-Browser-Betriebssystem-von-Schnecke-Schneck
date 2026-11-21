# Schleim OS 3.17.0 – Kontextmenü, Drucken und Erweiterungen

Schleim Browser erhält neue Browserfunktionen für Android. Die Browser-Extension für Chromium bleibt weiterhin separat verfügbar.

## Neu in Schleim Browser

- **Kontextmenü per langem Drücken:** Halte einen Link, ein Bild, ein Video oder eine Audiodatei gedrückt, um passende Browseraktionen zu öffnen.
- **Links:** In neuem Tab öffnen, herunterladen oder die Adresse kopieren.
- **Dateien und Medien:** Bilder, Videos und Audiodateien öffnen, herunterladen oder ihre Adresse kopieren, sofern die Webseite eine direkte HTTP(S)-Quelle bereitstellt.
- **Drucken:** Die aktuelle Webseite kann über das Browser-Menü oder das Kontextmenü an das Android-Drucksystem übergeben werden. Dort kannst du einen Drucker auswählen oder die Seite als PDF speichern.
- **Erweiterungen öffnen:** Bei Add-ons mit einer hinterlegten Optionsseite erscheint im Erweiterungsmanager ein zusätzlicher Button „Öffnen“. Die integrierte Schleim-OS-Erweiterung führt über diesen Button zur Schleim-OS-Startseite.

## Release-Downloads

- Schleim-OS-Extension.zip: normale Browser-Extension.
- Schleim-Browser-Android-0.1.0-alpha23.apk: Android-Browser.
- Browser-OS-Extension-Template.zip: neutrales Extension-Template.
- Schleim-Browser-Android-Studio-Template.zip: neutrales Android-Studio-Projekt.
- Schleim-OS-SHA256SUMS.txt: SHA-256-Prüfsummen der Release-Dateien.

## Hinweise und bekannte Grenzen

- Der Download von Links und Medien setzt eine direkte HTTP(S)-Adresse voraus. Geschützte, dynamische oder blob-basierte Inhalte sowie Streaming-/DRM-Inhalte können Einschränkungen haben.
- Ein „Öffnen“-Button für Erweiterungen wird nur angezeigt, wenn das Add-on eine Optionsseite bereitstellt oder es sich um die integrierte Schleim-OS-Erweiterung handelt.
- Android 8.0 oder neuer und ein 64-Bit-ARM-Gerät (arm64-v8a) werden benötigt.
- Kamera- und Mikrofonaufnahme bleiben in der Android-App deaktiviert.
- Die APK ist ein Debug-Build. Aufgrund unterschiedlicher Signaturen kann ein Update gegebenenfalls erst nach Deinstallation der vorherigen Version installiert werden.

## Versionsinformationen

- Schleim OS Extension: **3.17.0**
- Schleim Browser: **0.1.0-alpha23**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android-Anleitung](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
