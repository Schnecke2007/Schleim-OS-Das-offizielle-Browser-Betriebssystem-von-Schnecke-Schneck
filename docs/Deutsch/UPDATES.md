# Schleim OS aktualisieren

Das Update-Center in Schleim OS lädt die Original-Extension direkt aus dem neuesten [GitHub-Release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest). Du musst die Release-Seite zum Herunterladen nicht selbst öffnen.

## Update herunterladen

1. Öffne in Schleim OS **Einstellungen → Schleim OS aktualisieren**.
2. Wähle **Nach Updates suchen**.
3. Wenn eine neuere Version verfügbar ist, wähle **Original-Extension-ZIP herunterladen**.
4. Der Browser lädt **Schleim-OS-Extension.zip** direkt aus dem neuesten Release herunter. Alternativ kannst du [die Original-Extension direkt aus Releases herunterladen](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip).

## Update im Browser installieren

1. **Entpacke die ZIP-Datei nicht.** Die Datei muss unverändert bleiben.
2. Öffne die Erweiterungsverwaltung eines Browsers, der lokale ZIP-Erweiterungen importieren kann.
3. Aktiviere bei Bedarf den Entwicklermodus.
4. Wähle **+ (from .zip/.crx/.user.js)** oder die entsprechende Import-Funktion deines Browsers.
5. Wähle die heruntergeladene **Schleim-OS-Extension.zip** aus.
6. Bestätige den Import beziehungsweise das Update im Browser.

Der Download wird von Schleim OS gestartet. Die Installation wird aus Sicherheitsgründen nicht automatisch ausgeführt: Den ZIP-Import und die anschließende Bestätigung musst du selbst anstoßen.

## Browser-Unterstützung

Diese Anleitung ohne Entpacken gilt für Browser, deren Erweiterungsverwaltung einen lokalen ZIP-Import anbietet. Normales Google Chrome für Android unterstützt keine Erweiterungen. Desktop-Chrome bietet keinen direkten ZIP-Import; dort lädt **Entpackte Erweiterung laden** einen Ordner. Ein Browser ohne ZIP-Import kann die ZIP-Datei nicht auf diesem Weg installieren.

## Wichtige Hinweise

- Der Versions-Check liest die Version aus `extension/manifest.json` im GitHub-Hauptzweig. Codeänderungen ohne Erhöhung der Versionsnummer werden nicht als neues Update erkannt.
- Vor einer neuen Original-Extension-Veröffentlichung muss die Version in `extension/manifest.json` erhöht und eine passende Release-Notes-Datei angelegt werden.
- Das Update-Center lädt nur das öffentliche Original-Extension-ZIP. Es erhält keine GitHub-Anmeldedaten.
- Die Browser-Bestätigung bleibt manuell. Ein Download allein installiert das Update nicht.
- Falls du Schleim OS vollständig entfernst und lokale Einstellungen verlierst, kannst du sie über **Einstellungen → Schleim-Konto** aus deinem privaten Cloud-Backup wiederherstellen.

[Zur GitHub-Releases-Seite](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) · [Installationsanleitung](INSTALLATION.md) · [Leichte Sprache](../Leichte-Sprache/Deutsch/UPDATES.md)
