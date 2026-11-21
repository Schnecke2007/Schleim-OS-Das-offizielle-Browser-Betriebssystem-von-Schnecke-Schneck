# Schleim Browser – Android-App

Schleim OS gibt es jetzt in zwei getrennten Varianten:

- **Browser-Extension:** Die ursprüngliche Schleim-OS-Neuer-Tab-Oberfläche für kompatible Chromium-Browser.
- **Schleim Browser:** Eine eigenständige Android-App auf Basis von Mozilla GeckoView. Sie enthält die Schleim-OS-Extension und kombiniert sie mit einer nativen Browserleiste, Tabs und Android-Dateifunktionen.

Die Android-App ersetzt nicht Android. Sie ist ein Browser, der unter Android ausgeführt wird.

## Download

Öffne die [GitHub-Releases-Seite](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest) und lade **Schleim-Browser-Android-0.1.0-alpha23.apk** herunter.

Direktdownload: [Schleim Browser für Android – APK](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest/download/Schleim-Browser-Android-0.1.0-alpha23.apk)

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

- Es können bis zu sechs Browser-Tabs gleichzeitig geöffnet gehalten werden. Beim Öffnen weiterer Tabs wird ein älterer Hintergrund-Tab entfernt, um Speicher und Ressourcen zu begrenzen.
- Die Android-App unterstützt Datei-Upload und den Speicherdialog für exportierte Dateien.
- Mozilla-signierte XPI-Erweiterungen können über das Browser-Menü installiert werden.
- **Kontextmenü:** Halte einen Link, ein Bild, Video oder Audio-Element gedrückt. Das Menü bietet passende Aktionen zum Öffnen, Herunterladen und Kopieren der Adresse. Downloads funktionieren, wenn eine direkte HTTP(S)-Adresse bereitsteht.
- **Drucken:** Über das Browser-Menü oder Kontextmenü kannst du die aktuelle Webseite an Androids Druckdialog senden. Dort lassen sich ein Drucker oder „Als PDF speichern“ auswählen.
- **Erweiterungen öffnen:** Für Add-ons mit einer hinterlegten Optionsseite erscheint im Erweiterungsmanager ein Button „Öffnen“. Die integrierte Schleim-OS-Erweiterung öffnet ihre Startseite.
- Kamera- und Mikrofonaufnahme sind in der Android-App absichtlich deaktiviert. Die Kamera-Kachel erklärt diese Einschränkung. Die JavaScript-Webkamera der originalen Browser-Extension bleibt davon getrennt.
- Manche Webseiten blockieren das Einbetten in andere Seiten. Solche Inhalte können leer bleiben oder müssen direkt geöffnet werden.
- Nicht jede Chrome-Desktop-Erweiterung ist mit GeckoView kompatibel.

## Updates

Android-Apps werden nicht über das Extension-Update-Center aktualisiert. Lade die neue APK aus dem neuesten GitHub-Release herunter und installiere sie.

**Wichtiger Hinweis zur aktuellen Debug-Signierung:** Die Release-APK wird derzeit als Debug-Build erstellt. Solange kein dauerhaftes privates Signatur-Schlüsselpaar eingerichtet ist, kann Android ein direktes Update ablehnen. In diesem Fall musst du die vorherige App-Version deinstallieren und die neue APK installieren. Sichere vorher wichtige lokale Einstellungen und prüfe, ob deine private Cloud-Sicherung aktuell ist. Eine Deinstallation kann lokale App-Daten löschen.

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
| „App nicht installiert“ beim Update. | Eine Debug-Signatur kann sich zwischen Builds unterscheiden. Sichere Daten, deinstalliere die alte App und installiere die neue APK. |
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
- Zielarchitektur: ARM64

[Zur Hauptdokumentation](../../README.md) · [Installation der Browser-Extension](INSTALLATION.md) · [Fehlerbehebung](FEHLERBEHEBUNG.md) · [Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
