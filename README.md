# Schleim OS 🐌

**Das offizielle Browser-Betriebssystem von Schnecke Schneck.** Eine eigene, anpassbare Startseite für deinen Browser – mit App-Kacheln, persönlichen Einstellungen und einer Oberfläche, die sich an Smartphone, Tablet und Desktop anpasst.

[🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md)

![Version](https://img.shields.io/badge/version-3.4.1-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

## Was ist Schleim OS?

Schleim OS ist eine Browser-Erweiterung, die den normalen neuen Tab durch eine eigene Oberfläche ersetzt. Statt einer leeren oder standardmäßigen Tab-Seite öffnet sich ein persönlicher Startbildschirm mit Apps und Verknüpfungen.

Das Projekt ist kein eigenständiges Betriebssystem, das Windows, Android oder Linux ersetzt. Es läuft innerhalb eines kompatiblen Browsers und nutzt dessen Erweiterungsfunktionen.

## Funktionen

- Eigene Neuer-Tab-Seite für Chrome und kompatible Chromium-Browser
- Startbildschirm mit Apps und Website-Verknüpfungen
- App-Kacheln per Drag-and-drop neu anordnen
- Personalisierung von Design, Akzentfarbe und Hintergrund
- App-Editor und lokale JSON-Sicherung bzw. Wiederherstellung
- Mehrsprachige Oberfläche: Deutsch, Englisch und Niederländisch
- Separate Standalone-HTML-Datei im Projektpaket
- Werbefreie Erweiterungsoberfläche

## Installation

### Google Chrome

1. Lade das ZIP-Paket über den Bereich **Releases** herunter (oder verwende das Projektpaket aus diesem Repository).
2. Entpacke die ZIP-Datei vollständig.
3. Öffne in Chrome die Adresse `chrome://extensions`.
4. Aktiviere oben rechts den **Entwicklermodus**.
5. Klicke auf **Entpackte Erweiterung laden**.
6. Wähle den Ordner `schleim-os-browser-extension` aus – direkt darin muss die Datei `manifest.json` liegen.
7. Öffne einen neuen Tab. Schleim OS sollte jetzt angezeigt werden.

### Microsoft Edge und Brave

- Edge: `edge://extensions` öffnen.
- Brave: `brave://extensions` öffnen.
- Entwicklermodus einschalten, **Entpackt laden** auswählen und denselben Erweiterungsordner mit der `manifest.json` öffnen.

> Die ZIP-Datei wird nicht direkt als Erweiterung installiert. Sie muss vorher entpackt werden.

## Bedienung und Einstellungen

- **Apps starten:** Eine Kachel auf dem Startbildschirm auswählen.
- **Kacheln sortieren:** Eine Kachel mit der Maus ziehen. Auf Touchgeräten die Kachel gedrückt halten und verschieben.
- **Personalisieren:** Den Einstellungs- bzw. App-Editor in der Oberfläche öffnen.
- **Sicherung:** Die angebotene JSON-Funktion verwenden, um persönliche Einstellungen zu exportieren oder wieder einzulesen.

Persönliche Einstellungen werden lokal im Browserprofil gespeichert. Das JSON-Backup sollte an einem sicheren Ort aufbewahrt werden.

## Fehlerbehebung

| Problem | Mögliche Lösung |
|---|---|
| Schleim OS erscheint nicht in einem neuen Tab | Prüfen, ob die Erweiterung aktiviert ist und der richtige Ordner mit `manifest.json` geladen wurde. |
| Chrome meldet ein ungültiges Manifest | ZIP erneut vollständig entpacken und den Ordner auswählen, in dem `manifest.json` direkt liegt. |
| Eine andere Neuer-Tab-Erweiterung ist aktiv | Die andere Erweiterung vorübergehend deaktivieren. Mehrere Erweiterungen können dieselbe Tab-Seite nicht gleichzeitig ersetzen. |
| Änderungen werden nicht angezeigt | Unter `chrome://extensions` bei Schleim OS auf **Aktualisieren** klicken und einen neuen Tab öffnen. |
| Eine externe Website oder Einbettung bleibt leer | Internetverbindung prüfen. Manche Anbieter blockieren das Einbetten in andere Seiten. |
| Einstellungen sind nach einem Browserwechsel weg | Das Browserprofil ist lokal. Das JSON-Backup im alten Browser exportieren und im neuen Browser importieren. |
| Installation auf Android funktioniert nicht | Chrome für Android unterstützt keine regulären Desktop-Chrome-Erweiterungen. Dafür ist eine separate PWA oder ein Browser mit Erweiterungsunterstützung nötig. |

## Projektstruktur

```text
schleim-os-browser-extension/
├── manifest.json
├── pages/
│   └── newtab.html
├── scripts/
│   ├── app.js
│   └── personalization.js
├── styles/
│   ├── main.css
│   └── personalization.css
├── locales/
│   └── legal-translations.js
├── assets/
│   └── icons/
├── docs/
├── standalone/
│   └── schleim-os-standalone.html
└── README.md
```

## Datenschutz und Berechtigungen

Schleim OS speichert Oberflächen- und Personalisierungseinstellungen lokal im Browserprofil. Die Erweiterung verwendet die in `manifest.json` aufgeführten Berechtigungen. Externe Apps und Websites können beim Öffnen eine Verbindung zu ihren jeweiligen Anbietern herstellen; deren Datenschutzbestimmungen gelten zusätzlich.

Die Erweiterungsoberfläche enthält keine Werbe-IFrames, keine Werbe-Erreichbarkeitsprüfung und keine werbebedingte Start-Sperre. Aussagen zu Werbung in übernommenen Rechtstexten beziehen sich auf die dort beschriebene Website und nicht auf eine Werbeeinbindung in der Extension.

## Hinweise

- Schleim OS ersetzt die Neuer-Tab-Seite, nicht die gesamte Browseroberfläche.
- Inkognito-Fenster können eigene Einschränkungen haben.
- Google Chrome für Android unterstützt keine normalen Desktop-Erweiterungen.
- Externe Inhalte benötigen gegebenenfalls eine Internetverbindung.

## Sprachen und Dokumentation

- [Deutsch – Hauptdokumentation](README.md)
- [English – documentation](README.en.md)
- [Nederlands – documentatie](README.nl.md)
- [Installationsanleitung](docs/INSTALLATION.md)
- [Technische Hinweise](docs/TECHNICAL-NOTES.md)

---

**Schleim OS** wird von **Schnecke Schneck** entwickelt und gepflegt.

© 2026 Schnecke Schneck.
