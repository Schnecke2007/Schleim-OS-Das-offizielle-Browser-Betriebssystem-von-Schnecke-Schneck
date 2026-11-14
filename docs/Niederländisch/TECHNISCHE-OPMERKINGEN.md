# 🧩 Schleim OS – Technische opmerkingen · Versie 3.12.0

## Platform en extensieformaat

- **Platform:** Chromium-gebaseerde browsers met ondersteuning voor extensies
- **Extensieformaat:** Manifest V3
- **Belangrijkste ingangspunt:** `pages/newtab.html`
- **Vervanging van het nieuwe tabblad:** `chrome_url_overrides.newtab`

## Projectbestanden

- **Interface en navigatie:** `scripts/app.js`
- **Personalisatie en Schleim-Store:** `scripts/personalization.js`
- **GitHub-aanmelding en cloudback-up:** `scripts/schleim-account.js`
- **Store-beheerportaal:** `scripts/slime-store-admin.js`
- **Stylesheets:** `styles/main.css` en `styles/personalization.css`
- **Vertalingen van juridische teksten:** `locales/legal-translations.js`
- **Standalone demo:** `standalone/schleim-os-standalone.html`

## Installatie

De beschreven installatie importeert de volledige repository-ZIP rechtstreeks in een ondersteunde Chromium-browser. Het archief bevat de extensie in de submap `extension` en wordt vóór het importeren niet uitgepakt. De beschikbaarheid van ZIP-import hangt af van de browser en het platform.

## Opslag en cloudback-up

Schleim OS bewaart actieve instellingen lokaal in het browserprofiel. Je start of herstelt de cloudback-up handmatig via **Instellingen → Schleim-account**. Wijzigingen worden niet na elke bewerking automatisch gesynchroniseerd.

Back-upformaat 2 bevat de opgeslagen `ssos-` instellingen en legt ook deze onderdelen apart vast:
- de volgorde van de tegels op het startscherm (`ssos-personalization-v1.homeOrder`),
- geïnstalleerde Store-apps (`ssos-store-v1.installed`),
- de gekozen systeemachtergrond (`ssos-wallpaper`),
- een eigen achtergrondafbeelding en de afbeeldingsgegevens of URL.

Back-ups in formaat 1 kunnen nog steeds worden hersteld. De oude lokale JSON-import-/exportfunctie maakt geen deel meer uit van de gebruikersinterface.

## Schleim-Store en aanmelden

De Schleim-Store is alleen beschikbaar met een aangemeld Schleim-account. De Store-interface controleert de aangemelde sessie. Na het afmelden worden de Store-inhoud en geïnstalleerde Store-tegels vergrendeld of verborgen. Bestanden in de openbare GitHub-Store-catalogus blijven rechtstreeks op GitHub zichtbaar.

## Machtigingen

Het manifest bevat onder andere `storage` en `clipboardWrite`. De klembordmachtiging wordt gebruikt om de GitHub-apparaatcode automatisch te kopiëren. Optionele hostmachtigingen kunnen worden aangevraagd wanneer een functie ze nodig heeft. Lees toestemmingsmeldingen zorgvuldig.

## Reclame en externe verbindingen

De extensie-interface bevat geen advertentie-iframes, advertentie-URL's of opstartblokkering door reclame. Externe apps en websites kunnen netwerkverzoeken uitvoeren wanneer je ze opent.

---

[🇩🇪 Deutsche technische Hinweise](../Deutsch/TECHNISCHE-HINWEISE.md) · [🇬🇧 English technical notes](../Englisch/TECHNICAL-NOTES.md)
