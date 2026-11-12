# Schleim OS | Das offizielle Browser-Betriebssystem von Schnecke Schneck 🐌

**Version 3.7.0 · Chrome-/Chromium-Erweiterung**

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
- `scripts/github-cloud.js` – GitHub-Anmeldung, Cloud-Sicherung und Wiederherstellung
- `scripts/background.js` – Fünf-Minuten-Sicherung über den Manifest-V3-Hintergrunddienst
- `data/store-apps.json` – zentraler Store-Katalog
- `styles/` – Design und Personalisierung
- `locales/` – Rechtstext-Übersetzungen
- `assets/icons/` – App-Symbole
- `docs/` – Installation und Release-Notizen
- `standalone/schleim-os-standalone.html` – komplette Einzel-HTML-Datei

## App-Kacheln anordnen

Auf dem Desktop eine Kachel mit der Maus ziehen. Auf Touchgeräten die Kachel kurz gedrückt halten und an eine andere Position ziehen. Die Reihenfolge wird im Browserprofil gespeichert und nach der GitHub-Anmeldung in die private Cloud-Sicherung übernommen.

## Werbung

Die Chrome-Erweiterung lädt keine Werbeanzeigen. Es gibt keine Werbe-IFrames, keine Werbe-URL, keine Werbe-Erreichbarkeitsprüfung und keine Start-Sperre wegen Werbung. Die Extension benötigt keine Hostberechtigung für eine Werbedomain.

**Hinweis zu den Rechtstexten:** Die App enthält weiterhin die von der offiziellen Fan-Webseite übernommenen Rechtstexte. Der darin enthaltene Abschnitt über Werbung beschreibt die Datenschutzinformationen der Fan-Webseite selbst und keine Werbeeinbindung dieser Chrome-Erweiterung.

## Speicherung

Schleim OS benötigt einen lokalen Arbeitsstand, damit der Startbildschirm im Browser angezeigt und bedient werden kann. Nach der GitHub-Anmeldung wird der vollständige Personalisierungsstand sofort und anschließend alle fünf Minuten im privaten GitHub-Repository gesichert. Der Hintergrunddienst übernimmt die regelmäßigen Sicherungen auch dann, wenn die Neuer-Tab-Seite nicht geöffnet ist, solange der Browser läuft. Die GitHub-Verbindung bleibt im geschützten Erweiterungsspeicher erhalten, damit die automatische Sicherung nach einem Browserneustart weiterlaufen kann. Der Token ist damit lokal im Erweiterungsprofil gespeichert; die Sicherungsdatei selbst liegt im privaten GitHub-Repository.
