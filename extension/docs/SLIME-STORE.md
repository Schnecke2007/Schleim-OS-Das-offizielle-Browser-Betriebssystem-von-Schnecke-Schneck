# Slime Store – Apps verwalten

Der Slime Store ist der App-Katalog von Schleim OS. Er zeigt kuratierte Web-Apps, die Besucherinnen und Besucher auf ihrem eigenen Startbildschirm installieren können.

## Eine App zum Store hinzufügen

Der Katalog befindet sich in `extension/scripts/personalization.js` in der Konstanten `STORE_CATALOG`.

Füge dort ein neues Objekt hinzu. Beispiel:

```js
{
  id: 'beispiel-web',
  name: 'Beispiel',
  icon: '🌐',
  url: 'https://example.com/',
  category: 'tools',
  addedAt: '2026-11-11',
  featured: true,
  tags: 'beispiel web app werkzeug',
  description: {
    de: 'Kurze deutsche Beschreibung.',
    en: 'Short English description.',
    nl: 'Korte Nederlandse beschrijving.'
  }
}
```

Wichtige Felder:

- `id`: Eindeutige Kennung. Sie darf im Katalog nur einmal vorkommen.
- `name`: Name der App.
- `icon`: Emoji oder kurzes Symbol.
- `url`: Zieladresse der Website. Verwende eine vertrauenswürdige HTTP- oder HTTPS-Adresse.
- `category`: Eine der Kategorien `tools`, `ai`, `media`, `knowledge`, `navigation`, `productivity`, `communication` oder `privacy`.
- `addedAt`: Veröffentlichungsdatum im Format `YYYY-MM-DD`. Neuere Daten erscheinen weiter oben unter „Neu im Store“.
- `featured`: Bei `true` wird die App in den Empfehlungen angezeigt.
- `tags`: Zusätzliche Suchbegriffe.
- `description`: Beschreibung in Deutsch, Englisch und Niederländisch.

## Vorschläge aus der Community

Besucher senden App-Vorschläge über das Formular im Slime Store. Dadurch wird das GitHub-Issue-Formular `.github/ISSUE_TEMPLATE/app-submission.yml` mit den Angaben vorausgefüllt.

Die Einsendung wird **nicht automatisch veröffentlicht**. Prüfe zuerst die Website, den Inhalt, die Sicherheit, die Datenschutzbedingungen und die Eignung. Übernimm eine App erst danach manuell in `STORE_CATALOG`.

Wenn ein eigenes Icon als Datei ausgewählt wurde, muss es im geöffneten GitHub-Formular zusätzlich hochgeladen werden. Eine lokale Datei kann nicht automatisch an GitHub übergeben werden.

## Installationen, Bewertungen und System-Apps

- Installierte Store-Apps werden lokal im Browser unter `ssos-store-v1` gespeichert.
- Die Sternebewertungen sind persönliche Bewertungen auf diesem Gerät. Sie sind keine globalen Community-Bewertungen.
- Eine Installation fügt eine Website-Kachel zum Startbildschirm hinzu. Die Website wird beim Öffnen in einem neuen Browser-Tab geladen.
- Beim Deinstallieren wird nur die Store-Kachel entfernt.
- Eingebaute System-Apps und feste Schleim-OS-Inhalte gehören nicht zum Store-Katalog und können über den Store nicht deinstalliert werden.
- Bereits vorhandene eigene Webseiten werden im Store-Bereich „Bisherige eigene Webseiten“ verwaltet und können dort einzeln entfernt werden.

## Standalone-Demo aktuell halten

Die Erweiterung verwendet die Dateien unter `extension/scripts/` und `extension/styles/`. Die Standalone-Demo enthält eingebettete Kopien dieser Dateien in `extension/standalone/schleim-os-standalone.html`.

Wenn du den Store-Code oder sein Design änderst, müssen die eingebetteten Abschnitte der Standalone-Datei ebenfalls aktualisiert werden. Sonst können Erweiterung und Demo unterschiedliche Funktionen zeigen.
