# Schleim OS | Das offizielle Browser-Betriebssystem von Schnecke Schneck

**Version 3.15.5 · Chromium-Erweiterung · Manifest V3**

Schleim OS ersetzt den normalen neuen Tab durch einen anpassbaren Startbildschirm mit App-Kacheln.

## Installation

1. Lade die Original-Extension aus dem [neuesten GitHub-Release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip) herunter.
2. Für Updates kannst du den Download auch direkt unter **Einstellungen → Schleim OS aktualisieren** starten.
3. **Entpacke die ZIP-Datei nicht.**
4. Öffne die Erweiterungsverwaltung eines Chromium-Browsers, der lokale ZIP-Erweiterungen importieren kann.
5. Aktiviere bei Bedarf den Entwicklermodus und wähle **+ (from .zip/.crx/.user.js)**.
6. Wähle **Schleim-OS-Extension.zip** und bestätige den Import beziehungsweise das Update manuell.

Die ZIP-Datei ist das fertige Original-Extension-Paket und wird direkt aus GitHub Releases heruntergeladen. Nur das Importieren und Bestätigen im Browser bleibt ein manueller Schritt. Normales Chrome für Android unterstützt keine Erweiterungen; Desktop-Chrome bietet keinen direkten ZIP-Import.

[Release-Downloads](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) · [Installationsanleitung](../docs/Deutsch/INSTALLATION.md)

## Funktionen

- Homescreen mit fest eingebauten Apps und eigenen Website-Kacheln
- Kacheln per Maus oder Touch neu anordnen
- Personalisierung von Akzentfarbe, Hintergrund und Sperrbildschirm
- Schleim-Store mit Kategorien, Suche, Empfehlungen, Bewertungen und App-Vorschlägen
- Sonos als normale Web-App im Schleim-Store; der Start erfolgt wie bei anderen Store-Apps in einem neuen Browser-Tab
- Store-Zugriff nur nach Anmeldung mit einem Schleim-Konto
- GitHub-App-Anmeldung mit Installationsprüfung und Gerätecode
- Update-Center: GitHub-Version prüfen und die Original-Extension-ZIP aus dem neuesten Release direkt herunterladen; ZIP-Import und Bestätigung startest du manuell im Browser
- Fotos-App als private Foto-/Video-Mediathek mit Suche, Upload und Datumsordnern
- Hintergrund-Upload über einen Offscreen-Prozess: Uploads laufen beim Schließen des Fotos-Tabs weiter, solange Chrome geöffnet bleibt
- Fortschrittsbenachrichtigung mit Prozentanzeige und Abschlussmeldung, die direkt die Fotos-App öffnet
- Statische Fotos werden lokal mit abgestuften WebP-Profilen optimiert; Videos als WebM neu kodiert und bei Bedarf in mehreren Durchgängen weiter verkleinert. Uploads über 50 MiB werden verhindert.
- Kamera-App mit Front-/Rückkamera, Fotos und Videoaufnahmen
- Separates privates Medien-Repository `schleim-os-cloud-photos-and-videos`
- Speicherübersicht mit Foto-/Videoanzahl und belegten MB/GB unter **Einstellungen → Schleim-Konto**
- Metadatensuche mit Synonymen auf allen unterstützten Geräten
- Optionale KI-Bildbeschreibung und semantische Suche mit lokalem Gemini Nano in geeigneten Chrome-Desktop-Erweiterungen, ohne API-Schlüssel
- Manuelle Cloud-Sicherung und Wiederherstellung ausschließlich unter **Einstellungen → Schleim-Konto**
- Backup-Format 2 mit App-Reihenfolge, installierten Store-Apps und Hintergrundbild
- Benutzeroberfläche auf Deutsch, Englisch und Niederländisch
- Werbefreie Erweiterungsoberfläche

## Projektdateien

- `manifest.json` – Manifest V3, Neuer-Tab-Override, Hintergrund-Service-Worker und Berechtigungen
- `scripts/media-upload-worker.js` – verwaltet Upload-Warteschlange, Authentifizierung und Benachrichtigungen
- [Release Notes 3.15.4](docs/RELEASE-NOTES-3.15.5.md) – stärkere Foto-/Videokomprimierung und Upload-Grenzen
- [Release Notes 3.15.0](docs/RELEASE-NOTES-3.15.0.md) – Hintergrund-Upload, erste Komprimierung und bekannte Grenzen
- `pages/media-upload.html` und `scripts/media-upload-offscreen.js` – komprimieren Medien und laden sie unabhängig vom geöffneten Tab hoch
- `pages/newtab.html` – Erweiterungsoberfläche
- `scripts/app.js` – Apps, Navigation und Oberfläche
- `scripts/personalization.js` – Personalisierung, Store-Oberfläche und Homescreen-Reihenfolge
- `scripts/schleim-account.js` – GitHub-App-Anmeldung, Installationserkennung, Einstellungs-Backup und Medien-Repository-Zugriff
- `scripts/schleim-photos-cloud.js` – Kamera, Foto-/Video-Cloud, Upload, Galerie, Metadatensuche und Speicherstatistik
- `scripts/schleim-photo-ai.js` – optionale lokale Bildanalyse und KI-Suchbegriff-Erweiterung über die Chrome Prompt API
- `scripts/slime-store-admin.js` – Admin-Portal zum Prüfen und Veröffentlichen von Store-Vorschlägen
- `scripts/update-center.js` – prüft die GitHub-Manifest-Version und bietet den ZIP-Download an
- `data/store-apps.json` und `data/store-ratings.json` – Laufzeitkatalog und Bewertungsstatistik
- `styles/` – Oberflächen-, Personalisierungs- und Admin-Styles
- `locales/legal-translations.js` – zusätzliche Übersetzungen der Rechtstexte
- `docs/` – technische Dokumentation, Installation und Kontoeinrichtung
- `standalone/schleim-os-standalone.html` – separate Demo als Einzeldatei

