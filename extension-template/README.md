# Browser OS – Erweiterungs-Vorlage

**Vorlagen-Version: 3.22.0**

Browser OS ist eine neutrale, mehrsprachige Manifest-V3-Vorlage für Chromium-basierte Browser. Sie enthält Demo-Texte, Beispielgrafiken und Platzhalter statt persönlicher Originaldaten.

## Funktionen

- Startseite mit App-Übersicht, Suche, Schnell-Einstellungen und Themes
- Sprachwahl: Deutsch, Englisch und Niederländisch
- Beispiel-Konto mit GitHub-Device-Flow und privater Einstellungs-Sicherung
- Foto- und Video-Cloud mit Galerie, Suche und Kamera-App
- Hintergrund-Upload mit Fortschritt und Benachrichtigungen
- Browser Store mit Beispielen, Bewertungen und Vorschlagsfunktion
- Optionale lokale Bildanalyse über die Prompt API
- Eigenständige HTML-Demo für Webhosting

## Download und Installation

Lade [Browser-OS-Extension-Template.zip aus dem Release deines eigenen GitHub-Repositories](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/releases/latest/download/Browser-OS-Extension-Template.zip) herunter. **Die ZIP-Datei nicht entpacken.** Öffne die Erweiterungsverwaltung eines Browsers mit ZIP-Import, wähle die lokale ZIP-Datei und bestätige den Import. Der Download installiert nichts automatisch.

Normales Google Chrome für Android unterstützt keine Erweiterungen. Desktop-Chrome kann im Entwicklermodus Ordner laden, aber keine ZIP-Dateien direkt importieren.

## Eigene Version erstellen

Arbeite in einem eigenen Git-Repository mit den Quelldateien. Passe `manifest.json`, Profil, Links, Store und Platzhalter in den Skripten an. Richte deine eigene GitHub App und private Repositories ein, bevor du Konto oder Cloud verwendest.

Der Update-Center-Platzhalter lädt ausschließlich **Browser-OS-Extension-Template.zip** aus dem neuesten Release deines konfigurierten Repositories. Verwende beim Veröffentlichen genau diesen Asset-Namen.

## Dokumentation

- [Deutsch](docs/Deutsch/README.md)
- [English](docs/Englisch/README.md)
- [Nederlands](docs/Niederländisch/README.md)
- [Leichte Sprache – Deutsch](docs/Leichte-Sprache/Deutsch/README.md)
- [Easy Language – English](docs/Leichte-Sprache/Englisch/README.md)
- [Eenvoudige taal – Nederlands](docs/Leichte-Sprache/Niederländisch/README.md)
- [Sprachübersicht und alle Anleitungen](docs/README.md)
- [Konfiguration](docs/Deutsch/KONFIGURATION.md)
- [Konto und private Cloud](docs/Deutsch/KONTO-UND-CLOUD.md)
- [Technische Hinweise](docs/Deutsch/TECHNIK.md)

Alle Profile, Bilder, Konten, Repositories und rechtlichen Texte sind Beispiele. Ersetze sie vor einer Veröffentlichung.


## Optional Android VPN bridge

The template includes a Schleim VPN tile on the new-tab page. In an Android GeckoView host that registers the `browser` native-message bridge, the tile requests opening the host's native VPN panel. Desktop browsers show a fallback notice because extensions cannot directly start Android's `VpnService`.

The native Android template includes WireGuard tunnel support and encrypted local profile storage. Import a current personal `.conf` file in the app; never bundle a private WireGuard key in the extension or public repository. The VPN tunnel is intended to be limited to the browser package. The Alpha 32 universal APK bundles ARMv7, ARM64 and x86_64. 32-bit x86 is not supported by the pinned GeckoView build; Android 8.0 (API 26) or newer is required.
