# Schleim OS 3.22.1 – Android Alpha 33

## Schleim VPN
- Schleim Browser heeft nu een VPN.
- De VPN zit in de browser. Je hebt geen aparte VPN-app nodig.
- De VPN gebruikt WireGuard.
- Je kunt een locatie kiezen en je eigen WireGuard-bestand importeren.
- Het bestand wordt versleuteld op je apparaat bewaard.
- Alleen Schleim Browser gebruikt de VPN. Andere Android-apps gebruiken hun normale internetverbinding.
- De browserextensie kan de Android-VPN niet inschakelen.

## Serverlijst
- De lijst komt uit de Schleim OS-repository.
- Je kunt de lijst vernieuwen. De lijst toont geen live Proton-servergegevens.
- Voor een verbinding heb je je eigen volledige .conf-bestand uit je Proton-account nodig.
- Openbare voorbeelden hebben geen privésleutel.

## Eén APK voor meerdere apparaten
De APK ondersteunt ARMv7, ARM64 en x86_64. 32-bit x86 wordt niet ondersteund. GeckoView levert de benodigde bibliotheek niet.

De browser heeft Android 8 of nieuwer nodig. Android 7 werkt niet. De NextDNS-server en bestaande browserfuncties blijven hetzelfde.


## Nieuwe extensiedetails
- Elke extensie heeft nu een detailpagina.
- De pagina toont informatie en machtigingen van de extensie.
- Sommige extra machtigingen kun je afzonderlijk aan- of uitzetten.
- De VPN-tegel in de extensie opent het VPN-menu in de Android-app.
- De extensie maakt zelf geen VPN-tunnel.
- Een extensie mag alleen in privévensters werken als de extensie dit toestaat.

## Belangrijk over VPN-sleutels
Privé-VPN-sleutels waren eerder openbaar. Ze zijn uit de bestanden verwijderd. Maak bij Proton nieuwe sleutels en nieuwe configuratiebestanden.


## Release 3.22.1

- Er is een nieuwe Android-versie: Alpha 33.
- De APK is opnieuw gebouwd en gecontroleerd.
- De ZIP-bestanden voor de browser en Extension zijn ook opnieuw gemaakt.
- Een bestand controleert de SHA-256-controlesommen.
- De oude release-opmerkingen 3.22.0 blijven beschikbaar.
