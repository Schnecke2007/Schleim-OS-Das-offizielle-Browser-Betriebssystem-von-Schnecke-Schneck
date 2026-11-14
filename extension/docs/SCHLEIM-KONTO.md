# Schleim-Konto, GitHub-App und Cloud-Sicherung

Das Schleim-Konto verwendet dein GitHub-Konto zur Anmeldung. Schleim OS fragt dein GitHub-Passwort nicht ab und speichert es nicht. Die Anmeldung läuft über die offizielle GitHub-Geräteautorisierung (Device Flow).

## 1. GitHub-App einrichten

Die GitHub-App **Schleim OS Account** ist bereits angelegt:

- [Schleim OS Account öffnen](https://github.com/apps/schleim-os-account)
- [GitHub-App-Einstellungen öffnen](https://github.com/settings/apps)

Damit auch andere Schleim-OS-Nutzer die App installieren können, muss die GitHub-App öffentlich (Public) sein. Aktiviere **Enable Device Flow**.

Benötigte App-Berechtigungen:

| Bereich | Berechtigung | Zugriff |
|---|---|---|
| Account permissions | Email addresses | Read-only |
| Repository permissions | Repository creation | Read and write |
| Repository permissions | Contents | Read and write |

Die E-Mail-Berechtigung wird verwendet, um die verifizierte primäre GitHub-E-Mail-Adresse zu prüfen. Repository creation erlaubt das Anlegen des privaten Backup-Repositorys. Contents erlaubt das Lesen und Schreiben der Sicherungsdatei.

## 2. Client-ID

Die öffentliche Client-ID der GitHub-App steht in `extension/scripts/schleim-account.js` in `GITHUB_APP_CLIENT_ID`.

Die Client-ID ist kein Passwort und kein App-Geheimnis. Ein GitHub-App-Client-Secret oder ein privater App-Schlüssel darf niemals in den Erweiterungscode geschrieben werden.

## 3. Anmeldung und Installation

Der Anmeldeablauf ist in Store und Einstellungen verfügbar:

1. Öffne den Schleim-Store oder **Einstellungen → Schleim-Konto**.
2. Wähle **Mit GitHub verbinden**.
3. Schleim OS öffnet zuerst die GitHub-App-Seite [Schleim OS Account](https://github.com/apps/schleim-os-account).
4. Installiere die App für dein GitHub-Konto. Kehre danach zu Schleim OS zurück und wähle **Ich habe die App installiert – weiter**.
5. Schleim OS fordert einen einmaligen Gerätecode an und zeigt ihn an.
6. Nach kurzer Verzögerung versucht Schleim OS, den Code automatisch in die Zwischenablage zu kopieren. Du kannst ihn auch über **Code kopieren** manuell kopieren.
7. Einige Sekunden später öffnet Schleim OS die GitHub-Gerätefreigabe. Der Link **GitHub-Gerätefreigabe öffnen** bleibt ebenfalls sichtbar.
8. Gib den Gerätecode auf der echten GitHub-Seite ein und bestätige die App **Schleim OS Account**.
9. Nach der Autorisierung prüft Schleim OS über die GitHub-API, ob die App-Installation dem angemeldeten Konto zugeordnet ist. Wird sie noch nicht angezeigt, wartet Schleim OS bis zu fünf Minuten und prüft erneut.
10. Danach wird das private Repository `schleim-os-cloud` gesucht oder erstellt.

**Wichtige technische Grenze:** Vor der ersten OAuth-/Geräteautorisierung hat Schleim OS noch kein GitHub-App-Benutzertoken. Deshalb kann es die Installationsliste nicht schon vor dem ersten Gerätecode per API abfragen. Der Ablauf öffnet zuerst die App-Seite und bittet dich um die Bestätigung, dass du sie installiert hast. Die automatische GitHub-Prüfung erfolgt nach der Geräteautorisierung. GitHub dokumentiert den Endpunkt [List app installations accessible to the user access token](https://docs.github.com/en/rest/apps/installations?apiVersion=2026-03-10).

Wenn die Zwischenablage nicht verfügbar ist, bleibt der Code sichtbar und kann manuell kopiert werden. Auch die Links zum erneuten Öffnen der GitHub-App und der Gerätefreigabe bleiben verfügbar.

## 4. Store-Zugriff

Der Schleim-Store ist nur mit einem angemeldeten Schleim-Konto verfügbar. Ohne Anmeldung sind Katalog, Suche, Bewertungen, Installationen, Deinstallationen und Vorschläge gesperrt. Nach einer erfolgreichen Anmeldung wird der Store freigeschaltet. Beim Abmelden wird er wieder gesperrt.

Die Sperre gilt für die Store-Oberfläche in Schleim OS. Die Katalog- und Bewertungsdateien im öffentlichen GitHub-Repository bleiben direkt auf GitHub sichtbar.

## 5. Cloud-Sicherung und Wiederherstellung

Die Sicherung befindet sich ausschließlich unter **Einstellungen → Schleim-Konto**. Im Schleim-Store gibt es keine Sicherungs- oder Wiederherstellungsbuttons.

- **Jetzt in der Cloud sichern:** Erstellt oder aktualisiert `schleim-os-backup.json` im privaten Repository `schleim-os-cloud`.
- **Cloud-Sicherung wiederherstellen:** Lädt die Sicherung herunter und ersetzt damit die lokalen Schleim-OS-Einstellungen. Vorher erscheint eine Bestätigung.

Das aktuelle Backup verwendet **Formatversion 2**. Es umfasst die gespeicherten Schleim-OS-Einstellungen mit dem Präfix `ssos-` und enthält zusätzlich ausdrücklich diese Designangaben:

- Reihenfolge der App-Kacheln auf dem Startbildschirm
- installierte Store-Apps
- ausgewähltes System-Hintergrundbild
- eigenes Hintergrundbild: Bilddaten und/oder Bild-URL

Die eigentlichen Bilddaten eines eigenen Hintergrundbilds werden in den Personalisierungsdaten mitgesichert. Die Sicherung wird manuell gestartet. Es gibt keine automatische Synchronisierung nach jeder Änderung.

Backups im älteren Format 1 können weiterhin wiederhergestellt werden. Die frühere lokale JSON-Import-/Export-Oberfläche ist nicht mehr Bestandteil der aktuellen Erweiterung.

## 6. Sicherheit und Abmeldung

- Das Repository `schleim-os-cloud` muss privat bleiben. Schleim OS verweigert das Speichern, wenn das Repository öffentlich ist.
- GitHub-Passwörter und Zugriffstokens werden nicht in die Backup-Datei geschrieben.
- Zugriffstokens werden lokal in den Erweiterungsdaten gespeichert, damit die Anmeldung über Browser-Neustarts hinweg bestehen bleiben und bei Bedarf erneuert werden kann.
- **Abmelden** entfernt die lokal gespeicherte Schleim-Konto-Sitzung. Dadurch wird die App-Berechtigung bei GitHub nicht automatisch widerrufen.
- Um den Zugriff vollständig zu beenden, widerrufe die App zusätzlich in deinen GitHub-Einstellungen unter **Settings → Applications**.

## Weiterführende Dokumentation

- [Hauptdokumentation](../../docs/README.md)
- [Installationsanleitung](../../docs/Deutsch/INSTALLATION.md)
- [Technische Hinweise](TECHNICAL-NOTES.md)
