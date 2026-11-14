# Technik einfach erklärt – Schleim OS

## Wo läuft Schleim OS?

Schleim OS läuft in einem Browser. Der Browser muss Erweiterungen unterstützen.

Schleim OS ist eine Erweiterung nach Manifest V3. Das ist eine technische Vorgabe für Browser-Erweiterungen.

## Was passiert bei einem neuen Tab?

Der Browser öffnet die Datei `pages/newtab.html`. Diese Datei zeigt die Startseite von Schleim OS.

## Welche Dateien gibt es?

- `pages/newtab.html`: Die Seite, die du siehst.
- `scripts/app.js`: Viele Funktionen der Oberfläche.
- `scripts/personalization.js`: Einstellungen und persönliche Anpassungen.
- `scripts/schleim-account.js`: GitHub-Anmeldung und Cloud-Sicherung.
- `scripts/slime-store-admin.js`: Verwaltung der Store-Vorschläge.
- `styles/main.css`: Das Aussehen der Seite.
- `styles/personalization.css`: Das Aussehen der persönlichen Einstellungen.
- `locales/legal-translations.js`: Übersetzungen von Rechtstexten.
- `standalone/schleim-os-standalone.html`: Eine einzelne HTML-Demo-Datei.

## Wo werden Einstellungen gespeichert?

Die Einstellungen werden im Browser-Profil gespeichert. Das ist der Bereich des Browsers für deine Daten und Einstellungen.

Du kannst deine Einstellungen mit deinem Schleim-Konto in einer privaten GitHub-Cloud sichern. Die Sicherung startest du unter **Einstellungen → Schleim-Konto**.

Die Sicherung enthält auch die Reihenfolge der Apps, installierte Store-Apps und dein Hintergrundbild.

Die Sicherung wird manuell gestartet. Sie wird nicht nach jeder Änderung automatisch gespeichert.

Die aktuelle Sicherung hat das Format 2. Ältere Sicherungen im Format 1 können noch wiederhergestellt werden.

Der Schleim-Store braucht eine Anmeldung mit dem Schleim-Konto.

## Internet und Rechte

Einige Inhalte kommen von anderen Webseiten. Dafür brauchst du Internet.
Manche Webseiten erlauben keine Anzeige in einem anderen Fenster.

Der Browser kann nach Rechten fragen. Lies solche Fragen genau durch.

[Technische Hinweise in normaler Sprache](../../Deutsch/TECHNISCHE-HINWEISE.md) · [Schleim-Store einfach erklärt](SCHLEIM-STORE.md) · [Konto und Cloud-Sicherung](KONTO-CLOUD.md)