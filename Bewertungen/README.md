# Community-Bewertungen des Schleim Stores

In diesem Ordner wird jede eingereichte Schleim-Store-Bewertung als eigene JSON-Datei gespeichert. Der Dateiname entspricht der GitHub-Issue-Nummer, zum Beispiel `5.json`.

## Gespeicherte Angaben

Jede Datei enthält:

- `issueNumber` und `issueUrl`: zugehöriges öffentliches GitHub-Issue
- `appId` und `appName`: bewertete Store-App
- `githubUsername`: GitHub-Benutzername des Issue-Autors, automatisch von GitHub übernommen
- `rating`: Sternebewertung von 1 bis 5
- `feedback`: optionaler Freitext der bewertenden Person
- `submittedAt` und `updatedAt`: Zeitpunkte der Einreichung und letzten Bearbeitung

## Ablauf

1. Eine Person wählt im Schleim Store eine Sternebewertung und kann optional Feedback ergänzen.
2. Die Person reicht das vorbereitete Bewertungs-Issue auf GitHub ein.
3. GitHub Actions prüft die App-ID und Sternezahl, speichert die Daten hier als JSON und aktualisiert `extension/data/store-ratings.json`.
4. Erst nach erfolgreicher Speicherung und Berechnung wird das Issue automatisch geschlossen.
5. Pro GitHub-Konto und App zählt für den Durchschnitt die zuletzt eingereichte Bewertung.

## Antworten des Entwicklers

Bewertungs-Issues bleiben öffentlich. Der Entwickler kann sie über den Admin-Bereich im Schleim Store wieder öffnen und mit einem öffentlichen GitHub-Kommentar beantworten. Eine Wiederöffnung durch den Entwickler wird nicht automatisch erneut geschlossen.

**Öffentlichkeit:** Dieser Ordner ist Teil eines öffentlichen GitHub-Repositories. GitHub-Benutzernamen, Sternebewertungen und eingegebenes Feedback sind öffentlich sichtbar. Keine vertraulichen Daten eintragen.
