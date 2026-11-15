# Release 3.15.2 – Release-Downloads und ZIP-Update-Import

## Verbesserungen

- Das Update-Center vergleicht weiterhin die installierte Original-Extension-Version mit dem öffentlichen Manifest auf GitHub.
- Bei einer neueren Version lädt der Download-Button jetzt direkt das Release-Asset **Schleim-OS-Extension.zip** aus dem neuesten GitHub-Release herunter.
- Die Download-Schaltfläche startet den Dateidownload über eine direkte Benutzeraktion. Die ZIP-Datei wird nicht entpackt und die laufende Erweiterung nicht selbst ersetzt.
- Die Installation wird anschließend im Browser manuell gestartet und bestätigt. Unterstützte Browser können die ZIP-Datei über eine Import-Funktion wie **+ (from .zip/.crx/.user.js)** importieren.

## Template

- Das Update-Center des neutralen Templates verwendet einen eigenen Download-Link auf **Schleim-OS-Extension-Template.zip**.
- Das Template lädt dadurch nicht versehentlich das Original-Extension-Paket oder das vollständige Repository-Quellcode-Archiv herunter.
- Für ein eigenes Template müssen GitHub-Benutzername, Repository und das Release-Asset mit dem erwarteten Dateinamen konfiguriert werden.

## Dokumentation

- Installations- und Update-Anleitungen wurden auf den direkten Download der Release-ZIP-Dateien und den Import ohne Entpacken umgestellt.
- Readme-Dateien und technische Hinweise wurden in Deutsch, Englisch, Niederländisch und Leichter Sprache angepasst.
- Die Browser-Unterstützung wird ausdrücklich unterschieden: ZIP-Import ist nicht in jedem Chromium-Browser verfügbar. Standard-Google-Chrome für Android unterstützt keine Erweiterungen; Desktop-Chrome lädt im Entwicklermodus entpackte Ordner statt ZIP-Dateien.

## Manuelle Bestätigung

Der Download allein installiert kein Update. Der Nutzer muss die heruntergeladene ZIP-Datei im Erweiterungsmanager eines kompatiblen Browsers auswählen und den Import beziehungsweise das Update bestätigen.
