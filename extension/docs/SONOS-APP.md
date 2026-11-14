# Sonos-App für Schleim OS

Die native Sonos-App befindet sich im **Schleim-Store → Medien → Sonos**. Nach der Installation erscheint Sonos als Kachel auf dem Schleim-OS-Startbildschirm.

## Funktionen

- Sonos-Konto per OAuth 2.0 verbinden und Verbindung trennen
- Sonos-Haushalt, Lautsprecher und Raumgruppen auswählen
- Aktuellen Titel, Künstler, Album, Cover und Wiedergabequelle anzeigen
- Wiedergabe, Pause, vorheriger/nächster Titel und 15-Sekunden-Sprung
- Fortschrittsbalken und Lautstärkeregelung
- Gruppen-Stummschaltung
- Zufallswiedergabe, Wiederholen, Titelwiederholung und Überblenden
- Sonos-Favoriten und Sonos-Playlists laden
- Titel, Sender oder Playlists über das Textfeld anhand ihrer gespeicherten Favoriten-/Playlist-Namen starten

## Warum eine Cloudflare-Bridge benötigt wird

Die Sonos Control API verlangt für den OAuth-Codeaustausch und die Aktualisierung der Tokens das Client-Secret deiner Sonos-Integration. Sonos schreibt ausdrücklich vor, dass dieser Vorgang serverseitig und nicht direkt im Browser stattfinden soll. Deshalb enthält die Erweiterung **keinen** Sonos-Client-Secret.

Die optionale Cloudflare-Worker-Bridge übernimmt:
1. Den Start der Sonos-Anmeldung und den HTTPS-Callback.
2. Den OAuth-Codeaustausch sowie spätere Token-Erneuerungen.
3. Die sichere Ablage von Access- und Refresh-Token in einem privaten Cloudflare-KV-Namespace.
4. Die Weiterleitung einer begrenzten Auswahl erlaubter Sonos-Control-API-Aufrufe.

Schleim OS speichert lokal nur die Worker-URL, ausgewählte Raum-/Haushalts-IDs und eine zufällige Sitzungskennung. Diese Daten werden unter `sonosControlConfig` gespeichert und nicht in das Schleim-Cloud-Backup aufgenommen. Die Sonos-Tokens liegen nicht im GitHub-Store-Katalog und nicht im Schleim-Cloud-Backup.

## Einmalige Einrichtung

### 1. Sonos Control Integration anlegen

