# Schleim-Konto und GitHub-Cloud-Sicherung

Das Schleim-Konto verwendet dein eigenes GitHub-Konto als Identität. Schleim OS erhält kein separates Passwort und speichert niemals dein GitHub-Passwort. Die Anmeldung erfolgt über die offizielle GitHub-Geräteautorisierung.

## 1. GitHub-App erstellen

1. Deine bereits erstellte App findest du hier: [Schleim OS Account auf GitHub](https://github.com/apps/schleim-os-account). Die Einstellungen verwaltest du unter [GitHub Developer Settings → GitHub Apps](https://github.com/settings/apps).
2. Verwende als Namen **Schleim OS Account**.
3. Als Homepage-URL kannst du das [Schleim-OS-Repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck) eintragen.
4. Aktiviere **Enable Device Flow**. Für diesen Anmeldeweg wird keine Callback-URL benötigt.
5. **Wähle die Sichtbarkeit passend aus:** Wenn andere Schleim-OS-Nutzer ihr eigenes GitHub-Konto verbinden sollen, muss die App **Public** sein. Eine private App kann nur auf dem Konto installiert werden, dem sie gehört. Wenn ausschließlich du selbst das Konto nutzt, kannst du sie privat lassen.
6. Aktiviere die folgenden Berechtigungen:

| Bereich | Berechtigung | Zugriff |
|---|---|---|
| Account permissions | Email addresses | Read-only |
| Repository permissions | Repository creation | Read and write |
| Repository permissions | Contents | Read and write |

**Warum diese Berechtigungen?** Die E-Mail-Berechtigung prüft, ob dein primäres GitHub-E-Mail-Konto bereits verifiziert ist. Repository creation erlaubt die automatische Erstellung des privaten Cloud-Repositorys. Contents wird benötigt, um die Sicherungsdatei hoch- und herunterzuladen. GitHub gibt einer App automatisch Zugriff auf die Repositories, die sie selbst erstellt. Daher muss die App nicht pauschal Zugriff auf sämtliche vorhandenen Repositories bekommen.

7. Speichere die App. Du und andere Nutzer können sie über [Schleim OS Account installieren](https://github.com/apps/schleim-os-account). Für die Cloud-Funktion müssen Nutzer die App-Installation und anschließend die Geräteautorisierung bei GitHub bestätigen.

**Sicherheitshinweis zum Gerätecode:** GitHub beschreibt Device Flow vor allem für CLI-, IoT- und andere Geräte ohne normalen Browser-Redirect. Für Browser-Anwendungen ist ein PKCE-Redirect grundsätzlich vorzuziehen. Der Gerätecode ist hier gewählt, weil Schleim OS als manuell installierte Erweiterung keine einheitliche Redirect-Adresse auf allen Browsern besitzt. Nutzer sollten den Code ausschließlich auf `github.com/login/device` eingeben und dort prüfen, dass die Freigabe tatsächlich **Schleim OS Account** betrifft. Gib einen Gerätecode niemals an Personen weiter.

## 2. Client-ID in Schleim OS eintragen

Öffne die GitHub-App-Einstellungen und kopiere die **Client ID**. Nicht mit der App-ID verwechseln.

Öffne anschließend in diesem Repository:

`extension/scripts/schleim-account.js`

Trage die Client-ID in die Konstante `GITHUB_APP_CLIENT_ID` ein und ersetze den Platzhalter `GITHUB_APP_CLIENT_ID_HERE`.

Die Client-ID darf im Extension-Code stehen. **Die Client Secret und den privaten App-Schlüssel darfst du niemals in die Browser-Erweiterung eintragen oder veröffentlichen.** Der Geräteablauf benötigt diese Geheimnisse nicht.

## 3. Anmeldung und Cloud-Repository

1. Öffne den Schleim Store und wähle **Mit GitHub verbinden**.
2. Schleim OS fordert bei GitHub einen einmaligen Gerätecode an.
3. Öffne die offizielle GitHub-Gerätefreigabe und gib den angezeigten Code ein.
4. Bestätige die Autorisierung direkt bei GitHub.
5. Schleim OS liest deinen GitHub-Benutzernamen und deine verifizierte primäre E-Mail-Adresse aus.
6. Anschließend wird das private Repository `schleim-os-cloud` in deinem GitHub-Konto gesucht oder automatisch erstellt.

GitHub fragt niemals dein Passwort innerhalb von Schleim OS ab. Du meldest dich ausschließlich auf der echten GitHub-Seite an. Einen separaten Bestätigungscode per E-Mail verschickt der Schleim-Bot nicht; stattdessen prüft Schleim OS den Verifizierungsstatus der primären E-Mail-Adresse in deinem GitHub-Konto.

## 4. Sicherung und Wiederherstellung

Im Schleim Store und in den Einstellungen findest du im Bereich **Schleim-Konto** die Aktionen:

- **Jetzt in der Cloud sichern:** Die Schleim-OS-Einstellungen werden in `schleim-os-backup.json` im privaten Repository gespeichert oder aktualisiert.
- **Cloud-Sicherung wiederherstellen:** Die Datei wird aus deinem privaten Repository geladen und die lokalen Schleim-OS-Einstellungen werden damit ersetzt.

Die Sicherung enthält die lokalen Einstellungen und Store-Daten mit dem Präfix `ssos-`. GitHub-Zugriffstokens und Anmeldedaten werden niemals in die Backup-Datei geschrieben.

## 5. Sicherheit und Abmeldung

GitHub-Zugriffstokens werden lokal im Erweiterungsprofil gespeichert, damit die Anmeldung über Browser-Neustarts hinweg bestehen bleiben und bei Bedarf erneuert werden kann. Das Refresh-Token ist zeitlich begrenzt. Die Sicherungsdatei enthält keine Zugriffstokens oder Passwörter.

Bei **Abmelden** entfernt Schleim OS die lokal gespeicherten Anmeldetokens. Dadurch wird die Autorisierung bei GitHub nicht automatisch widerrufen. Um den Zugriff vollständig zu entziehen, entferne die GitHub-App zusätzlich in deinen GitHub-Kontoeinstellungen unter **Applications**.

Das Repository muss privat bleiben. Schleim OS verweigert das Speichern, wenn das Repository öffentlich ist.
