# Schleim OS 3.18.0 – Browser-Kontextmenü, Drucken und Erweiterungen

## Schleim Browser für Android

- Das native Android-Kontextmenü öffnet sich durch langes Drücken auf Links, Bilder, Videos oder Audio-Elemente.
- Links und direkte HTTP(S)-Medienquellen können geöffnet, in einem neuen Tab geöffnet, heruntergeladen oder als Adresse kopiert werden.
- Das Kontextmenü enthält jetzt **Seite drucken**. Zusätzlich steht Drucken im Browser-Menü zur Verfügung und öffnet das Android-Drucksystem.
- Im Erweiterungsmanager können Add-ons mit einer verfügbaren Optionsseite oder geeigneten Homepage direkt über **Öffnen** gestartet werden. Die integrierte Schleim-OS-Extension öffnet ihre Startseite.
- Aktivieren, Deaktivieren und Entfernen von installierten XPI-Add-ons bleiben verfügbar.

## Grenzen

- Downloads geschützter, blob-basierter, dynamisch generierter oder DRM-geschützter Inhalte können von der Quelle verhindert werden.
- Für den Druck wird die Android-Druckfunktion verwendet. Ob ein physischer Drucker verfügbar ist, hängt vom Android-Gerät und den installierten Druckdiensten ab.
- Die Android-App bleibt eine GeckoView-App. Chrome-CRX-Dateien werden nicht unterstützt; kompatible, Mozilla-signierte XPI-Dateien können installiert werden.
- Kamera- und Mikrofonaufnahmen sind in der Android-App deaktiviert. Die ursprüngliche Chromium-Extension behält ihre separate JavaScript-Webkamera.

## Versionen

- Chromium-Extension: **3.18.0**
- Schleim Browser für Android: **0.1.0-alpha24**
- Mozilla GeckoView · Android 8.0+ · ARM64
