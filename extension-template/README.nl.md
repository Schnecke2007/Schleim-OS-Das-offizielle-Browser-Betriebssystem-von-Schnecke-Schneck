# Browser OS – Extensie-template

**Templateversie: 3.22.0**

Browser OS is een neutraal, meertalig Manifest V3-template voor Chromium-browsers. Het bevat demoteksten, voorbeeldafbeeldingen en tijdelijke invulvelden in plaats van persoonlijke gegevens uit het oorspronkelijke project.

## Functies

- Nieuw tabblad met apps, zoeken, snelle instellingen en thema’s
- Taalkeuze: Duits, Engels en Nederlands
- Voorbeeldaccount met GitHub Device Flow en privéback-up van instellingen
- Foto- en videocloud met galerij, zoeken en camera-app
- Achtergronduploads met voortgang en meldingen
- Browser Store met voorbeeldapps, beoordelingen en suggesties
- Optionele lokale beeldanalyse via de Prompt API
- Zelfstandige HTML-demo voor webhosting

## Downloaden en installeren

Download [Browser-OS-Extension-Template.zip uit de nieuwste release van je eigen GitHub-repository](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/releases/latest/download/Browser-OS-Extension-Template.zip). **Pak het ZIP-bestand niet uit.** Open het extensiebeheer van een browser die lokale ZIP-import ondersteunt, selecteer het ZIP-bestand en bevestig de import. Alleen downloaden installeert niets automatisch.

De gewone Google Chrome voor Android ondersteunt geen extensies. Desktop-Chrome kan in de ontwikkelaarsmodus een map laden, maar geen ZIP-bestanden rechtstreeks importeren.

## Je eigen versie maken

Gebruik een eigen Git-repository voor de bronbestanden. Pas `manifest.json`, profiel, links, Store-inhoud en de tijdelijke waarden in de scripts aan. Configureer je eigen GitHub App en privé-repositories voordat je account- of cloudfuncties gebruikt.

De updatefunctie downloadt uitsluitend **Browser-OS-Extension-Template.zip** uit de nieuwste release van je ingestelde repository. Gebruik exact deze bestandsnaam voor je eigen release.

## Documentatie

- [Deutsch](docs/Deutsch/README.md)
- [English](docs/Englisch/README.md)
- [Nederlands](docs/Niederländisch/README.md)
- [Leichte Sprache – Deutsch](docs/Leichte-Sprache/Deutsch/README.md)
- [Easy Language – English](docs/Leichte-Sprache/Englisch/README.md)
- [Eenvoudige taal – Nederlands](docs/Leichte-Sprache/Niederländisch/README.md)
- [Documentatie en taalkeuze](docs/README.md)
- [Configuratie](docs/Niederländisch/CONFIGURATIE.md)
- [Account en privécloud](docs/Niederländisch/ACCOUNT-EN-PRIVECLOUD.md)
- [Technische informatie](docs/Niederländisch/TECHNIEK.md)

Alle profielen, afbeeldingen, accounts, repositories en juridische teksten zijn voorbeelden. Vervang ze voordat je publiceert.


## Optionele Android-VPN-brug

De template bevat een Schleim VPN-tegel op de nieuwe-tabpagina. In een Android-GeckoView-host die de native-messagebrug `browser` registreert, vraagt de tegel om het native VPN-scherm te openen. Desktopbrowsers tonen een melding, omdat extensies Android `VpnService` niet rechtstreeks kunnen starten.

De native Android-template bevat WireGuard-tunnelondersteuning en versleutelde lokale profielopslag. Importeer een actuele persoonlijke `.conf`-configuratie in de app; plaats nooit een privé-WireGuard-sleutel in de extensie of openbare repository. De VPN-tunnel is bedoeld om alleen het browserpakket te gebruiken.
