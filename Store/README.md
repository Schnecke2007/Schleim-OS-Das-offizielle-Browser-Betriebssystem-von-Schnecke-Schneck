# Schleim-Store – öffentlicher App-Katalog 🐌

Dieses Verzeichnis enthält die freigegebenen Apps, sortiert nach Kategorie. Jede App besitzt eine eigene JSON-Datei im jeweiligen Kategorieordner.

## Kategorien

| Kategorie | Ordner | Apps |
|---|---|---:|
| [Tools](./tools/README.md) | tools | 1 |
| [KI & Chatbots](./ai/README.md) | ai | 1 |
| [Medien](./media/README.md) | media | 4 |
| [Wissen](./knowledge/README.md) | knowledge | 1 |
| [Navigation](./navigation/README.md) | navigation | 1 |
| [Produktivität](./productivity/README.md) | productivity | 1 |
| [Kommunikation](./communication/README.md) | communication | 1 |
| [Suche & Datenschutz](./privacy/README.md) | privacy | 1 |
| [Shopping & Online-Shops](./shopping/README.md) | shopping | 1 |

## Wie die Ablage funktioniert

- Einreichungen werden zunächst als GitHub-Issue eingereicht und von Schnecke Schneck geprüft.
- Erst nach der Genehmigung wird eine App hier veröffentlicht.
- Die App wird automatisch unter Store/<category>/<app-id>.json abgelegt.
- Die jeweilige Kategorie-README und diese Übersicht werden bei jeder Veröffentlichung aktualisiert.
- Der Laufzeitkatalog der Browser-Erweiterung bleibt extension/data/store-apps.json; er wird zusammen mit den Kategorie-Dateien in einem Commit aktualisiert.

**Öffentlichkeit:** Alle Dateien in diesem Ordner sind öffentlich einsehbar. Die Store-Oberfläche innerhalb von Schleim OS setzt eine GitHub-Anmeldung voraus. Keine Tokens, Passwörter oder privaten Sicherungsdaten hier ablegen.
