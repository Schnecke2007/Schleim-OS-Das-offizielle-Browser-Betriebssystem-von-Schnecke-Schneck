# Schleim OS 3.21.0 – Extensiedetails en privé browsen

## Schleim Browser voor Android

- **Details voor elke add-on:** De extensiebeheerder heeft nu voor elke geïnstalleerde extensie een eigen knop **Details**. De detailweergave gebruikt de werkelijke GeckoView-metadata van die add-on.
- **Add-oninformatie:** Waar de add-on deze gegevens levert, toont het scherm de naam, versie, status, beschrijving, ontwikkelaar, homepage, Mozilla Add-ons-link, optiespagina, beoordeling, vereiste machtigingen, website-toegang en informatie over gegevensverzameling. Ontbrekende gegevens worden niet verzonnen.
- **Eigen instellingen:** Wanneer GeckoView een optiespagina doorgeeft, kan deze direct vanuit de detailweergave worden geopend. Als er geen optiespagina is, meldt de browser dat.
- **Optionele machtigingen:** Optionele API-machtigingen, website-toegang en machtigingen voor gegevensverzameling worden afzonderlijk getoond. Je kunt elk onderdeel vanuit de detailweergave geven of intrekken.
- **Privévensters:** Voor externe add-ons waarvan het manifest privégebruik niet uitdrukkelijk verbiedt, bevat de detailweergave **Uitvoeren in privévensters**. Dit gebruikt GeckoView's setAllowedInPrivateBrowsing-functie. Als het manifest not_allowed vermeldt, blijft de optie uitgeschakeld.
- **VPN- en proxy-add-ons:** Als een extensie de machtiging proxy aanvraagt, wordt deze herkenbaar weergegeven als proxybeheer. Een extensie toestaan in privévensters maakt op zichzelf geen VPN-tunnel. De extensie moet privésessies zelf ondersteunen en juist worden ingesteld. Dit schakelt geen systeembrede VPN-bescherming in.
- **Profielsynchronisatie:** De instelling **Uitvoeren in privévensters** wordt samen met de in-/uitgeschakelde status van elke add-on in de versleutelde browserprofielback-up opgenomen en op een ander apparaat hersteld.

## Privacy, ontwerp en bestaande functies

- Het donkerbruine ontwerp **#251205**, tabbladen, lokale geschiedenis, bladwijzers, wachtwoordbeheer, Gastmodus en add-onondersteuning blijven behouden.
- De bestaande DNS-over-HTTPS-/NextDNS-configuratie is ongewijzigd.
- Gastmodus blijft gescheiden van het normale profiel en accountsynchronisatie.

## Opmerkingen en beperkingen

- GeckoView kan alleen informatie tonen die een geïnstalleerde add-on daadwerkelijk doorgeeft. Sommige extensies hebben geen optiespagina of ontwikkelaars-/beoordelingsgegevens.
- Niet elke Firefox-extensie werkt met GeckoView. Toegang tot privévensters garandeert niet dat elke extensiefunctie daar werkt.
- De machtiging voor privévensters is een browser-/add-onmachtiging. Ze vervangt geen afzonderlijke VPN-app of Android-systeemtunnel.

## Versies

- Browser-Extension: **3.21.0**
- Schleim Browser voor Android: **0.1.0-alpha32**
- Mozilla GeckoView · Android 8.0+ · ARM64

De Android-APK gebruikt de standaard Android-debugondertekening. Afhankelijk van de build moet de oude app mogelijk eerst worden verwijderd. Maak een back-up van belangrijke lokale gegevens en zo nodig een versleutelde profielback-up voordat je de oude app verwijdert.
