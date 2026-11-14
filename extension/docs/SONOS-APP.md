# Sonos als Web-App im Schleim-Store

Sonos ist eine normale Web-App in **Schleim-Store → Medien**. Der Store-Eintrag besitzt die ID `sonos-control` und öffnet die offizielle Sonos-Web-App:

**https://play.sonos.com/**

## Öffnen und Installieren

1. Öffne den Schleim-Store und melde dich mit deinem Schleim-Konto an.
2. Wähle die Kategorie **Medien** und suche nach **Sonos**.
3. Installiere Sonos wie jede andere Store-Web-App.
4. Starte die installierte Sonos-Kachel. Schleim OS öffnet die offizielle Sonos-Web-App in einem neuen Browser-Tab.

Der Start verwendet denselben allgemeinen Store-Mechanismus wie bei Spotify, YouTube und anderen Web-Apps. Es gibt keine eigene Sonos-Oberfläche, kein HTML-iFrame und keinen Sonderweg über eine interne Player-Ansicht.

## Anmeldung und Datenschutz

- Die Anmeldung erfolgt direkt auf der offiziellen Sonos-Webseite.
- Schleim OS fragt kein Sonos-Passwort ab und speichert keine Sonos-Zugangsdaten.
- Für den normalen Start werden weder ein Sonos-API-Schlüssel noch ein Cloudflare-Worker oder ein eigener Server benötigt.
- Die Nutzung der Sonos-Web-App und die verfügbaren Funktionen richten sich nach Sonos und dem verwendeten Browser.

## Technische Umsetzung

Der öffentliche Katalogeintrag liegt unter `Store/media/sonos-control.json`; der Laufzeitkatalog liegt in `extension/data/store-apps.json`. Beide Einträge verwenden `https://play.sonos.com/` als Zieladresse. Die Funktion `openStoreApp()` prüft Anmeldung und Installation und öffnet anschließend jede Store-App einheitlich mit `window.open(app.url, '_blank', 'noopener,noreferrer')`.

Die frühere eingebettete Sonos-Oberfläche wurde entfernt. Der alte Cloudflare-Worker unter `integrations/sonos-worker/` ist Legacy-Code und wird von der Store-Web-App nicht aufgerufen.
