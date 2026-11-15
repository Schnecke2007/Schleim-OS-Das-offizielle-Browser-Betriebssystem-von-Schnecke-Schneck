# Schleim OS aktualisieren

Im [GitHub-Releasebereich](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) findest du die aktuelle Version und beide Download-Pakete. Das Update-Center vergleicht die installierte Version mit der Version in `extension/manifest.json` auf GitHub und bietet den Download der einzelnen Extension an.

## Update herunterladen

1. Öffne in Schleim OS **Einstellungen → Schleim OS aktualisieren**.
2. Wähle **Nach Updates suchen**.
3. Wenn eine neuere Version verfügbar ist, wähle **Neueste ZIP-Version herunterladen**. Der Button lädt **Schleim-OS-Extension.zip** aus dem aktuellen Release.
4. Alternativ kannst du die [Extension direkt aus dem neuesten Release herunterladen](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip).

## Update im Browser abschließen

1. Entpacke die heruntergeladene ZIP-Datei.
2. Kopiere den Inhalt in denselben lokalen Ordner, in dem die bisherige Extension liegt, und überschreibe die vorhandenen Dateien.
3. Öffne die Erweiterungsverwaltung deines Browsers (`chrome://extensions` in Chrome).
4. Klicke bei Schleim OS auf **Neu laden**.
5. Öffne einen neuen Tab und prüfe im Update-Center die installierte Versionsnummer.

Verwende möglichst denselben Ordner wie bei der bisherigen Installation. Entferne die Erweiterung nicht, wenn du die bestehende lokale Installation weiterverwenden möchtest.

## Warum installiert der Button das Update nicht automatisch?

Chrome erlaubt einer Erweiterung nicht, eine beliebige ZIP-Datei aus dem Internet herunterzuladen und sich selbst damit still zu ersetzen. Der Download ist deshalb ein manueller Schritt. Die Erweiterungsverwaltung lädt die aktualisierten Dateien nach dem Klick auf **Neu laden**.

Automatische Updates außerhalb des Chrome Web Stores benötigen einen anderen Verteilungsweg: eine Update-URL mit XML-Update-Manifest und ein signiertes CRX-Paket. Das CRX muss mit demselben privaten Schlüssel signiert sein wie die bereits installierte Erweiterung. Chrome beschränkt selbst gehostete Installationen zusätzlich je nach Betriebssystem und Verwaltungsrichtlinie.

Offizielle Hinweise:
- [Chrome: Update-Lebenszyklus von Erweiterungen](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle)
- [Chrome: Erweiterungen verteilen](https://developer.chrome.com/docs/extensions/how-to/distribute)
- [Chrome: Selbst gehostete Erweiterungen unter Linux](https://developer.chrome.com/docs/extensions/how-to/distribute/host-on-linux)

## Wichtige Hinweise

- Der Versions-Check liest die Versionsnummer aus dem GitHub-Hauptzweig. Änderungen ohne Erhöhung der Versionsnummer werden nicht als neues Update erkannt.
- Vor jeder Veröffentlichung muss deshalb die Version in `extension/manifest.json` erhöht und eine passende Release-Notes-Datei angelegt werden.
- Das Update-Center lädt nur die öffentliche Extension-ZIP-Datei herunter. Es erhält keine GitHub-Anmeldedaten.
- Der Browser installiert das Update nicht still; das Neuladen erfolgt über die Erweiterungsverwaltung.
- Falls du Schleim OS entfernst und neu installierst und dadurch lokale Einstellungen verloren gehen, kannst du sie über **Einstellungen → Schleim-Konto** aus deinem privaten Cloud-Backup wiederherstellen.

[Zur GitHub-Releases-Seite](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) · [Installationsanleitung](INSTALLATION.md) · [Leichte Sprache](../Leichte-Sprache/Deutsch/UPDATES.md)
