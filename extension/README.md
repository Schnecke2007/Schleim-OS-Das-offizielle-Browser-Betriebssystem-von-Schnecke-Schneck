# Schleim OS | Das offizielle Browser-Betriebssystem von Schnecke Schneck

**Version 3.11.0 · Chromium-Erweiterung · Manifest V3**

Schleim OS ersetzt den normalen neuen Tab durch einen anpassbaren Startbildschirm mit App-Kacheln.

## Installation

1. Lade das vollständige Repository über GitHub mit **Code → Download ZIP** herunter.
2. Entpacke die ZIP-Datei nicht.
3. Öffne die Erweiterungsverwaltung eines Chromium-Browsers, der den direkten ZIP-Import unterstützt.
4. Aktiviere bei Bedarf den Entwicklermodus.
5. Wähle die ZIP-Importfunktion, zum Beispiel **„From .zip/.crx/.user.js“**.
6. Wähle die vollständige Repository-ZIP aus und bestätige den Import.
7. Öffne einen neuen Tab.

Der Browser muss die Erweiterung im Unterordner `extension` erkennen. Die Importfunktion unterscheidet sich je nach Browser und Plattform. Chrome für Android unterstützt keine normalen Chrome-Erweiterungen.

[Schleim OS live ausprobieren](https://raw.githack.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) · [Installationsanleitung in Leichter Sprache](../docs/Leichte-Sprache/Deutsch/INSTALLATION.md)

## Funktionen

- Homescreen mit fest eingebauten Apps und eigenen Website-Kacheln
- Kacheln per Maus oder Touch neu anordnen
- Personalisierung von Akzentfarbe, Hintergrund und Sperrbildschirm
- Schleim-Store mit Kategorien, Suche, Empfehlungen, Bewertungen und App-Vorschlägen
- Store-Zugriff nur nach Anmeldung mit einem Schleim-Konto
- GitHub-App-Anmeldung mit Installationsprüfung und Gerätecode
- Manuelle Cloud-Sicherung und Wiederherstellung ausschließlich unter **Einstellungen → Schleim-Konto**
- Backup-Format 2 mit App-Reihenfolge, installierten Store-Apps und Hintergrundbild
- Benutzeroberfläche auf Deutsch, Englisch und Niederländisch
- Werbefreie Erweiterungsoberfläche

## Projektdateien

- `manifest.json` – Manifest V3, Neuer-Tab-Override und Berechtigungen
- `pages/newtab.html` – Erweiterungsoberfläche
- `scripts/app.js` – Apps, Navigation und Oberfläche
- `scripts/personalization.js` – Personalisierung, Store-Oberfläche und Homescreen-Reihenfolge
- `scripts/schleim-account.js` – GitHub-App-Anmeldung, Installationserkennung und Cloud-Sicherung
- `scripts/slime-store-admin.js` – Admin-Portal zum Prüfen und Veröffentlichen von Store-Vorschlägen
- `data/store-apps.json` und `data/store-ratings.json` – Laufzeitkatalog und Bewertungsstatistik
- `styles/` – Oberflächen-, Personalisierungs- und Admin-Styles
- `locales/legal-translations.js` – zusätzliche Übersetzungen der Rechtstexte
- `docs/` – technische Dokumentation, Installation und Kontoeinrichtung
- `standalone/schleim-os-standalone.html` – separate Demo als Einzeldatei

Die Benutzeroberfläche verwendet Sprachwörterbücher in den JavaScript-Dateien. Die Sprachdateien für Rechtstexte liegen separat unter `locales/`.

## Schleim-Store und Anmeldung

Der Schleim-Store bleibt gesperrt, solange kein Schleim-Konto angemeldet ist. Ohne Anmeldung werden Store-Katalog, Bewertungen, Installation, Deinstallation und Vorschläge nicht angezeigt. Nach der Anmeldung wird der Store freigeschaltet. Beim Abmelden wird er wieder gesperrt.

Die Store-Katalog- und Bewertungsdateien im öffentlichen GitHub-Repository bleiben direkt auf GitHub sichtbar. Die Anmeldung schützt die Store-Oberfläche, nicht die Repository-Dateien.

## Cloud-Sicherung

Die Cloud-Sicherung befindet sich ausschließlich unter **Einstellungen → Schleim-Konto**. Im Store gibt es keine Sicherungs- oder Wiederherstellungssteuerung.

Das Backup wird manuell in das private Repository `schleim-os-cloud` geschrieben. Es enthält die gespeicherten Schleim-OS-Einstellungen sowie ausdrücklich die Startbildschirm-Reihenfolge, installierte Store-Apps und das Hintergrundbild. Es findet keine automatische Synchronisierung nach jeder Änderung statt.

Anleitung: [Schleim-Konto und Cloud-Sicherung](docs/SCHLEIM-KONTO.md).

## App-Kacheln anordnen

Auf dem Desktop eine Kachel mit der Maus ziehen. Auf Touchgeräten eine Kachel kurz gedrückt halten und an eine andere Position ziehen. Die Reihenfolge wird lokal gespeichert und in der Cloud-Sicherung mitgespeichert.

## Werbung und externe Verbindungen

Die Erweiterungsoberfläche enthält keine Werbe-IFrames und keine Werbe-Startprüfung. Externe Apps und Websites können Netzwerkverbindungen herstellen, wenn du sie öffnest.

**Hinweis zu den Rechtstexten:** Die App zeigt lokale Auszüge der Rechtstexte der offiziellen Fan-Webseite. Aussagen über Werbung in diesen Rechtstexten beziehen sich auf die Fan-Webseite, nicht auf Werbeeinbindungen in der Erweiterung.
