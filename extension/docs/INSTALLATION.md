# Schleim OS 3.15.1 – Installationsanleitung

1. Öffne die [GitHub-Releases-Seite](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest).
2. Lade [Schleim-OS-Extension.zip](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip) herunter.
3. Entpacke die ZIP-Datei auf deinem Gerät.
4. Öffne die Erweiterungsverwaltung deines Chromium-Browsers. In Chrome lautet die Adresse `chrome://extensions`.
5. Aktiviere den **Entwicklermodus**.
6. Wähle **Entpackte Erweiterung laden**.
7. Wähle den entpackten Ordner aus, in dem sich `manifest.json` direkt befindet.

Das Release-Paket enthält ausschließlich die Original-Extension. Das Template wird als separates Paket angeboten und enthält absichtlich `manifest.template.json`, damit es nicht versehentlich als zweite Erweiterung geladen wird.

## Schleim-Store

Der Schleim-Store ist nur nach Anmeldung mit einem Schleim-Konto verfügbar. Beim ersten Anmelden öffnet Schleim OS zuerst die GitHub-App-Seite. Installiere **Schleim OS Account**, kehre zurück und wähle **Ich habe die App installiert – weiter**. Danach wird der Gerätecode angezeigt. Schleim OS versucht, ihn nach kurzer Verzögerung automatisch zu kopieren. Falls das nicht klappt, kannst du ihn manuell kopieren. Anschließend öffnet sich die GitHub-Gerätefreigabe. Nach der Autorisierung prüft Schleim OS, ob GitHub die App-Installation erkannt hat. Die Prüfung kann bis zu fünf Minuten dauern.

Anleitung: [Schleim-Store – Deutsch](../../Store/Deutsch/README.md) · [English](../../Store/Englisch/README.md) · [Nederlands](../../Store/Niederländisch/README.md).

## Updates nach der Erstinstallation

Nach einer neuen Version kannst du im Update-Center die aktuelle Extension-ZIP herunterladen. Entpacke sie in denselben Ordner, überschreibe die vorhandenen Dateien und klicke in der Erweiterungsverwaltung auf **Neu laden**.

Anleitung: [Update-Anleitung](../../docs/Deutsch/UPDATES.md).

## Cloud-Sicherung

Die Cloud-Sicherung ist nur unter **Einstellungen → Schleim-Konto** verfügbar. Sie wird manuell gestartet und enthält die gespeicherten Einstellungen, die Reihenfolge der Apps, installierte Store-Apps und das Hintergrundbild. Im Store gibt es keine Sicherungs- oder Wiederherstellungsbuttons.

Die Erweiterung basiert auf Chromium und Manifest V3. Die Oberfläche enthält keine Werbeeinbindungen und führt keine Werbe- oder Filterprüfung durch.
