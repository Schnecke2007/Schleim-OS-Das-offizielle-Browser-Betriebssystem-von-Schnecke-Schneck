# Schleim OS 🐌

**Das offizielle Browser-Betriebssystem von Schnecke Schneck** – deine persönliche, anpassbare Browser-Startseite mit App-Kacheln, Personalisierung und responsivem Design für Desktop, Tablet und Smartphone. 🌐✨

![Version](https://img.shields.io/badge/version-3.11.0-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

[🌍 Offizielle Webseite](https://schnecke1.wixsite.com/schnecke-schneck) · [📦 Projekt als ZIP herunterladen](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/main.zip)

[🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md) · [🧪 Demo öffnen](https://raw.githack.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) · [📖 Leichte Sprache](docs/Leichte-Sprache/Deutsch/README.md)

## 👋 Über mich

Hey! Ich bin **Schnecke Schneck**, 19 Jahre alt und komme aus **Bottrop in Nordrhein-Westfalen, Deutschland**. Im Internet bin ich unter dem Namen *Schnecke Schneck* unterwegs und beschäftige mich besonders gerne mit Technik und digitalen Ideen.

Zu meinen Hobbys gehören **Programmieren, Webdesign sowie das Entwickeln und Gestalten von Websites und Apps**. Außerdem interessiere ich mich für **künstliche Intelligenz (KI), Computer, digitale Systeme und neue Technologien**. Ich probiere gerne Werkzeuge aus, lerne Neues dazu und setze eigene Ideen in kleinen und größeren Projekten um.

Was mich daran begeistert? Aus einer Idee Schritt für Schritt etwas Funktionierendes zu machen! Ich finde es spannend zu verstehen, wie Technik im Hintergrund arbeitet, Probleme selbst zu lösen und digitale Projekte kreativ zu gestalten. Dabei nutze ich auch KI als Unterstützung zum Lernen, Planen und Entwickeln.

**Schleim OS** ist eines meiner eigenen Projekte. Mit meinen Projekten möchte ich meine Begeisterung für Technik teilen und zeigen, was man mit Neugier, Kreativität und digitalen Werkzeugen erschaffen kann. 🐌💻

## 🧪 Schleim OS live ausprobieren

[**Demo in einem neuen Browser-Tab öffnen**](https://raw.githack.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) – du kannst die Standalone-Version direkt testen. Für die Demo musst du die Erweiterung nicht installieren.

## 🚀 Was ist Schleim OS?

Schleim OS ist eine Browser-Erweiterung, die den normalen neuen Tab durch eine eigene Oberfläche ersetzt. Statt einer leeren oder standardmäßigen Tab-Seite öffnet sich ein persönlicher Startbildschirm mit Apps und Verknüpfungen.

Das Projekt ist kein eigenständiges Betriebssystem, das Windows, Android oder Linux ersetzt. Es läuft innerhalb eines kompatiblen Browsers und nutzt dessen Erweiterungsfunktionen.

## ⭐ Funktionen

- Eigene Neuer-Tab-Seite für Chrome und kompatible Chromium-Browser
- Startbildschirm mit Apps und Website-Verknüpfungen
- App-Kacheln per Drag-and-drop neu anordnen
- Personalisierung von Design, Akzentfarbe und Hintergrund
- Schleim-Store mit Empfehlungen, Kategorien, Suche, Installation und Deinstallation von Web-Apps
- App-Vorschläge über ein GitHub-Issue-Formular einreichen
- Schleim-Store: Zugriff nur nach Anmeldung mit dem Schleim-Konto
- Schleim-Konto mit GitHub-Anmeldung und privater Cloud-Sicherung des Homescreens
- Mehrsprachige Oberfläche: Deutsch, Englisch und Niederländisch
- Separate Standalone-HTML-Datei im Projektpaket
- Werbefreie Erweiterungsoberfläche

## 🛍️ Der Schleim-Store

Der **Schleim-Store** ist nur nach einer Anmeldung mit dem Schleim-Konto verfügbar. Ohne Anmeldung bleiben App-Katalog, Suche, Bewertungen, Installationen und Vorschläge gesperrt. Nach erfolgreicher Anmeldung wird der Store freigeschaltet. Die Katalogdateien im öffentlichen GitHub-Repository bleiben unabhängig davon direkt auf GitHub einsehbar.

- **Entdecken:** Empfehlungen, neue Apps, Top-Bewertungen und Kategorien.
- **Installieren:** Eine App wird als Kachel hinzugefügt und öffnet die zugehörige Webseite in einem neuen Browser-Tab.
- **Einreichen:** Besucher können eigene Webseiten über das öffentliche [GitHub-Einreichungsformular](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues/new?template=app-submission.md) vorschlagen.
- **Lokale Webseiten übernehmen:** Importierte oder bereits lokal gespeicherte Webseiten erscheinen unter „Bisherige eigene Webseiten“. Mit „Im Schleim-Store einreichen“ werden ihre Daten in das Einreichungsformular übernommen. Ergänze eine aussagekräftige Beschreibung und sende den Vorschlag zur Prüfung auf GitHub ab.
- **Bewerten:** Über die Sterne öffnest du ein GitHub-Formular und kannst zusätzlich einen Feedbacktext eintragen. Nach erfolgreicher Verarbeitung wird das Issue automatisch geschlossen. Jede Bewertung wird mit GitHub-Benutzername und optionalem Feedback als JSON-Datei im öffentlichen Ordner `Bewertungen/` gespeichert. GitHub Actions berechnet daraus den veröffentlichten Sterne-Durchschnitt und die Stimmenzahl. Pro GitHub-Konto und App zählt die neueste Bewertung.
- **Prüfen und veröffentlichen:** Vorschläge erscheinen nicht automatisch. Vorschläge werden vor der Veröffentlichung geprüft und freigegeben.

Der öffentliche [Store-Katalog](Store/README.md) ist nach Kategorien sortiert. Jede freigegebene App erhält eine eigene JSON-Datei im passenden Kategorieordner. Die Erweiterung nutzt zusätzlich den zentralen Laufzeitkatalog unter `extension/data/store-apps.json`.

**Transparenz:** Das GitHub-Repository, der Store-Katalog, Bewertungen und App-Vorschläge als Issues sind öffentlich einsehbar. Reiche dort keine Passwörter, privaten Daten oder vertraulichen Inhalte ein. Die Anmeldung schützt die Store-Oberfläche in Schleim OS, nicht die Dateien im öffentlichen Repository.

## 📥 Download und Installation

1. Öffne das [Schleim-OS-GitHub-Repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck).
2. Klicke auf **Code → Download ZIP** und lade das **vollständige Repository** herunter.
3. Entpacke die ZIP-Datei **nicht**.
4. Öffne die Erweiterungsverwaltung eines unterstützten Chromium-Browsers.
5. Aktiviere bei Bedarf den **Entwicklermodus**.
6. Wähle die Importfunktion für ZIP-Dateien, beispielsweise **„From .zip/.crx/.user.js“**.
7. Wähle die vollständige Repository-ZIP aus und bestätige die Installation.

Der Browser-Importer erkennt Schleim OS im Unterordner `extension`. Die Bezeichnung und Position der Import-Schaltfläche kann je nach Browser und Gerät variieren. Voraussetzung ist ein Browser, der den direkten ZIP-Import unterstützt.

## Bedienung und Einstellungen

- **Apps starten:** Eine Kachel auf dem Startbildschirm auswählen.
- **Kacheln sortieren:** Eine Kachel mit der Maus ziehen. Auf Touchgeräten die Kachel gedrückt halten und verschieben.
- **Personalisieren:** Den Einstellungsbereich in der Oberfläche öffnen.
- **Apps entdecken:** Den Schleim-Store öffnen, nach Web-Apps suchen und gewünschte Apps installieren oder wieder entfernen.
- **Schleim-Konto:** Die Anmeldung startet mit der GitHub-App-Seite. Nach der Installation bestätigst du sie in Schleim OS. Der Gerätecode wird angezeigt, automatisch kopiert und die GitHub-Gerätefreigabe geöffnet. Nach der Bestätigung prüft Schleim OS die App-Installation und erstellt bei Bedarf dein privates Repository `schleim-os-cloud`.
- **Cloud-Sicherung:** Die Sicherung und Wiederherstellung findest du ausschließlich unter **Einstellungen → Schleim-Konto**. Gesichert werden die gespeicherten Schleim-OS-Einstellungen, die App-Reihenfolge, installierte Store-Apps und das Hintergrundbild. Es gibt keine automatische Synchronisierung bei jeder Änderung. Details: [Schleim-Konto einrichten](extension/docs/SCHLEIM-KONTO.md).

# 🛠️ Schleim OS – Fehlerbehebung

Hier findest du Lösungen für häufige Probleme beim direkten ZIP-Import und bei der Verwendung von Schleim OS.

| Problem | Mögliche Lösung |
|---|---|
| **Die ZIP-Import-Schaltfläche fehlt.** | Prüfe, ob dein Browser den Import von ZIP-Erweiterungen unterstützt. Die Schaltfläche kann beispielsweise **„From .zip/.crx/.user.js“** heißen. |
| **Die ZIP-Datei wird nicht angezeigt.** | Lade zuerst über GitHub **Code → Download ZIP** das vollständige Repository herunter. Prüfe anschließend, ob dein Browser-Dateiauswahldialog den Download-Ordner anzeigt. |
| **Die Installation meldet einen Fehler.** | Stelle sicher, dass du das vollständige Repository-ZIP ausgewählt hast und es unverändert geblieben ist. Verwende nicht einzelne Dateien oder ein anderes Archiv. |
| **Schleim OS erscheint nicht in einem neuen Tab.** | Prüfe in der Erweiterungsverwaltung, ob Schleim OS installiert und aktiviert ist. Öffne danach einen neuen Tab. |
| **Eine andere Erweiterung ersetzt ebenfalls den neuen Tab.** | Deaktiviere testweise andere Erweiterungen, die ebenfalls die Neuer-Tab-Seite ersetzen. |
| **Änderungen werden nicht angezeigt.** | Öffne die Erweiterungsverwaltung und verwende bei Schleim OS die Schaltfläche **Aktualisieren** bzw. **Neu laden**, sofern vorhanden. Öffne anschließend einen neuen Tab. |
| **Externe Inhalte fehlen oder bleiben leer.** | Prüfe deine Internetverbindung. Manche Anbieter blockieren die Einbettung ihrer Seiten in andere Websites. |
| **Einstellungen fehlen nach einem Browserwechsel.** | Öffne **Einstellungen → Schleim-Konto**, melde dich mit demselben GitHub-Konto an und wähle **Cloud-Sicherung wiederherstellen**. |
| **Die Installation funktioniert in Chrome für Android nicht.** | Chrome für Android unterstützt keine regulären Chrome-Erweiterungen. Verwende einen Android-Browser, der Erweiterungen und direkten ZIP-Import unterstützt. |

## Weitere Hilfe

Wenn das Problem weiterhin besteht, melde es bitte über [GitHub Issues](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues). Beschreibe dabei möglichst genau, welchen Browser und welche Version du verwendest und welche Schritte zum Fehler führen. Teile keine Passwörter oder vertraulichen Zugangsdaten.

---

[🇬🇧 English troubleshooting](docs/Englisch/TROUBLESHOOTING.md) · [🇳🇱 Nederlandse probleemoplossing](docs/Niederländisch/PROBLEMEN-OPLOSSEN.md)

## 💡 Hinweise

- Schleim OS ersetzt die Neuer-Tab-Seite, nicht die gesamte Browseroberfläche.
- Inkognito-Fenster können eigene Einschränkungen haben.
- Google Chrome für Android unterstützt keine normalen Desktop-Erweiterungen.
- Externe Inhalte benötigen gegebenenfalls eine Internetverbindung.

## 🌐 Sprachen und Dokumentation

- [Deutsch – Hauptdokumentation](README.md)
- [English – documentation](README.en.md)
- [Nederlands – documentatie](README.nl.md)
- [Installationsanleitung](docs/Deutsch/INSTALLATION.md)
- [Fehlerbehebung](docs/Deutsch/FEHLERBEHEBUNG.md)
- [Technische Hinweise](docs/Deutsch/TECHNISCHE-HINWEISE.md)
- [Dokumentationsübersicht – alle Sprachen](docs/README.md)

## 📖 Dokumentation in Leichter Sprache

Du möchtest kurze Sätze und einfache Erklärungen? Hier findest du die [deutsche Dokumentation in Leichter Sprache](docs/Leichte-Sprache/Deutsch/README.md). Es gibt dort auch eine einfache Installationsanleitung, Hilfe und Erklärungen zu rechtlichen Themen. Für den Store gibt es eine eigene [Anleitung in Leichter Sprache](docs/Leichte-Sprache/Deutsch/SCHLEIM-STORE.md).

## 📁 Projektstruktur

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
├── Store/
│   ├── ai/
│   ├── communication/
│   ├── knowledge/
│   ├── media/
│   ├── navigation/
│   ├── privacy/
│   ├── productivity/
│   ├── shopping/
│   └── tools/
├── Bewertungen/
│   ├── README.md
│   └── <issue-number>.json
├── docs/
│   ├── Deutsch/
│   ├── Englisch/
│   ├── Leichte-Sprache/
│   ├── Niederländisch/
│   └── README.md
├── extension/
│   ├── assets/icons/
│   ├── data/
│   ├── docs/
│   ├── locales/
│   ├── pages/newtab.html
│   ├── scripts/
│   │   ├── app.js
│   │   ├── personalization.js
│   │   ├── schleim-account.js
│   │   └── slime-store-admin.js
│   ├── standalone/schleim-os-standalone.html
│   ├── styles/
│   ├── manifest.json
│   ├── README.md
│   └── SHA256SUMS.txt
├── legal/
│   ├── Deutsch/
│   ├── Englisch/
│   ├── Niederländisch/
│   └── README.md
├── .gitignore
├── README.md
├── README.en.md
└── README.nl.md
```

## 🔐 Datenschutz und Berechtigungen

Schleim OS speichert Oberflächen- und Personalisierungseinstellungen lokal im Browserprofil. Die Erweiterung verwendet die in `manifest.json` aufgeführten Berechtigungen. Externe Apps und Websites können beim Öffnen eine Verbindung zu ihren jeweiligen Anbietern herstellen; deren Datenschutzbestimmungen gelten zusätzlich.

Die Erweiterungsoberfläche enthält keine Werbe-IFrames, keine Werbe-Erreichbarkeitsprüfung und keine werbebedingte Start-Sperre. Aussagen zu Werbung in übernommenen Rechtstexten beziehen sich auf die dort beschriebene Website und nicht auf eine Werbeeinbindung in der Extension.

## ⚖️ Rechtliche Informationen

- [Allgemeine Geschäftsbedingungen (AGB) & Community-Richtlinien](legal/Deutsch/AGB.md)
- [Datenschutzerklärung](legal/Deutsch/DATENSCHUTZ.md)
- [Impressum](legal/Deutsch/IMPRESSUM.md)

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
