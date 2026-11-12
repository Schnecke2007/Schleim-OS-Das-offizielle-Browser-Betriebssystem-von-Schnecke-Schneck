# 🧩 Schleim OS – Technische Hinweise

## Plattform und Erweiterungsformat

- **Plattform:** Chromium-basierte Browser
- **Erweiterungsformat:** Manifest V3
- **Haupteinstiegspunkt:** `pages/newtab.html`
- **Neuer-Tab-Überschreibung:** `chrome_url_overrides.newtab`

## Installation

Die dokumentierte Installation verwendet den direkten Import des vollständigen GitHub-Repository-ZIP über die ZIP-Importfunktion eines unterstützten Chromium-Browsers. Das Archiv enthält die Erweiterung im Unterordner `extension` und wird vor dem Import nicht entpackt. Die Importfunktion ist browser- und plattformabhängig.

## Projektdateien

- **Lokale Oberflächen-Skripte:** `scripts/app.js` und `scripts/personalization.js`
- **Stylesheets:** `styles/main.css` und `styles/personalization.css`
- **Sprach- und Rechtstext-Übersetzungen:** `locales/legal-translations.js`
- **Standalone-Version:** `standalone/schleim-os-standalone.html`

## Speicherung und Sicherungen

Schleim OS benötigt einen lokalen Arbeitsstand im Browser, um den Startbildschirm bedienen zu können. Ein Button startet die GitHub-Verbindung. Danach erstellt Schleim OS automatisch ein privates Repository, sichert sofort und plant Updates alle fünf Minuten über den Manifest-V3-Hintergrunddienst. Die Anmeldung bleibt im geschützten Erweiterungsspeicher erhalten. Der Projektbetreiber muss einmalig eine GitHub App mit aktiviertem Device Flow, `Repository creation: Write` sowie `Contents: Read and write` einrichten und deren öffentliche Client-ID in den Quellcode eintragen. Details: [GITHUB-CLOUD-BACKUP.md](GITHUB-CLOUD-BACKUP.md).

## Werbung und externe Verbindungen

Die Erweiterungsoberfläche ist werbefrei. Sie enthält keine Werbe-IFrames, keine Prüfung der Erreichbarkeit von Werbung und keine werbebedingte Start-Sperre. Externe Apps und Websites können weiterhin Netzwerkverbindungen herstellen, wenn du sie öffnest.

## Berechtigungen

Optionale Host-Berechtigungen sind im Manifest deklariert und können von der Anwendung angefordert werden, wenn eine Funktion sie benötigt. Lies die Berechtigungsabfrage des Browsers sorgfältig, bevor du den Zugriff erlaubst.

---

[🇬🇧 English technical notes](../Englisch/TECHNICAL-NOTES.md) · [🇳🇱 Nederlandse technische opmerkingen](../Niederländisch/TECHNISCHE-OPMERKINGEN.md)