Die Benutzeroberfläche verwendet Sprachwörterbücher in den JavaScript-Dateien. Die Sprachdateien für Rechtstexte liegen separat unter `locales/`.

## Schleim-Store und Anmeldung

Der Schleim-Store bleibt gesperrt, solange kein Schleim-Konto angemeldet ist. Ohne Anmeldung werden Store-Katalog, Bewertungen, Installation, Deinstallation und Vorschläge nicht angezeigt. Nach der Anmeldung wird der Store freigeschaltet. Beim Abmelden wird er wieder gesperrt.

Die Store-Katalog- und Bewertungsdateien im öffentlichen GitHub-Repository bleiben direkt auf GitHub sichtbar. Die Anmeldung schützt die Store-Oberfläche, nicht die Repository-Dateien.

## Updates

Unter **Einstellungen → Schleim OS aktualisieren** vergleicht das Update-Center die installierte Version mit `extension/manifest.json` im GitHub-Hauptzweig. Bei einer neueren Version lädt der Download-Button die Datei `Schleim-OS-Extension.zip` direkt aus dem neuesten Release herunter.

Entpacke die ZIP-Datei nicht. Öffne danach die Erweiterungsverwaltung eines Browsers mit ZIP-Import, wähle **+ (from .zip/.crx/.user.js)** und bestätige den Import beziehungsweise das Update. Die manuelle Bestätigung im Browser bleibt erforderlich. Die Template-ZIP ist für eigene angepasste Varianten gedacht. Siehe [Update-Anleitung](../docs/Deutsch/UPDATES.md), [English](../docs/Englisch/UPDATES.md) und [Nederlands](../docs/Niederländisch/UPDATES.md).

## Sonos-Integration

Sonos ist ein normaler Web-App-Eintrag in **Schleim-Store → Medien**. Nach der Installation öffnet Schleim OS `https://play.sonos.com/` über denselben Launcher wie Spotify und andere Store-Apps in einem neuen Browser-Tab. Die Anmeldung und Wiedergabe werden vollständig von Sonos verwaltet; Schleim OS fragt keine Zugangsdaten ab und benötigt keine API-Schlüssel oder eigenen Server.

## Cloud-Sicherung

Die Cloud-Sicherung befindet sich ausschließlich unter **Einstellungen → Schleim-Konto**. Im Store gibt es keine Sicherungs- oder Wiederherstellungssteuerung.

Das Backup wird manuell in das private Repository `schleim-os-cloud` geschrieben. Es enthält die gespeicherten Schleim-OS-Einstellungen sowie ausdrücklich die Startbildschirm-Reihenfolge, installierte Store-Apps und das Hintergrundbild. Es findet keine automatische Synchronisierung nach jeder Änderung statt.

Anleitung: [Schleim-Konto und Cloud-Sicherung – Deutsch](docs/SCHLEIM-KONTO.md) · [English](../docs/Englisch/SCHLEIM-ACCOUNT.md) · [Nederlands](../docs/Niederländisch/SCHLEIM-ACCOUNT.md).

## App-Kacheln anordnen

Auf dem Desktop eine Kachel mit der Maus ziehen. Auf Touchgeräten eine Kachel kurz gedrückt halten und an eine andere Position ziehen. Die Reihenfolge wird lokal gespeichert und in der Cloud-Sicherung mitgespeichert.

## Mehrsprachige Store-Dokumentation

- [Deutsch](../Store/Deutsch/README.md)
- [English](../Store/Englisch/README.md)
- [Nederlands](../Store/Niederländisch/README.md)
- [Leichte Sprache / Plain language / Eenvoudige taal](../docs/README.md)

## Werbung und externe Verbindungen

Die Erweiterungsoberfläche enthält keine Werbe-IFrames und keine Werbe-Startprüfung. Externe Apps und Websites können Netzwerkverbindungen herstellen, wenn du sie öffnest.

**Hinweis zu den Rechtstexten:** Die App zeigt lokale Auszüge der Rechtstexte der offiziellen Fan-Webseite. Aussagen über Werbung in diesen Rechtstexten beziehen sich auf die Fan-Webseite, nicht auf Werbeeinbindungen in der Erweiterung.


## Android-App

Das Projekt veröffentlicht zusätzlich die eigenständige Android-App **Schleim Browser** auf Basis von Mozilla GeckoView. Die Android-App bündelt die Original-Extension, verwendet aber eine eigene native Browseroberfläche und wird als APK separat aktualisiert.

- [Android-APK aus dem neuesten Release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha22.apk)
- [Android-Installation, Updates und Fehlerbehebung](../docs/Deutsch/ANDROID-BROWSER.md)
- [Android-Studio-Projektvorlage](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-Studio-Template.zip)

Die Browser-Extension bleibt ein eigenständiges ZIP-Paket. Android-Kamera- und Mikrofonaufnahme sind in der App deaktiviert.
