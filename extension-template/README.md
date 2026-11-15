# Browser OS – Erweiterungs-Vorlage

**Vorlagen-Version: 3.14.6**

Browser OS ist eine neutrale, mehrsprachige Manifest-V3-Vorlage für Chromium-basierte Browser. Sie enthält Beispieltexte und Platzhalter statt persönlicher Originaldaten.

## Funktionen

- Startseite mit App-Übersicht, Suche, Schnell-Einstellungen und Themes
- Sprachwahl: Deutsch, Englisch und Niederländisch
- Beispiel-Konto mit GitHub-Device-Flow und privater Einstellungs-Sicherung
- Foto- und Video-Cloud mit Galerie, Suche und Kamera-App
- Browser Store mit Beispielen, Bewertungen und Vorschlagsfunktion
- Optionale lokale Bildanalyse über die Prompt API
- Eigenständige HTML-Demo für Webhosting

## Download und Installation

Lade [Browser-OS-Extension-Template.zip aus dem neuesten Release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension-Template.zip) herunter. **Die ZIP-Datei nicht entpacken.** Öffne die Erweiterungsverwaltung eines Browsers mit ZIP-Import, wähle die lokale ZIP-Datei und bestätige den Import. Der Download installiert nichts automatisch.

Normales Google Chrome für Android unterstützt keine Erweiterungen. Desktop-Chrome kann im Entwicklermodus Ordner laden, aber keine ZIP-Dateien direkt importieren.

## Eigene Version erstellen

Arbeite in einem eigenen Git-Repository mit den Quelldateien. Passe `manifest.json`, Profil, Links, Store und die Platzhalter in den Skripten an. Richte eine eigene GitHub App und private Repositories ein, bevor du Konto oder Cloud verwendest.

Der Update-Center-Platzhalter lädt ausschließlich `Browser-OS-Extension-Template.zip` aus dem Release deines konfigurierten Repositories. Verwende beim Veröffentlichen genau diesen Asset-Namen.

## Dokumentation

- [Deutsch](docs/Deutsch/README.md)
- [English](docs/Englisch/README.md)
- [Nederlands](docs/Niederländisch/README.md)
- [Leichte Sprache](docs/Leichte-Sprache/Deutsch/README.md)
- [Konfiguration](CONFIGURATION.md)
- [Konto und private Cloud](docs/ACCOUNT-AND-CLOUD.md)
- [Technische Hinweise](docs/TECHNICAL-NOTES.md)

Alle Profile, Bilder, Konten, Repositories und rechtlichen Texte sind Beispiele. Ersetze sie vor einer Veröffentlichung.