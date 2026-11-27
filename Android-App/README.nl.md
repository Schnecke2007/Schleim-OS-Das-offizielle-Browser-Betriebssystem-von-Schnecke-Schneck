# Android-app – Android Studio-sjabloon

Deze map bevat de handleiding en generator voor het neutrale Android Studio-project. Het volledige ZIP-pakket wordt tijdens de grote Schleim OS-release samengesteld uit het actuele Android-project en de Extension.

## Download

In de nieuwste GitHub-release staat **Schleim-Browser-Android-Studio-Template.zip**. Pak het archief uit en open de projectmap **Android-App Template** in Android Studio.

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
- Een universele APK voor ARMv7 (armeabi-v7a), ARM64 (arm64-v8a), x86 en x86_64; Android 8.0/API 26 blijft de minimumversie

## VPN-sjabloon

De Android-sjabloon bevat de native **VPN-bridge** en een voorbeeldmanifest in `vpn/servers.json`. Deze bestuurt OpenVPN for Android als externe client; er is geen OpenVPN-engine ingebouwd. Om veiligheids- en licentieredenen bevat de gegenereerde ZIP geen productie-`.ovpn`-profielen. Stel je repository in `VpnIntegration.kt` in, voeg actuele providerprofielen toe aan de servermap en werk het manifest bij. Zet nooit inloggegevens of privésleutels in een openbare repository.

De universele APK wordt pas gepubliceerd nadat CI alle vier ABI's succesvol heeft gecontroleerd.

## Het project bouwen

1. Open Android Studio en kies **Open**.
2. Selecteer de uitgepakte map **Android-App Template**.
3. Voer Gradle Sync uit.
4. Maak een test-APK via **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. Stel voor publicatie je eigen blijvende ondertekeningssleutel in.

De sjabloon bevat geen privésleutels, tokens of inloggegevens. Zet geheimen nooit rechtstreeks in broncode of in een openbare repository.

Het ZIP-bestand bevat de Gradle 8.13-wrapper; een systeembrede Gradle-installatie is voor de sjabloon niet nodig. Het Android-startpictogram en de Extension-pictogrammen zijn neutrale tijdelijke afbeeldingen en moeten vóór publicatie van je eigen app worden vervangen.

## Technische opmerking

De sjabloon is gebaseerd op een GeckoView-browser met een ingebouwde WebExtension. Pas de voorbeeld-Extension aan voordat je deze voor het eerst start. Camera- en microfoonopnamen zijn in de meegeleverde Android-browserlogica standaard niet ingeschakeld.

[Deutsch](README.md) · [English](README.en.md) · [Android-browserdocumentatie](../docs/Niederländisch/ANDROID-BROWSER.md)
