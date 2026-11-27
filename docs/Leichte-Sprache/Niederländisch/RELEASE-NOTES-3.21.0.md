# Schleim OS 3.21.0 – Nieuwe extensiedetails

## Schleim Browser voor Android

- **Details:** Elke extensie heeft nu een eigen knop **Details**.
- **Informatie:** Je ziet de gegevens die de browser over die extensie heeft. Bijvoorbeeld de naam, versie, beschrijving en machtigingen.
- **Instellingen:** Heeft een extensie een eigen instellingenpagina? Dan kun je die openen. Heeft de extensie geen pagina, dan vertelt de browser dat.
- **Machtigingen:** Je kunt optionele machtigingen één voor één geven of intrekken.
- **Privévensters:** Bij geschikte extensies kun je **Uitvoeren in privévensters** inschakelen. Het manifest van de extensie mag privégebruik niet verbieden.
- **VPN:** Deze instelling maakt op zichzelf geen VPN. Een VPN-extensie moet privévensters zelf ondersteunen. De browser start geen Android-systeembrede VPN-tunnel.
- **Back-up:** De instelling voor privévensters wordt opgeslagen in het versleutelde browserprofiel. Je kunt deze op een ander apparaat herstellen.

## Wat blijft hetzelfde?

Het bruine ontwerp **#251205**, tabbladen, geschiedenis, bladwijzers, wachtwoordbeheer, Gastmodus en NextDNS blijven hetzelfde. De DNS-instelling wordt niet gewijzigd.

## Belangrijke opmerkingen

Niet elke extensie heeft een eigen instellingenpagina. Niet elke extensie werkt met GeckoView. De browser toont alleen informatie die hij echt van de extensie ontvangt.

## Versies

- Browser-Extension: **3.21.0**
- Schleim Browser: **0.1.0-alpha32**

Mogelijk moet je de oude app verwijderen voordat je een nieuwe installeert. Maak eerst een back-up van belangrijke gegevens.


## Android – Alpha 32

- De nieuwe APK werkt met drie processortypen: ARMv7, ARM64 en x86_64.
- Android 8.0 of nieuwer blijft nodig.
- Schleim Browser heeft nu een VPN-menu.
- De Extension heeft een VPN-tegel.
- OpenVPN for Android is ook nodig voor de VPN-verbinding.
- De oude Proton-bestanden komen uit 2023. Ze zijn niet gecontroleerd. Gebruik nieuwe VPN-bestanden en je eigen OpenVPN-inloggegevens.
