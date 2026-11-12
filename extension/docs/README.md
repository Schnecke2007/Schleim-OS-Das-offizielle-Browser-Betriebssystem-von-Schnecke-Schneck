# Schleim OS | Das offizielle Browser-Betriebssystem von Schnecke Schneck · Version 3.8.0

Manifest-V3-Erweiterung für Chromium-Browser. Die Erweiterung ersetzt den neuen Tab durch die Schleim OS-Oberfläche.

## Funktionen

- App-Startbildschirm mit fest eingebauten Apps und eigenen Website-Apps
- Werbefreie Extension-Oberfläche ohne Werbe-IFrames
- Kein Werbe-URL-Aufruf, keine Werbeprüfung und keine Werbe-Start-Sperre
- Freies Umordnen sämtlicher Homescreen-Kacheln per Ziehen (Desktop und Touch)
- Persistente Reihenfolge in `ssos-personalization-v1.homeOrder`; die Personalisierung wird bei aktivierter Browser-Synchronisierung über das Browserprofil abgeglichen
- Schleim-Store mit Suche, Empfehlungen, App-Installation und Deinstallation; ohne GitHub-Anmeldung nutzbar
- HEX-Akzentfarbe, Wallpaper, Sperrbildschirm und automatische Browser-Cloud-Synchronisierung
- Deutsch, Englisch und Niederländisch

Schleim OS nutzt `chrome.storage.sync`, um die Personalisierung automatisch über das angemeldete Browserprofil zu synchronisieren. Eine GitHub-App oder Client-ID ist nicht erforderlich. Voraussetzung ist eine aktivierte Browser-Synchronisierung. Das Kontingent liegt bei ungefähr 100 KB; hochgeladene Bilddateien bleiben lokal. Details: [Browser-Cloud-Synchronisierung](../../docs/Deutsch/BROWSER-CLOUD-SYNC.md).

## Installation

1. Lade über GitHub mit **Code → Download ZIP** das vollständige Repository herunter.
2. Entpacke das ZIP-Archiv nicht.
3. Öffne die Erweiterungsverwaltung eines Chromium-Browsers mit ZIP-Import-Unterstützung.
4. Aktiviere bei Bedarf den Entwicklermodus.
5. Wähle **„From .zip/.crx/.user.js“** oder die entsprechende ZIP-Importfunktion.
6. Importiere die vollständige Repository-ZIP und bestätige die Installation.

Der Browser-Importer erkennt die Erweiterung im Unterordner `extension`. Die genaue Bezeichnung und Verfügbarkeit der Importfunktion hängt vom Browser und der Plattform ab. Chrome für Android unterstützt keine regulären Chrome-Erweiterungen; auf Android ist daher ein kompatibler Browser mit Erweiterungs- und ZIP-Import-Unterstützung erforderlich.

## Standalone-HTML

Die separate Datei `schleim-os-standalone.html` enthält Struktur, CSS, Übersetzungen und JavaScript eingebettet. Sie kann als eigenständige Besucheroberfläche geöffnet werden. Browser- bzw. Dateikontextbeschränkungen können einzelne Funktionen (z. B. optionale Website-Metadaten-Berechtigungen) einschränken. Auch die Standalone-Datei enthält keine Werbe-IFrames oder Werbe-Startprüfung.

## Hinweis zu den Rechtstexten

Die App zeigt einen lokalen Auszug der offiziellen Fan-Webseiten-Rechtstexte. Aussagen über Werbung in der kopierten Datenschutzerklärung beziehen sich auf die Fan-Webseite, nicht auf Werbeeinbindungen in dieser Extension.


## Leichte Sprache und Demo

[Schleim OS live ausprobieren](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html)

[Deutsch – Leichte Sprache](../../docs/Leichte-Sprache/Deutsch/README.md) · [English – plain language](../../docs/Leichte-Sprache/Englisch/README.md) · [Nederlands – eenvoudige taal](../../docs/Leichte-Sprache/Niederländisch/README.md)
