# Schleim OS | Das offizielle Browser-Betriebssystem von Schnecke Schneck · Version 3.4.1

Manifest-V3-Erweiterung für Chromium-Browser. Die Erweiterung ersetzt den neuen Tab durch die Schleim OS-Oberfläche.

## Funktionen

- App-Startbildschirm mit fest eingebauten Apps und eigenen Website-Apps
- Werbefreie Extension-Oberfläche ohne Werbe-IFrames
- Kein Werbe-URL-Aufruf, keine Werbeprüfung und keine Werbe-Start-Sperre
- Freies Umordnen sämtlicher Homescreen-Kacheln per Ziehen (Desktop und Touch)
- Persistente Reihenfolge in `ssos-personalization-v1.homeOrder`; JSON-Export/Import sichert und restauriert diese Reihenfolge
- App-Editor, HEX-Akzentfarbe, Wallpaper, Sperrbildschirm und JSON-Backup
- Deutsch, Englisch und Niederländisch

## Installation

1. ZIP vollständig entpacken.
2. Chrome öffnen und `chrome://extensions` eingeben.
3. Entwicklermodus einschalten.
4. **Entpackte Erweiterung laden** wählen und den Ordner `schleim-os-browser-extension` öffnen, in dem `manifest.json` liegt.
5. Einen neuen Tab öffnen.

Die ZIP-Datei wird nicht direkt als Extension installiert. Chrome für Android unterstützt reguläre Desktop-Chrome-Erweiterungen nicht; dort ist eine PWA bzw. ein kompatibler Browser erforderlich.

## Standalone-HTML

Die separate Datei `schleim-os-standalone.html` enthält Struktur, CSS, Übersetzungen und JavaScript eingebettet. Sie kann als eigenständige Besucheroberfläche geöffnet werden. Browser- bzw. Dateikontextbeschränkungen können einzelne Funktionen (z. B. optionale Website-Metadaten-Berechtigungen) einschränken. Auch die Standalone-Datei enthält keine Werbe-IFrames oder Werbe-Startprüfung.

## Hinweis zu den Rechtstexten

Die App zeigt einen lokalen Auszug der offiziellen Fan-Webseiten-Rechtstexte. Aussagen über Werbung in der kopierten Datenschutzerklärung beziehen sich auf die Fan-Webseite, nicht auf Werbeeinbindungen in dieser Extension.
