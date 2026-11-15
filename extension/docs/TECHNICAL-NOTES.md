# Technische Hinweise – Version 3.15.0

## Plattform und Erweiterungsformat

- **Plattform:** Chromium-basierte Browser mit Erweiterungsunterstützung
- **Erweiterungsformat:** Manifest V3
- **Neuer-Tab-Einstiegspunkt:** `pages/newtab.html`
- **Neuer-Tab-Override:** `chrome_url_overrides.newtab`

## Projektstruktur

- `pages/` enthält die Erweiterungsoberfläche.
- `scripts/app.js` steuert Apps und Navigation.
- `scripts/personalization.js` verwaltet Personalisierung, Homescreen-Reihenfolge und den Store.
- `scripts/schleim-account.js` verwaltet GitHub-App-Anmeldung, Geräteautorisierung, Installationserkennung, Einstellungs-Backup und den Zugriff auf das private Medien-Repository.
- `scripts/schleim-photos-cloud.js` verwaltet Fotos-App, Upload-Warteschlange, Metadaten, Metadatensuche, Kamera, Galerie und Speicherstatistik.
- `scripts/media-upload-worker.js` koordiniert Hintergrundjobs, Fortschritts-/Abschlussbenachrichtigungen und GitHub-Sitzung.
- `scripts/media-upload-offscreen.js` komprimiert Fotos, kodiert Videos neu und überträgt Medien unabhängig vom geöffneten Tab.
- `pages/media-upload.html` ist die statische Offscreen-Seite für den Medienprozess.
- `scripts/schleim-photo-ai.js` nutzt optional die Chrome Prompt API für lokale Bildbeschreibungen und KI-gestützte Suchbegriff-Erweiterung.
- `scripts/slime-store-admin.js` stellt das Store-Admin-Portal bereit.
- `scripts/update-center.js` vergleicht die installierte Version mit dem öffentlichen GitHub-Manifest und zeigt bei Bedarf den ZIP-Download.
- `styles/` enthält die Stylesheets.
- `locales/legal-translations.js` enthält Übersetzungen der Rechtstexte. Die übrigen Oberflächentexte werden über Sprachwörterbücher in den JavaScript-Dateien gepflegt.
- `data/store-apps.json` und `data/store-ratings.json` sind die Laufzeitdaten für Katalog und Bewertungen.

## Anmeldung und Berechtigungen

Das Manifest verwendet unter anderem:
- `storage` für lokale Erweiterungsdaten und die Schleim-Konto-Sitzung
- `clipboardWrite` für das automatische Kopieren des GitHub-Gerätecodes
- `offscreen` für die Verarbeitung von Blob-/Medieninhalten ohne geöffneten Fotos-Tab
- `notifications` für Fortschritts- und Abschlussmeldungen
- Host-Berechtigungen für GitHub-API, GitHub-Geräteautorisierung und öffentliche Laufzeitdaten

Die GitHub-App verwendet den Device Flow. Der Anmeldeablauf öffnet zunächst die Installationsseite. Nach der Installation bestätigt die Person den nächsten Schritt, erhält einen Gerätecode und autorisiert die App auf GitHub. Danach prüft Schleim OS über `GET /user/installations`, ob die App-Installation für das Konto sichtbar ist.

## Store-Zugriff

Die Store-Oberfläche prüft den authentifizierten Status des Schleim-Kontos. Ohne gültige Sitzung bleiben Store-Katalog, Suche, Bewertungen, Installation, Deinstallation und Vorschlagsfunktionen gesperrt. Die öffentlichen Katalogdateien im GitHub-Repository sind dadurch nicht geschützt.

## Foto- und Video-Cloud

Das Medien-Repository `schleim-os-cloud-photos-and-videos` wird getrennt vom Einstellungs-Repository `schleim-os-cloud` verwaltet. Das Konto-Modul prüft Besitzer-ID und `private=true` und erstellt das Medien-Repository bei Bedarf über die GitHub-Repository-API. Die Medienschnittstelle akzeptiert nur Content-Pfade und verwendet dieselbe Schleim-Konto-Sitzung.

Dateien werden nach Medientyp, Aufnahmejahr und -monat sortiert. JPEG-EXIF `DateTimeOriginal` wird – soweit verfügbar und lesbar – ausgewertet; andernfalls gilt `File.lastModified`. Die Metadatensuche funktioniert ohne externe Dienste. Optional stellt `schleim-photo-ai.js` über `LanguageModel.availability()` und `LanguageModel.create()` eine lokale Gemini-Nano-Sitzung bereit. Neue Fotos können nach ausdrücklicher Aktivierung lokal beschrieben werden; die Ergebnisse werden als Beschreibung und Stichwörter in den Medien-Metadaten gespeichert. Die KI-Suche erweitert Suchbegriffe lokal und bewertet Treffer anhand der gespeicherten Metadaten. Für Videos werden derzeit nur Metadaten und Dateinamen indexiert.

