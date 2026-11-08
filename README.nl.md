# Schleim OS 🐌

**Het officiële browserbesturingssysteem van Schnecke Schneck.** Een aanpasbare startpagina voor je browser, met app-tegels, persoonlijke instellingen en een indeling die zich aanpast aan desktop, tablet en mobiel.

[🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md)

## Wat is Schleim OS?

Schleim OS is een browserextensie die de standaardpagina voor een nieuw tabblad vervangt door een eigen interface. Je krijgt een persoonlijk startscherm met apps, snelkoppelingen en instellingen.

Het is geen zelfstandig besturingssysteem en vervangt Windows, Android of Linux niet. Het werkt binnen een compatibele browser en gebruikt de extensiefuncties van die browser.

## Functies

- Eigen nieuw-tabbladpagina voor Chrome en compatibele Chromium-browsers
- Startscherm met apps en websitelinks
- App-tegels verslepen en opnieuw ordenen
- Uiterlijk, accentkleur en achtergrond aanpassen
- App-editor en lokale JSON-back-up/herstel
- Interface in het Duits, Engels en Nederlands
- Afzonderlijke standalone HTML-versie in het projectpakket
- Reclamevrije extensie-interface

## Installatie

### Google Chrome

1. Download het ZIP-pakket via **Releases** (of gebruik het projectpakket uit deze repository).
2. Pak het ZIP-bestand volledig uit.
3. Open `chrome://extensions` in Chrome.
4. Schakel **Ontwikkelaarsmodus** in.
5. Klik op **Uitgepakte extensie laden**.
6. Selecteer de map `schleim-os-browser-extension`. Het bestand `manifest.json` moet direct in deze map staan.
7. Open een nieuw tabblad. Schleim OS zou nu moeten verschijnen.

### Microsoft Edge en Brave

- Edge: open `edge://extensions`.
- Brave: open `brave://extensions`.
- Schakel de ontwikkelaarsmodus in, kies **Uitgepakte extensie laden** en selecteer de map met `manifest.json`.

> Het ZIP-bestand kan niet rechtstreeks als extensie worden geïnstalleerd. Pak het eerst uit.

## Schleim OS gebruiken

- **Apps openen:** selecteer een app-tegel op het startscherm.
- **Tegels ordenen:** sleep een tegel met de muis. Houd op een touchscreen een tegel ingedrukt voordat je deze verplaatst.
- **Aanpassen:** open de instellingen of de app-editor in de interface.
- **Instellingen bewaren:** gebruik de JSON-export/import om persoonlijke instellingen op te slaan of terug te zetten.

Persoonlijke instellingen worden lokaal in het browserprofiel bewaard. Bewaar JSON-back-ups op een veilige plek.

## Problemen oplossen

| Probleem | Mogelijke oplossing |
|---|---|
| Schleim OS verschijnt niet bij een nieuw tabblad | Controleer of de extensie is ingeschakeld en of de map met `manifest.json` is geladen. |
| Chrome meldt een ongeldig manifest | Pak het ZIP-bestand opnieuw uit en selecteer de map waarin `manifest.json` direct staat. |
| Een andere nieuw-tabbladextensie is actief | Schakel de andere extensie tijdelijk uit. Slechts één extensie kan tegelijk de nieuw-tabbladpagina beheren. |
| Wijzigingen worden niet getoond | Open `chrome://extensions`, klik bij Schleim OS op **Opnieuw laden** en open een nieuw tabblad. |
| Een externe pagina of insluiting blijft leeg | Controleer de internetverbinding. Sommige aanbieders blokkeren insluiting op andere websites. |
| Instellingen ontbreken in een andere browser | Instellingen horen bij het lokale browserprofiel. Exporteer een JSON-back-up in de oude browser en importeer deze in de nieuwe. |
| Installatie werkt niet op Android | Chrome voor Android ondersteunt geen gewone desktop-Chrome-extensies. Gebruik een aparte PWA of een browser met extensieondersteuning. |

## Privacy en machtigingen

Schleim OS bewaart interface- en personalisatie-instellingen lokaal in het browserprofiel. De extensie gebruikt de machtigingen die in `manifest.json` staan. Het openen van externe apps of websites kan verbinding maken met de betreffende aanbieders; hun privacybeleid is dan ook van toepassing.

De extensie-interface bevat geen advertentie-iframes, geen controle van de bereikbaarheid van advertenties en geen opstartblokkering vanwege advertenties.

## Opmerkingen

- Schleim OS vervangt de nieuw-tabbladpagina, niet de volledige browserinterface.
- Incognitovensters kunnen aparte beperkingen hebben.
- Google Chrome voor Android ondersteunt geen gewone desktopextensies.
- Externe inhoud kan een internetverbinding vereisen.

## Documentatie

- [Deutsch](README.md)
- [English](README.en.md)
- [Nederlands – deze pagina](README.nl.md)
- [Installatiehandleiding](docs/INSTALLATION.md)
- [Technische opmerkingen](docs/TECHNICAL-NOTES.md)

---

Ontwikkeld en onderhouden door **Schnecke Schneck**.

© 2026 Schnecke Schneck.
