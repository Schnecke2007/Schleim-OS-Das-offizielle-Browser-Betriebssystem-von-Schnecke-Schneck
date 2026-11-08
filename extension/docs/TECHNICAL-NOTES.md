# Technische Hinweise – Version 3.4.0

- Shop-URL: `https://sites.google.com/view/schneckenshop/`; die vorherige eigenständige `shop.html` wurde aus der neuen Ausgabe entfernt.
- Browsererweiterung: Manifest V3 mit `chrome_url_overrides.newtab`.
- Erweiterungs-Root: nur `manifest.json`. Die Neuer-Tab-Seite liegt unter `pages/`, Scripts unter `scripts/`, Styles unter `styles/`, Icons unter `assets/icons/`, Übersetzungen unter `locales/` und Dokumentation unter `docs/`.
- Optional host permissions: Webseiten-Metadaten werden nur nach Zustimmung zu der ausgewählten Website abgerufen. Wetter wird über Open-Meteo geladen.
- Custom apps werden lokal im Browser-Storage gehalten und per JSON-Backup übertragen.
- Externe Frames bleiben unter der jeweiligen Provider-Origin; Browser-Same-Origin-Regeln verhindern das automatische Überschreiben ihrer Texte. Ein Google-Translate-Link bleibt als Ausweichmöglichkeit verfügbar.
- Deutsche offizielle Rechtstexte bleiben unverändert. Die englische und niederländische Ausgabe sind zusätzliche Leseübersetzungen und keine rechtsverbindliche Übersetzung.
- Die Extension enthält keine Werbe-IFrames, keine Werbe-URL, keine Werbe-Hostberechtigung und keine Werbe-Erreichbarkeitsprüfung.

Die Homescreen-Reihenfolge wird in `ssos-personalization-v1.homeOrder` gespeichert. Das bestehende JSON-Backup enthält diese Property.
