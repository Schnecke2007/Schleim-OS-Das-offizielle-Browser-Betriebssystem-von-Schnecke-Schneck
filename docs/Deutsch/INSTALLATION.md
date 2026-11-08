# 📥 Schleim OS – Installationsanleitung

Diese Anleitung beschreibt die Installation der Schleim-OS-Browser-Erweiterung in kompatiblen Chromium-Browsern auf Android und Desktop.

## 1. Das vollständige GitHub-Repository herunterladen

1. Öffne das [Schleim-OS-GitHub-Repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck).
2. Klicke oben auf die grüne Schaltfläche **Code**.
3. Wähle **Download ZIP**.
4. Speichere das ZIP-Archiv auf deinem Gerät.

Lade auf diesem Weg das **gesamte Repository** herunter. Die Browser-Erweiterung befindet sich darin im Unterordner `extension`. Du musst das Archiv zunächst **nicht** entpacken, wenn dein Browser den direkten ZIP-Import unterstützt.

## 2. ZIP-Datei direkt im Browser installieren (Android und Desktop)

Einige unterstützte Chromium-Browser bieten in ihrer Erweiterungsverwaltung eine Funktion zum Importieren einer ZIP-Datei an. Das funktioniert auf Android oder Desktop, sofern der jeweilige Browser diese Importfunktion bereitstellt.

1. Öffne die Erweiterungsverwaltung deines Browsers.
2. Aktiviere bei Bedarf den **Entwicklermodus**.
3. Tippe oder klicke auf die Import-/Installationsschaltfläche für Dateien. Sie kann beispielsweise **„From .zip/.crx/.user.js“**, **„Aus ZIP-Datei installieren“** oder ähnlich heißen.
4. Wähle das zuvor heruntergeladene **vollständige GitHub-Repository-ZIP** aus. Du musst die ZIP-Datei dafür nicht vorher entpacken.
5. Der Browser sollte Schleim OS im Unterordner `extension` erkennen. Folge den angezeigten Schritten und bestätige die Installation.

> 💡 **Tipp:** Wähle beim ZIP-Import das vollständige Repository-Archiv aus – nicht nur einzelne Dateien. Die genaue Bezeichnung und Position der Import-Schaltfläche kann je nach Browser und Gerät variieren.

> ⚠️ **Hinweis:** Nicht jeder Chromium-Browser unterstützt den direkten ZIP-Import. Wenn dein Browser keine entsprechende Schaltfläche anbietet, verwende die folgende alternative Installationsmethode.

## 3. Alternative: Installation über „Entpackte Erweiterung laden“

Diese Methode ist für Browser gedacht, die keinen direkten ZIP-Import anbieten, aber das Laden eines lokalen Erweiterungsordners unterstützen.

1. Entpacke das zuvor heruntergeladene vollständige GitHub-ZIP-Archiv.
2. Öffne den entpackten Repository-Ordner.
3. Öffne darin den Unterordner **`extension`**. In genau diesem Ordner liegt die Datei `manifest.json`.
4. Öffne die Erweiterungsverwaltung deines Browsers und aktiviere den **Entwicklermodus**.
5. Wähle **„Entpackte Erweiterung laden“** bzw. **„Load unpacked“**.
6. Wähle den Ordner **`extension`** aus – nicht den übergeordneten Repository-Ordner.
7. Öffne einen neuen Tab. Schleim OS sollte jetzt starten. 🎉

### Google Chrome, Microsoft Edge und Brave

- **Google Chrome:** Öffne `chrome://extensions`.
- **Microsoft Edge:** Öffne `edge://extensions`.
- **Brave:** Öffne `brave://extensions`.

Aktiviere den Entwicklermodus und verwende anschließend **„Entpackte Erweiterung laden“** bzw. **„Load unpacked“**. Wähle dabei den zuvor entpackten Ordner `extension` mit der darin liegenden Datei `manifest.json` aus.

## 4. Nach der Installation

Öffne einen neuen Browser-Tab. Wenn Schleim OS nicht erscheint, prüfe die Erweiterungsverwaltung und folge der [Fehlerbehebung](FEHLERBEHEBUNG.md).

---

[🇬🇧 English installation guide](../Englisch/INSTALLATION.md) · [🇳🇱 Nederlandse installatiehandleiding](../Niederländisch/INSTALLATIE.md)
