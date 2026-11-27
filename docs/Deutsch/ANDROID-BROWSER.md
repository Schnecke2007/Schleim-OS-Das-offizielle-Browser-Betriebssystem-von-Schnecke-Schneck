# Schleim Browser – Android-App

Schleim OS gibt es jetzt in zwei getrennten Varianten:

- **Browser-Extension:** Die ursprüngliche Schleim-OS-Neuer-Tab-Oberfläche für kompatible Chromium-Browser.
- **Schleim Browser:** Eine eigenständige Android-App auf Basis von Mozilla GeckoView. Sie enthält die Schleim-OS-Extension und kombiniert sie mit einer nativen Browserleiste, Tabs und Android-Dateifunktionen.

Die Android-App ersetzt nicht Android. Sie ist ein Browser, der unter Android ausgeführt wird.

## Download

Öffne die [GitHub-Releases-Seite](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) und lade **Schleim-Browser-Android-0.1.0-alpha31.apk** herunter.

Direktdownload: [Schleim Browser für Android – APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha31.apk)

## Systemanforderungen

- Android 8.0 oder neuer (API 26+)
- 64-Bit-ARM-Gerät (arm64-v8a)
- Internetverbindung für Webseiten, Extension-Inhalte und Online-Funktionen
- Rund 200 MB freier Speicher für die APK und zusätzlichen App-Speicher

Die App wird mit Android SDK 36 gebaut. Der Mindestwert für das Ausführen der App bleibt Android 8.0 (API 26).

## Installation

1. Lade die APK aus dem Release herunter.
2. Öffne die heruntergeladene APK mit dem Android-Dateimanager.
3. Android kann dich auffordern, **Installieren unbekannter Apps** für den verwendeten Browser oder Dateimanager zu erlauben. Erteile diese Berechtigung nur für eine Quelle, der du vertraust.
4. Kehre zur APK zurück und wähle **Installieren**.
5. Starte anschließend **Schleim Browser**.

Android kann eine Warnung anzeigen, weil die APK außerhalb des Play Stores verteilt wird. Prüfe vor der Installation, dass der Download aus dem offiziellen GitHub-Repository stammt.

## Erste Schritte

- **Adresse oder Suche:** Gib eine Webadresse oder einen Suchbegriff in die Adressleiste ein.
- **Navigation:** Verwende Zurück, Vorwärts und Neu laden.
- **Startseite:** Öffnet die integrierte Schleim-OS-Oberfläche.
- **Tabs:** Über das Tab-Symbol kannst du zwischen geöffneten Seiten wechseln, Tabs schließen und neue Tabs öffnen.
- **Browser-Menü:** Enthält unter anderem Downloads, Erweiterungen, Desktop-Ansicht und Einstellungen.
- **Standardbrowser:** Unter Einstellungen kannst du Android bitten, Schleim Browser als Standardbrowser festzulegen.
- **Downloads und Dateien:** Heruntergeladene Dateien werden im App-eigenen Downloadbereich gespeichert. Dateiauswahl und Speicherdialoge werden von Android angezeigt.

## Funktionen und Grenzen

Die Android-App bündelt die Schleim-OS-Extension in GeckoView. Dazu gehören die Startseite, Apps, Personalisierung, Schleim-Store, Schleim-Konto und die Cloud-Funktionen.

