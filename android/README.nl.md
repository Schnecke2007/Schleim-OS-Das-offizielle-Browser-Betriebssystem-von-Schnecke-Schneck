# Schleim Browser – Android-app

**Versie 0.1.0-alpha33 · GeckoView · Universele APK**

Schleim Browser is de zelfstandige Android-browser van het Schleim OS-project. De app gebruikt Mozilla GeckoView en bevat de oorspronkelijke Schleim OS-WebExtension in het APK-bestand.

## Technische architectuur

- Native Android-interface met adresbalk, zoeken, tabbladbeheer en browsermenu.
- Mozilla GeckoView als browserengine.
- De oorspronkelijke Schleim OS-Extension wordt door de releaseworkflow opgenomen onder `app/src/main/assets/extension`.
- Native Android-bruggen voor documenten opslaan, XPI-bestanden kiezen, downloads en meldingen.
- Application-ID: `de.schneckeschneck.schleimbrowser`.
- Minimale versie: Android 8.0 / API 26.
- Target-SDK: API 35; build-SDK: API 36.
- Ingebouwde ABI's: `armeabi-v7a`, `arm64-v8a` en `x86_64`; 32-bit `x86` wordt niet geleverd door de vastgezette GeckoView-build.
- JDK 17, Gradle 8.13, Android Gradle Plugin 8.13.2 en Kotlin Gradle Plugin 2.3.0.

## Browserfuncties

- Adresbalk met URL-navigatie en Google-zoekopdrachten voor zoektermen.
- Terug, Vooruit, Opnieuw laden en Startpagina.
- Tabbladbeheer met maximaal vier behouden GeckoView-sessies; tabbladen en het actieve tabblad worden lokaal opgeslagen en bij de volgende start hersteld.
- Downloads in een eigen downloadgedeelte van de app.
- Lokale browsegeschiedenis met maximaal 250 items en een functie om de geschiedenis te wissen.
- Een vaste DNS-over-HTTPS-resolver zonder normale terugval naar onversleutelde DNS; Instellingen toont alleen de status van de veilige DNS-verbinding.
- Houd links, afbeeldingen, video's en audio lang ingedrukt om een contextmenu met openen-, downloaden- en kopieeracties te tonen wanneer een direct HTTP(S)-adres beschikbaar is.
- Stuur webpagina's vanuit het browsermenu of contextmenu naar het Android-afdrukvenster om af te drukken of als PDF op te slaan.
- Open geïnstalleerde extensies via de knop **Openen** wanneer ze een optiespagina aanbieden; de ingebouwde Schleim OS-Extension opent de startpagina.
- Elke geïnstalleerde extensie heeft een eigen knop **Details**. De weergave leest GeckoView-metadata zoals beschrijving, versie, ontwikkelaar, optiespagina, vereiste/optionele machtigingen, website-toegang en gegevensverzameling.
- Optionele add-onmachtigingen kunnen afzonderlijk worden gewijzigd met GeckoView-API's addOptionalPermissions en removeOptionalPermissions.
- Compatibele add-ons kunnen **Uitvoeren in privévensters** gebruiken via WebExtensionController.setAllowedInPrivateBrowsing. Manifestinstellingen die privégebruik uitdrukkelijk verbieden, blijven gerespecteerd. Deze machtiging wordt opgeslagen en hersteld met de browserprofielback-up.
- Deze machtiging is geen systeembrede VPN-functie. VPN-/proxy-add-ons moeten zelf privésessies ondersteunen; de proxy-machtiging wordt getoond wanneer de add-on deze aanvraagt.
- Android-bestandskiezer en opslagvensters.
- Mozilla-ondertekende XPI-extensies installeren, activeren, uitschakelen en verwijderen.
- De officiële Mozilla Firefox Add-ons-catalogus rechtstreeks vanuit de extensiebeheerder openen.
- Desktopmodus en selectie als standaardbrowser van Android.
- De oorspronkelijke Extension levert het Schleim OS-startscherm, de Store, account-, personalisatie- en cloudfuncties.



## Browserprofiel, Gastmodus en accountsynchronisatie

- Bij de eerste start legt een welkomstscherm dat je kunt overslaan de belangrijkste browserfuncties uit.
- Bladwijzers kunnen worden opgeslagen, geopend, bewerkt en verwijderd.
- De wachtwoordbeheerder gebruikt de loginopslag-API van GeckoView. Nieuwe inloggegevens worden alleen na bevestiging opgeslagen; de kluis wordt versleuteld met Android Keystore en beschermd door de apparaatvergrendeling.
- Gastmodus gebruikt privé-GeckoSession-sessies. Geschiedenis, tabbladen, website- en formuliergegevens worden niet blijvend in het normale profiel opgeslagen. Account, cloud en add-onbeheer zijn in Gastmodus uitgeschakeld.
- Het Schleim-account staat in Instellingen. Aanmelden opent eerst de GitHub App-pagina in een nieuw tabblad en start daarna de apparaatcodeprocedure. De code wordt getoond/gekopieerd en de GitHub-apparaatmachtiging opent in een ander tabblad.
- Cloudback-ups worden versleuteld met AES-256-GCM en alleen opgeslagen in de privérepository schleim-os-cloud. Back-ups bevatten lokale instellingen, geschiedenis, tabbladen, bladwijzers, versleutelde aanmeldingen, add-onmetadata en beschikbare XPI-pakketten met hun in-/uitgeschakelde status.
- Websitecookies, actieve websitesessies, formulierinvoer, privégegevens van add-ons en gewone downloads worden niet overgedragen. Add-ons zonder lokaal beschikbaar XPI-installatiebestand kunnen niet automatisch op een ander apparaat worden geïnstalleerd.

