# Browser OS Template 3.14.4 – eigener Release-Download

## Verbesserungen

- Das Template-Update-Center lädt **Schleim-OS-Extension-Template.zip** aus dem neuesten Release des konfigurierten GitHub-Repositories.
- Der Download verwendet nicht das Original-Extension-Paket und nicht das automatisch erzeugte Quellcode-Archiv des Repositorys.
- Die ZIP-Datei bleibt unverändert und wird nicht automatisch installiert. Der Import und die Bestätigung erfolgen manuell über die ZIP-Import-Funktion eines kompatiblen Browsers.

## Einrichtung

- In `scripts/update-center.js` müssen `OWNER` und `REPOSITORY` auf das eigene GitHub-Repository zeigen.
- Das eigene Release muss das Template-Paket unter dem Asset-Namen **Schleim-OS-Extension-Template.zip** bereitstellen.
- Die Release-Datei muss eine aktive Manifest-V3-Erweiterung mit `manifest.json` im ZIP-Stamm enthalten.

## Browser-Kompatibilität

Der direkte ZIP-Import hängt vom Browser ab. Standard-Google-Chrome für Android unterstützt keine Erweiterungen. Desktop-Chrome lädt im Entwicklermodus entpackte Ordner und importiert ZIP-Dateien nicht direkt.
