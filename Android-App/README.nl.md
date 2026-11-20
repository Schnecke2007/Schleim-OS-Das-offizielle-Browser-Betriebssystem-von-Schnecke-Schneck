# Android-app – Android Studio-sjabloon

Deze map bevat de handleiding en generator voor het neutrale Android Studio-project. Het volledige ZIP-pakket wordt tijdens de grote Schleim OS-release samengesteld uit het actuele Android-project en de Extension.

## Download

In de nieuwste GitHub-release staat **Schleim-Browser-Android-Studio-Template.zip**. Pak het archief uit en open de map **Android-App** in Android Studio.

## Plaatsaanduidingen en aanpassing

De sjabloon staat los van de productieversie van Schleim Browser. Binnen de sjabloon zijn persoonlijke en projectspecifieke gegevens vervangen door neutrale waarden, waaronder de appnaam, application-ID, GitHub-repository, website, contactgegevens en Extension-ID. De productie-app en de gewone Extension buiten deze sjabloonmap worden hierdoor niet gewijzigd.

Pas vóór je eigen build ten minste het volgende aan:

1. app/build.gradle.kts: namespace, applicationId en versienummer.
2. app/src/main/AndroidManifest.xml: appnaam en benodigde machtigingen.
3. app/src/main/java/com/example/yourbrowser/: pakketdeclaratie en Android-logica.
4. app/src/main/assets/extension/: je eigen WebExtension en het manifest.
5. GitHub-, website- en contactplaatsaanduidingen in de Extension-bestanden.
6. App-pictogram en ondertekening voor je eigen publicatie.

## Vereisten

- Android Studio met Android SDK Platform 36
- JDK 17
- Gradle 8.13 / Android Gradle Plugin 8.13.2
- Kotlin Gradle Plugin 2.3.0
- Internetverbinding voor GeckoView en Android-afhankelijkheden
- Een ARM64-apparaat voor de vooraf ingestelde ABI-uitvoer

## Het project bouwen

1. Open Android Studio en kies **Open**.
2. Selecteer de uitgepakte map Android-App.
3. Voer Gradle Sync uit.
4. Maak een test-APK via **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. Stel voor publicatie je eigen blijvende ondertekeningssleutel in.

De sjabloon bevat geen privésleutels, tokens of inloggegevens. Zet geheimen nooit rechtstreeks in broncode of in een openbare repository.

## Technische opmerking

De sjabloon is gebaseerd op een GeckoView-browser met een ingebouwde WebExtension. Pas de voorbeeld-Extension aan voordat je deze voor het eerst start. Camera- en microfoonopnamen zijn in de meegeleverde Android-browserlogica standaard niet ingeschakeld.

[Deutsch](README.md) · [English](README.en.md) · [Android-browserdocumentatie](../docs/Niederländisch/ANDROID-BROWSER.md)
