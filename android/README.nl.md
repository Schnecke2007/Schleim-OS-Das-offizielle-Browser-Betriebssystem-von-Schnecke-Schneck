# Schleim Browser – Android-app

**Versie 0.1.0-alpha25 · GeckoView · ARM64**

Schleim Browser is de zelfstandige Android-browser van het Schleim OS-project. De app gebruikt Mozilla GeckoView en bevat de oorspronkelijke Schleim OS-WebExtension in het APK-bestand.

## Technische architectuur

- Native Android-interface met adresbalk, zoeken, tabbladbeheer en browsermenu.
- Mozilla GeckoView als browserengine.
- De oorspronkelijke Schleim OS-Extension wordt door de releaseworkflow opgenomen onder `app/src/main/assets/extension`.
- Native Android-bruggen voor documenten opslaan, XPI-bestanden kiezen, downloads en meldingen.
- Application-ID: `de.schneckeschneck.schleimbrowser`.
- Minimale versie: Android 8.0 / API 26.
- Target-SDK: API 35; build-SDK: API 36.
- Doelarchitectuur: `arm64-v8a`.
- JDK 17, Gradle 8.13, Android Gradle Plugin 8.13.2 en Kotlin Gradle Plugin 2.3.0.

## Browserfuncties

- Adresbalk met URL-navigatie en Google-zoekopdrachten voor zoektermen.
- Terug, Vooruit, Opnieuw laden en Startpagina.
- Tabbladbeheer met maximaal zes behouden GeckoView-sessies.
- Downloads in een eigen downloadgedeelte van de app.
- Houd links, afbeeldingen, video's en audio lang ingedrukt om een contextmenu met openen-, downloaden- en kopieeracties te tonen wanneer een direct HTTP(S)-adres beschikbaar is.
- Stuur webpagina's vanuit het browsermenu of contextmenu naar het Android-afdrukvenster om af te drukken of als PDF op te slaan.
- Open geïnstalleerde extensies via de knop **Openen** wanneer ze een optiespagina aanbieden; de ingebouwde Schleim OS-Extension opent de startpagina.
- Android-bestandskiezer en opslagvensters.
- Mozilla-ondertekende XPI-extensies installeren, activeren, uitschakelen en verwijderen.
- De officiële Mozilla Firefox Add-ons-catalogus rechtstreeks vanuit de extensiebeheerder openen.
- Desktopmodus en selectie als standaardbrowser van Android.
- De oorspronkelijke Extension levert het Schleim OS-startscherm, de Store, account-, personalisatie- en cloudfuncties.

## Grenzen van Android

- Camera- en microfoonopnamen zijn bewust uitgeschakeld. Android-capturemachtigingen worden niet aangevraagd en GeckoView-mediaverzoeken worden geweigerd.
- Externe websites kunnen insluiting blokkeren met hun eigen Content Security Policy of X-Frame-Options.
- Niet elke Chromium-extensie is compatibel met GeckoView.
- De app wordt momenteel als debug-APK gepubliceerd. Zonder een blijvende privésleutel voor ondertekening kan Android een update weigeren en opnieuw installeren vereisen.

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

[Android-APK downloaden](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha25.apk) · [Instructies Android Studio-template](../Android-App/README.nl.md)
