# Sprachdateien und Übersetzungen

Schleim OS unterstützt Deutsch, Englisch und Niederländisch. Die Übersetzungen liegen derzeit an mehreren Stellen:

- `scripts/app.js` enthält die Beschriftungen der Hauptoberfläche, Apps und Navigation.
- `scripts/personalization.js` enthält Übersetzungen für Personalisierung, Schleim-Store, Bewertungen, App-Vorschläge und Store-Sperrhinweise.
- `scripts/schleim-account.js` enthält Übersetzungen für Anmeldung, GitHub-App-Installation, Gerätecode, Cloud-Backup und Wiederherstellung.
- `scripts/slime-store-admin.js` enthält die Texte für das Admin-Portal und seine Formulare.
- `scripts/update-center.js` enthält die übersetzten Texte für die GitHub-Versionsprüfung und den ZIP-Download.
- `scripts/slime-store-admin.js` enthält Texte für das Store-Admin-Portal.
- `locales/legal-translations.js` enthält die lokal eingebundenen Rechtstext-Übersetzungen.

Die Oberfläche nutzt also nicht ausschließlich Dateien in diesem Ordner. Wenn neue Funktionen hinzukommen, müssen die Sprachwörterbücher in den jeweils zuständigen JavaScript-Dateien für **de**, **en** und **nl** aktualisiert werden.

## Leichte Sprache

Die leicht verständlichen Anleitungen sind getrennt von den UI-Übersetzungen unter `docs/Leichte-Sprache/` abgelegt:

- `Deutsch/`
- `Englisch/`
- `Niederländisch/`

Dort gibt es Installations-, Hilfe-, Technik-, Konto- und Cloud-Backup-Texte. Die Store-Anleitung steht jeweils in `SCHLEIM-STORE.md`.

Die drei Store-Anleitungen in normaler Sprache liegen unter `Store/Deutsch/`, `Store/Englisch/` und `Store/Niederländisch/`. Die allgemeine Konto- und Cloud-Dokumentation liegt unter `docs/Deutsch/`, `docs/Englisch/` und `docs/Niederländisch/`; die deutsche Hauptreferenz ist `extension/docs/SCHLEIM-KONTO.md`.

## Externe Inhalte

Extern gerenderte Provider-Inhalte (Wix, Google Sites, CodePen, Websim, Social Media) sind aufgrund der Same-Origin-Policy nicht direkt durch die Host-Seite übersetzbar. Die App kann dafür einen Google-Translate-Link anzeigen.
