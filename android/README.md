# Schleim Browser – Android-App (0.1.0-alpha33)

Schleim Browser ist die eigenständige Android-App des Schleim-OS-Projekts. Sie basiert auf Mozilla GeckoView und bündelt die originale WebExtension aus extension/.

## Technische Architektur

- Native Android-Oberfläche mit Adressleiste, Suche, Tab-Verwaltung und Browser-Menü.
- Mozilla GeckoView als Browser-Engine.
- Originale Schleim-OS-Extension als Android-Asset unter app/src/main/assets/extension (wird vom Release-Workflow aus extension/ gebündelt).
- Native Android-Brücken für Dokument-Speicherung, XPI-Dateiauswahl, Downloads und Benachrichtigungen.
- App-ID: de.schneckeschneck.schleimbrowser.
- Mindestversion: Android 8.0 / API 26.
- Ziel-SDK: API 35; Build-SDK: API 36.
- Zielarchitektur: armeabi-v7a, arm64-v8a und x86_64 (universal APK; 32-bit x86 is not supported by the pinned GeckoView build).
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
- Jede installierte Erweiterung erhält einen eigenen **Details**-Button. Die Ansicht liest GeckoView-Metadaten wie Beschreibung, Version, Entwickler, Optionsseite, erforderliche/optionale Berechtigungen, Webseitenzugriffe und Datennutzung aus.
- Optionale Add-on-Berechtigungen können einzeln über GeckoView-APIs addOptionalPermissions und removeOptionalPermissions geändert werden.
- Für kompatible Add-ons kann **In privaten Fenstern ausführen** über WebExtensionController.setAllowedInPrivateBrowsing gesetzt werden. Manifest-Angaben, die private Nutzung ausdrücklich verbieten, werden respektiert. Die Freigabe wird im Browser-Profil-Backup gespeichert und wiederhergestellt.
- Die private Freigabe ist keine systemweite VPN-Funktion. VPN-/Proxy-Erweiterungen müssen private Sitzungen selbst unterstützen; die proxy-Berechtigung wird in den Details angezeigt, wenn das Add-on sie deklariert.
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


## Schleim VPN (WireGuard)

Schleim Browser enthält einen integrierten VPN-Bereich im Browser-Menü. Er nutzt die eingebettete WireGuard-Tunnelbibliothek; es wird keine separate VPN-App gebaut. Die Extension öffnet den nativen VPN-Bereich über die GeckoView-Native-Messaging-Brücke.

- Importiere eine aktuelle persönliche WireGuard-Konfigurationsdatei (.conf) aus deinem Proton-VPN-Konto. Die App speichert das Profil verschlüsselt mit Android Keystore (AES-GCM).
- Der VPN-Tunnel ist auf Schleim Browser beschränkt. Andere Android-Apps werden nicht über diesen Tunnel geleitet.
- Die Standortliste wird beim Öffnen des VPN-Bereichs aus dem Repository-Katalog servers.json abgerufen und zeigt Änderungen am Repository-Katalog.
- Proton hat den früher öffentlich zugänglichen Serverlisten-Endpunkt abgeschaltet; eine automatische Live-Abfrage der Proton-Server ist daher nicht verlässlich möglich. Aktuelle persönliche .conf-Dateien müssen aus dem eigenen Proton-Konto importiert werden.
- Free bezieht sich auf die von Proton angebotenen kostenlosen Standorte. Schleim Browser stellt selbst keinen VPN-Server bereit und garantiert keine Verfügbarkeit.
- Die öffentlichen .conf-Dateien im Repository sind bereinigt und enthalten keine privaten Schlüssel. Frühere veröffentlichte Schlüssel sollten bei Proton erneuert werden.

### Universelle APK

Die APK wird nicht in mehrere Architektur-Dateien aufgeteilt. Sie bündelt ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) und x86_64. 32-Bit-x86 wird von der gepinnten GeckoView-Bibliothek nicht unterstützt. Android 8.0 (API 26) oder neuer ist weiterhin erforderlich.


- **Live-Datenraten:** Die VPN-Ansicht zeigt Download (empfangen) und Upload (gesendet) in Mbit/s sowie die übertragenen MB.
- **Profilwechsel:** Du kannst ein anderes lokal importiertes WireGuard-Profil wählen und direkt im Browser-Menü verbinden.
- **Profil-Datenschutz:** Die App entfernt Kommentarzeilen und den ursprünglichen Dateinamen, vergibt einen neutralen lokalen Namen und verschlüsselt die vollständige Konfiguration mit Android Keystore (AES-GCM). Die notwendigen privaten Schlüssel bleiben lokal erhalten; der VPN-Anbieter kann den Schlüssel weiterhin deinem Konto zuordnen.
