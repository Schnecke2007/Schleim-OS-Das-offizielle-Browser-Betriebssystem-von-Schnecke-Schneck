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

Schleim OS bewaart een lokale werkkopie en spiegelt personalisatiegegevens naar `chrome.storage.sync`. De browser verzorgt de cloudsynchronisatie wanneer je bent aangemeld bij een browserprofiel met ingeschakelde synchronisatie. Een GitHub App, Client ID of aparte aanmelding bij Schleim OS is niet nodig. Het quotum is ongeveer 100 KB per extensie; geüploade achtergrondafbeeldingen blijven lokaal. Zie de [handleiding voor browsersynchronisatie](../../Deutsch/BROWSER-CLOUD-SYNC.md).

## Reclame en externe verbindingen

De extensie-interface is reclamevrij. De interface bevat geen advertentie-iframes, geen controles of advertenties bereikbaar zijn en geen opstartblokkering vanwege advertenties. Externe apps en websites kunnen nog steeds netwerkverzoeken uitvoeren wanneer de gebruiker ze opent.

## Machtigingen

Optionele hostmachtigingen zijn in het manifest gedeclareerd en kunnen door de toepassing worden aangevraagd wanneer een functie ze nodig heeft. Lees de toestemmingsmelding van de browser zorgvuldig voordat je toegang verleent.

---

[🇩🇪 Deutsche technische Hinweise](../Deutsch/TECHNISCHE-HINWEISE.md) · [🇬🇧 English technical notes](../Englisch/TECHNICAL-NOTES.md)
