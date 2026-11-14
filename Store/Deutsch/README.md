# Schleim-Store – Anleitung auf Deutsch

Der Schleim-Store ist der App-Katalog von Schleim OS. Er enthält Webseiten und Web-Apps, die du als Kacheln auf deinem Startbildschirm installieren kannst. Die App wird in einem neuen Browser-Tab geöffnet.

## Zugriff und Anmeldung

Der Store in der Browser-Erweiterung ist nur mit einem angemeldeten **Schleim-Konto** verfügbar. Ohne Anmeldung bleiben Katalog, Suche, Bewertungen, Installation, Deinstallation und Vorschläge gesperrt.

1. Öffne den Schleim-Store und wähle **Mit GitHub verbinden**.
2. Schleim OS öffnet die GitHub-App-Seite [Schleim OS Account](https://github.com/apps/schleim-os-account).
3. Installiere die App in deinem GitHub-Konto.
4. Kehre zu Schleim OS zurück und wähle **Ich habe die App installiert – weiter**.
5. Schleim OS zeigt einen einmaligen Gerätecode. Nach kurzer Verzögerung versucht Schleim OS, den Code automatisch zu kopieren.
6. Die GitHub-Gerätefreigabe öffnet sich danach automatisch. Du kannst den Code auch manuell kopieren und den sichtbaren Link zur Gerätefreigabe verwenden.
7. Gib den Code direkt auf GitHub ein und bestätige **Schleim OS Account**.
8. Nach der Autorisierung prüft Schleim OS, ob GitHub die App-Installation erkannt hat. Die Prüfung kann bis zu fünf Minuten dauern.

Schleim OS kann die GitHub-Installationsliste erst nach der Geräteautorisierung über die GitHub-API abfragen. Wenn die App nicht erkannt wird, kontrolliere, ob sie im selben GitHub-Konto installiert wurde, und starte den Ablauf erneut.

## Apps entdecken und installieren

- Nutze die Kategorien, Empfehlungen oder die Suche, um Apps zu finden.
- Wähle **Installieren**, um die App als Kachel zum Startbildschirm hinzuzufügen.
- Wähle **Öffnen**, um die Webseite in einem neuen Browser-Tab zu öffnen.
- Wähle **Deinstallieren**, um die Store-Kachel vom Startbildschirm zu entfernen.

Der Katalog enthält aktuell 15 Einträge in neun Kategorien:

| Kategorie | Beispiele |
|---|---|
| KI & Chatbots | ChatGPT, Claude |
| Kommunikation | WhatsApp Web |
| Wissen | Google, Wikipedia |
| Medien | Deezer, Instagram, Spotify, TikTok, YouTube |
| Navigation | Google Maps |
| Suche & Datenschutz | DuckDuckGo |
| Produktivität | Google Drive |
| Shopping & Online-Shops | Amazon |
| Tools | NextDNS |

Die vollständigen Kategorien und JSON-App-Dateien findest du im [öffentlichen Katalog](../README.md).

## Bewertungen und App-Vorschläge

- Über die Sterne öffnest du ein Bewertungsformular auf GitHub.
- Du kannst zusätzlich einen kurzen Feedbacktext eintragen.
- Dein GitHub-Benutzername, deine Bewertung und dein Feedback sind öffentlich sichtbar.
- GitHub Actions speichert Bewertungen als JSON und aktualisiert die angezeigten Durchschnittswerte.
- App-Vorschläge werden als GitHub-Issue eingereicht und vor einer Veröffentlichung geprüft. Ein Vorschlag erscheint nicht automatisch im Store.

## Abmelden und Cloud-Sicherung

Beim Abmelden wird der Schleim-Store wieder gesperrt. Store-Kacheln werden auf dem Startbildschirm ausgeblendet und nach der nächsten Anmeldung wieder angezeigt. Eigene Webseiten, die unabhängig vom Store hinzugefügt wurden, bleiben erhalten.

**Die Cloud-Sicherung gehört nicht zum Store.** Du findest sie ausschließlich unter **Einstellungen → Schleim-Konto**. Dort kannst du sie manuell speichern oder wiederherstellen. Das Backup-Format 2 umfasst die gespeicherten Schleim-OS-Einstellungen, die Reihenfolge der Apps, installierte Store-Apps und das Hintergrundbild. Es gibt keine automatische Synchronisierung nach jeder Änderung.

## Öffentlichkeit und Datenschutz

Die Dateien in diesem GitHub-Repository sind öffentlich. Die Anmeldung schützt die Store-Oberfläche innerhalb von Schleim OS, nicht den Katalog auf GitHub. Reiche keine Passwörter, Tokens oder privaten Daten als App-Vorschlag oder Feedback ein.

Weiterführende Dokumentation: [Schleim-Konto und Cloud-Sicherung](../../extension/docs/SCHLEIM-KONTO.md) · [Leichte Sprache](../../docs/Leichte-Sprache/Deutsch/SCHLEIM-STORE.md) · [Englische Store-Anleitung](../Englisch/README.md) · [Nederlandse Store-handleiding](../Niederländisch/README.md)
