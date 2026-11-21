# Schleim Browser – Android-App (0.1.0-alpha23)

Schleim Browser ist die eigenständige Android-App des Schleim-OS-Projekts. Sie basiert auf Mozilla GeckoView und bündelt die originale WebExtension aus extension/.

## Technische Architektur

- Native Android-Oberfläche mit Adressleiste, Suche, Tab-Verwaltung und Browser-Menü.
- Mozilla GeckoView als Browser-Engine.
- Originale Schleim-OS-Extension als Android-Asset unter app/src/main/assets/extension (wird vom Release-Workflow aus extension/ gebündelt).
- Native Android-Brücken für Dokument-Speicherung, XPI-Dateiauswahl, Downloads und Benachrichtigungen.
- App-ID: de.schneckeschneck.schleimbrowser.
- Mindestversion: Android 8.0 / API 26.
- Ziel-SDK: API 35; Build-SDK: API 36.
- Zielarchitektur: arm64-v8a.
- JDK 17, Gradle 8.13, Android Gradle Plugin 8.13.2 und Kotlin Gradle Plugin 2.3.0.

## Browserfunktionen

- Adressleiste mit URL-Navigation und Google-Suche für Suchbegriffe.
- Zurück, Vorwärts, Neu laden und Startseite.
- Tab-Verwaltung mit maximal sechs gleichzeitig gehaltenen GeckoView-Sessions.
- Downloads in einem app-eigenen Downloadbereich.
- Android-Dateiauswahl und Speicherdialoge.
- Mozilla-signierte XPI-Erweiterungen installieren, aktivieren, deaktivieren und entfernen.
- Desktop-Ansicht und Android-Standardbrowser-Auswahl.
- Die originale Extension stellt Startseite, Schleim-Store, Konto, Personalisierung und Cloud-Funktionen bereit.

## Android-Grenzen

- Kamera- und Mikrofonaufnahme sind absichtlich nicht aktiviert. Android-Capture-Berechtigungen werden nicht angefordert und Media-Permission-Requests abgelehnt.
- Externe Seiten können Einbettungen durch eigene Content-Security-Policy- oder X-Frame-Options-Regeln blockieren.
- Nicht alle Chromium-Erweiterungen funktionieren mit GeckoView.
- Die App wird aktuell als Debug-APK veröffentlicht. Ohne dauerhaftes privates Signatur-Schlüsselpaar kann Android ein Update ablehnen und eine Neuinstallation erfordern.

## Lokal bauen

1. Java 17, Android SDK Platform 36 und Gradle 8.13 installieren. Der Quellordner `android/` enthält keinen Gradle-Wrapper; das herunterladbare **Android-App Template** erhält beim ZIP-Build automatisch einen Wrapper.
2. Repository im Android Studio öffnen und den Ordner android/ als Projekt auswählen.
3. Die Original-Extension nach app/src/main/assets/extension kopieren und das Android-Gecko-Manifest vorbereiten. Der GitHub-Workflow übernimmt diese Schritte automatisch.
4. In der Projektwurzel den Build mit Gradle ausführen:

   gradle --no-daemon -PgeckoviewVersion=153.0.20260810162159 :app:assembleDebug

5. Die APK liegt unter app/build/outputs/apk/debug/app-debug.apk.

## Release und Dokumentation

Die Android-App wird zusammen mit der Extension im großen Release veröffentlicht. Die vollständige Installations-, Update- und Fehlerbehebungsanleitung steht in den drei Sprachen:

- Deutsch: ../docs/Deutsch/ANDROID-BROWSER.md
- English: ../docs/Englisch/ANDROID-BROWSER.md
- Nederlands: ../docs/Niederländisch/ANDROID-BROWSER.md

Die Anleitung und der Generator liegen im Repository unter Android-App/. Im heruntergeladenen ZIP heißt der vollständige Android-Studio-Projektordner **Android-App Template**.
