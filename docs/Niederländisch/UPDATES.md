# Schleim OS bijwerken

Op de [GitHub-Releases-pagina](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) vind je de actuele versie en beide downloadpakketten. Het updatecentrum vergelijkt de geïnstalleerde versie met de versie in `extension/manifest.json` op GitHub en biedt de afzonderlijke Extension-download aan.

## De update downloaden

1. Open **Instellingen → Schleim OS bijwerken** in Schleim OS.
2. Kies **Controleren op updates**.
3. Is er een nieuwere versie beschikbaar? Kies dan **Nieuwste ZIP-versie downloaden**. De knop downloadt **Schleim-OS-Extension.zip** uit de nieuwste release.
4. Je kunt de [Extension ook rechtstreeks uit de nieuwste release downloaden](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip).

## De update in je browser afronden

1. Pak het gedownloade ZIP-bestand uit.
2. Kopieer de inhoud naar dezelfde lokale map waarin je huidige extensie staat en overschrijf de bestaande bestanden.
3. Open het extensiebeheer van je browser (`chrome://extensions` in Chrome).
4. Klik bij Schleim OS op **Opnieuw laden**.
5. Open een nieuw tabblad en controleer de geïnstalleerde versie in het updatecentrum.

Gebruik indien mogelijk dezelfde map als bij je bestaande installatie. Verwijder de extensie niet als je de huidige lokale installatie wilt behouden.

## Waarom installeert de knop de update niet automatisch?

Chrome staat niet toe dat een extensie willekeurige ZIP-bestanden van internet downloadt en zichzelf daarmee stil vervangt. Downloaden is daarom een handmatige stap. Het extensiebeheer laadt de bijgewerkte bestanden nadat je op **Opnieuw laden** hebt geklikt.

Automatische updates buiten de Chrome Web Store vereisen een andere distributiemethode: een update-URL met een XML-update-manifest en een ondertekend CRX-pakket. Het CRX-bestand moet zijn ondertekend met dezelfde privésleutel als de reeds geïnstalleerde extensie. Chrome beperkt zelf gehoste installaties bovendien afhankelijk van het besturingssysteem en het beheerbeleid.

Officiële informatie:
- [Chrome: Updatelevenscyclus van extensies](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle)
- [Chrome: Extensies distribueren](https://developer.chrome.com/docs/extensions/how-to/distribute)
- [Chrome: Zelf gehoste extensies op Linux](https://developer.chrome.com/docs/extensions/how-to/distribute/host-on-linux)

## Belangrijke opmerkingen

- De updatecontrole leest de versie uit de standaardbranch van GitHub. Codewijzigingen zonder verhoging van het versienummer worden niet als nieuwe update herkend.
- Verhoog vóór elke release het versienummer in `extension/manifest.json` en voeg bijpassende release-opmerkingen toe.
- Het updatecentrum downloadt alleen het openbare Extension-ZIP-bestand. Het ontvangt geen GitHub-aanmeldgegevens.
- De browser installeert de update niet stil; laad de extensie opnieuw via het extensiebeheer.
- Als je Schleim OS verwijdert en opnieuw installeert en lokale instellingen daardoor verloren gaan, kun je ze terugzetten via **Instellingen → Schleim-account** vanuit je privécloudback-up.

[GitHub-Releases-pagina](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) · [Installatiehandleiding](INSTALLATIE.md) · [Eenvoudige taal](../Leichte-Sprache/Niederländisch/UPDATES.md)
