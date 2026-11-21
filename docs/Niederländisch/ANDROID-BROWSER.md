# Schleim Browser – Android-app

Schleim OS is nu beschikbaar in twee afzonderlijke varianten:

- **Browser-Extension:** De oorspronkelijke Schleim OS-nieuw-tabbladinterface voor compatibele Chromium-browsers.
- **Schleim Browser:** Een zelfstandige Android-app op basis van Mozilla GeckoView. De app bevat de Schleim OS-Extension en combineert deze met een native browserbalk, tabbladen en Android-bestandsfuncties.

De Android-app vervangt Android niet. Het is een browser die op Android draait.

## Download

Open de [GitHub-Releases-pagina](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) en download **Schleim-Browser-Android-0.1.0-alpha24.apk**.

Directe download: [Schleim Browser voor Android – APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha24.apk)

## Systeemvereisten

- Android 8.0 of nieuwer (API 26+)
- 64-bits ARM-apparaat (arm64-v8a)
- Internetverbinding voor websites, Extension-inhoud en online functies
- Ongeveer 200 MB vrije opslagruimte voor de APK en aanvullende appgegevens

De app wordt gebouwd met Android SDK 36. De minimale Android-runtimeversie blijft Android 8.0 (API 26).

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

- Er worden maximaal zes browsertabbladen tegelijk opengehouden. Bij meer tabbladen wordt een ouder achtergrondtabblad verwijderd om geheugen en bronnen te beperken.
- De Android-app ondersteunt bestandsuploads en het Android-venster om geëxporteerde bestanden op te slaan.
- Mozilla-ondertekende XPI-extensies kunnen via het browsermenu worden geïnstalleerd.
- **Contextmenu:** Houd een link, afbeelding, video of audio-element lang ingedrukt. Het menu biedt passende acties om te openen, te downloaden of het adres te kopiëren. Downloads werken wanneer een direct HTTP(S)-adres beschikbaar is.
- **Afdrukken:** Stuur de huidige webpagina vanuit het browsermenu of contextmenu naar het Android-afdrukvenster. Kies een printer of selecteer **Opslaan als PDF**.
- **Extensies openen:** De extensiebeheerder toont een knop **Openen** voor add-ons met een ingestelde optiespagina. De ingebouwde Schleim OS-Extension opent de startpagina.
- Camera- en microfoonopnamen zijn in de Android-app bewust uitgeschakeld. De Camera-tegel legt deze beperking uit. De JavaScript-webcam van de oorspronkelijke browser-Extension blijft hiervan gescheiden.
- Sommige websites blokkeren insluiting in andere pagina's. De inhoud kan leeg blijven of moet rechtstreeks worden geopend.
- Niet elke Chrome-desktopextensie is compatibel met GeckoView.

## Updates

Android-apps worden niet bijgewerkt via het Extension-updatecentrum. Download de nieuwste APK uit de nieuwste GitHub-release en installeer deze.

**Opmerking over de huidige debug-ondertekening:** De release-APK wordt momenteel als debug-build gemaakt. Zolang er geen blijvende privésleutel voor ondertekening is ingesteld, kan Android een update over de bestaande app weigeren. Maak in dat geval een back-up van belangrijke lokale instellingen, controleer of je privécloudback-up actueel is, verwijder de vorige appversie en installeer de nieuwe APK. Verwijderen kan lokale appgegevens wissen.

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
- Doelarchitectuur: ARM64

[Hoofddocumentatie](../../README.nl.md) · [Installatie van de browser-Extension](INSTALLATIE.md) · [Problemen oplossen](PROBLEMEN-OPLOSSEN.md) · [Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
