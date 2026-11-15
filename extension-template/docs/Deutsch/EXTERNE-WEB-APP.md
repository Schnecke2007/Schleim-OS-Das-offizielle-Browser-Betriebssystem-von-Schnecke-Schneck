# Externe Web-Apps

Der Browser Store kann externe Web-Apps als normale Website-Verknüpfungen anbieten. Eine externe App wird in einem neuen Browser-Tab geöffnet; sie benötigt keine eigene API-Integration.

## Einen Eintrag hinzufügen

1. Öffne `data/store-apps.json`.
2. Füge eine eindeutige `id`, einen sichtbaren Namen, eine HTTPS-Adresse und eine Kategorie hinzu.
3. Ergänze kurze Beschreibungen für Deutsch, Englisch und Niederländisch.
4. Prüfe, ob die Website auf Mobilgeräten funktioniert.
5. Führe die Store- und Navigationstests aus.

## Datenschutz und Sicherheit

Verwende nur offizielle HTTPS-Adressen. Trage keine Passwörter, Zugriffstoken oder private Zugangsdaten in den Katalog ein. Externe Websites können eigene Cookies und Tracker verwenden. Eine Einbettung per iFrame ist nicht garantiert; öffne externe Dienste standardmäßig in einem neuen Tab.
