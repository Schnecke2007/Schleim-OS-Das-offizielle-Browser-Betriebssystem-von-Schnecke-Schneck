# Schleim OS 3.12.0 direkt aus der Repository-ZIP installieren

Diese Anleitung gilt für Version **3.12.0** der Chromium-Erweiterung.

1. Öffne das [Schleim-OS-GitHub-Repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck).
2. Wähle **Code → Download ZIP** und lade das vollständige Repository herunter.
3. Entpacke die ZIP-Datei nicht.
4. Öffne die Erweiterungsverwaltung eines Chromium-Browsers, der ZIP-Erweiterungen importieren kann.
5. Aktiviere bei Bedarf den Entwicklermodus.
6. Wähle die Importfunktion, beispielsweise **„From .zip/.crx/.user.js“**, und anschließend die vollständige Repository-ZIP.
7. Bestätige die Installation und öffne einen neuen Tab.

Der Browser-Importer erkennt die Erweiterung im Unterordner `extension`. Die genaue Importfunktion unterscheidet sich je nach Browser und Plattform. Chrome für Android unterstützt keine regulären Chrome-Erweiterungen; verwende dort einen Android-Browser mit Erweiterungs- und ZIP-Import-Unterstützung.

## Schleim-Store

Der Schleim-Store ist nur nach Anmeldung mit einem Schleim-Konto verfügbar. Beim ersten Anmelden öffnet Schleim OS zuerst die GitHub-App-Seite. Installiere **Schleim OS Account**, kehre zurück und wähle **Ich habe die App installiert – weiter**. Danach wird der Gerätecode angezeigt. Schleim OS versucht, ihn nach kurzer Verzögerung automatisch zu kopieren. Falls das nicht klappt, kannst du ihn manuell kopieren. Anschließend öffnet sich die GitHub-Gerätefreigabe. Nach der Autorisierung prüft Schleim OS, ob GitHub die App-Installation erkannt hat. Die Prüfung kann bis zu fünf Minuten dauern.

Anleitung: [Schleim-Store – Deutsch](../../Store/Deutsch/README.md) · [English](../../Store/Englisch/README.md) · [Nederlands](../../Store/Niederländisch/README.md).

## Updates nach der Erstinstallation

Nach der ersten Installation kannst du unter **Einstellungen → Schleim OS aktualisieren** die GitHub-Version prüfen und die neueste ZIP-Datei herunterladen. Der Browser muss das Update danach über seine Import- oder Aktualisierungsfunktion bestätigen. Eine stille Selbstinstallation aus einer ZIP-Datei ist nicht möglich.

Anleitung: [Update-Anleitung](../../docs/Deutsch/UPDATES.md).

## Cloud-Sicherung

Die Cloud-Sicherung ist nur unter **Einstellungen → Schleim-Konto** verfügbar. Sie wird manuell gestartet und enthält die gespeicherten Einstellungen, die Reihenfolge der Apps, installierte Store-Apps und das Hintergrundbild. Im Store gibt es keine Sicherungs- oder Wiederherstellungsbuttons.

Die Erweiterung basiert auf Chromium und Manifest V3. Die Oberfläche enthält keine Werbeeinbindungen und führt keine Werbe- oder Filterprüfung durch.
