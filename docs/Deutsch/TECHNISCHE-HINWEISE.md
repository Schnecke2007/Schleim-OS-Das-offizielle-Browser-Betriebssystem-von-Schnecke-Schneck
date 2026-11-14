# 🧩 Schleim OS – Technische Hinweise · Version 3.12.0

## Plattform und Erweiterungsformat

- **Plattform:** Chromium-basierte Browser mit Erweiterungsunterstützung
- **Erweiterungsformat:** Manifest V3
- **Haupteinstiegspunkt:** `pages/newtab.html`
- **Neuer-Tab-Überschreibung:** `chrome_url_overrides.newtab`

## Projektdateien

- **Oberfläche und Navigation:** `scripts/app.js`
- **Personalisierung und Schleim-Store:** `scripts/personalization.js`
- **GitHub-Anmeldung und Cloud-Sicherung:** `scripts/schleim-account.js`
- **Store-Admin-Portal:** `scripts/slime-store-admin.js`
- **GitHub-Update-Center:** `scripts/update-center.js`
- **Stylesheets:** `styles/main.css` und `styles/personalization.css`
- **Rechtstext-Übersetzungen:** `locales/legal-translations.js`
- **Standalone-Demo:** `standalone/schleim-os-standalone.html`

## Installation

Die dokumentierte Installation importiert die vollständige Repository-ZIP direkt in einem unterstützten Chromium-Browser. Das Archiv enthält die Erweiterung im Unterordner `extension` und wird vor dem Import nicht entpackt. Die ZIP-Importfunktion ist browser- und plattformabhängig.

## Speicherung und Cloud-Sicherung

Schleim OS speichert aktive Einstellungen lokal im Browserprofil. Die Cloud-Sicherung wird manuell unter **Einstellungen → Schleim-Konto** gestartet oder wiederhergestellt. Es gibt keine automatische Synchronisierung nach jeder Änderung.

Das Backup-Format 2 enthält die gespeicherten `ssos-` Einstellungen und ausdrücklich:
- die Reihenfolge der App-Kacheln (`ssos-personalization-v1.homeOrder`),
- installierte Store-Apps (`ssos-store-v1.installed`),
- die System-Hintergrundauswahl (`ssos-wallpaper`),
- ein eigenes Hintergrundbild und seine Bilddaten bzw. URL.

Format-1-Backups können weiterhin wiederhergestellt werden. Die frühere lokale JSON-Import-/Export-Funktion ist nicht mehr Teil der Benutzeroberfläche.

## Schleim-Store und Anmeldung

Der Schleim-Store ist nur mit einem angemeldeten Schleim-Konto verfügbar. Die Store-Oberfläche prüft die authentifizierte Sitzung. Beim Abmelden werden Store-Inhalte und installierte Store-Kacheln gesperrt bzw. ausgeblendet. Die Dateien im öffentlichen GitHub-Store-Katalog bleiben direkt auf GitHub sichtbar.

## Berechtigungen

Das Manifest enthält unter anderem `storage` und `clipboardWrite`. Die Zwischenablage-Berechtigung wird für das automatische Kopieren des GitHub-Gerätecodes verwendet. Optionale Host-Berechtigungen können von der Anwendung angefordert werden, wenn eine Funktion sie benötigt. Lies Berechtigungsabfragen sorgfältig.

## Update-Center

Das Update-Center wird in den Einstellungen angezeigt. Es liest die Manifest-Version im GitHub-Hauptzweig über `raw.githubusercontent.com` und vergleicht sie mit `chrome.runtime.getManifest().version`. Bei einer neueren Version wird ein Link zum vollständigen Repository-ZIP angeboten. Das Skript installiert keine Dateien und ersetzt die laufende Erweiterung nicht.

Der Browser muss den ZIP-Import oder seine Aktualisierungsfunktion selbst ausführen. `chrome.runtime.requestUpdateCheck()` wird nicht als GitHub-Installer verwendet, da diese API den vom Browser konfigurierten Erweiterungs-Update-Kanal prüft.

## Werbung und externe Verbindungen

Die Erweiterungsoberfläche enthält keine Werbe-IFrames, Werbe-URLs oder werbebedingte Start-Sperre. Externe Apps und Websites können Netzwerkverbindungen herstellen, wenn du sie öffnest.

---

[🇬🇧 English technical notes](../Englisch/TECHNICAL-NOTES.md) · [🇳🇱 Nederlandse technische opmerkingen](../Niederländisch/TECHNISCHE-OPMERKINGEN.md)
