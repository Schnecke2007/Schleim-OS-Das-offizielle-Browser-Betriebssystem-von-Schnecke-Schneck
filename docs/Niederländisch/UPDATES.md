# Schleim OS bijwerken

Het updatecentrum in Schleim OS downloadt de oorspronkelijke Extension rechtstreeks uit de nieuwste [GitHub-release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest). Je hoeft de Releases-pagina niet zelf te openen om de download te starten.

## De update downloaden

1. Open **Instellingen → Schleim OS bijwerken** in Schleim OS.
2. Kies **Controleren op updates**.
3. Is er een nieuwere versie beschikbaar? Kies dan **Oorspronkelijke Extension-ZIP downloaden**.
4. De browser downloadt **Schleim-OS-Extension.zip** rechtstreeks uit de nieuwste release. Je kunt ook [de oorspronkelijke Extension rechtstreeks via Releases downloaden](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension.zip).

## De update in je browser installeren

1. **Pak het ZIP-bestand niet uit.** Laat het archief ongewijzigd.
2. Open het extensiebeheer van een browser die lokale ZIP-extensies kan importeren.
3. Schakel zo nodig Ontwikkelaarsmodus in.
4. Kies **+ (from .zip/.crx/.user.js)** of de vergelijkbare importoptie van je browser.
5. Selecteer het gedownloade bestand **Schleim-OS-Extension.zip**.
6. Bevestig de import of update in je browser.

Schleim OS start de download voor je. Om veiligheidsredenen wordt de installatie niet automatisch uitgevoerd: je moet de ZIP-import en de bevestiging in de browser zelf starten.

## Browserondersteuning

Deze handleiding zonder uitpakken geldt voor browsers waarvan het extensiebeheer lokale ZIP-import aanbiedt. De gewone Google Chrome voor Android ondersteunt geen extensies. Desktop-Chrome biedt geen rechtstreekse ZIP-import; **Uitgepakte extensie laden** laadt een map. Een browser zonder ZIP-import kan de ZIP niet via deze methode installeren.

## Belangrijke opmerkingen

- De updatecontrole leest de versie uit `extension/manifest.json` in de standaardbranch van GitHub. Codewijzigingen zonder verhoging van het versienummer worden niet als nieuwe update herkend.
- Verhoog vóór een nieuwe release van de oorspronkelijke Extension het versienummer in `extension/manifest.json` en voeg bijpassende release-opmerkingen toe.
- Het updatecentrum downloadt alleen het openbare ZIP-bestand van de oorspronkelijke Extension. Het ontvangt geen GitHub-aanmeldgegevens.
- De browserbevestiging blijft handmatig. Alleen het downloaden van de ZIP installeert de update niet.
- Als je Schleim OS volledig verwijdert en lokale instellingen verliest, kun je die herstellen vanuit je privécloudback-up via **Instellingen → Schleim-account**.

[GitHub-Releases-pagina](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) · [Installatiehandleiding](INSTALLATIE.md) · [Eenvoudige taal](../Leichte-Sprache/Niederländisch/UPDATES.md)
