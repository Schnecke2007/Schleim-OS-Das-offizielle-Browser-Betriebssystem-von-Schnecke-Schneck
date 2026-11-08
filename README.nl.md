# Schleim OS 🐌

**Het officiële browserbesturingssysteem van Schnecke Schneck** – jouw persoonlijke, aanpasbare startpagina voor de browser, met app-tegels, personalisatie en een responsief ontwerp voor desktop, tablet en smartphone. 🌐✨

[🌍 Officiële website](https://schnecke1.wixsite.com/schnecke-schneck) · [📦 Download het project als ZIP](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/main.zip) · [🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md)

![Version](https://img.shields.io/badge/version-3.4.1-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

## 🚀 Wat is Schleim OS?

Schleim OS is een browserextensie die de gewone nieuw-tabbladpagina van de browser vervangt door een eigen interface. In plaats van een lege of standaard tabbladpagina opent een persoonlijk startscherm met apps en snelkoppelingen.

Dit project is geen zelfstandig besturingssysteem dat Windows, Android of Linux vervangt. Het werkt binnen een compatibele browser en maakt gebruik van de extensiefuncties van die browser.

## ⭐ Functies

- Eigen nieuw-tabbladpagina voor Chrome en compatibele Chromium-browsers
- Startscherm met apps en websitelinks
- App-tegels verslepen en opnieuw ordenen
- Ontwerp, accentkleur en achtergrond aanpassen
- App-editor en lokale JSON-back-up en herstel
- Meertalige interface: Duits, Engels en Nederlands
- Afzonderlijk standalone HTML-bestand in het projectpakket
- Reclamevrije extensie-interface

## 📥 Downloaden en installeren

### 1. Download het project als ZIP-bestand

1. Open deze GitHub-repository.
2. Klik bovenaan op de groene knop **Code**.
3. Kies **Download ZIP** in het menu.
4. Sla het ZIP-bestand op je apparaat op.
5. Pak het ZIP-archief volledig uit.
6. Zoek in de uitgepakte bestanden de extensiemap waarin het bestand `manifest.json` rechtstreeks staat. Dit is de map die je straks selecteert – niet het ZIP-bestand en ook niet een bovenliggende map.

### 2. Google Chrome instellen

1. Open `chrome://extensions`.
2. Schakel rechtsboven **Ontwikkelaarsmodus** in.
3. Klik op **Uitgepakte extensie laden**.
4. Selecteer de uitgepakte extensiemap. Het bestand `manifest.json` moet rechtstreeks in deze map staan.
5. Open een nieuw tabblad. Schleim OS zou nu moeten verschijnen. 🎉

### Microsoft Edge en Brave

- **Edge:** Open `edge://extensions`.
- **Brave:** Open `brave://extensions`.
- Schakel de ontwikkelaarsmodus in, kies **Uitgepakte extensie laden** en selecteer vervolgens de uitgepakte extensiemap met `manifest.json` rechtstreeks erin.

> ⚠️ **Belangrijk – ZIP of map?** De knop **Uitgepakte extensie laden** verwacht een map, geen ZIP-bestand. Voor een lokale installatie via de ontwikkelaarsmodus van de browser moet je het ZIP-archief dat je via GitHub hebt gedownload eerst uitpakken. Selecteer daarna de map waarin `manifest.json` rechtstreeks staat.

## Schleim OS gebruiken en instellingen beheren

- **Apps openen:** Selecteer een tegel op het startscherm.
- **Tegels ordenen:** Sleep een tegel met de muis. Houd op apparaten met een touchscreen een tegel ingedrukt voordat je deze verplaatst.
- **Personaliseren:** Open de instellingen of de app-editor in de interface.
- **Instellingen back-uppen:** Gebruik de beschikbare JSON-functie om je persoonlijke instellingen te exporteren of te importeren.

Persoonlijke instellingen worden lokaal in het browserprofiel opgeslagen. Bewaar je JSON-back-up op een veilige plek.

## 🛠️ Problemen oplossen

| Probleem | Mogelijke oplossing |
|---|---|
| Schleim OS verschijnt niet in een nieuw tabblad | Controleer of de extensie is ingeschakeld en of de uitgepakte extensiemap met `manifest.json` is geladen. |
| Chrome meldt een ongeldig manifest | Pak het ZIP-bestand volledig uit en selecteer de map waarin `manifest.json` rechtstreeks staat. |
| Er is een ZIP-bestand geselecteerd in het venster voor uitgepakte extensies | Pak het ZIP-archief eerst uit. Selecteer daarna de extensiemap die erin staat. |
| De verkeerde map is geselecteerd | Selecteer de map waarin `manifest.json` rechtstreeks staat, niet de bovenliggende repositorymap. |
| Een andere nieuw-tabbladextensie is actief | Schakel de andere extensie tijdelijk uit. Meerdere extensies kunnen niet tegelijkertijd dezelfde nieuw-tabbladpagina vervangen. |
| Wijzigingen worden niet weergegeven | Open `chrome://extensions`, klik bij Schleim OS op **Opnieuw laden** en open een nieuw tabblad. |
| Een externe website of insluiting blijft leeg | Controleer je internetverbinding. Sommige aanbieders blokkeren insluiting op andere websites. |
| Instellingen ontbreken na een browserwissel | Het browserprofiel wordt lokaal opgeslagen. Exporteer de JSON-back-up in de oude browser en importeer deze in de nieuwe browser. |
| Installatie werkt niet op Android | Chrome voor Android ondersteunt geen gewone desktop-Chrome-extensies. Hiervoor is een aparte PWA of een browser met extensieondersteuning nodig. |

## 📁 Projectstructuur

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

## 🔐 Privacy en machtigingen

Schleim OS slaat interface- en personalisatie-instellingen lokaal op in het browserprofiel. De extensie gebruikt de machtigingen die in `manifest.json` worden vermeld. Wanneer externe apps en websites worden geopend, kan er verbinding worden gemaakt met de betreffende aanbieders; ook hun privacybeleid is dan van toepassing.

De extensie-interface bevat geen advertentie-iframes, geen controles of advertenties bereikbaar zijn en geen opstartblokkering vanwege advertenties. Vermeldingen over advertenties in overgenomen juridische teksten hebben betrekking op de daarin beschreven website en niet op advertenties die in de extensie zijn ingebouwd.

## 💡 Opmerkingen

- Schleim OS vervangt de nieuw-tabbladpagina, niet de volledige browserinterface.
- Incognitovensters kunnen eigen beperkingen hebben.
- Google Chrome voor Android ondersteunt geen gewone desktopextensies.
- Voor externe inhoud kan een internetverbinding nodig zijn.

## 🌐 Talen en documentatie

- [Deutsch – hoofddocumentatie](README.md)
- [English – documentation](README.en.md)
- [Nederlands – hoofddocumentatie](README.nl.md)
- [Installatiehandleiding](docs/INSTALLATION.md)
- [Technische opmerkingen](docs/TECHNICAL-NOTES.md)


## 📬 Contact en ondersteuning

Heb je vragen over Schleim OS, hulp nodig bij de installatie of wil je een probleem melden? Je kunt rechtstreeks contact met mij opnemen:

- **WhatsApp:** [Stuur mij een bericht](https://wa.me/491773988636) op **+49 177 3988636**.
- **E-mail:** [info.schnecke.schneck@gmail.com](mailto:info.schnecke.schneck@gmail.com).

Beschrijf je vraag kort, zodat ik je zo goed mogelijk kan helpen. Bij technische problemen is het ook handig om te vermelden welke browser en versie je gebruikt en welke stappen tot het probleem hebben geleid. Stuur nooit wachtwoorden of andere vertrouwelijke inloggegevens.

## 💬 Feedback

Jouw feedback is belangrijk voor mij! Ik ontvang graag beoordelingen, verbetersuggesties, ideeën en meldingen van fouten. Je kunt op de volgende manieren feedback geven:

- **GitHub:** [Feedback, vragen of foutmeldingen als issue indienen](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues).
- **Google-bedrijfsprofiel:** [Schnecke-Schneck Creator Studio beoordelen](https://g.page/r/CfqIlATGmPYUEBM/review).
- **E-mail:** [Feedback per e-mail versturen](mailto:info.schnecke.schneck@gmail.com).
- **WhatsApp:** [Rechtstreeks feedback sturen via WhatsApp](https://wa.me/491773988636).

Bedankt dat je de tijd neemt om Schleim OS en mijn werk te ondersteunen! ❤️

## 📱 Volg mij op social media

Wil je meer zien van mijn projecten en updates? Ik vind het leuk als je mij volgt op Instagram en TikTok:

- **Instagram:** [@schnecke_schneck2007](https://www.instagram.com/schnecke_schneck2007/)
- **TikTok:** [@schnecke_schneck2007](https://www.tiktok.com/@schnecke_schneck2007/)

---

**Schleim OS** wordt ontwikkeld en onderhouden door **Schnecke Schneck**.

© 2026 Schnecke Schneck.
