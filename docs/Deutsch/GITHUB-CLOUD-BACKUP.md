# GitHub-Cloud-Sicherung – Ein-Knopf-Verbindung

Nach der einmaligen Einrichtung durch den Projektbetreiber ist die Bedienung einfach: Du wählst in Schleim OS **Mit GitHub verbinden**, meldest dich bei GitHub an und bestätigst die Berechtigung. Schleim OS erstellt danach selbstständig ein privates Backup-Repository und schreibt die Sicherung hinein.

Du musst selbst kein Repository erstellen, keinen Repository-Namen eingeben und keine GitHub-App installieren.

## So läuft die Verbindung für Nutzer ab

1. Öffne in Schleim OS die **Einstellungen**.
2. Wähle **Mit GitHub verbinden**.
3. Schleim OS zeigt einen Gerätecode und einen Link zu GitHub an.
4. Öffne den Link `github.com/login/device`, gib den angezeigten Code ein und bestätige die GitHub-Berechtigung für Schleim OS.
5. Schleim OS erstellt automatisch ein privates Repository in deinem GitHub-Konto. Der Standardname lautet `schleim-os-cloud-backup`. Ist dieser Name bereits belegt, wird automatisch eine nummerierte Variante verwendet.
6. Der komplette aktuelle Personalisierungsstand wird sofort in `schleim-os-backup.json` geschrieben.

Danach aktualisiert der Hintergrunddienst die Sicherung planmäßig alle fünf Minuten. Du musst den Namen des Backup-Repositorys nicht kennen oder eintragen.

## Einmalige Einrichtung durch den Projektbetreiber

GitHub verlangt für Geräteanmeldungen eine registrierte GitHub App und eine öffentliche Client-ID. Diese Einrichtung betrifft nur den Betreiber des Schleim-OS-Projekts – nicht jeden einzelnen Nutzer.

1. Öffne [GitHub Developer Settings – GitHub Apps](https://github.com/settings/apps) und registriere einmalig eine GitHub App für Schleim OS.
2. Aktiviere unter **Identifying and authorizing users** den **Device Flow**.
3. Vergib die benötigten Berechtigungen:
   - **Repository permission – Repository creation: Write**
   - **Repository permission – Contents: Read and write**
4. Kopiere die **Client ID** der App. Die Client ID ist nicht die App-ID und nicht das Client Secret.
5. Trage die öffentliche Client ID einmalig in `GITHUB_APP_CLIENT_ID` in `extension/scripts/github-cloud.js` ein und veröffentliche die aktualisierte Erweiterung.

Die Berechtigung **Repository creation** ist die gezielte Berechtigung zum Erstellen von Repositorys. GitHub gibt der App automatisch Zugriff auf die Repositorys, die sie selbst erstellt. Die Contents-Berechtigung wird zum Schreiben der Sicherungsdatei verwendet.

**Wichtig:** Ein Client Secret oder ein Access-/Refresh-Token darf niemals in den Quellcode eingetragen werden. Nur die öffentliche Client ID gehört in die Erweiterung. Die Registrierung der GitHub App und das Eintragen dieser ID sind die einzigen projektweiten Vorarbeiten, die sich nicht durch den Anmeldebutton selbst ersetzen lassen.

## Automatische Sicherung und Wiederherstellung

Gesichert werden die Schleim-OS-Personalisierungsdaten mit dem Präfix `ssos-`, zum Beispiel:

- Startbildschirm-Kacheln und ihre Reihenfolge
- Eigene Website-Apps und Verknüpfungen
- Design, Akzentfarbe und Hintergrund
- Personalisierungs- und Startbildschirm-Einstellungen
- Installierte Store-Apps

Liegt bereits eine Sicherung im privaten Repository, fragt Schleim OS beim ersten Abgleich, ob die Cloud-Sicherung auf das Gerät übernommen oder der aktuelle lokale Stand hochgeladen werden soll.

Der Hintergrunddienst speichert die letzte Momentaufnahme im Erweiterungsspeicher und aktualisiert die private GitHub-Datei alle fünf Minuten, solange der Browser läuft. Wird das Gerät ausgeschaltet oder der Browser vollständig beendet, kann währenddessen kein Upload stattfinden. Nach dem Neustart wird die gespeicherte Verbindung wieder aufgenommen, sofern das GitHub-Token noch gültig ist.

## Sicherheit und Datenschutz

- Das automatisch angelegte Backup-Repository wird ausdrücklich als **Private** erstellt.
- Die GitHub-App erhält nur die Berechtigungen zum Erstellen eines Repositorys und zum Schreiben der Sicherungsdatei.
- Die Anmeldung wird im Erweiterungsspeicher gehalten, damit die Verbindung Browserneustarts übersteht. Der Speicherzugriff wird auf vertrauenswürdige Erweiterungskontexte beschränkt. Der Token ist dort nicht als verschlüsselter Tresor gespeichert; schütze daher dein Browserprofil und dein Betriebssystem.
- Das Backup selbst wird in dein privates GitHub-Repository geschrieben. Die Sicherungsdatei ist nicht Teil des öffentlichen Schleim-OS-Quellcode-Repositorys.
- Die GitHub-Client-ID ist öffentlich. Ein Client Secret, Access Token oder Refresh Token gehört nicht in ein öffentliches Repository, eine README oder ein Issue.
- Die GitHub-Verbindung kann über denselben Button getrennt oder in den GitHub-Kontoeinstellungen widerrufen werden.
- Der Schleim-Store selbst bleibt ohne GitHub-Anmeldung nutzbar.

Weitere Informationen:
- [GitHub App – Device Flow](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App – Repository-Berechtigungen auswählen](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app)
- [GitHub REST API – Repository für angemeldete Nutzer erstellen](https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user)
