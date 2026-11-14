# Sonos innerhalb von Schleim OS

Die Sonos-Kachel zeigt die offizielle Sonos-Web-App jetzt in einem eingebetteten Fenster innerhalb von Schleim OS:

**https://play.sonos.com/de-de/web-app**

## Desktop-Ansicht im App-Fenster

- Das iframe erhält eine feste Layoutbreite von **1280 CSS-Pixeln**, damit Websites, die ihre Darstellung anhand der Viewport-Breite wählen, möglichst die Desktop-Anordnung verwenden.
- Die Desktop-Fläche wird standardmäßig an die Breite des Schleim-OS-Fensters angepasst. Über **„Desktopgröße 100 %“** kann die Skalierung ausgeschaltet und die breite Seite horizontal gescrollt werden.
- **Neu laden** lädt den eingebetteten Sonos-Aufruf erneut.
- Die Anmeldung erfolgt direkt bei Sonos. Schleim OS liest oder speichert keine Sonos-Zugangsdaten.

### Wichtige technische Grenze

Die 1280-Pixel-Fläche simuliert eine breite Desktop-Layout-Viewport-Breite. Sie kann jedoch nicht den User-Agent des Browsers oder `window.screen.width` der eingebetteten Seite ändern. Ein echtes Browser-„Desktopwebsite anfordern“, wie es der Browser-Schalter ausführt, lässt sich von einer gewöhnlichen HTML-Seite aus nicht erzwingen.

Außerdem entscheidet Sonos selbst, ob `play.sonos.com` in fremden Frames angezeigt werden darf. Falls Sonos das mit `Content-Security-Policy: frame-ancestors` oder `X-Frame-Options` verhindert, kann Schleim OS diese Serverrichtlinie nicht überschreiben. Login kann zusätzlich durch blockierte Drittanbieter-Cookies oder Popup-/Weiterleitungsregeln des Browsers eingeschränkt sein. Der Statushinweis in der App zeigt nach 18 Sekunden an, wenn das Frame nicht fertig lädt; er kann eine serverseitige Frame-Sperre nicht zuverlässig erkennen.

In diesem Fall bleibt **„Separat öffnen“** als Fallback. Das ist keine freiwillige Designentscheidung, sondern eine Grenze der Browser-Sicherheit.

## Sonos-Konto und Datenschutz

- Die Sonos-Anmeldung findet auf der offiziellen Domain `play.sonos.com` statt.
- Schleim OS fragt keine Sonos-Passwörter ab.
- Schleim OS speichert keine Sonos-Tokens.
- Das iframe wird ohne restriktives `sandbox` eingebunden, damit Sonos seine normale Anmeldung, Skripte, Weiterleitungen und Wiedergabe verwenden kann. Die Sonos-Seite bleibt durch die Same-Origin-Policy vom Schleim-OS-Code getrennt.

## Alternative

Für eine komplett native Steuerung innerhalb von Schleim OS wäre weiterhin eine echte API-Anbindung nötig, beispielsweise über einen laufenden Home-Assistant-Server und dessen Zugriffstoken. Das ist von der eingebetteten Sonos-Webseite unabhängig.

## Offizielle Links

- [Sonos Web-App](https://play.sonos.com/)
- [Sonos Web-App – offizielle Produktbeschreibung](https://www.sonos.com/en-us/guides/sonos-pro/sonosapp)
- [Sonos-Hilfe zu 27mcp](https://support.sonos.com/de-at/article/control-your-sonos-system-with-ai-using-sonos-27mcp)
- [MDN: Content-Security-Policy frame-ancestors](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)
- [MDN: X-Frame-Options](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Headers/X-Frame-Options)
