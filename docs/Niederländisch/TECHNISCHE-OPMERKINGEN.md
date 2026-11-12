# 🧩 Schleim OS – Technische opmerkingen

## Platform en extensieformaat

- **Platform:** Chromium-gebaseerde browsers
- **Extensieformaat:** Manifest V3
- **Belangrijkste ingangspunt:** `pages/newtab.html`
- **Vervanging van het nieuwe tabblad:** `chrome_url_overrides.newtab`

## Installatie

De gedocumenteerde installatie gebruikt rechtstreekse import van de volledige GitHub-repository-ZIP via de ZIP-importfunctie van een ondersteunde Chromium-browser. Het archief bevat de extensie in de submap `extension` en wordt vóór het importeren niet uitgepakt. De beschikbaarheid van ZIP-import hangt af van de browser en het platform.

## Projectbestanden

- **Lokale interfacescripts:** `scripts/app.js` en `scripts/personalization.js`
- **Stylesheets:** `styles/main.css` en `styles/personalization.css`
- **Vertalingen van talen en juridische teksten:** `locales/legal-translations.js`
- **Standaloneversie:** `standalone/schleim-os-standalone.html`

## Opslag en back-ups

Schleim OS heeft een lokale werkkopie in de browser nodig om het startscherm weer te geven en te bedienen. Na aanmelding bij GitHub wordt deze status direct opgeslagen in een privérepository en daarna elke vijf minuten bijgewerkt via de Manifest V3-achtergronddienst. Na het opnieuw starten van de browser moet je opnieuw aanmelden bij GitHub. Configureer hiervoor een GitHub App met Device Flow en de machtigingen `Contents: Read and write` en `Metadata: Read-only`. Volg de [handleiding voor de GitHub-cloudback-up](../../Deutsch/GITHUB-CLOUD-BACKUP.md).

## Reclame en externe verbindingen

De extensie-interface is reclamevrij. De interface bevat geen advertentie-iframes, geen controles of advertenties bereikbaar zijn en geen opstartblokkering vanwege advertenties. Externe apps en websites kunnen nog steeds netwerkverzoeken uitvoeren wanneer de gebruiker ze opent.

## Machtigingen

Optionele hostmachtigingen zijn in het manifest gedeclareerd en kunnen door de toepassing worden aangevraagd wanneer een functie ze nodig heeft. Lees de toestemmingsmelding van de browser zorgvuldig voordat je toegang verleent.

---

[🇩🇪 Deutsche technische Hinweise](../Deutsch/TECHNISCHE-HINWEISE.md) · [🇬🇧 English technical notes](../Englisch/TECHNICAL-NOTES.md)
