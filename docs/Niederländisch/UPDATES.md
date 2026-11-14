# Schleim OS bijwerken

Deze handleiding geldt vanaf **Schleim OS 3.12.0**. In de instellingen staat een updatecentrum. Dit controleert de versie op GitHub en biedt de nieuwste projectdownload aan wanneer er een nieuwere versie beschikbaar is.

## Na de eerste installatie

Je hoeft het volledige GitHub-project niet elke keer zelf op te zoeken.

1. Open **Instellingen** in Schleim OS.
2. Zoek **Schleim OS bijwerken**.
3. Kies **Controleren op updates**.
4. Schleim OS vergelijkt de geïnstalleerde versie met de versie in `extension/manifest.json` op de standaardbranch van GitHub.
5. Als er een nieuwere versie is, kies je **Nieuwste ZIP-versie downloaden**.

## De update in je browser afronden

De download is nog geen installatie.

1. Open het extensiebeheer van je browser.
2. Gebruik de ZIP-import of updatefunctie die je browser ondersteunt.
3. Selecteer de gedownloade volledige repository-ZIP.
4. Bevestig de update als je browser daarom vraagt.
5. Laad Schleim OS opnieuw of open een nieuw tabblad. Controleer de geïnstalleerde versie in het updatecentrum.

**Belangrijk:** Pak het ZIP-bestand niet uit als je browser dezelfde rechtstreekse ZIP-import gebruikt als bij de eerste installatie. De precieze stappen hangen af van de browser. Niet elke Chromium-browser heeft deze importfunctie.

## Waarom installeert de knop de update niet automatisch?

Chrome staat niet toe dat een extensie zomaar een willekeurig ZIP-bestand van internet downloadt en zichzelf daarmee ongemerkt vervangt. De API `chrome.runtime.requestUpdateCheck()` controleert het updatekanaal dat in de browser is ingesteld. Deze API installeert geen willekeurige GitHub-ZIP.

Automatische updates buiten de Chrome Web Store vereisen een andere distributiemethode: een update-URL met een XML-updatebestand en een ondertekend CRX-pakket. Het CRX-bestand moet met dezelfde privésleutel worden ondertekend als de al geïnstalleerde extensie. Chrome beperkt zelf gehoste installaties bovendien afhankelijk van het besturingssysteem en beheerbeleid.

Officiële informatie:
- [Chrome: Updatelevenscyclus van extensies](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle)
- [Chrome: Je extensie distribueren](https://developer.chrome.com/docs/extensions/how-to/distribute)
- [Chrome: Extensies zelf hosten op Linux](https://developer.chrome.com/docs/extensions/how-to/distribute/host-on-linux)

## Belangrijke opmerkingen

- De updatecontrole leest de versienummering uit de standaardbranch van GitHub. Codewijzigingen zonder een hoger versienummer worden niet als nieuwe update herkend.
- Verhoog daarom vóór elke publicatie het versienummer in `extension/manifest.json`.
- Het updatecentrum downloadt alleen het openbare ZIP-bestand. Het krijgt geen GitHub-inloggegevens.
- Je browser bepaalt de installatie, vervanging en bevestiging.
- Als je Schleim OS verwijdert en opnieuw installeert en daardoor lokale instellingen verliest, kun je deze herstellen via **Instellingen → Schleim-account** met je privécloudback-up.

[Documentatieoverzicht](../README.md) · [Installatiehandleiding](INSTALLATIE.md) · [Eenvoudige uitleg](../Leichte-Sprache/Niederländisch/UPDATES.md)
