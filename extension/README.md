# Schleim OS | Das offizielle Browser-Betriebssystem von Schnecke Schneck 🐌

**Version 3.4.1 · Chrome-/Chromium-Erweiterung**

**Manifest V3 · Chromium · werbefreie Extension-Oberfläche · frei sortierbarer Homescreen**

## Installation

1. Dieses Paket vollständig entpacken.
2. In Chrome `chrome://extensions` öffnen.
3. **Entwicklermodus** einschalten.
4. **Entpackte Erweiterung laden** anklicken und den Ordner `schleim-os-browser-extension` auswählen.
5. Einen neuen Tab öffnen.

## Dateien

- `manifest.json` – Manifest V3 und Neuer-Tab-Override
- `pages/newtab.html` – Extension-Oberfläche
- `scripts/app.js` – Apps, Navigation und Rechtliches
- `scripts/personalization.js` – Personalisierung, App-Editor, JSON-Backup und Icon-Anordnung
- `styles/` – Design und Personalisierung
- `locales/` – Rechtstext-Übersetzungen
- `assets/icons/` – App-Symbole
- `docs/` – Installation und Release-Notizen
- `standalone/schleim-os-standalone.html` – komplette Einzel-HTML-Datei

## App-Kacheln anordnen

Auf dem Desktop eine Kachel mit der Maus ziehen. Auf Touchgeräten die Kachel kurz gedrückt halten und an eine andere Position ziehen. Die Reihenfolge wird automatisch in `ssos-personalization-v1.homeOrder` gespeichert und beim vorhandenen JSON-Export in der Datei mitgesichert.

## Werbung

Die Chrome-Erweiterung lädt keine Werbeanzeigen. Es gibt keine Werbe-IFrames, keine Werbe-URL, keine Werbe-Erreichbarkeitsprüfung und keine Start-Sperre wegen Werbung. Die Extension benötigt keine Hostberechtigung für eine Werbedomain.

**Hinweis zu den Rechtstexten:** Die App enthält weiterhin die von der offiziellen Fan-Webseite übernommenen Rechtstexte. Der darin enthaltene Abschnitt über Werbung beschreibt die Datenschutzinformationen der Fan-Webseite selbst und keine Werbeeinbindung dieser Chrome-Erweiterung.

## Speicherung

Eine Browseranwendung darf ohne ausdrückliche Nutzeraktion keine beliebige lokale JSON-Datei stillschweigend überschreiben. Die App speichert die Anordnung automatisch im lokalen Browserprofil und nimmt sie beim JSON-Export mit.
