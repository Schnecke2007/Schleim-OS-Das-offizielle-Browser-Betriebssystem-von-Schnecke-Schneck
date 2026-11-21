# Schleim OS 3.18.0 – Kontextmenü, Drucken und Dateiaktionen

Schleim Browser erweitert die Android-Browserbedienung. Die ursprüngliche Chromium-Extension bleibt separat verfügbar und wird nicht durch die Android-App ersetzt.

## Neu und verbessert

- **Kontextmenü per langem Drücken:** Halte einen Link, ein Bild, ein Video oder eine Audiodatei gedrückt. Schleim Browser zeigt ein natives Android-Kontextmenü mit passenden Aktionen.
- **Links und Dateien herunterladen:** Links können geöffnet, in einem neuen Tab geöffnet, heruntergeladen oder als Adresse kopiert werden.
- **Medien herunterladen:** Bilder, Videos und Audiodateien können geöffnet, heruntergeladen oder als Adresse kopiert werden, wenn die Seite eine direkte HTTP(S)-Quelle bereitstellt.
- **Seite drucken:** Das Kontextmenü enthält jetzt zusätzlich **„Seite drucken“**. Die aktuelle Webseite kann außerdem über **Browser-Menü → Drucken** an das Android-Drucksystem übergeben werden. Dort lässt sich ein Drucker auswählen oder die Seite als PDF speichern.
- **Erweiterungen öffnen:** Im Erweiterungsmanager erscheint **„Öffnen“**, wenn ein Add-on eine Optionsseite oder geeignete Homepage bereitstellt. Die integrierte Schleim-OS-Extension öffnet die Schleim-OS-Startseite.
- **Erweiterungen verwalten:** Aktivieren, Deaktivieren und Entfernen bleiben im selben Erweiterungsbereich verfügbar.

## Downloads im Release

- **Schleim-OS-Extension.zip** – die ursprüngliche Browser-Extension.
- **Browser-OS-Extension-Template.zip** – ein neutrales Extension-Template.
- **Schleim-Browser-Android-0.1.0-alpha24.apk** – die eigenständige Android-App.
- **Schleim-Browser-Android-Studio-Template.zip** – das neutrale Android-Studio-Projekt.
- **Schleim-OS-SHA256SUMS.txt** – SHA-256-Prüfsummen der Release-Dateien.

## Hinweise und bekannte Grenzen

- Datei- und Medien-Downloads benötigen eine direkte HTTP(S)-Adresse. Geschützte, dynamisch erzeugte oder blob-basierte Inhalte sowie Streaming-/DRM-Inhalte können nicht immer als einzelne Datei heruntergeladen werden.
- Der Button **„Öffnen“** wird nur angezeigt, wenn ein Add-on eine Optionsseite oder eine geeignete Homepage bereitstellt. Nicht jede Erweiterung besitzt eine eigene Öffnungsseite.
- Schleim Browser unterstützt Mozilla-signierte XPI-Erweiterungen. Chrome-CRX-Dateien können in GeckoView nicht direkt installiert werden.
- Android 8.0 oder neuer und ein 64-Bit-ARM-Gerät (arm64-v8a) werden benötigt.
- Kamera- und Mikrofonaufnahme bleiben in der Android-App deaktiviert.
- Die APK ist ein Debug-Build. Aufgrund unterschiedlicher Signaturen kann ein Update gegebenenfalls erst nach Deinstallation der vorherigen Version installiert werden.

## Versionsinformationen

- Schleim OS Extension: **3.18.0**
- Schleim Browser: **0.1.0-alpha24**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android-Anleitung](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