## Grenzen van Android

- Camera- en microfoonopnamen zijn bewust uitgeschakeld. Android-capturemachtigingen worden niet aangevraagd en GeckoView-mediaverzoeken worden geweigerd.
- Externe websites kunnen insluiting blokkeren met hun eigen Content Security Policy of X-Frame-Options.
- Niet elke Chromium-extensie is compatibel met GeckoView.
- De release-APK gebruikt bewust de standaard Android-debugondertekening. De sleutel kan tussen GitHub-builds veranderen. Het updatevenster biedt de APK-download en een aparte bevestiging om de oude app te verwijderen; maak vóór herinstallatie een back-up van belangrijke lokale gegevens.

## Lokaal bouwen

1. Installeer JDK 17, Android SDK Platform 36 en Gradle 8.13. De bronmap `android/` in de repository bevat geen Gradle-wrapper; de downloadbare **Android-App Template**-ZIP krijgt tijdens het verpakken automatisch een wrapper.
2. Open de repository in Android Studio en selecteer de map `android/` als project.
3. Kopieer de oorspronkelijke Extension naar `app/src/main/assets/extension` en bereid het Android-GeckoView-manifest voor. GitHub Actions voert deze stappen automatisch uit.
4. Voer de build uit vanuit de projectmap:

   ```bash
   gradle --no-daemon -PgeckoviewVersion=153.0.20260810162159 :app:assembleDebug
   ```

5. De APK wordt opgeslagen in `app/build/outputs/apk/debug/app-debug.apk`.

## Release en documentatie

De Android-app wordt samen met de Extension in de gecombineerde release gepubliceerd. Gebruikershandleidingen voor installatie, updates en probleemoplossing zijn beschikbaar in drie talen:

- [Deutsch](../docs/Deutsch/ANDROID-BROWSER.md)
- [English](../docs/Englisch/ANDROID-BROWSER.md)
- [Nederlands](../docs/Niederländisch/ANDROID-BROWSER.md)

De handleiding en generator staan in de repository onder `Android-App/`. In het gedownloade ZIP-bestand heet de volledige Android Studio-projectmap **Android-App Template**.

[Android-APK downloaden](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha33.apk) · [Instructies Android Studio-template](../Android-App/README.nl.md)


## Schleim VPN (WireGuard)

Schleim Browser heeft een geïntegreerd VPN-gedeelte in het browsermenu. Het gebruikt de ingebouwde WireGuard-tunnelbibliotheek; er wordt geen aparte VPN-app gebouwd. De extensie opent het native VPN-scherm via de GeckoView-native-messagingbrug.

- Importeer een actuele persoonlijke WireGuard-configuratie (.conf) uit je Proton VPN-account. De app versleutelt het profiel met Android Keystore (AES-GCM).
- De tunnel is beperkt tot Schleim Browser. Andere Android-apps gebruiken deze browser-VPN-tunnel niet.
- De locatielijst wordt bij het openen van het VPN-scherm opgehaald uit servers.json in de repository en toont wijzigingen aan de repositorycatalogus.
- Proton heeft het eerder openbare serverlijst-eindpunt uitgeschakeld. Betrouwbare live-serverdetectie rechtstreeks bij Proton is daarom niet beschikbaar. Importeer actuele persoonlijke .conf-bestanden uit je eigen Proton-account.
- Free verwijst naar locaties die Proton in het Free-abonnement aanbiedt. Schleim Browser beheert zelf geen VPN-servers en garandeert de beschikbaarheid niet.
- De openbare .conf-bestanden in deze repository zijn opgeschoond en bevatten geen privésleutels. Eerder blootgestelde sleutels moeten bij Proton worden vernieuwd.

### Universele APK

De build splitst de app niet in aparte APK-bestanden. Eén APK bevat ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) en x86_64. 32-bit x86 wordt niet ondersteund door de vastgezette GeckoView-bibliotheek. Android 8.0 (API 26) of hoger blijft vereist.


- **Live-snelheden:** Het VPN-venster toont download (ontvangen) en upload (verzonden) in Mbit/s plus de cumulatief overgedragen MB.
- **Van profiel wisselen:** Kies een ander lokaal geïmporteerd WireGuard-profiel en maak rechtstreeks vanuit het browsermenu verbinding.
- **Privacy van profielen:** De app verwijdert commentaarregels en de oorspronkelijke bestandsnaam, geeft het profiel een neutrale lokale naam en versleutelt de volledige configuratie met Android Keystore (AES-GCM). Noodzakelijke privésleutels blijven op het apparaat; de VPN-provider kan de sleutel nog steeds aan het account koppelen.
