# Schleim OS 3.20.0 – Willkommensbildschirm, Gastmodus und Browser-Cloud-Sicherung

## Schleim Browser für Android

- **Willkommensbildschirm:** Beim ersten Start erklärt eine kurze, überspringbare Einführung die wichtigsten Bereiche: Schleim-OS-Startseite, Tabs und Verlauf, Lesezeichen und Passwort-Manager, Add-ons, Konto/Cloud und Gastmodus. Zur Navigation gibt es Vorwärts- und Zurück-Schaltflächen. Der Browser kann direkt gestartet werden.
- **Privater Gastmodus:** Gast-Tabs verwenden private GeckoView-Sitzungen. Verlauf, Tabs, Lesezeichen, Passwörter, Formular- und Websitedaten werden nicht in das reguläre Browser-Profil geschrieben oder in die Cloud übertragen. Konto- und Synchronisationsfunktionen sowie die Add-on-Verwaltung sind im Gastmodus gesperrt. Das normale Profil bleibt getrennt und unverändert.
- **Lesezeichen:** Webseiten können gespeichert, erneut geöffnet, bearbeitet und gelöscht werden.
- **Passwort-Manager:** GeckoView erkennt Login-Formulare. Neue oder geänderte Zugangsdaten werden nur nach ausdrücklicher Bestätigung gespeichert. Der Passwortspeicher wird verschlüsselt und durch den Android-Keystore geschützt. Die Verwaltung erfordert die sichere Gerätesperre; Vorschläge und Autofill können aktiviert werden.
- **Schleim-Konto in den Einstellungen:** Der Kontobereich wurde in **Browser-Menü → Einstellungen → Schleim-Konto** verschoben. Ohne erfolgreiche GitHub-Anmeldung bleiben Backup und Wiederherstellung gesperrt.
- **GitHub-Geräteanmeldung:** Beim ersten Schritt öffnet sich die GitHub-App-Seite „Schleim OS Account“ in einem neuen Browser-Tab. Nach der Installation kann der Tab geschlossen werden. Über **Weiter – Gerätecode anzeigen** startet der Gerätecode-Flow. Der Code erscheint im Browser, wird automatisch kopiert und die GitHub-Gerätefreigabe öffnet sich in einem weiteren Tab. Der Anmeldestatus wird automatisch geprüft.
- **Verschlüsselte Profil-Synchronisierung:** Der Browser nutzt das private Repository schleim-os-cloud. Das Repository wird bei der ersten erfolgreichen Anmeldung erstellt, sofern es noch nicht vorhanden ist. Das Profil-Backup wird vor dem Upload mit AES-256-GCM verschlüsselt. Es umfasst lokale Browser-Einstellungen, Verlauf, gespeicherte Tabs, Lesezeichen, den Passwortspeicher sowie Add-on-Metadaten und verfügbare XPI-Installationspakete einschließlich Aktivierungsstatus. Die automatische Sicherung ist optional. Eine Wiederherstellung auf einem weiteren Gerät benötigt dasselbe GitHub-Konto und das Backup-Passwort.

## Fehlerbehebungen und technische Hinweise

- Die Profil-Wiederherstellung gleicht die Add-on-Liste ab, installiert gespeicherte XPI-Pakete erneut und stellt den Aktiviert-/Deaktiviert-Status wieder her, soweit das passende Installationspaket gesichert wurde.
- Profiländerungen während eines laufenden Uploads werden für eine weitere automatische Sicherung vorgemerkt.
- Die Einstellung für die Desktop-Ansicht wird aus den gespeicherten Profileinstellungen wiederhergestellt.
- Der bestehende dunkelbraune Oberflächenstil bleibt erhalten.
- Die bestehende DNS-over-HTTPS-/NextDNS-Konfiguration wurde nicht geändert. Die Einstellungen zeigen weiterhin nur den allgemeinen Status der sicheren DNS-Verbindung.

## Grenzen der Profil-Synchronisierung

Website-Cookies und aktive Website-Anmeldesitzungen, Formulareingaben, private Daten einzelner Erweiterungen und gewöhnliche Downloads werden nicht in dieses Browser-Backup übernommen. XPI-Pakete können nur wiederhergestellt werden, wenn die Installationsdatei lokal verfügbar und im Backup enthalten ist. Der vollständige Zurück-/Vorwärts-Verlauf einzelner Seiten wird nicht übertragen.

## Versionen

- Browser-Extension: **3.20.0**
- Schleim Browser für Android: **0.1.0-alpha30**
- Mozilla GeckoView · Android 8.0+ · ARM64

Die Android-APK verwendet weiterhin die normale Android-Debug-Signierung. Je nach Build kann eine Deinstallation der bisherigen App vor der Neuinstallation erforderlich sein. Sichere lokale Daten vor dem Entfernen der alten App.
