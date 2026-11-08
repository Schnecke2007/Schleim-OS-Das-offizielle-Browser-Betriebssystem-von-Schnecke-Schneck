# Schleim OS 🐌

**Das offizielle Browser-Betriebssystem von Schnecke Schneck** – deine persönliche, anpassbare Browser-Startseite mit App-Kacheln, Personalisierung und responsivem Design für Desktop, Tablet und Smartphone. 🌐✨

[🌍 Offizielle Webseite](https://schnecke1.wixsite.com/schnecke-schneck) · [📦 Projekt als ZIP herunterladen](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/main.zip) · [🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md)

![Version](https://img.shields.io/badge/version-3.4.1-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

## 👋 Über mich

Hey! Ich bin **Schnecke Schneck**, 19 Jahre alt und komme aus **Bottrop in Nordrhein-Westfalen, Deutschland**. Im Internet bin ich unter dem Namen *Schnecke Schneck* unterwegs und beschäftige mich besonders gerne mit Technik und digitalen Ideen.

Zu meinen Hobbys gehören **Programmieren, Webdesign sowie das Entwickeln und Gestalten von Websites und Apps**. Außerdem interessiere ich mich für **künstliche Intelligenz (KI), Computer, digitale Systeme und neue Technologien**. Ich probiere gerne Werkzeuge aus, lerne Neues dazu und setze eigene Ideen in kleinen und größeren Projekten um.

Was mich daran begeistert? Aus einer Idee Schritt für Schritt etwas Funktionierendes zu machen! Ich finde es spannend zu verstehen, wie Technik im Hintergrund arbeitet, Probleme selbst zu lösen und digitale Projekte kreativ zu gestalten. Dabei nutze ich auch KI als Unterstützung zum Lernen, Planen und Entwickeln.

**Schleim OS** ist eines meiner eigenen Projekte. Mit meinen Projekten möchte ich meine Begeisterung für Technik teilen und zeigen, was man mit Neugier, Kreativität und digitalen Werkzeugen erschaffen kann. 🐌💻

## 🚀 Was ist Schleim OS?

Schleim OS ist eine Browser-Erweiterung, die den normalen neuen Tab durch eine eigene Oberfläche ersetzt. Statt einer leeren oder standardmäßigen Tab-Seite öffnet sich ein persönlicher Startbildschirm mit Apps und Verknüpfungen.

Das Projekt ist kein eigenständiges Betriebssystem, das Windows, Android oder Linux ersetzt. Es läuft innerhalb eines kompatiblen Browsers und nutzt dessen Erweiterungsfunktionen.

## ⭐ Funktionen

- Eigene Neuer-Tab-Seite für Chrome und kompatible Chromium-Browser
- Startbildschirm mit Apps und Website-Verknüpfungen
- App-Kacheln per Drag-and-drop neu anordnen
- Personalisierung von Design, Akzentfarbe und Hintergrund
- App-Editor und lokale JSON-Sicherung bzw. Wiederherstellung
- Mehrsprachige Oberfläche: Deutsch, Englisch und Niederländisch
- Separate Standalone-HTML-Datei im Projektpaket
- Werbefreie Erweiterungsoberfläche

## 📥 Download und Installation

### 1. Projekt als ZIP herunterladen

1. Öffne dieses GitHub-Repository.
2. Klicke oben auf die grüne Schaltfläche **Code**.
3. Wähle im Menü **Download ZIP**.
4. Speichere die ZIP-Datei auf deinem Gerät.
5. Entpacke die ZIP-Datei vollständig.
6. Suche in den entpackten Dateien den Erweiterungsordner, in dem die Datei `manifest.json` direkt liegt. Wähle später genau diesen Ordner aus – nicht die ZIP-Datei und nicht einen übergeordneten Ordner.

### 2. Google Chrome einrichten

1. Öffne `chrome://extensions`.
2. Aktiviere oben rechts den **Entwicklermodus**.
3. Klicke auf **Entpackte Erweiterung laden**.
4. Wähle den zuvor entpackten Erweiterungsordner aus. Die Datei `manifest.json` muss direkt darin liegen.
5. Öffne einen neuen Tab. Schleim OS sollte jetzt angezeigt werden. 🎉

### Microsoft Edge und Brave

- **Edge:** Öffne `edge://extensions`.
- **Brave:** Öffne `brave://extensions`.
- Aktiviere den Entwicklermodus, wähle **Entpackt laden** und anschließend den entpackten Erweiterungsordner mit der direkt darin liegenden Datei `manifest.json`.

> ⚠️ **Wichtig – ZIP oder Ordner?** Die Schaltfläche **„Entpackte Erweiterung laden“** erwartet einen Ordner, keine ZIP-Datei. Für die lokale Installation über den Browser-Entwicklermodus musst du das über GitHub heruntergeladene ZIP-Archiv daher zuerst entpacken. Wähle danach den Ordner aus, in dem `manifest.json` direkt liegt.

## Bedienung und Einstellungen

- **Apps starten:** Eine Kachel auf dem Startbildschirm auswählen.
- **Kacheln sortieren:** Eine Kachel mit der Maus ziehen. Auf Touchgeräten die Kachel gedrückt halten und verschieben.
- **Personalisieren:** Den Einstellungs- bzw. App-Editor in der Oberfläche öffnen.
- **Sicherung:** Die angebotene JSON-Funktion verwenden, um persönliche Einstellungen zu exportieren oder wieder einzulesen.

Persönliche Einstellungen werden lokal im Browserprofil gespeichert. Das JSON-Backup sollte an einem sicheren Ort aufbewahrt werden.

## 🛠️ Fehlerbehebung

| Problem | Mögliche Lösung |
|---|---|
| Schleim OS erscheint nicht in einem neuen Tab | Prüfen, ob die Erweiterung aktiviert ist und der entpackte Erweiterungsordner mit `manifest.json` geladen wurde. |
| Chrome meldet ein ungültiges Manifest | ZIP-Datei vollständig entpacken und den Ordner auswählen, in dem `manifest.json` direkt liegt. |
| ZIP-Datei wurde im Dialog „Entpackte Erweiterung laden“ ausgewählt | Das ZIP-Archiv zuerst entpacken. Anschließend den darin enthaltenen Erweiterungsordner auswählen. |
| Falscher Ordner wurde ausgewählt | Nicht den übergeordneten Repository-Ordner, sondern den Ordner auswählen, in dem `manifest.json` direkt liegt. |
| Eine andere Neuer-Tab-Erweiterung ist aktiv | Die andere Erweiterung vorübergehend deaktivieren. Mehrere Erweiterungen können dieselbe Tab-Seite nicht gleichzeitig ersetzen. |
| Änderungen werden nicht angezeigt | Unter `chrome://extensions` bei Schleim OS auf **Aktualisieren** klicken und einen neuen Tab öffnen. |
| Eine externe Website oder Einbettung bleibt leer | Internetverbindung prüfen. Manche Anbieter blockieren das Einbetten in andere Seiten. |
| Einstellungen sind nach einem Browserwechsel weg | Das Browserprofil ist lokal. Das JSON-Backup im alten Browser exportieren und im neuen Browser importieren. |
| Installation auf Android funktioniert nicht | Chrome für Android unterstützt keine regulären Desktop-Chrome-Erweiterungen. Dafür ist eine separate PWA oder ein Browser mit Erweiterungsunterstützung nötig. |

## 📁 Projektstruktur

```text
schleim-os-browser-extension/
├── manifest.json
├── pages/
│   └── newtab.html
├── scripts/
│   ├── app.js
│   └── personalization.js
├── styles/
│   ├── main.css
│   └── personalization.css
├── locales/
│   └── legal-translations.js
├── assets/
│   └── icons/
├── docs/
├── standalone/
│   └── schleim-os-standalone.html
└── README.md
```

## 🔐 Datenschutz und Berechtigungen

Schleim OS speichert Oberflächen- und Personalisierungseinstellungen lokal im Browserprofil. Die Erweiterung verwendet die in `manifest.json` aufgeführten Berechtigungen. Externe Apps und Websites können beim Öffnen eine Verbindung zu ihren jeweiligen Anbietern herstellen; deren Datenschutzbestimmungen gelten zusätzlich.

Die Erweiterungsoberfläche enthält keine Werbe-IFrames, keine Werbe-Erreichbarkeitsprüfung und keine werbebedingte Start-Sperre. Aussagen zu Werbung in übernommenen Rechtstexten beziehen sich auf die dort beschriebene Website und nicht auf eine Werbeeinbindung in der Extension.

## 💡 Hinweise

- Schleim OS ersetzt die Neuer-Tab-Seite, nicht die gesamte Browseroberfläche.
- Inkognito-Fenster können eigene Einschränkungen haben.
- Google Chrome für Android unterstützt keine normalen Desktop-Erweiterungen.
- Externe Inhalte benötigen gegebenenfalls eine Internetverbindung.

## 🌐 Sprachen und Dokumentation

- [Deutsch – Hauptdokumentation](README.md)
- [English – documentation](README.en.md)
- [Nederlands – documentatie](README.nl.md)
- [Installationsanleitung](docs/INSTALLATION.md)
- [Technische Hinweise](docs/TECHNICAL-NOTES.md)

## 📬 Kontakt und Support

Du hast Fragen zu Schleim OS, benötigst Hilfe bei der Installation oder möchtest ein Problem melden? Du kannst mich direkt kontaktieren:

- **WhatsApp:** [Schreibe mir eine Nachricht](https://wa.me/491773988636) unter **+49 177 3988636**.
- **E-Mail:** [info.schnecke.schneck@gmail.com](mailto:info.schnecke.schneck@gmail.com).

Damit ich dir möglichst gut helfen kann, beschreibe bitte kurz dein Anliegen. Bei technischen Problemen helfen außerdem der verwendete Browser, dessen Version und eine Beschreibung der einzelnen Schritte. Bitte sende niemals Passwörter oder andere vertrauliche Zugangsdaten.

## 💬 Feedback

Deine Meinung ist mir wichtig! Ich freue mich über Bewertungen, Verbesserungsvorschläge, Ideen und Hinweise auf Fehler. Du kannst dein Feedback auf folgenden Wegen teilen:

- **GitHub:** [Feedback, Fragen oder Fehler als Issue melden](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues).
- **Google-Unternehmensprofil:** [Schnecke-Schneck Creator Studio bewerten](https://g.page/r/CfqIlATGmPYUEBM/review).
- **E-Mail:** [Feedback per E-Mail senden](mailto:info.schnecke.schneck@gmail.com).
- **WhatsApp:** [Feedback direkt per WhatsApp senden](https://wa.me/491773988636).

Vielen Dank, dass du dir die Zeit nimmst, Schleim OS und meine Arbeit zu unterstützen! ❤️

## 📱 Folge mir auf Social Media

Du möchtest mehr von meinen Projekten und Neuigkeiten sehen? Dann freue ich mich, wenn du mir auf Instagram und TikTok folgst:

- **Instagram:** [@schnecke_schneck2007](https://www.instagram.com/schnecke_schneck2007/)
- **TikTok:** [@schnecke_schneck2007](https://www.tiktok.com/@schnecke_schneck2007)

---

## 🤝 Mitwirkende & Credits

- **Projektentwicklung und Verantwortung:** Schnecke Schneck.
- **KI-Unterstützung:** [ChatGPT von OpenAI](https://chatgpt.com/) – Unterstützung bei Ideenfindung, Planung, Programmierung, Fehleranalyse, Dokumentation und Übersetzungen.

*Hinweis: ChatGPT ist ein KI-Assistent und keine menschliche Person oder ein eigenständiger GitHub-Contributor. Die Projektidee, Entscheidungen und Verantwortung für Schleim OS liegen bei Schnecke Schneck.*

---

**Schleim OS** wird von **Schnecke Schneck** entwickelt und gepflegt.

© 2026 Schnecke Schneck.

