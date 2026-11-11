# Schleim-Store – Apps verwalten

Der Schleim-Store ist der zentrale App-Katalog von Schleim OS. Besucher können empfohlene Webseiten entdecken, suchen, bewerten sowie auf ihrem Startbildschirm installieren oder wieder deinstallieren.

## Öffentlicher App-Katalog

Die veröffentlichten Apps stehen in:

`extension/data/store-apps.json`

Die Erweiterung lädt diese Datei aus dem öffentlichen GitHub-Repository. Falls die Netzwerkverbindung oder GitHub nicht erreichbar ist, verwendet sie den eingebauten Fallback-Katalog.

Jeder Eintrag benötigt eine eindeutige App-ID, einen Namen, eine HTTP-/HTTPS-Adresse sowie eine Beschreibung in Deutsch, Englisch und Niederländisch. Zusätzlich kann ein Eintrag Kategorie, Icon, Icon-URL, Suchbegriffe, Veröffentlichungsdatum und die Empfehlung-Kennzeichnung enthalten.

Beispiel:

```json
{
  "id": "beispiel-web",
  "name": "Beispiel",
  "icon": "🌐",
  "url": "https://example.com/",
  "category": "tools",
  "addedAt": "2026-11-11",
  "featured": true,
  "tags": "beispiel web app werkzeug",
  "description": {
    "de": "Kurze deutsche Beschreibung.",
    "en": "Short English description.",
    "nl": "Korte Nederlandse beschrijving."
  }
}
```

## Kategorie-Verzeichnis im Repository

Neben dem Laufzeitkatalog gibt es den öffentlichen Ordner [Store](../../Store/README.md). Dort werden freigegebene Apps übersichtlich nach Kategorie abgelegt:

| Kategorie | Ordner |
|---|---|
| Tools | `Store/tools/` |
| KI & Chatbots | `Store/ai/` |
| Medien | `Store/media/` |
| Wissen | `Store/knowledge/` |
| Navigation | `Store/navigation/` |
| Produktivität | `Store/productivity/` |
| Kommunikation | `Store/communication/` |
| Suche & Datenschutz | `Store/privacy/` |

Jede Kategorie besitzt eine `README.md` mit den veröffentlichten Apps. Jede einzelne App wird zusätzlich als eigene JSON-Datei gespeichert, zum Beispiel `Store/ai/chatgpt-web.json`.

Bei einer Genehmigung aktualisiert das Admin-Portal in einem gemeinsamen Git-Commit:

1. den zentralen Laufzeitkatalog `extension/data/store-apps.json`,
2. die JSON-Datei der App im passenden Kategorieordner,
3. die README der betroffenen Kategorie,
4. die Übersicht `Store/README.md`.

Wird eine bestehende App in eine andere Kategorie verschoben, entfernt die Veröffentlichung die alte Kategorie-Datei und aktualisiert beide Kategorie-Übersichten. Die Laufzeit-Erweiterung liest weiterhin den zentralen Katalog; die Kategorieordner dienen der transparenten Ablage und einfachen manuellen Übersicht.

## Community-Vorschläge

Besucher können im Schleim-Store eine Webseite mit Name, URL, Kategorie, Beschreibung und optionalem Icon vorschlagen. Das Formular öffnet ein vorbereitetes GitHub-Issue. Der Nutzer muss die Einreichung auf GitHub selbst abschicken.

Ein Vorschlag erscheint **nicht automatisch** im Store. Er wird erst nach Prüfung durch den Admin veröffentlicht.

## Admin-Portal einrichten

Die Anleitung mit den Schritten zum Erstellen des Fine-grained GitHub-Tokens, zum Erzeugen der verschlüsselten Admin-JSON-Datei und zum Prüfen und Veröffentlichen von Vorschlägen findest du hier:

[Admin-Zugang und Veröffentlichung](../admin/README.md)

Das Admin-Portal verwendet eine lokal gespeicherte, verschlüsselte JSON-Datei. Der Token wird mit AES-256-GCM verschlüsselt und beim Anmelden nur im Arbeitsspeicher der geöffneten Seite gehalten. Für die GitHub-API sind nur Repository-Zugriff sowie **Contents: Read and write** und **Issues: Read and write** vorgesehen.

**Wichtig:** Das Portal ist ein clientseitiges Admin-Werkzeug und kein serverseitiges Rollen- oder Zugriffssystem. Die Admin-Datei und ihre Passphrase müssen getrennt und sicher aufbewahrt werden.

## Öffentlichkeit und Datenschutz

Das Schleim-OS-Repository ist öffentlich. Deshalb sind der Katalog, die Kategorie-Dateien, die Einreichungsvorlage und eingereichte GitHub-Issues öffentlich einsehbar. Einreichungen können den GitHub-Benutzernamen des Absenders und alle in den Text geschriebenen Angaben enthalten. Keine Passwörter, privaten Kontaktdaten oder vertraulichen Inhalte in App-Vorschläge schreiben.

Das Admin-Portal und sein Quellcode sind ebenfalls öffentlich sichtbar. Die Admin-Datei und die Passphrase sind jedoch private Zugangsdaten und dürfen nicht ins Repository hochgeladen werden. Die lokale `.gitignore` schützt nur die dort ausdrücklich aufgeführten Dateinamen; kontrolliere vor jedem Commit auch manuell, dass keine andere Token- oder Schlüsseldatei enthalten ist.

## Installationen, Bewertungen und System-Apps

- Installierte Store-Apps werden lokal im Browser unter `ssos-store-v1` gespeichert.
- Bewertungen sind persönliche Bewertungen auf diesem Gerät, keine globalen Community-Bewertungen.
- Eine Installation fügt eine Website-Kachel zum Startbildschirm hinzu. Die Website wird beim Öffnen in einem neuen Browser-Tab geladen.
- Beim Deinstallieren wird nur die betreffende Store-Kachel entfernt.
- Eingebaute System-Apps und feste Schleim-OS-Inhalte befinden sich nicht im Store-Katalog und können über den Store nicht deinstalliert werden.
- Bereits vorhandene eigene Webseiten werden unter „Bisherige eigene Webseiten“ angezeigt und können dort einzeln entfernt werden.

## Standalone-Demo aktuell halten

Die Erweiterung verwendet Dateien unter `extension/scripts/` und `extension/styles/`. Die Standalone-Demo enthält eingebettete Kopien dieser Dateien in `extension/standalone/schleim-os-standalone.html`.

Wenn du den Store-Code oder sein Design änderst, müssen die eingebetteten Abschnitte der Standalone-Datei ebenfalls aktualisiert werden. Sonst können Erweiterung und Demo unterschiedliche Funktionen zeigen.
