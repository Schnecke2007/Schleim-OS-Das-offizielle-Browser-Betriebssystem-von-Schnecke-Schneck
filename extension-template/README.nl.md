# Browser OS – Extensie-template

**Templateversie: 3.14.7**

Browser OS is een neutraal, meertalig Manifest V3-template voor Chromium-browsers. Het bevat voorbeeldteksten en tijdelijke invulvelden in plaats van persoonlijke gegevens uit het oorspronkelijke project.

## Functies

- Nieuw tabblad met apps, zoeken, snelle instellingen en thema's
- Taalkeuze: Duits, Engels en Nederlands
- Voorbeeldaccount met GitHub Device Flow en privéback-up van instellingen
- Foto- en videocloud met galerij, zoeken en camera-app
- Browser Store met voorbeeldapps, beoordelingen en suggesties
- Optionele lokale beeldanalyse via de Prompt API
- Zelfstandige HTML-demo voor webhosting

## Downloaden en installeren

Download [Schleim-OS-Extension-Template.zip uit de nieuwste release](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-OS-Extension-Template.zip). **Pak het ZIP-bestand niet uit.** Open het extensiebeheer van een browser die lokale ZIP-import ondersteunt, selecteer het ZIP-bestand en bevestig de import. Alleen downloaden installeert niets.

De gewone Google Chrome voor Android ondersteunt geen extensies. Desktop-Chrome kan in de ontwikkelaarsmodus een map laden, maar geen ZIP-bestanden rechtstreeks importeren.

## Je eigen versie maken

Gebruik een eigen Git-repository voor de bronbestanden. Pas `manifest.json`, profiel, links, Store-inhoud en de tijdelijke waarden in de scripts aan. Configureer je eigen GitHub App en privé-repositories voordat je account- of cloudfuncties gebruikt.

De updatefunctie downloadt uitsluitend `Schleim-OS-Extension-Template.zip` uit de nieuwste release van je ingestelde repository. Gebruik exact deze bestandsnaam voor je eigen release.

## Documentatie

- [Deutsch](docs/Deutsch/README.md)
- [English](docs/Englisch/README.md)
- [Nederlands](docs/Niederländisch/README.md)
- [Eenvoudige taal](docs/Leichte-Sprache/Niederländisch/README.md)
- [Configuratie](CONFIGURATION.md)
- [Account en privécloud](docs/ACCOUNT-AND-CLOUD.md)
- [Technische informatie](docs/TECHNICAL-NOTES.md)

Alle profielen, afbeeldingen, accounts, repositories en juridische teksten zijn voorbeelden. Vervang ze voordat je publiceert.