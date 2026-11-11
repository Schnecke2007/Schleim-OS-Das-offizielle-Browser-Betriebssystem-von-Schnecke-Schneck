# Schleim-Store – Admin-Zugang

Dieses Verzeichnis enthält nur die Anleitung. Die persönliche Admin-Datei wird **nicht** hier abgelegt und gehört nicht in das öffentliche Repository.

## 1. Fine-grained GitHub-Token erstellen

Erstelle in deinen GitHub-Einstellungen einen **Fine-grained personal access token** mit diesen Einschränkungen:

- Resource owner: `Schnecke2007`
- Repository access: **Only select repositories** → ausschließlich dieses Schleim-OS-Repository auswählen (nicht nur alle Repositories allgemein anzeigen lassen)
- Repository permissions:
  - **Contents: Read and write** – zum Aktualisieren von `extension/data/store-apps.json`
  - **Issues: Read and write** – zum Lesen, Kommentieren und Schließen von Einreichungen
- Keine weiteren Rechte hinzufügen.
- Verwende nach Möglichkeit ein Ablaufdatum und erneuere den Token bei Bedarf.

Der Token wird im Admin-Portal nur lokal eingegeben, verschlüsselt und nicht in den Quellcode geschrieben.

## 2. Verschlüsselte JSON-Datei erstellen

1. Öffne Schleim OS und gehe zum **Schleim-Store**.
2. Öffne **Admin-Portal**.
3. Füge den Fine-grained Token im Bereich **Admin-Datei erstellen** ein.
4. Vergib eine lange Passphrase mit mindestens 12 Zeichen und wiederhole sie.
5. Lade die Datei `schleim-store-admin-key.json` herunter.
6. Bewahre die Datei sicher auf. Sie sollte zusammen mit der Passphrase nicht öffentlich zugänglich sein.

Die Datei enthält den Token nicht im Klartext. Der Browser verschlüsselt ihn mit **AES-256-GCM**; der Schlüssel wird aus deiner Passphrase mit **PBKDF2-SHA-256** und einem zufälligen Salt abgeleitet. Die Entschlüsselung erfolgt erst beim Anmelden.

## 3. Vorschläge prüfen und veröffentlichen

- Nutzer senden App-Vorschläge über das Formular im Schleim-Store als GitHub-Issue ein.
- Im Admin-Portal meldest du dich mit der verschlüsselten JSON-Datei und Passphrase an.
- Wähle eine offene Einreichung, kontrolliere Name, URL, Kategorie, Icon und Beschreibungen in allen drei Sprachen.
- Mit **Genehmigen und veröffentlichen** wird die App in `extension/data/store-apps.json` eingetragen. Das Issue wird anschließend kommentiert und geschlossen.
- Abgelehnte Vorschläge können mit **Ablehnen** geschlossen werden.

Der Store lädt den öffentlichen Katalog direkt aus diesem Repository. Neue Apps erscheinen nach dem Neuladen des Katalogs.


### Fehler „Resource not accessible by personal access token“

Wenn das Admin-Portal die offene Einreichung bereits anzeigen kann, aber das Veröffentlichen fehlschlägt, fehlt häufig die Schreibberechtigung für den App-Katalog. Prüfe im Fine-grained Token unter **Repository permissions**:

- **Contents: Read and write** – erforderlich, um `extension/data/store-apps.json` zu lesen und zu aktualisieren.
- **Issues: Read and write** – erforderlich, um Einreichungen zu lesen, zu kommentieren und zu schließen.

Prüfe außerdem unter **Repository access**, ob genau dieses Repository ausgewählt ist. Die Statusmeldung im Admin-Portal nennt jetzt den betroffenen API-Bereich (`Contents` oder `Issues`). Erstelle bei Bedarf einen neuen Token mit diesen Rechten und danach im Admin-Portal eine neue verschlüsselte Admin-JSON-Datei. Den alten Token kannst du anschließend in GitHub widerrufen.

## Sicherheitshinweise

- **Niemals** den unverschlüsselten Token in GitHub, Issue-Kommentare, Screenshots oder Chats kopieren.
- Die Admin-Datei allein reicht ohne Passphrase nicht zum Entschlüsseln; schütze aber beides getrennt.
- Der Token befindet sich während einer angemeldeten Admin-Sitzung im Arbeitsspeicher des Browsers. Melde dich auf gemeinsam genutzten Geräten ab und schließe das Fenster.
- Das Admin-Portal ist ein clientseitiges Werkzeug, kein serverseitiges Rollen- oder Zugriffssystem. Wer sowohl die verschlüsselte Datei als auch die Passphrase erhält, kann die erlaubten Repository-Aktionen ausführen.
- Bei Verlust oder Verdacht auf Offenlegung den Token bei GitHub widerrufen und einen neuen erstellen.
- Die Admin-Datei wird nicht im Repository gespeichert. Die Regeln in der Repository-`.gitignore` helfen zusätzlich, versehentliche Commits der Datei zu vermeiden.

Die Store-App ist eine Website-Verknüpfung und keine native Browser-Erweiterung. System-Apps und fest eingebaute Inhalte von Schleim OS sind nicht Teil des Store-Katalogs und bleiben bei der Deinstallation einer Store-App unberührt.
