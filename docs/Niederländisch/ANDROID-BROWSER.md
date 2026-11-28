# Schleim Browser – Android-app

Schleim OS is nu beschikbaar in twee afzonderlijke varianten:

- **Browser-Extension:** De oorspronkelijke Schleim OS-nieuw-tabbladinterface voor compatibele Chromium-browsers.
- **Schleim Browser:** Een zelfstandige Android-app op basis van Mozilla GeckoView. De app bevat de Schleim OS-Extension en combineert deze met een native browserbalk, tabbladen en Android-bestandsfuncties.

De Android-app vervangt Android niet. Het is een browser die op Android draait.

## Download

Open de [GitHub-Releases-pagina](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) en download **Schleim-Browser-Android-0.1.0-alpha33.apk**.

Directe download: [Schleim Browser voor Android – APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha33.apk)

## Systeemvereisten

- Android 8.0 of nieuwer (API 26+)
- ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) of x86_64
- Internetverbinding voor websites, Extension-inhoud en online functies
- Ongeveer 200 MB vrije opslagruimte voor de APK en aanvullende appgegevens

De app wordt gebouwd met Android SDK 36. De minimale versie blijft Android 8.0 (API 26). De universele APK bevat ARMv7, ARM64 en x86_64. 32-bit x86 wordt niet ondersteund door de vastgezette GeckoView-build. Android 7 wordt niet ondersteund.

## Installatie

1. Download de APK uit de release.
2. Open de gedownloade APK met de Android-bestandsbeheerder.
3. Android kan vragen om **Onbekende apps installeren** toe te staan voor de gebruikte browser of bestandsbeheerder. Geef deze toestemming alleen aan een bron die je vertrouwt.
4. Open de APK opnieuw en kies **Installeren**.
5. Start daarna **Schleim Browser**.

Android kan een waarschuwing tonen omdat de APK buiten Google Play wordt verspreid. Controleer vóór de installatie of de download afkomstig is van de officiële GitHub-repository.

## Aan de slag

- **Adres of zoeken:** Voer een webadres of zoekterm in de adresbalk in.
- **Navigatie:** Gebruik Terug, Vooruit en Opnieuw laden.
- **Startpagina:** Opent de ingebouwde Schleim OS-interface.
- **Tabbladen:** Gebruik het tabbladpictogram om tussen pagina's te wisselen, tabbladen te sluiten en nieuwe tabbladen te openen.
- **Browsermenu:** Bevat onder andere Downloads, Extensies, Desktopweergave en Instellingen.
- **Standaardbrowser:** Via Instellingen kun je Android vragen Schleim Browser als standaardbrowser in te stellen.
- **Downloads en bestanden:** Gedownloade bestanden worden opgeslagen in de eigen downloadmap van de app. Android toont de bestandskiezer en opslagvensters.

## Functies en beperkingen

De Android-app bundelt de Schleim OS-Extension in GeckoView. De startpagina, apps, personalisatie, Schleim-Store, Schleim-account en cloudfuncties zijn inbegrepen.

