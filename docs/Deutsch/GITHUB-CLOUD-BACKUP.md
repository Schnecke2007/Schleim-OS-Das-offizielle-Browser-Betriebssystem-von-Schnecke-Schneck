# GitHub-Cloud-Sicherung für Schleim OS

Die Cloud-Sicherung legt eine Kopie des persönlichen Schleim-OS-Startbildschirms in einem **privaten Repository deines eigenen GitHub-Kontos** ab. Nach der Anmeldung wird sofort gesichert. Danach aktualisiert der Manifest-V3-Hintergrunddienst die Sicherung alle fünf Minuten, solange der Browser läuft.

## Was wird gesichert?

Gesichert werden die Personalisierungsdaten mit dem Präfix `ssos-`, darunter die Startbildschirm-Anordnung, eigene Website-Apps, installierte Store-Apps, Design, Akzentfarbe, Hintergrund und weitere Schleim-OS-Einstellungen.

Der Browser benötigt weiterhin einen lokalen Arbeitsstand, damit die Oberfläche direkt angezeigt und bedient werden kann. Die GitHub-Datei ist die zusätzliche private Sicherungskopie. GitHub-Anmeldetokens werden nur in der temporären Browser-Sitzung gespeichert und nicht in das Repository geschrieben.

## Einmalige Einrichtung

### 1. GitHub App anlegen

1. Öffne [GitHub Developer Settings](https://github.com/settings/apps) und wähle **New GitHub App**.
2. Vergib einen Namen, zum Beispiel **Schleim OS Cloud Backup**, und trage eine passende Homepage-URL ein.
3. Aktiviere in den App-Einstellungen den **Device Flow**.
4. Setze unter **Repository permissions**:
   - **Contents:** Read and write
   - **Metadata:** Read-only
5. Speichere die App und kopiere ihre **Client ID**. Nicht die App-ID und nicht ein Client Secret verwenden.

Der Device Flow muss ausdrücklich eingeschaltet sein. Gib einen Gerätecode ausschließlich auf der echten GitHub-Seite [github.com/login/device](https://github.com/login/device) ein und kontrolliere vor der Freigabe den angezeigten App-Namen.

### 2. Privates Backup-Repository erstellen

1. Erstelle in deinem GitHub-Konto ein neues Repository, zum Beispiel `schleim-os-cloud-backup`.
2. Stelle die Sichtbarkeit ausdrücklich auf **Private**.
3. Installiere deine GitHub App auf genau diesem Repository. Wähle nicht pauschal alle Repositorys aus.

Die Erweiterung prüft, ob das Repository privat ist und dem angemeldeten GitHub-Konto gehört. Ein öffentliches oder fremdes Repository wird abgelehnt.

### 3. Schleim OS verbinden

1. Installiere und öffne die Schleim-OS-Erweiterung.
2. Öffne den Schleim-Store oder die GitHub-Cloud-Einstellungen.
3. Trage die **Client ID** deiner GitHub App ein.
4. Trage den Namen deines privaten Backup-Repositorys ein. Standardmäßig lautet er `schleim-os-cloud-backup`.
5. Wähle **Mit GitHub anmelden**.
6. Öffne die angezeigte Geräteanmeldeseite und gib den Einmalcode auf [github.com/login/device](https://github.com/login/device) ein.
7. Prüfe den App-Namen und bestätige die Berechtigungsanfrage.

Nach erfolgreicher Anmeldung prüft Schleim OS das private Repository und erstellt sofort die erste Sicherung als `schleim-os-backup.json`.

## Automatische Aktualisierung

Die Neuer-Tab-Seite übergibt den aktuellen Personalisierungsstand regelmäßig an den Erweiterungs-Hintergrunddienst. Dieser hält die letzte Momentaufnahme in der temporären Browser-Sitzung und lädt sie anschließend alle fünf Minuten in das private GitHub-Repository hoch. Dadurch läuft der Fünf-Minuten-Takt weiter, auch wenn die Neuer-Tab-Seite geschlossen ist, solange der Browser geöffnet bleibt und die Erweiterung aktiv ist.

Wird der Computer ausgeschaltet oder der Browser vollständig beendet, kann in dieser Zeit keine neue Sicherung hochgeladen werden. Nach dem nächsten Browserstart ist aus Sicherheitsgründen eine erneute GitHub-Anmeldung erforderlich. Sobald du dich wieder anmeldest, wird der aktuelle lokale Arbeitsstand sofort gesichert. Eine vorhandene Cloud-Sicherung kann beim ersten Abgleich wiederhergestellt werden.

## Wiederherstellen

1. Installiere Schleim OS im gewünschten Browser.
2. Öffne die GitHub-Cloud-Einstellungen und melde dich mit dem GitHub-Konto an, das die private Sicherung enthält.
3. Wenn eine vorhandene Sicherung erkannt wird, kannst du sie beim ersten Abgleich übernehmen. Alternativ steht **Aus GitHub wiederherstellen** zur Verfügung.
4. Die Oberfläche wird nach dem Wiederherstellen neu geladen.

Beim Wiederherstellen werden die lokalen `ssos-`-Einstellungen durch die Werte aus dem Backup ersetzt. Bestätige den Vorgang nur, wenn du diesen Stand übernehmen möchtest.

## Sicherheit und Grenzen

- Das Backup-Repository muss privat sein und deinem angemeldeten GitHub-Konto gehören.
- Die GitHub App benötigt nur Repository-Zugriff auf das ausgewählte Backup-Repository sowie die genannten Repository-Berechtigungen.
- Access- und Refresh-Tokens werden in `chrome.storage.session` gehalten. Sie werden beim Beenden der Browser-Sitzung beziehungsweise beim Neuladen oder Aktualisieren der Erweiterung verworfen. Danach ist eine erneute Anmeldung erforderlich.
- Die GitHub-Client-ID ist öffentlich und darf im Einstellungsfeld stehen. Ein Client Secret, Access Token oder Refresh Token gehört niemals in den Quellcode, in ein öffentliches Repository oder in eine Issue-Meldung.
- Die Sicherungsdatei liegt in deinem privaten GitHub-Repository. GitHub verwaltet Änderungen an dieser Datei als Repository-Versionen.
- Der Hintergrunddienst arbeitet, solange der Browser läuft. Er kann einen ausgeschalteten Computer nicht starten und keine Sicherung hochladen, während der Browser beendet ist.

Weitere technische Informationen findest du in der [offiziellen GitHub-Dokumentation zum Device Flow](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app) und zur [Chrome-Alarms-API](https://developer.chrome.com/docs/extensions/reference/api/alarms).
