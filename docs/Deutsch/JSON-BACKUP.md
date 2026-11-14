# Cloud-Sicherung mit dem Schleim-Konto

> **Hinweis zu älteren Versionen:** Die lokale JSON-Import- und Exportfunktion wurde mit Schleim OS 3.10.0 durch das Schleim-Konto ersetzt. Diese Seite dient nur noch als Hinweis für ältere JSON-Sicherungsdateien.

## Neue Sicherung verwenden

1. Richte zuerst die GitHub-App ein. Die Anleitung findest du unter [Schleim-Konto einrichten](../../extension/docs/SCHLEIM-KONTO.md).
2. Öffne den **Schleim Store** oder die **Einstellungen**.
3. Wähle im Bereich **Schleim-Konto** die Option **Mit GitHub verbinden**.
4. Bestätige den einmaligen Gerätecode direkt bei GitHub.
5. Wähle **Jetzt in der Cloud sichern**.

Schleim OS legt in deinem privaten GitHub-Repository `schleim-os-cloud` die Datei `schleim-os-backup.json` an oder aktualisiert sie.

## Sicherung auf einem anderen Gerät wiederherstellen

Melde dich dort mit demselben GitHub-Konto über das Schleim-Konto an und wähle **Cloud-Sicherung wiederherstellen**. Die Einstellungen des aktuellen Geräts werden durch die gespeicherte Sicherung ersetzt.

## Ältere JSON-Dateien

JSON-Dateien, die mit einer früheren Schleim-OS-Version exportiert wurden, können in Version 3.10.0 nicht mehr über die Oberfläche importiert werden. Bewahre vorhandene Dateien weiterhin separat auf. Eine automatische Übernahme alter Dateien in die Cloud findet nicht statt.

**Sicherheit:** Das Cloud-Repository muss privat bleiben. Schleim OS speichert dort keine Passwörter und keine Zugriffstokens.
