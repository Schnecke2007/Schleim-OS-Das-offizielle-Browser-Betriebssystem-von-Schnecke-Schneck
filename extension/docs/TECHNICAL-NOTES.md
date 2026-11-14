# Technische Hinweise – Version 3.13.1

## Plattform und Erweiterungsformat

- **Plattform:** Chromium-basierte Browser mit Erweiterungsunterstützung
- **Erweiterungsformat:** Manifest V3
- **Neuer-Tab-Einstiegspunkt:** `pages/newtab.html`
- **Neuer-Tab-Override:** `chrome_url_overrides.newtab`

## Projektstruktur

- `pages/` enthält die Erweiterungsoberfläche.
- `scripts/app.js` steuert Apps und Navigation.
- `scripts/personalization.js` verwaltet Personalisierung, Homescreen-Reihenfolge und den Store.
- `scripts/schleim-account.js` verwaltet GitHub-App-Anmeldung, Geräteautorisierung, Installationserkennung und Cloud-Backup.
- `scripts/slime-store-admin.js` stellt das Store-Admin-Portal bereit.
- `scripts/sonos-app.js` stellt die native Sonos-Oberfläche mit OAuth-Sitzung, Lautsprecher-/Gruppenauswahl, Wiedergabesteuerung und Favoriten-/Playlist-Start bereit.
- `../integrations/sonos-worker/src/index.js` ist die serverseitige OAuth- und Control-API-Bridge. Sonos-Client-Secret sowie Access-/Refresh-Tokens verbleiben auf dem Server.
- `scripts/update-center.js` vergleicht die installierte Version mit dem öffentlichen GitHub-Manifest und zeigt bei Bedarf den ZIP-Download.
- `styles/` enthält die Stylesheets.
- `locales/legal-translations.js` enthält Übersetzungen der Rechtstexte. Die übrigen Oberflächentexte werden über Sprachwörterbücher in den JavaScript-Dateien gepflegt.
- `data/store-apps.json` und `data/store-ratings.json` sind die Laufzeitdaten für Katalog und Bewertungen.

## Anmeldung und Berechtigungen

Das Manifest verwendet unter anderem:
- `storage` für lokale Erweiterungsdaten und die Schleim-Konto-Sitzung
- `clipboardWrite` für das automatische Kopieren des GitHub-Gerätecodes
- Host-Berechtigungen für GitHub-API, GitHub-Geräteautorisierung und öffentliche Laufzeitdaten

Die GitHub-App verwendet den Device Flow. Der Anmeldeablauf öffnet zunächst die Installationsseite. Nach der Installation bestätigt die Person den nächsten Schritt, erhält einen Gerätecode und autorisiert die App auf GitHub. Danach prüft Schleim OS über `GET /user/installations`, ob die App-Installation für das Konto sichtbar ist.

## Store-Zugriff

Die Store-Oberfläche prüft den authentifizierten Status des Schleim-Kontos. Ohne gültige Sitzung bleiben Store-Katalog, Suche, Bewertungen, Installation, Deinstallation und Vorschlagsfunktionen gesperrt. Die öffentlichen Katalogdateien im GitHub-Repository sind dadurch nicht geschützt.

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

## Sonos-Integration

Die Sonos-App verwendet die offizielle Sonos Control API über einen separat bereitzustellenden Cloudflare Worker. Die Anmeldung erfolgt per OAuth Authorization Code Flow. Der Worker speichert Sonos-Tokens in einem privaten KV-Namespace und stellt der Erweiterung nur eine zufällige Sitzungskennung bereit. `sonosControlConfig` wird lokal gespeichert und nicht in das Schleim-Cloud-Backup aufgenommen. Eine Anleitung für Sonos Developer Integration, Cloudflare Worker und KV steht in `SONOS-APP.md`. Texteingaben können gespeicherte Sonos-Favoriten und Playlists finden und starten; eine universelle Musiksuche über beliebige verbundene Dienste wird von der Control API für Drittanbieter nicht allgemein angeboten.

## Werbung und externe Verbindungen

Die Erweiterungsoberfläche enthält keine Werbe-IFrames, Werbe-URL-Aufrufe oder werbebedingte Start-Sperre. Externe Apps und Websites können Netzwerkverbindungen herstellen, wenn sie geöffnet werden.
