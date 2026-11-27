# Android-App – Android-Studio-Vorlage

Dieser Ordner enthält die Anleitung und den Generator für das neutrale Android-Studio-Projekt. Das vollständige ZIP-Paket wird beim großen Schleim-OS-Release aus dem aktuellen Android-Projekt und der Extension erzeugt.

## Download

Im neuesten GitHub-Release findest du **Schleim-Browser-Android-Studio-Template.zip**. Entpacke das Archiv und öffne den enthaltenen Projektordner **Android-App Template** in Android Studio.

## Platzhalter und Anpassung

Die Vorlage ist vom produktiven Schleim-Browser getrennt. Innerhalb der Vorlage werden persönliche und projektbezogene Angaben durch neutrale Werte ersetzt, unter anderem App-Name, Paket-ID, GitHub-Repository, Website, Kontaktangaben und Extension-ID. Die produktive App und die normale Extension außerhalb dieses Template-Ordners werden dadurch nicht verändert.

Passe vor dem eigenen Build mindestens Folgendes an:

1. app/build.gradle.kts: namespace, applicationId und Versionsnummer.
2. app/src/main/AndroidManifest.xml: App-Name und gegebenenfalls Berechtigungen.
3. app/src/main/java/com/example/yourbrowser/: Paketdeklaration und eigene Android-Logik.
4. app/src/main/assets/extension/: deine eigene WebExtension und deren Manifest.
5. GitHub-, Website- und Kontakt-Platzhalter in den Extension-Dateien.
6. App-Icon und Signierung für deine eigene Veröffentlichung.

## Voraussetzungen

- Android Studio mit Android SDK Platform 36
- JDK 17
- Gradle 8.13 / Android Gradle Plugin 8.13.2
- Kotlin Gradle Plugin 2.3.0
- Internetzugang zum Laden von GeckoView und Android-Abhängigkeiten
- Eine universelle APK mit ARMv7 (armeabi-v7a), ARM64 (arm64-v8a), x86_64 (32-Bit-x86 wird von dieser GeckoView-Version nicht unterstützt); Android 8.0/API 26 bleibt Mindestversion

## VPN-Vorlage

Die Android-Vorlage enthält die native **VPN-Bridge** und ein Beispielmanifest unter `vpn/servers.json`. Sie steuert OpenVPN for Android als externen Client; eine eigene OpenVPN-Engine ist nicht eingebettet. Die generierte ZIP-Datei enthält aus Sicherheits- und Lizenzgründen keine produktiven `.ovpn`-Profile. Trage dein Repository in `VpnIntegration.kt` ein, ergänze aktuelle Anbieterprofile im Serverordner und aktualisiere das Manifest. Keine Zugangsdaten oder privaten Schlüssel in ein öffentliches Repository schreiben.

Die universelle APK wird erst nach erfolgreichem CI-Build für alle drei unterstützten ABIs veröffentlicht.

## Projekt bauen

1. Android Studio öffnen und **Open** wählen.
2. Den Ordner **Android-App Template** aus dem entpackten ZIP auswählen.
3. Gradle-Synchronisierung durchführen.
4. Eine Test-APK über **Build → Build Bundle(s) / APK(s) → Build APK(s)** erstellen.
5. Für eine eigene Veröffentlichung eine eigene, dauerhaft gesicherte Signatur konfigurieren.

Die Vorlage enthält keine privaten Schlüssel, Tokens oder Zugangsdaten. Lege Geheimnisse niemals direkt in den Quellcode oder in ein öffentliches Repository.

Das ZIP enthält den Gradle-Wrapper 8.13; eine systemweite Gradle-Installation ist für das Template nicht erforderlich. App-Launcher und Extension-Symbole sind neutrale Platzhalter und sollten vor einer eigenen Veröffentlichung ersetzt werden.

## Technischer Hinweis

Die Vorlage basiert auf einem GeckoView-Browser mit einer eingebundenen WebExtension. Die Demo-Extension muss vor dem ersten Start angepasst werden. Android-Kamera- und Mikrofonaufnahme sind in der übernommenen Android-Browserlogik standardmäßig nicht freigeschaltet.

[English instructions](README.en.md) · [Nederlandse handleiding](README.nl.md) · [Android-Browser-Dokumentation](../docs/Deutsch/ANDROID-BROWSER.md)
