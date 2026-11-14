# Schleim-Store – öffentlicher App-Katalog 🐌

Dieses Verzeichnis enthält die freigegebenen Apps des Schleim-Stores. Jede App besitzt eine eigene JSON-Datei im jeweiligen Kategorieordner.

## Kategorien

| Kategorie | Ordner | Apps |
|---|---|---:|
| [Tools](./tools/README.md) | tools | 1 |
| [KI & Chatbots](./ai/README.md) | ai | 2 |
| [Medien](./media/README.md) | media | 5 |
| [Wissen](./knowledge/README.md) | knowledge | 2 |
| [Navigation](./navigation/README.md) | navigation | 1 |
| [Produktivität](./productivity/README.md) | productivity | 1 |
| [Kommunikation](./communication/README.md) | communication | 1 |
| [Suche & Datenschutz](./privacy/README.md) | privacy | 1 |
| [Shopping & Online-Shops](./shopping/README.md) | shopping | 1 |
| **Gesamt** | | **15** |

## Store-Zugriff in Schleim OS

Der Schleim-Store innerhalb der Browser-Erweiterung ist nur nach Anmeldung mit einem **Schleim-Konto** verfügbar. Ohne Anmeldung bleiben Katalog, Suche, Bewertungen, Installationen, Deinstallationen und App-Vorschläge gesperrt.

Beim ersten Anmelden öffnet Schleim OS die GitHub-App-Seite [Schleim OS Account](https://github.com/apps/schleim-os-account). Installiere die App für dein GitHub-Konto und bestätige danach in Schleim OS den nächsten Schritt. Der Gerätecode wird angezeigt. Nach kurzer Verzögerung versucht Schleim OS, ihn automatisch zu kopieren; manuelles Kopieren bleibt möglich. Danach öffnet sich die GitHub-Gerätefreigabe. Nach der Autorisierung prüft Schleim OS, ob GitHub die App-Installation erkannt hat. Die Prüfung kann bis zu fünf Minuten dauern.

**Die Cloud-Sicherung gehört nicht zum Store.** Sie ist ausschließlich unter **Einstellungen → Schleim-Konto** verfügbar und wird manuell gestartet. Es gibt keine automatische Synchronisierung nach jeder Änderung.

## App-Vorschläge und Veröffentlichung

- App-Vorschläge werden als GitHub-Issue eingereicht.
- Schnecke Schneck prüft die Vorschläge.
- Erst nach Freigabe wird eine App in diesem Verzeichnis veröffentlicht.
- Der Laufzeitkatalog der Erweiterung liegt zusätzlich in `extension/data/store-apps.json`.
- Bewertungsdaten werden im Ordner `Bewertungen/` als JSON gespeichert und durch GitHub Actions in `extension/data/store-ratings.json` zusammengefasst.

## Öffentlichkeit und Datenschutz

Dieses Verzeichnis und seine Dateien sind Teil eines öffentlichen GitHub-Repositories. Die Anmeldung schützt die Store-Oberfläche in Schleim OS, nicht die Dateien hier auf GitHub. App-Namen, URLs, Kategorien, Beschreibungen, Bewertungen und eingereichte GitHub-Issues können öffentlich eingesehen werden. Lege hier keine Tokens, Passwörter, privaten Daten oder vertraulichen Inhalte ab.

## Store-Anleitungen in drei Sprachen

- [Deutsch – Store-Anleitung](./Deutsch/README.md)
- [English – Store guide](./Englisch/README.md)
- [Nederlands – Store-handleiding](./Niederländisch/README.md)

Die Anleitungen erklären Anmeldung, Installation, Bewertungen, Vorschläge, Abmeldung und den Ort der Cloud-Sicherung.

## Store in Leichter Sprache

- [Deutsch – Leichte Sprache](../docs/Leichte-Sprache/Deutsch/SCHLEIM-STORE.md)
- [English – plain language](../docs/Leichte-Sprache/Englisch/SCHLEIM-STORE.md)
- [Nederlands – eenvoudige taal](../docs/Leichte-Sprache/Niederländisch/SCHLEIM-STORE.md)
