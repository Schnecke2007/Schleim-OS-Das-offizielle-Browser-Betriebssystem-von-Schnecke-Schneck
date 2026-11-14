# Sonos in Schleim OS

Die Sonos-Kachel öffnet standardmäßig die offizielle browserbasierte Sonos-Steuerung:

**https://play.sonos.com/**

## Einfache Nutzung

1. Öffne die Sonos-App-Kachel in Schleim OS.
2. Tippe auf **Offizielle Sonos-Websteuerung öffnen**.
3. Melde dich direkt auf der Sonos-Webseite mit deinem Sonos-Konto an.
4. Wähle dein Sonos-System bzw. deine Lautsprecher und steuere die Wiedergabe.

Schleim OS fragt keine Sonos-Zugangsdaten ab und speichert weder Passwort noch API-Token. Es ist kein Sonos-Developer-Key, keine selbst erstellte Sonos-Control-Integration, kein Cloudflare-Worker und kein KV-Speicher notwendig.

Die Websteuerung wird in einem eigenen Browser-Tab geöffnet. Sie wird absichtlich nicht in ein iframe eingebettet, damit Anmeldung und Wiedergabe nicht von Einbettungs- oder Drittanbieter-Cookie-Beschränkungen abhängen.

## Alternative für eine spätere direkte In-App-Steuerung

Wenn die Wiedergabe unbedingt innerhalb von Schleim OS gesteuert werden soll, ist Home Assistant eine mögliche Alternative:

- Home Assistant erkennt Sonos-Lautsprecher im lokalen Netzwerk automatisch, sofern die Netzwerkbedingungen stimmen.
- In Home Assistant wird ein Sonos-Gerät über **Einstellungen → Geräte & Dienste** eingerichtet.
- Anschließend lässt sich ein Long-Lived Access Token im Home-Assistant-Profil erstellen.
- Eine spätere Schleim-OS-Anbindung könnte dann nur die Home-Assistant-URL und dieses Zugriffstoken benötigen.

Diese Variante braucht allerdings einen laufenden Home-Assistant-Server und eine einmalige Einrichtung. Sie ist deshalb nicht die vorausgewählte Standardlösung.

## Sonos 27mcp

Sonos bietet außerdem den MCP-Server `https://mcp.ws.sonos.com/mcp`. Er benötigt keine vorher selbst erstellte Client-ID oder API-Key: kompatible MCP-Clients registrieren sich dynamisch und führen eine Sonos-Kontoautorisierung durch. Sonos beschreibt den Dienst ausdrücklich für KI-/MCP-Clients und weist darauf hin, dass sich die verfügbaren Tools und deren Schemas ohne Vorankündigung ändern können. Er wird deshalb nicht als fest verdrahtete REST-API in der Schleim-OS-App verwendet.

## Alte Cloudflare-Bridge

Die bisherige Sonos-Control-API-Bridge unter `integrations/sonos-worker/` bleibt aus Kompatibilitätsgründen im Repository erhalten, wird von der aktuellen Sonos-Kachel aber nicht mehr verwendet. Für die einfache Sonos-Websteuerung muss sie nicht deployed oder konfiguriert werden.

## Offizielle Links

- [Sonos Web](https://play.sonos.com/)
- [Sonos 27mcp – offizielle Sonos-Informationen](https://tech-blog.sonos.com/posts/sonos-27mcp/)
- [Sonos 27mcp – Einrichtungsanleitung](https://support.sonos.com/de-at/article/control-your-sonos-system-with-ai-using-sonos-27mcp)
- [Home Assistant – Sonos-Integration](https://www.home-assistant.io/integrations/sonos/)
- [Home Assistant – REST API](https://developers.home-assistant.io/docs/api/rest/)
