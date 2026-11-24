# Schleim Browser – Android-App (0.1.0-alpha30)

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
- Tab-Verwaltung mit maximal vier gleichzeitig gehaltenen GeckoView-Sessions; Tabs und der aktive Tab werden lokal gespeichert und beim nächsten App-Start wiederhergestellt.
- Downloads in einem app-eigenen Downloadbereich.
- Lokaler Browserverlauf mit bis zu 250 Einträgen und einer Funktion zum Löschen des Verlaufs.
- Fester DNS-over-HTTPS-Resolver im Modus ohne normalen Klartext-DNS-Fallback; die Einstellungen zeigen nur den Status einer sicheren DNS-Verbindung.
- Langes Drücken auf Links, Bilder, Videos und Audio öffnet ein Kontextmenü mit Öffnen-, Download- und Kopieraktionen (sofern eine direkte HTTP(S)-Adresse verfügbar ist).
- Webseiten über das Browser-Menü oder Kontextmenü an Androids Druckdialog senden und drucken oder als PDF speichern.
- Erweiterungen über „Öffnen“ starten, wenn sie eine Optionsseite bereitstellen; die integrierte Schleim-OS-Extension öffnet die Schleim-OS-Startseite.
- Android-Dateiauswahl und Speicherdialoge.
- Mozilla-signierte XPI-Erweiterungen installieren, aktivieren, deaktivieren und entfernen.
- Den offiziellen Mozilla Firefox Add-ons-Katalog direkt über den Erweiterungsmanager öffnen.
- Desktop-Ansicht und Android-Standardbrowser-Auswahl.
- Die originale Extension stellt Startseite, Schleim-Store, Konto, Personalisierung und Cloud-Funktionen bereit.



## Browserprofil, Gastmodus und Kontosynchronisierung

- Beim ersten Start erklärt ein überspringbarer Willkommensbildschirm die wichtigsten Browserfunktionen.
- Lesezeichen können gespeichert, geöffnet, bearbeitet und gelöscht werden.
- Der Passwort-Manager verwendet GeckoViews Login-Speicher-API. Neue Logins werden nur nach Bestätigung gespeichert; der Vault wird mit dem Android-Keystore verschlüsselt und durch die Gerätesperre geschützt.
- Der Gastmodus verwendet private GeckoSession-Sitzungen. Verlaufs-, Tab-, Website- und Formulardaten werden nicht dauerhaft im normalen Profil gespeichert. Konto, Cloud und Add-on-Verwaltung sind dort deaktiviert.
- Das Schleim-Konto befindet sich in den Einstellungen. Die Anmeldung öffnet zuerst die GitHub-App-Seite in einem neuen Tab, danach startet der Gerätecode-Flow. Der Code wird angezeigt/kopiert und die Gerätefreigabe in einem weiteren Tab geöffnet.
- Cloud-Backups werden mit AES-256-GCM verschlüsselt und nur im privaten Repository schleim-os-cloud gespeichert. Gesichert werden lokale Einstellungen, Verlauf, Tabs, Lesezeichen, verschlüsselte Logins sowie Add-on-Metadaten und vorhandene XPI-Pakete inklusive Aktivierungsstatus.
- Website-Cookies, aktive Website-Sitzungen, Formulareingaben, private Add-on-Daten und gewöhnliche Downloads werden nicht übertragen. Add-ons ohne lokal verfügbares XPI-Installationspaket können auf einem anderen Gerät nicht automatisch neu installiert werden.

## Android-Grenzen

- Kamera- und Mikrofonaufnahme sind absichtlich nicht aktiviert. Android-Capture-Berechtigungen werden nicht angefordert und Media-Permission-Requests abgelehnt.
- Externe Seiten können Einbettungen durch eigene Content-Security-Policy- oder X-Frame-Options-Regeln blockieren.
- Nicht alle Chromium-Erweiterungen funktionieren mit GeckoView.
- Die Release-APK nutzt absichtlich die normale Android-Debug-Signierung. Der Schlüssel kann sich zwischen GitHub-Builds ändern. Das Update-Fenster bietet den APK-Download und eine separate Deinstallationsabfrage; vor der Neuinstallation müssen wichtige lokale Daten gesichert werden.

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
