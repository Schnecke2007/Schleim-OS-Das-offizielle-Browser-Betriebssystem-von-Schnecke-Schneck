# Schleim OS 3.19.0 – Verlauf, sichere DNS-Verbindung und gespeicherte Tabs

Schleim Browser erhält drei wichtige Browserfunktionen. Die Android-App bleibt eine eigenständige GeckoView-App. Die Browser-Extension ist weiterhin separat verfügbar.

## Neu und verbessert

- **Browserverlauf:** Im Browser-Menü gibt es jetzt den Punkt **Verlauf**. Dort werden erfolgreich besuchte HTTP- und HTTPS-Seiten mit Titel, Adresse und Besuchszeit angezeigt. Der Verlauf wird lokal auf dem Gerät gespeichert. Es können bis zu 250 Einträge gespeichert und der Verlauf kann jederzeit gelöscht werden.
- **Fester sicherer DNS-Server:** Schleim Browser verwendet für normale DNS-Auflösungen einen fest hinterlegten DNS-over-HTTPS-Server. Die Verbindung erfolgt verschlüsselt über HTTPS. Der DNS-Modus ist fest eingestellt und kann in der App nicht geändert werden. In den Einstellungen wird nur angezeigt, dass eine sichere DNS-Verbindung verwendet wird.
- **Tabs automatisch speichern:** Die zuletzt geöffneten bis zu vier Tabs und der aktive Tab werden automatisch lokal gespeichert. Beim nächsten Start stellt Schleim Browser diese Tabs wieder her. Pro Tab wird die zuletzt geöffnete Adresse gespeichert; der Verlauf innerhalb einer einzelnen Seite wird nicht als vollständiger Sitzungszustand wiederhergestellt.

## Hinweise

- Verlauf und gespeicherte Tabs liegen lokal in den App-Daten.
- Wird Schleim Browser deinstalliert, können diese Daten verloren gehen. Sichere wichtige Inhalte vorher.
- Die Release-APK nutzt die Android-Debug-Signierung. Bei einem neuen Build kann Android eine Deinstallation der alten App verlangen, bevor die neue APK installiert werden kann.
- GeckoView kann bestimmte systeminterne oder lokale Namensauflösungen außerhalb des DoH-Dienstes behandeln. Der feste DoH-Modus gilt für normale Browser-DNS-Abfragen.

## Versionsinformationen

- Schleim OS Extension: **3.19.0**
- Schleim Browser: **0.1.0-alpha29**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android-Browser-Anleitung](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
