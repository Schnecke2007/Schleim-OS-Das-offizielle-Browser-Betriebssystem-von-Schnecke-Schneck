# Schleim OS | Das offizielle Browser-Betriebssystem von Schnecke Schneck 🐌

**Version 3.9.1 · Chrome-/Chromium-Erweiterung**

**Manifest V3 · Chromium · werbefreie Extension-Oberfläche · frei sortierbarer Homescreen**

## Installation

1. Lade das vollständige Repository über GitHub mit **Code → Download ZIP** herunter.
2. Entpacke die ZIP-Datei nicht.
3. Öffne die Erweiterungsverwaltung eines Chromium-Browsers, der ZIP-Import unterstützt.
4. Aktiviere bei Bedarf den Entwicklermodus.
5. Wähle **„From .zip/.crx/.user.js“** oder die entsprechende ZIP-Importfunktion.
6. Wähle die vollständige Repository-ZIP aus und bestätige den Import.

Der Browser muss die Erweiterung im Unterordner `extension` erkennen können. Die Importfunktion ist je nach Browser und Gerät unterschiedlich. Chrome für Android unterstützt keine normalen Chrome-Erweiterungen.

[Schleim OS live ausprobieren](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) · [Installation in Leichter Sprache](../docs/Leichte-Sprache/Deutsch/INSTALLATION.md)

## Dateien

- `manifest.json` – Manifest V3 und Neuer-Tab-Override
- `pages/newtab.html` – Extension-Oberfläche
- `scripts/app.js` – Apps, Navigation und Rechtliches
- `scripts/personalization.js` – Store-Oberfläche, Personalisierung und Kachel-Anordnung
- `scripts/slime-store-admin.js` – separates Admin-Portal zum Prüfen und Veröffentlichen von Store-Vorschlägen
- JSON-Backup – manuelles Exportieren und Importieren der Personalisierung über die Einstellungen
- `data/store-apps.json` und `data/store-ratings.json` – Store-Katalog und Community-Bewertungen
- `styles/` – Design, Personalisierung und Admin-Portal
- `locales/` – Rechtstext-Übersetzungen
- `assets/icons/` – App-Symbole
- `docs/` – Installation und Release-Notizen
- `standalone/schleim-os-standalone.html` – komplette Einzel-HTML-Datei

## App-Kacheln anordnen

Auf dem Desktop eine Kachel mit der Maus ziehen. Auf Touchgeräten die Kachel kurz gedrückt halten und an eine andere Position ziehen. Die Reihenfolge wird lokal gespeichert und beim manuellen JSON-Export in der Sicherungsdatei mitgespeichert.

## Werbung

Die Chrome-Erweiterung lädt keine Werbeanzeigen. Es gibt keine Werbe-IFrames, keine Werbe-URL, keine Werbe-Erreichbarkeitsprüfung und keine Start-Sperre wegen Werbung. Die Extension benötigt keine Hostberechtigung für eine Werbedomain.

**Hinweis zu den Rechtstexten:** Die App enthält weiterhin die von der offiziellen Fan-Webseite übernommenen Rechtstexte. Der darin enthaltene Abschnitt über Werbung beschreibt die Datenschutzinformationen der Fan-Webseite selbst und keine Werbeeinbindung dieser Chrome-Erweiterung.

## Speicherung

Schleim OS speichert die Personalisierungsdaten lokal im Browserprofil. Im Einstellungsbereich kannst du den Homescreen als JSON-Datei exportieren und diese Datei später wieder importieren. Es gibt keine automatische Cloud- oder Browser-Synchronisierung. Eine Anleitung findest du unter [JSON-Backup](../docs/Deutsch/JSON-BACKUP.md).
