# Schleim OS aktualisieren

Diese Anleitung gilt ab **Schleim OS 3.12.0**. In den Einstellungen gibt es ein Update-Center. Es prüft die Versionsnummer auf GitHub und bietet bei Bedarf den aktuellen Projekt-Download an.

## Nach der ersten Installation

Du musst das vollständige GitHub-Projekt nicht jedes Mal manuell suchen.

1. Öffne in Schleim OS **Einstellungen**.
2. Suche den Bereich **Schleim OS aktualisieren**.
3. Wähle **Nach Updates suchen**.
4. Schleim OS vergleicht die installierte Version mit der Version in `extension/manifest.json` im GitHub-Hauptzweig.
5. Wenn eine neuere Version gefunden wird, wähle **Neueste ZIP-Version herunterladen**.

## Update im Browser abschließen

Der Download ist noch keine Installation.

1. Öffne die Erweiterungsverwaltung deines Browsers.
2. Nutze den ZIP-Import oder die Aktualisierungsfunktion, die dein Browser für Erweiterungen anbietet.
3. Wähle die heruntergeladene vollständige Repository-ZIP aus.
4. Bestätige die Aktualisierung, wenn dein Browser danach fragt.
5. Lade Schleim OS neu oder öffne einen neuen Tab. Prüfe im Update-Center die installierte Versionsnummer.

**Wichtig:** Entpacke die ZIP-Datei nicht, wenn dein Browser denselben direkten ZIP-Import wie bei der Erstinstallation verwendet. Die genauen Schritte hängen vom Browser ab. Nicht jeder Chromium-Browser besitzt diese Importfunktion.

## Warum installiert der Button nicht automatisch?

Chrome erlaubt einer Erweiterung nicht, eine beliebige ZIP-Datei aus dem Internet herunterzuladen und sich selbst damit still zu ersetzen. Die Erweiterungs-API `chrome.runtime.requestUpdateCheck()` fragt den vom Browser eingerichteten Update-Kanal ab; sie installiert keine beliebige GitHub-ZIP-Datei.

Automatische Updates außerhalb des Chrome Web Stores benötigen einen anderen Verteilungsweg: eine Update-URL mit XML-Update-Manifest und ein signiertes CRX-Paket. Das CRX muss mit demselben privaten Schlüssel signiert sein wie die bereits installierte Erweiterung. Chrome beschränkt selbst gehostete Installationen zusätzlich je nach Betriebssystem und Verwaltungsrichtlinie.

Offizielle Hinweise:
- [Chrome: Update-Lebenszyklus von Erweiterungen](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle)
- [Chrome: Erweiterungen verteilen](https://developer.chrome.com/docs/extensions/how-to/distribute)
- [Chrome: Selbst gehostete Erweiterungen unter Linux](https://developer.chrome.com/docs/extensions/how-to/distribute/host-on-linux)

## Wichtige Hinweise

- Der Versions-Check liest die Versionsnummer aus dem GitHub-Hauptzweig. Änderungen ohne Erhöhung der Versionsnummer werden nicht als neues Update erkannt.
- Vor jeder Veröffentlichung muss deshalb die Version in `extension/manifest.json` erhöht werden.
- Das Update-Center lädt nur die öffentliche ZIP-Datei herunter. Es erhält keine GitHub-Anmeldedaten.
- Der Browser entscheidet über Installation, Ersetzung und Bestätigung.
- Falls du Schleim OS entfernst und neu installierst und dadurch lokale Einstellungen verloren gehen, kannst du sie über **Einstellungen → Schleim-Konto** aus deinem privaten Cloud-Backup wiederherstellen.

[Zur Dokumentationsübersicht](../README.md) · [Installationsanleitung](INSTALLATION.md) · [Leichte Sprache](../Leichte-Sprache/Deutsch/UPDATES.md)
