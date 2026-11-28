# Schleim OS 3.22.1 – Android Alpha 33

## Schleim VPN in de browser
- Native WireGuard-integratie rechtstreeks in Schleim Browser; geen aparte VPN-app.
- VPN-scherm in het browsermenu met status, locatiekeuze, profielimport en verbreken.
- De Free-loc lijst komt uit de Schleim OS-repository. Dit is een referentielijst, geen live Proton-beschikbaarheids- of belastingscontrole.
- Om te verbinden, importeer je een volledige persoonlijke WireGuard-.conf die in je eigen Proton-account is gemaakt. Profielen worden lokaal versleuteld opgeslagen met AES-GCM en Android Keystore.
- De tunnel is beperkt tot Schleim Browser. Andere Android-apps gebruiken de tunnel niet.
- Openbare voorbeelden bevatten geen privésleutel. De browserextensie kan de native Android-VPN-tunnel niet starten of bedienen.

## Universele APK
- Eén APK bevat GeckoView voor ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) en x86_64.
- 32-bit x86 wordt niet ondersteund, omdat de vastgezette GeckoView-build geen native bibliotheken hiervoor levert.
- De minimumversie blijft Android 8.0 / API 26. Android 7 wordt niet ondersteund.

Proton VPN Free kan serverwissels willekeurig toewijzen en wachttijden toepassen. Het openbare Proton-serverlijstendpoint is niet officieel ondersteund en is uitgeschakeld. De locatielijst blijft alleen automatisch actueel als de repositorycatalogus wordt bijgewerkt.

De vaste NextDNS-resolver, bruine interface, tabs, geschiedenis, bladwijzers, wachtwoordbeheerder en extensies blijven behouden.


## Extensiedetails
- Elke add-on heeft een detailweergave met de metadata en machtigingen die GeckoView levert.
- Optionele machtigingen kunnen afzonderlijk worden beheerd waar GeckoView dit ondersteunt.
- De optie voor privévensters wordt alleen getoond als de add-on en GeckoView dit toestaan.

**Beveiliging:** Privé-WireGuard-sleutels zijn uit openbare serverbestanden verwijderd. Omdat ze eerder openbaar waren, moet je de betrokken sleutels bij Proton vernieuwen.


## Release 3.22.1

Deze release bevat de opnieuw gebouwde Schleim Browser Android Alpha 33 en bijgewerkte releasepakketten. De Android-APK, de originele Extension-ZIP, de browser-/Extension-sjablonen en het SHA-256-controlebestand zijn opnieuw gemaakt en gecontroleerd door GitHub Actions. De bovenstaande functiebeschrijvingen beschrijven de meegeleverde browser- en Extension-versie. De release-opmerkingen 3.22.0 blijven beschikbaar als historische documentatie.
