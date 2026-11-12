# GitHub-Cloud-Sicherung für Schleim OS

Diese Anleitung betrifft ausschließlich die persönliche Cloud-Sicherung. Sie ist keine Anleitung für das entfernte Schleim-Store-Admin-Portal.

## Voraussetzungen

- Ein GitHub-Konto
- Ein privates Repository im eigenen GitHub-Konto, zum Beispiel `schleim-os-cloud-backup`
- Eine GitHub-App mit aktiviertem Device Flow

## 1. Privates Backup-Repository anlegen

1. Erstelle in deinem GitHub-Konto ein neues Repository.
2. Verwende zum Beispiel den Namen `schleim-os-cloud-backup`.
3. Stelle die Sichtbarkeit ausdrücklich auf **Private**.
4. Du musst keine Dateien hinzufügen; Schleim OS erstellt die Sicherungsdatei selbst.

## 2. GitHub-App einrichten

1. Öffne GitHub und gehe zu **Settings → Developer settings → GitHub Apps**.
2. Erstelle eine neue GitHub-App.
3. Aktiviere in den Einstellungen der App den **Device Flow**.
4. Vergib nur diese Repository-Berechtigungen:
   - **Contents: Read and write**
   - **Metadata: Read-only**
5. Installiere die App ausschließlich für dein privates Backup-Repository.
6. Kopiere die **Client ID** der App. Du brauchst keinen Client Secret in Schleim OS einzutragen.

Die Client ID ist kein Zugriffstoken. Teile niemals ein Client Secret, einen persönlichen Zugriffstoken oder einen Gerätecode.

## 3. In Schleim OS verbinden

1. Öffne Schleim OS in deinem unterstützten Chromium-Browser.
2. Öffne **Einstellungen** und den Bereich **GitHub-Cloud-Sicherung**.
3. Trage die Client ID deiner GitHub-App ein.
4. Trage den Namen deines privaten Backup-Repositories ein.
5. Speichere die Einstellungen und wähle **Mit GitHub anmelden**.
6. Öffne die angezeigte GitHub-Geräteanmeldeseite und gib den angezeigten Einmalcode ein.
7. Prüfe den Zugriff und bestätige die Anmeldung.

Schleim OS prüft, ob das Repository privat ist und deinem angemeldeten GitHub-Konto gehört.

## 4. Sicherung und Wiederherstellung

Nach erfolgreicher Anmeldung wird sofort eine Sicherung erstellt. Anschließend versucht Schleim OS, die Sicherung alle fünf Minuten zu aktualisieren. Die Datei heißt `schleim-os-backup.json` und liegt im privaten Backup-Repository.

Die Sicherung umfasst die Schleim-OS-Einstellungen und Personalisierungsdaten, die unter dem Präfix `ssos-` gespeichert sind, darunter Startbildschirm-Kacheln, deren Reihenfolge, Design, Hintergrund und Store-Installationen.

Wenn im Repository bereits eine Sicherung liegt, fragt Schleim OS beim ersten Verbinden, ob diese auf das Gerät übernommen oder durch den aktuellen lokalen Stand ersetzt werden soll. Lies die Auswahl sorgfältig, bevor du bestätigst.

## Hinweise

- Der Browser benötigt weiterhin einen lokalen Arbeitsstand, damit Schleim OS direkt starten und Einstellungen bearbeiten kann. Die zusätzliche Sicherungskopie wird in GitHub abgelegt.
- Die GitHub-Anmeldedaten und die Token für die Anmeldung werden lokal im geschützten Erweiterungsspeicher verwaltet, damit die Verbindung erneuert werden kann. Die Sicherungsdatei selbst wird in das private GitHub-Repository hochgeladen.
- Der automatische Fünf-Minuten-Takt der derzeitigen Oberfläche läuft, solange eine Schleim-OS-Erweiterungsseite geöffnet ist. Wird die letzte solche Seite geschlossen, pausiert dieser Seitentimer. Für eine vollständig tab-unabhängige Sicherung ist ein zusätzlicher Hintergrunddienst erforderlich.
- Die Cloud-Sicherung ist kein Ersatz für die Sicherheit deines GitHub-Kontos. Verwende Zwei-Faktor-Authentifizierung und halte dein Konto geschützt.
- Die manuelle JSON-Export-/Importfunktion bleibt als zusätzliche Möglichkeit erhalten.