- Er worden maximaal vier browsertabbladen tegelijk opengehouden. Bij meer tabbladen wordt een ouder achtergrondtabblad verwijderd om geheugen en bronnen te beperken.
- De Android-app ondersteunt bestandsuploads en het Android-venster om geëxporteerde bestanden op te slaan.
- Mozilla-ondertekende XPI-extensies kunnen via het browsermenu worden geïnstalleerd.
- **Mozilla Firefox Add-ons:** De knop in de extensiebeheerder opent opnieuw de officiële [Firefox Add-ons-catalogus](https://addons.mozilla.org/firefox/). Compatibele, door Mozilla ondertekende XPI-bestanden kunnen worden gedownload en daarna via **XPI-bestand installeren** worden geïnstalleerd.
- **Contextmenu:** Houd een link, afbeelding, video of audio-element lang ingedrukt. Het menu biedt passende acties om te openen, te downloaden of het adres te kopiëren. Downloads werken wanneer een direct HTTP(S)-adres beschikbaar is.
- **Afdrukken:** Stuur de huidige webpagina vanuit het browsermenu of contextmenu naar het Android-afdrukvenster. Kies een printer of selecteer **Opslaan als PDF**.
- **Extensies openen:** De extensiebeheerder toont een knop **Openen** voor add-ons met een ingestelde optiespagina. De ingebouwde Schleim OS-Extension opent de startpagina.
- **Details per extensie:** Elke geïnstalleerde extensie heeft een eigen knop **Details**. De detailweergave toont alleen gegevens die GeckoView voor die add-on doorgeeft: beschrijving, versie, ontwikkelaar, homepage, optiespagina, vereiste en optionele machtigingen en website-toegang. Optionele machtigingen kunnen afzonderlijk worden gegeven of ingetrokken. Een beschikbare optiespagina kan direct worden geopend.
- **Privévensters:** Als het manifest privégebruik niet uitdrukkelijk verbiedt, bevat de detailweergave de optie **Uitvoeren in privévensters**. Dit gebruikt GeckoView's setAllowedInPrivateBrowsing-API en wordt meegenomen in de back-up en het herstel van het browserprofiel. De instelling wordt per extensie opgeslagen. De machtiging proxy wordt weergegeven wanneer de add-on deze aanvraagt.
- Camera- en microfoonopnamen zijn in de Android-app bewust uitgeschakeld. De Camera-tegel legt deze beperking uit. De JavaScript-webcam van de oorspronkelijke browser-Extension blijft hiervan gescheiden.
- Sommige websites blokkeren insluiting in andere pagina's. De inhoud kan leeg blijven of moet rechtstreeks worden geopend.
- Niet elke Chrome-desktopextensie is compatibel met GeckoView.

## Geschiedenis, DNS en automatisch opgeslagen tabbladen

- **Geschiedenis:** Open **Geschiedenis** via het browsermenu. Je ziet succesvol bezochte HTTP- en HTTPS-pagina's met titel, adres en bezoektijd. De geschiedenis wordt lokaal opgeslagen, bevat maximaal 250 items en kan worden gewist met **Geschiedenis wissen**.
- **Veilige DNS-verbinding:** Schleim Browser gebruikt voor normale DNS-aanvragen een vaste DNS-over-HTTPS-resolver. De verbinding is versleuteld via HTTPS. Deze configuratie kan niet worden gewijzigd. In Instellingen staat alleen **Veilige DNS-verbinding**; het serveradres en de naam van de aanbieder worden daar niet getoond.
- **Tabbladen automatisch opslaan:** Maximaal vier geopende tabbladen en het actieve tabblad worden automatisch opgeslagen. Bij de volgende start worden de tabbladen hersteld met hun laatst geopende adres. De volledige terug-/vooruitnavigatie van een pagina wordt niet opgeslagen.
- Geschiedenis en tabbladen staan in de lokale appgegevens. Als je de app verwijdert, kunnen deze gegevens verloren gaan.

## Welkomstscherm, Gastmodus en Schleim-account

Bij de eerste start toont Schleim Browser een korte uitleg. Gebruik **Volgende** en **Terug** om door de belangrijkste functies te gaan. Je kunt de uitleg overslaan of direct beginnen met browsen.

- **Bladwijzers:** Bewaar een webpagina, open deze later opnieuw en wijzig of verwijder opgeslagen items.
- **Wachtwoordbeheer:** Nieuwe inloggegevens worden pas opgeslagen nadat je dit bevestigt. Wachtwoorden worden versleuteld en beschermd met Android Keystore. Je hebt de veilige schermvergrendeling van het apparaat nodig om de wachtwoordbeheerder te openen. Je kunt in de wachtwoordbeheerder suggesties en automatisch invullen inschakelen.
- **Gastmodus:** Start een privésessie vanuit de uitleg of het browsermenu. Gasttabbladen gebruiken privé GeckoView-sessies. Geschiedenis, tabbladen, bladwijzers, wachtwoorden, formuliergegevens en websitegegevens worden niet naar het normale profiel gekopieerd of met de cloud gesynchroniseerd. Aanmelden bij een account en add-onbeheer zijn ook uitgeschakeld. Je gewone browserprofiel blijft ongewijzigd. Gasttabbladen worden niet voor de volgende start opgeslagen.
- **Account openen:** Het Schleim-account staat onder **Browsermenu → Instellingen → Schleim-account**. Back-up en herstel via de cloud zijn geblokkeerd totdat het aanmelden is gelukt.
- **Eerste keer aanmelden:** Kies **Schleim OS Account openen**. De GitHub App-pagina opent in een nieuw browsertabblad. Installeer daar de GitHub-app **Schleim OS Account**. Je kunt dat tabblad sluiten en teruggaan naar **Instellingen → Schleim-account**. Kies daarna **Verder – apparaatcode tonen**.
- **Apparaatcode bevestigen:** De eenmalige code verschijnt in de browser en wordt automatisch naar het klembord gekopieerd. De GitHub-pagina voor apparaatmachtiging opent in een tweede tabblad. Je kunt de code opnieuw kopiëren of met **Terug** naar het vorige tabblad gaan. De app controleert de toestemming automatisch. Voer je GitHub-wachtwoord alleen rechtstreeks bij GitHub in.
- **Privécloudback-up:** Na het aanmelden gebruikt de app de privérepository schleim-os-cloud. Deze wordt indien nodig bij de eerste aanmelding aangemaakt. Browserback-ups worden vóór het uploaden versleuteld met AES-256-GCM. Voor herstel op een ander apparaat heb je hetzelfde GitHub-account en je back-upwachtwoord nodig. Automatische back-up is optioneel en kan in het account worden ingeschakeld.

De browserprofielback-up bevat lokale instellingen, geschiedenis, opgeslagen tabbladen, bladwijzers, de versleutelde wachtwoordkluis en add-oninformatie. XPI-installatiepakketten worden meegenomen wanneer ze in de appopslag aanwezig zijn en kunnen bij het herstellen opnieuw worden geïnstalleerd. Websitecookies en actieve websitesessies, formulierinvoer, privégegevens van afzonderlijke add-ons en gewone downloads worden niet meegenomen. De volledige terug-/vooruitnavigatiestatus per webpagina wordt ook niet overgedragen.

## Updates


De Android-app wordt afzonderlijk bijgewerkt van de browser-Extension. Open **Browsermenu → Instellingen → Controleren op updates**. Als er een update beschikbaar is, download je eerst de APK via het updatevenster. Kies daarna **Oude app verwijderen**. Android toont hiervoor een eigen bevestigingsvenster. Installeer vervolgens de gedownloade APK vanuit de map Downloads.

De release-APK gebruikt de standaard Android-debugondertekening. Deze sleutel kan per build veranderen. Een directe update over de bestaande app is daarom niet gegarandeerd. Verwijder de oude app voordat je de nieuwe APK installeert. Maak vooraf een back-up van belangrijke gegevens. Verwijderen kan de geschiedenis, opgeslagen tabbladen en andere lokale appgegevens wissen.

## Android Studio-sjabloon

De release bevat ook **Schleim-Browser-Android-Studio-Template.zip**. Het archief bevat een volledig Android Studio-project met Android-broncode en een ingebouwde voorbeeld-Extension. Persoonlijke gegevens, application-ID, GitHub-repository, website en contactgegevens zijn alleen binnen de sjabloon vervangen door neutrale plaatsaanduidingen. De productie-app in de repository wordt niet gewijzigd.

1. Download en pak het sjabloon-ZIP-bestand uit.
2. Open de projectmap **Android-App Template** in Android Studio.
3. Pas application-ID, appnaam, Extension, links en plaatsaanduidingen aan.
4. Synchroniseer Gradle en bouw je eigen test-APK.
5. Configureer voor publicatie je eigen blijvende ondertekeningssleutel.

[Android Studio-sjabloon downloaden](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-Studio-Template.zip) · [Sjabloonhandleiding](../../Android-App/README.nl.md)

## Problemen oplossen

| Probleem | Oplossing |
|---|---|
| Android blokkeert de installatie. | Sta installatie van onbekende apps alleen toe voor de gebruikte bestandsbeheerder of browser en open de APK opnieuw. |
| 'App niet geïnstalleerd' verschijnt bij een update. | De debug-ondertekening kan per build verschillen. Maak een back-up, verwijder de oude app en installeer de nieuwe APK. |
| Pagina's zijn traag of de app reageert niet. | Sluit ongebruikte tabbladen, laad de pagina opnieuw en start de app opnieuw. Meld bij herhaalde ANR-meldingen je Android-versie, apparaatmodel en stappen via GitHub Issues. |
| Een Extension kan niet worden geïnstalleerd. | Mozilla-ondertekende XPI-bestanden worden ondersteund. ZIP-, CRX- en uitgepakte projectmappen zijn geen XPI-bestanden. |
| Camera of microfoon werkt niet. | Opnamefuncties zijn bewust uitgeschakeld in de Android-app. |
| Een website wordt niet ingesloten. | Open de website rechtstreeks of gebruik een andere website. De aanbieder kan insluiting blokkeren. |

## Technische informatie

- Engine: Mozilla GeckoView
- Application-ID: de.schneckeschneck.schleimbrowser
- Minimale Android-versie: API 26
- Target SDK: API 35
- Build SDK: API 36
- Gebundelde ABI's: ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) en x86_64; 32-bit x86 wordt niet geleverd door de vastgezette GeckoView-versie

[Hoofddocumentatie](../../README.nl.md) · [Installatie van de browser-Extension](INSTALLATIE.md) · [Problemen oplossen](PROBLEMEN-OPLOSSEN.md) · [Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)

## Schleim VPN

Open **Browsermenu → Schleim VPN**. Importeer je persoonlijke WireGuard-.conf-bestand via de Android-bestandskiezer. De app verwijdert commentaarregels en de oorspronkelijke bestandsnaam, geeft het profiel een neutrale lokale naam en versleutelt de volledige configuratie met Android Keystore (AES-GCM). Sleutels en tunneladressen die nodig zijn voor een werkende verbinding blijven behouden; ze worden niet naar GitHub of de APK gekopieerd.

Je kunt de VPN-tunnel in- en uitschakelen, wisselen tussen geïmporteerde profielen en live datasnelheden bekijken: download (ontvangen) en upload (verzonden) in Mbit/s, plus cumulatieve totalen in MB. Deze metingen gelden alleen voor de Schleim Browser-tunnel. De tunnel is beperkt tot Schleim Browser; andere Android-apps gebruiken deze tunnel niet. De app kan niet voorkomen dat de VPN-provider de cryptografische sleutel aan zijn account koppelt.

De locatielijst is een referentiecatalogus en toont geen live serverbeschikbaarheid. Vernieuw eerder openbaar gemaakte sleutels bij de provider.
