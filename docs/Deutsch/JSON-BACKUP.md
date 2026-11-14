# Cloud-Sicherung mit dem Schleim-Konto

> **Hinweis zu älteren Versionen:** Die frühere lokale JSON-Import- und Exportfunktion ist in der aktuellen Oberfläche von Schleim OS 3.11.0 nicht mehr verfügbar. Diese Seite erklärt die aktuelle Cloud-Sicherung und den Umgang mit alten Dateien.

## Neue Cloud-Sicherung erstellen

1. Installiere bei Bedarf zuerst die [GitHub-App Schleim OS Account](https://github.com/apps/schleim-os-account).
2. Öffne **Einstellungen → Schleim-Konto**.
3. Wähle **Mit GitHub verbinden** und folge dem Installations- und Gerätecode-Ablauf.
4. Nach erfolgreicher Anmeldung wählst du **Jetzt in der Cloud sichern**.

Schleim OS speichert oder aktualisiert `schleim-os-backup.json` im privaten GitHub-Repository `schleim-os-cloud`.

## Was wird gesichert?

Das aktuelle Backup-Format 2 enthält die gespeicherten Schleim-OS-Einstellungen und ausdrücklich:
- die Reihenfolge der Apps auf dem Startbildschirm,
- installierte Store-Apps,
- das ausgewählte System-Hintergrundbild,
- ein eigenes Hintergrundbild mit seinen Bilddaten oder seiner URL.

Die Sicherung wird nur manuell unter **Einstellungen → Schleim-Konto** gestartet. Es gibt keine automatische Synchronisierung.

## Auf einem anderen Gerät wiederherstellen

Installiere Schleim OS und melde dich unter **Einstellungen → Schleim-Konto** mit demselben GitHub-Konto an. Wähle danach **Cloud-Sicherung wiederherstellen**. Die lokalen Schleim-OS-Einstellungen werden durch die Sicherung ersetzt.

## Ältere JSON-Dateien

JSON-Dateien aus der früheren lokalen Exportfunktion können in der aktuellen Oberfläche nicht importiert werden. Bewahre solche Dateien separat auf. Sie werden nicht automatisch in die Cloud übernommen.

Ältere Cloud-Backups im Format 1, die mit dem Schleim-Konto erstellt wurden, können weiterhin wiederhergestellt werden.

**Sicherheit:** Das Cloud-Repository muss privat bleiben. GitHub-Passwörter und Zugriffstokens werden nicht in die Backup-Datei geschrieben.


**Abgrenzung zur Standalone-Demo:** Die separate Datei `extension/standalone/schleim-os-standalone.html` besitzt eigene lokale Import-/Export-Funktionen für ihre Demo-Einstellungen. Das ist nicht die Cloud-Sicherung der vollständigen Erweiterung und überträgt keine GitHub-Konto-Sitzung.