1. Öffne den [Sonos Developer Portal / Integration Manager](https://developer.sonos.com/).
2. Melde dich mit deinem Sonos-Entwicklerkonto an.
3. Erstelle eine neue **Control Integration**.
4. Vergib einen Namen, zum Beispiel **Schleim OS Sonos**.
5. Erstelle eine Client Credential Key und notiere Client-ID und Client-Secret. Behandle das Secret wie ein Passwort.
6. Die Redirect-URL wird im nächsten Schritt eingetragen. Sie muss öffentlich erreichbar sein und HTTPS verwenden.

### 2. Cloudflare KV erstellen

1. Öffne das [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Erstelle unter **Workers & Pages → KV** einen privaten KV-Namespace, zum Beispiel `SONOS_SESSIONS`.
3. Notiere die Namespace-ID.

### 3. Worker bereitstellen

Die Worker-Datei liegt unter:
- `integrations/sonos-worker/src/index.js`
- `integrations/sonos-worker/wrangler.toml`

Du kannst die Datei als Cloudflare Worker über das Dashboard einfügen oder das Wrangler-Projekt verwenden.

Binde den KV-Namespace mit dem Binding-Namen **SONOS_SESSIONS** an den Worker. Erstelle unter **Settings → Variables and Secrets** folgende Werte:

| Name | Typ | Wert |
|---|---|---|
| `SONOS_CLIENT_ID` | Variable | Client-ID aus dem Sonos Integration Manager |
| `SONOS_CLIENT_SECRET` | Secret | Client-Secret aus dem Sonos Integration Manager |
| `SONOS_REDIRECT_URI` | Variable | Vollständige Worker-Adresse mit `/oauth/callback` |

Beispiel für die Redirect-URL:
`https://dein-worker.dein-konto.workers.dev/oauth/callback`

Trage **genau dieselbe vollständige HTTPS-Adresse** im Sonos Integration Manager als Redirect-URL für deine Integration ein. Die Adresse muss exakt übereinstimmen.

Wenn du Wrangler verwendest, ersetze in `wrangler.toml` die Platzhalter-KV-ID und Worker-Adresse. Lege das Client-Secret anschließend als Secret an, zum Beispiel über `wrangler secret put SONOS_CLIENT_SECRET`; speichere es nicht in einer öffentlichen Datei.

Nach dem Deployment sollte `https://DEIN-WORKER/health` den Dienststatus und `configured: true` melden.

### 4. Sonos in Schleim OS verbinden

1. Installiere **Sonos** im Schleim-Store.
2. Öffne die Sonos-Kachel auf dem Startbildschirm.
3. Füge im Feld **Cloudflare-Worker-URL** nur den HTTPS-Ursprung ein, zum Beispiel `https://dein-worker.dein-konto.workers.dev` – ohne Pfad.
4. Tippe auf **Server speichern** und erlaube den Netzwerkzugriff für diese Adresse.
5. Tippe auf **Mit Sonos verbinden**.
6. Melde dich im geöffneten Sonos-Fenster an und erlaube **Schleim OS Sonos** den Zugriff.
7. Nach der Freigabe lädt Schleim OS deine Haushalte, Raumgruppen, Favoriten und Playlists.

Die Verbindung ist anschließend in der Sonos-App gespeichert. Zum Beenden der Verbindung verwende **Sonos trennen** in der App. Damit wird die serverseitige Sitzung gelöscht.

## Grenzen der Texteingabe

Das Textfeld gleicht deine Eingabe mit den Namen deiner **gespeicherten Sonos-Favoriten und Sonos-Playlists** ab. Zum Beispiel kann „Spiele Radio Essen“ einen passenden Favoriten starten, wenn dieser in Sonos als Favorit gespeichert ist.

Die offizielle Control API stellt Drittanbieter-Integrationen keine allgemeine Freitextsuche über alle verbundenen Musikdienste bereit. Eine beliebige Suche wie „Spiele Titel XY von Künstler Z“ über Spotify, Apple Music, Amazon Music und alle anderen Dienste kann diese App deshalb nicht einfach selbst ausführen. Speichere solche Titel oder Sender zuerst in der Sonos-App als Favorit oder Playlist.

## Datenschutz und Sicherheit

- Das Sonos-Client-Secret bleibt als Cloudflare Secret auf dem Server.
- Access- und Refresh-Tokens bleiben im privaten Cloudflare-KV-Namespace.
- Im Browser liegt nur eine zufällige Sitzungskennung.
- Die Sonos-Sitzung ist getrennt vom Schleim-Konto.
- Die Sonos-Sitzung wird nicht in die SchleimCloud-Sicherung aufgenommen.
- Sonos-Verbindungen und Wiedergabesteuerung benötigen eine Internetverbindung zur Sonos Control API.

## Hinweise

Die App zeigt Metadaten und Albumcover so an, wie sie von Sonos geliefert werden, und weist die Wiedergabequelle aus. Die Oberfläche aktualisiert den Wiedergabestatus regelmäßig. Eine Sonos-Echtzeit-Event-Subscription ist in dieser ersten Integration noch nicht aktiviert.

## Offizielle Sonos-Dokumentation

- [Authorize – OAuth 2.0 und Client Credentials](https://docs.sonos.com/docs/authorize)
- [Discover – Haushalte, Gruppen und Player](https://docs.sonos.com/docs/discover)
- [Control API – Überblick](https://docs.sonos.com/docs/control)
- [Playback und Metadaten](https://docs.sonos.com/reference/playback)
- [Favoriten abrufen und starten](https://docs.sonos.com/reference/favorites-getfavorites-householdid)
- [Playlists abrufen und starten](https://docs.sonos.com/reference/playlists-getplaylists-householdid)