Die Chrome Prompt API steht nur in unterstützten Chrome-Erweiterungskontexten und auf geeigneter Hardware zur Verfügung. Beim ersten Aufruf wird das Modell heruntergeladen. Es ist kein API-Schlüssel erforderlich; die Bildanalyse läuft lokal und sendet das Bild nicht an Google oder einen anderen KI-Dienst. Auf nicht unterstützten Geräten bleibt die Metadatensuche erhalten. Die KI analysiert nur neue Fotos, die nach Aktivierung hochgeladen werden; bereits vorhandene Bilder werden nicht automatisch rückwirkend analysiert.

Das Medien-Repository wird erst beim Klick auf die Verknüpfungsaktion im angemeldeten GitHub-Konto angelegt, wenn es dort noch nicht existiert. Die GitHub-App benötigt Repository-Erstellung (write) sowie Contents (read/write). Uploads sind auf 50 MiB je Datei begrenzt. Statische, unterstützte Fotos werden lokal als WebP optimiert; Videos werden lokal als WebM neu kodiert. Animierte Bilder bleiben unverändert. Ein Chrome-Offscreen-Dokument hält Komprimierung und Upload bei geschlossenem Fotos-Tab am Laufen, solange Chrome aktiv bleibt. Der Service Worker aktualisiert eine Fortschrittsbenachrichtigung; der Abschluss öffnet per Klick die Fotos-App. Chrome muss geöffnet bleiben, und Videoneukodierung kann CPU-intensiv sein. GitHub-Repository-Versionierung ist für große Mediensammlungen nur eingeschränkt geeignet; entfernte Dateien können in der Git-Historie erhalten bleiben.

## Speicherung und Backup

- Personalisierungsdaten und Homescreen-Reihenfolge liegen lokal im Browserprofil.
- Die Startbildschirm-Reihenfolge wird in `ssos-personalization-v1.homeOrder` gespeichert.
- Installierte Store-Apps liegen in `ssos-store-v1.installed`.
- Die ausgewählten System-Wallpaper-Einstellungen liegen in `ssos-wallpaper`; eigene Wallpaper-Daten werden in `ssos-personalization-v1` gespeichert.
- Die Cloud-Sicherung ist eine manuelle Aktion unter **Einstellungen → Schleim-Konto**.
- Backup-Format 2 umfasst alle unterstützten `ssos-` Einstellungen und zusätzlich explizite Snapshot-Felder für App-Reihenfolge, Store-Installationen und Hintergrundbild.
- Format-1-Backups können weiterhin wiederhergestellt werden. Lokale JSON-Import-/Export-Steuerelemente sind nicht mehr Teil der aktuellen Oberfläche.
- Es findet keine automatische Synchronisierung nach jeder Änderung statt.

## Update-Center

Der Versions-Check liest `extension/manifest.json` aus dem GitHub-Hauptzweig über `raw.githubusercontent.com`. Er vergleicht ausschließlich die numerische Manifest-Version. Bei einer höheren GitHub-Version wird der Download des vollständigen Repository-Archivs angeboten. Der Download wird durch eine direkte Benutzeraktion geöffnet. Das Skript ersetzt keine Erweiterungsdateien und installiert keine Pakete. Für die Installation ist die vom Browser erlaubte Import- oder Update-Funktion notwendig.

`chrome.runtime.requestUpdateCheck()` wird bewusst nicht verwendet: Diese API fragt den Update-Kanal der installierten Erweiterung ab und ist kein allgemeiner GitHub-ZIP-Installer. Siehe [Chrome Update Lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle).

## Sonos-Web-App im Store

Sonos ist ein normaler Web-App-Eintrag in `Store/media/sonos-control.json` und `data/store-apps.json`. Die ID `sonos-control` bleibt stabil, damit vorhandene Installationen erhalten bleiben. Beim Start prüft der allgemeine Store-Launcher die Schleim-Konto-Anmeldung und die Installation und öffnet anschließend `app.url` mit `window.open(..., '_blank', 'noopener,noreferrer')` in einem neuen Browser-Tab.

Es gibt keine eigene Sonos-Systemkachel, keinen Sonos-spezifischen Renderer und kein Sonos-iFrame mehr. Die Anmeldung und Wiedergabe werden vollständig von der offiziellen Sonos-Web-App verwaltet. Schleim OS fragt keine Sonos-Zugangsdaten ab und benötigt für diesen Start keine API-Schlüssel oder eigenen Server.

Die frühere experimentelle Worker-Bridge ist nicht Bestandteil dieser Version. Die Sonos-Store-Web-App benötigt sie nicht.

## Werbung und externe Verbindungen

Die Erweiterungsoberfläche enthält keine Werbe-IFrames, Werbe-URL-Aufrufe oder werbebedingte Start-Sperre. Externe Apps und Websites können Netzwerkverbindungen herstellen, wenn sie geöffnet werden.