- Es können bis zu vier Browser-Tabs gleichzeitig geöffnet gehalten werden. Beim Öffnen weiterer Tabs wird ein älterer Hintergrund-Tab entfernt, um Speicher und Ressourcen zu begrenzen.
- Die Android-App unterstützt Datei-Upload und den Speicherdialog für exportierte Dateien.
- Mozilla-signierte XPI-Erweiterungen können über das Browser-Menü installiert werden.
- **Mozilla Firefox Add-ons:** Der Button im Erweiterungsmanager öffnet wieder den offiziellen [Firefox-Add-ons-Katalog](https://addons.mozilla.org/firefox/). Kompatible, von Mozilla signierte XPI-Dateien können heruntergeladen und anschließend über „XPI-Datei installieren“ installiert werden.
- **Kontextmenü:** Halte einen Link, ein Bild, Video oder Audio-Element gedrückt. Das Menü bietet passende Aktionen zum Öffnen, Herunterladen und Kopieren der Adresse. Downloads funktionieren, wenn eine direkte HTTP(S)-Adresse bereitsteht.
- **Drucken:** Über das Browser-Menü oder Kontextmenü kannst du die aktuelle Webseite an Androids Druckdialog senden. Dort lassen sich ein Drucker oder „Als PDF speichern“ auswählen.
- **Erweiterungen öffnen:** Für Add-ons mit einer hinterlegten Optionsseite erscheint im Erweiterungsmanager ein Button „Öffnen“. Die integrierte Schleim-OS-Erweiterung öffnet ihre Startseite.
- **Details je Erweiterung:** Jede installierte Erweiterung hat einen eigenen Button **Details**. Dort zeigt Schleim Browser nur Angaben, die GeckoView für genau dieses Add-on meldet: Beschreibung, Version, Entwickler, Homepage, Optionsseite, erforderliche und optionale Berechtigungen sowie Webseitenzugriffe. Optionale Berechtigungen lassen sich einzeln freigeben oder entziehen. Eine vorhandene Optionsseite kann direkt geöffnet werden.
- **Private Fenster:** In den Details gibt es – sofern das Manifest private Nutzung nicht ausdrücklich ausschließt – die Option **In privaten Fenstern ausführen**. Diese Einstellung verwendet GeckoViews `setAllowedInPrivateBrowsing`-Funktion und wird mit dem Browserprofil synchronisiert. Das ist keine systemweite VPN-Funktion: Bei VPN-/Proxy-Add-ons muss die Erweiterung selbst private Sitzungen unterstützen und korrekt eingerichtet sein. Die Berechtigung `proxy` wird als solche angezeigt, falls das Add-on sie anfordert.
- **Schleim VPN:** Der native WireGuard-Tunnel ist direkt in Schleim Browser integriert und wird über Androids VPN-Berechtigung gestartet. Er leitet nur den Schleim Browser durch den Tunnel; andere Android-Apps bleiben auf ihrer normalen Verbindung. Importiere eine persönliche WireGuard-`.conf`-Datei, die du in deinem VPN-Konto erzeugt hast. Das Profil wird mit Android-Keystore verschlüsselt gespeichert. Öffentliche Servervorlagen enthalten absichtlich keinen privaten Schlüssel und können allein keine Verbindung herstellen. Die Browser-Extension kann den nativen Android-Tunnel nicht starten oder steuern.
- Kamera- und Mikrofonaufnahme sind in der Android-App absichtlich deaktiviert. Die Kamera-Kachel erklärt diese Einschränkung. Die JavaScript-Webkamera der originalen Browser-Extension bleibt davon getrennt.
- Manche Webseiten blockieren das Einbetten in andere Seiten. Solche Inhalte können leer bleiben oder müssen direkt geöffnet werden.
- Nicht jede Chrome-Desktop-Erweiterung ist mit GeckoView kompatibel.

## Verlauf, DNS und automatische Tab-Sicherung

- **Verlauf:** Öffne im Browser-Menü den Punkt **Verlauf**. Dort findest du erfolgreich besuchte HTTP- und HTTPS-Seiten mit Titel, Adresse und Uhrzeit. Der Verlauf wird lokal gespeichert, umfasst bis zu 250 Einträge und kann über **Verlauf löschen** entfernt werden.
- **Sichere DNS-Verbindung:** Schleim Browser nutzt für normale DNS-Abfragen einen fest eingestellten DNS-over-HTTPS-Server. Die Verbindung läuft verschlüsselt über HTTPS. Die Konfiguration ist nicht änderbar. In den Einstellungen wird nur der Hinweis **Sichere DNS-Verbindung** angezeigt; Serveradresse und Anbietername werden dort nicht angezeigt.
- **Automatisch gespeicherte Tabs:** Bis zu vier geöffnete Tabs und der aktive Tab werden automatisch gespeichert. Beim nächsten Start werden die Tabs mit ihrer jeweils zuletzt geöffneten Adresse wiederhergestellt. Der vollständige Zurück-/Vorwärts-Verlauf einer einzelnen Seite wird dabei nicht gespeichert.
- Verlauf und Tabs liegen in den lokalen App-Daten. Durch eine Deinstallation können diese Daten gelöscht werden.

## Willkommensbildschirm, Gastmodus und Schleim-Konto

Beim ersten Start zeigt Schleim Browser eine kurze Einführung. Mit **Weiter** und **Zurück** wechselst du zwischen den wichtigsten Funktionen. Du kannst die Einführung überspringen oder direkt den Browser öffnen.

- **Lesezeichen:** Speichere eine Webseite, öffne sie später erneut und bearbeite oder lösche gespeicherte Einträge.
- **Passwort-Manager:** Neue Anmeldedaten werden erst nach deiner Bestätigung gespeichert. Die Zugangsdaten werden verschlüsselt und mit dem Android-Keystore geschützt. Zum Öffnen der Passwortverwaltung ist die sichere Displaysperre des Geräts erforderlich. Passwortvorschläge und das Ausfüllen kannst du im Passwort-Manager aktivieren.
- **Gastmodus:** Starte über die Einführung oder das Browser-Menü eine private Sitzung. Gast-Tabs verwenden private GeckoView-Sitzungen. Verlauf, Tabs, Lesezeichen, Passwörter, Formular- und Websitedaten werden nicht in das reguläre Profil übernommen oder mit der Cloud synchronisiert. Auch Konto-Anmeldung und Add-on-Verwaltung sind gesperrt. Dein normales Browser-Profil bleibt unverändert. Der Gastmodus speichert keine privaten Tabs für den nächsten App-Start.
- **Konto öffnen:** Das Schleim-Konto befindet sich unter **Browser-Menü → Einstellungen → Schleim-Konto**. Ohne erfolgreiche Anmeldung sind Cloud-Backup und Wiederherstellung gesperrt.
- **Erste Anmeldung:** Tippe auf **Schleim OS Account öffnen**. Die GitHub-App-Seite öffnet sich in einem neuen Browser-Tab. Installiere dort die GitHub-App „Schleim OS Account“. Schließe den Tab bei Bedarf und kehre zu **Einstellungen → Schleim-Konto** zurück. Tippe dann auf **Weiter – Gerätecode anzeigen**.
- **Gerätecode bestätigen:** Der einmalige Code erscheint im Browser und wird automatisch in die Zwischenablage kopiert. Die GitHub-Gerätefreigabe öffnet sich in einem weiteren Tab. Du kannst den Code erneut kopieren oder mit **Zurück** zum vorherigen Tab wechseln. Die App prüft die Freigabe automatisch. Dein GitHub-Passwort gibst du ausschließlich direkt bei GitHub ein.
- **Private Cloud-Sicherung:** Nach der Anmeldung wird das private Repository schleim-os-cloud verwendet bzw. bei der ersten Anmeldung angelegt. Browser-Backups werden vor dem Upload mit AES-256-GCM verschlüsselt. Für die Wiederherstellung auf einem anderen Gerät brauchst du dasselbe GitHub-Konto und dein Backup-Passwort. Die automatische Sicherung ist optional und kann im Konto aktiviert werden.

Das Browser-Profil-Backup umfasst lokale Einstellungen, Verlauf, gespeicherte Tabs, Lesezeichen, den verschlüsselten Passwortspeicher und Add-on-Informationen. Vorhandene XPI-Installationspakete werden, soweit im App-Speicher vorhanden, mit gesichert und können beim Wiederherstellen erneut installiert werden. Nicht enthalten sind Website-Cookies und aktive Website-Anmeldesitzungen, Formulareingaben, private Daten einzelner Add-ons oder gewöhnliche Downloads. Der vollständige Zurück-/Vorwärts-Verlauf einzelner Webseiten wird ebenfalls nicht übertragen.

## Updates


Die Android-App wird getrennt von der Browser-Extension aktualisiert. Öffne **Browser-Menü → Einstellungen → Nach Updates suchen**. Wenn ein Update verfügbar ist, kannst du im Update-Fenster zuerst die APK herunterladen. Danach kannst du die alte App über **Alte App deinstallieren** entfernen. Android zeigt dafür eine eigene Bestätigungsabfrage. Installiere anschließend die heruntergeladene APK aus deinem Download-Ordner.

Die Release-APK nutzt den normalen Android-Debug-Schlüssel. Dieser Schlüssel kann sich zwischen Builds ändern. Deshalb ist eine direkte Aktualisierung nicht garantiert und die alte App muss vor der neuen Installation entfernt werden. Sichere vorher wichtige Daten. Eine Deinstallation kann Verlauf, gespeicherte Tabs und andere lokale App-Daten löschen.

## Android-Studio-Vorlage

Im Release gibt es zusätzlich **Schleim-Browser-Android-Studio-Template.zip**. Das Archiv enthält ein vollständiges Android-Studio-Projekt mit Android-Quellcode und eingebundener Beispiel-Extension. Persönliche Angaben, Paket-ID, GitHub-Repository, Website- und Kontaktdaten sind innerhalb der Vorlage durch neutrale Platzhalter ersetzt. Die produktive App im Repository bleibt davon unberührt.

1. Lade das Template-ZIP herunter und entpacke es.
2. Öffne den enthaltenen Projektordner **Android-App Template** in Android Studio.
3. Passe Paket-ID, App-Name, Extension, Links und Platzhalter an.
4. Synchronisiere Gradle und baue eine eigene Test-APK.
5. Richte für eine Veröffentlichung einen eigenen, dauerhaft gesicherten Signaturschlüssel ein.

[Android-Studio-Template herunterladen](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-Studio-Template.zip) · [Template-Anleitung](../../Android-App/README.md)

## Fehlerbehebung

| Problem | Lösung |
|---|---|
| Android blockiert die Installation. | Erlaube die Installation unbekannter Apps nur für den verwendeten Dateimanager oder Browser und starte die APK erneut. |
| Update verfügbar. | Lade die APK über das Update-Fenster herunter, bestätige anschließend die Deinstallation der alten App und installiere die APK aus dem Download-Ordner. |
| Webseiten reagieren langsam oder die App meldet „reagiert nicht“. | Schließe nicht benötigte Tabs, lade die Seite neu und starte die App erneut. Bei wiederholten ANR-Meldungen melde Android-Version, Gerätemodell und Schritte über GitHub Issues. |
| Eine Erweiterung lässt sich nicht installieren. | Es werden Mozilla-signierte XPI-Dateien unterstützt. ZIP-, CRX- oder entpackte Projektordner sind kein XPI-Ersatz. |
| Kamera oder Mikrofon funktionieren nicht. | Aufnahmefunktionen sind in der Android-App bewusst deaktiviert. |
| Eine Webseite wird nicht eingebettet. | Öffne die Seite direkt oder verwende eine andere Website. Einbetten kann durch den Anbieter blockiert sein. |

## Technische Informationen

- Engine: Mozilla GeckoView
- App-ID: de.schneckeschneck.schleimbrowser
- Mindest-Android-Version: API 26
- Ziel-SDK: API 35
- Build-SDK: API 36
- Enthaltene ABIs: ARMv7 (armeabi-v7a), ARM64 (arm64-v8a) und x86_64; 32-Bit-x86 wird von der gepinnten GeckoView-Version nicht bereitgestellt

[Zur Hauptdokumentation](../../README.md) · [Installation der Browser-Extension](INSTALLATION.md) · [Fehlerbehebung](FEHLERBEHEBUNG.md) · [Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)


## Schleim VPN (WireGuard)

Öffne im Browser-Menü den Bereich **Schleim VPN**. Die Extension kann auf Android über die native GeckoView-Brücke den VPN-Bereich öffnen; sie führt selbst keinen VPN-Tunnel aus. Das ist keine systemweite VPN-Funktion: Nur Schleim Browser wird durch den Tunnel geleitet.

Importiere eine aktuelle persönliche WireGuard-.conf-Datei aus deinem Proton-Konto. Die App verschlüsselt das Profil lokal mit Android Keystore und AES-GCM. Wähle anschließend das importierte Profil und erteile Android die VPN-Berechtigung.

Die öffentliche Serverliste wird beim Öffnen aus dem Repository-Katalog geladen. Sie ist kein Live-Status von Proton. Proton hat den früher öffentlich verwendeten Serverlisten-Endpunkt abgeschaltet. Für eine Verbindung benötigst du deine eigene vollständige Konfiguration; die öffentlichen Repository-Dateien enthalten keine privaten Schlüssel. Frühere veröffentlichte Schlüssel sollten erneuert werden.
