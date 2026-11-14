# Schleim OS 🐌

**Het officiële browserbesturingssysteem van Schnecke Schneck** – jouw persoonlijke, aanpasbare startpagina voor de browser, met app-tegels, personalisatie en een responsief ontwerp voor desktop, tablet en smartphone. 🌐✨

![Version](https://img.shields.io/badge/version-3.11.0-806040) ![Manifest](https://img.shields.io/badge/Manifest-V3-blue) ![Browser](https://img.shields.io/badge/Browser-Chromium-green)

[🌍 Officiële website](https://schnecke1.wixsite.com/schnecke-schneck) · [📦 Download het project als ZIP](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/archive/refs/heads/main.zip)

[🇩🇪 Deutsch](README.md) · [🇬🇧 English](README.en.md) · [🇳🇱 Nederlands](README.nl.md) · [🧪 Demo openen](https://raw.githack.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) · [📖 Eenvoudige taal](docs/Leichte-Sprache/Niederländisch/README.md)

## 👋 Over mij

Hoi! Ik ben **Schnecke Schneck**, ik ben 19 jaar oud en kom uit **Bottrop in Noordrijn-Westfalen, Duitsland**. Online gebruik ik de naam *Schnecke Schneck*. Ik ben vooral geïnteresseerd in technologie en digitale ideeën.

Mijn hobby's zijn **programmeren, webdesign en het maken en vormgeven van websites en apps**. Daarnaast ben ik enthousiast over **kunstmatige intelligentie (AI), computers, digitale systemen en nieuwe technologieën**. Ik probeer graag nieuwe tools uit, leer steeds iets nieuws en werk mijn eigen ideeën uit tot kleine en grotere projecten.

Wat mij hierin zo aanspreekt? Het is geweldig om een idee stap voor stap om te zetten in iets dat echt werkt! Ik vind het interessant om te ontdekken hoe technologie achter de schermen werkt, zelf problemen op te lossen en digitale projecten creatief vorm te geven. AI gebruik ik ook als hulpmiddel om te leren, plannen en ontwikkelen.

**Schleim OS** is een van mijn eigen projecten. Met mijn projecten wil ik mijn enthousiasme voor technologie delen en laten zien wat nieuwsgierigheid, creativiteit en digitale hulpmiddelen mogelijk maken. 🐌💻

## 🧪 Schleim OS live uitproberen

[**Open de demo in een nieuw browsertabblad**](https://raw.githack.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/main/extension/standalone/schleim-os-standalone.html) – probeer de standalone-versie direct uit. Je hoeft de uitbreiding niet te installeren om de demo te gebruiken.

## 🚀 Wat is Schleim OS?

Schleim OS is een browserextensie die de gewone nieuw-tabbladpagina van de browser vervangt door een eigen interface. In plaats van een lege of standaard tabbladpagina opent een persoonlijk startscherm met apps en snelkoppelingen.

Dit project is geen zelfstandig besturingssysteem dat Windows, Android of Linux vervangt. Het werkt binnen een compatibele browser en maakt gebruik van de extensiefuncties van die browser.

## ⭐ Functies

- Eigen nieuw-tabbladpagina voor Chrome en compatibele Chromium-browsers
- Startscherm met apps en websitelinks
- App-tegels verslepen en opnieuw ordenen
- Ontwerp, accentkleur en achtergrond aanpassen
- Schleim-Store met aanbevelingen, categorieën, zoeken, installeren en verwijderen van webapps
- App-voorstellen indienen via een GitHub-issueformulier
- Schleim-Store: toegang is alleen mogelijk na aanmelding met een Schleim-account
- Schleim-account met GitHub-aanmelding en privécloudback-up van het startscherm
- Meertalige interface: Duits, Engels en Nederlands
- Afzonderlijk standalone HTML-bestand in het projectpakket
- Reclamevrije extensie-interface

## 🛍️ Schleim-Store

De **Schleim-Store** is alleen beschikbaar nadat je je met een Schleim-account hebt aangemeld. Zonder aanmelding blijven de appcatalogus, zoekfunctie, beoordelingen, installaties en voorstellen vergrendeld. Na een succesvolle aanmelding wordt de Store vrijgegeven. Catalogusbestanden in de openbare GitHub-repository blijven rechtstreeks op GitHub zichtbaar.

- **Ontdekken:** Aanbevelingen, nieuwe apps, hoogste beoordelingen en categorieën.
- **Installeren:** Een app wordt als tegel toegevoegd en opent de bijbehorende website in een nieuw browsertabblad.
- **Voorstellen:** Bezoekers kunnen websites voorstellen via het openbare [GitHub-inzendformulier](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues/new?template=app-submission.md).
- **Lokale websites indienen:** Geïmporteerde of eerder opgeslagen websites verschijnen onder „Eerder toegevoegde websites“. Kies „Indienen bij de Schleim-Store“ om de gegevens naar het inzendformulier over te nemen. Voeg een duidelijke beschrijving toe en dien het voorstel ter beoordeling in op GitHub.
- **Beoordelen:** Met de sterren open je een GitHub-formulier waar je optioneel tekstuele feedback kunt toevoegen. Na succesvolle verwerking wordt het issue automatisch gesloten. Elke beoordeling wordt met de GitHub-gebruikersnaam en feedback als JSON-bestand opgeslagen in de openbare map `Bewertungen/`. GitHub Actions berekent het gepubliceerde Store-gemiddelde en het aantal stemmen op basis van deze bestanden; per GitHub-account en app telt de nieuwste beoordeling.
- **Controleren en publiceren:** Voorstellen worden niet automatisch gepubliceerd. Voorstellen worden gecontroleerd en goedgekeurd voordat ze aan de Store worden toegevoegd.

De openbare [Store-catalogus](Store/README.md) is ingedeeld per categorie. Elke goedgekeurde app krijgt een eigen JSON-bestand in de bijbehorende categorie. De extensie gebruikt daarnaast de centrale runtime-catalogus in `extension/data/store-apps.json`.

**Transparantie:** De GitHub-repository, de Store-catalogus, beoordelingen en app-voorstellen als issues zijn openbaar zichtbaar. Deel daar geen wachtwoorden, privégegevens of vertrouwelijke informatie. De aanmeldplicht beveiligt de Store-interface binnen Schleim OS; de bestanden in de openbare repository worden er niet privé door.

## 📥 Downloaden en installeren

1. Open de [Schleim OS GitHub-repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck).
2. Kies **Code → Download ZIP** en download de **volledige repository**.
3. Pak het ZIP-bestand **niet** uit.
4. Open het extensiebeheer in een ondersteunde Chromium-browser.
5. Schakel indien nodig de **ontwikkelaarsmodus** in.
6. Kies de importoptie voor ZIP-bestanden, bijvoorbeeld **“From .zip/.crx/.user.js”**.
7. Selecteer de volledige repository-ZIP en bevestig de installatie.

De browserimporteur herkent Schleim OS in de submap `extension`. De naam en locatie van de importknop kunnen per browser en apparaat verschillen. De browser moet rechtstreekse ZIP-import ondersteunen.

## Schleim OS gebruiken en instellingen beheren

- **Apps openen:** Selecteer een tegel op het startscherm.
- **Tegels ordenen:** Sleep een tegel met de muis. Houd op apparaten met een touchscreen een tegel ingedrukt voordat je deze verplaatst.
- **Personaliseren:** Open het instellingengedeelte in de interface.
- **Apps ontdekken:** Open de Schleim-Store, zoek naar webapps en installeer of verwijder de gewenste apps.
- **Schleim-account:** De aanmelding opent eerst de GitHub-app-pagina. Na de installatie bevestig je de volgende stap in Schleim OS. De apparaatcode wordt getoond, automatisch gekopieerd en de GitHub-apparaatmachtiging wordt geopend. Na toestemming controleert Schleim OS de app-installatie en maakt zo nodig je privérepository `schleim-os-cloud` aan.
- **Cloudback-up:** Back-up maken en herstellen kan alleen via **Instellingen → Schleim-account**. De back-up bevat de opgeslagen Schleim OS-instellingen, de volgorde van de apps op het startscherm, geïnstalleerde Store-apps en de achtergrond. Wijzigingen worden niet automatisch gesynchroniseerd. Zie de [handleiding voor het Schleim-account](extension/docs/SCHLEIM-KONTO.md). GitHub-toegangstokens en wachtwoorden worden nooit in het back-upbestand opgeslagen.

# 🛠️ Schleim OS – Problemen oplossen

Hier vind je oplossingen voor veelvoorkomende problemen met rechtstreekse ZIP-import en het gebruik van Schleim OS.

| Probleem | Mogelijke oplossing |
|---|---|
| **De ZIP-importknop ontbreekt.** | Controleer of je browser het importeren van ZIP-extensies ondersteunt. De knop kan bijvoorbeeld **“From .zip/.crx/.user.js”** heten. |
| **Het ZIP-bestand wordt niet weergegeven.** | Download eerst de volledige repository via GitHub met **Code → Download ZIP**. Controleer daarna of de bestandskiezer van je browser toegang heeft tot de map Downloads. |
| **De installatie geeft een foutmelding.** | Controleer of je de volledige repository-ZIP hebt geselecteerd en of deze ongewijzigd is. Selecteer geen losse bestanden of een ander archief. |
| **Schleim OS verschijnt niet in een nieuw tabblad.** | Controleer in het extensiebeheer of Schleim OS is geïnstalleerd en ingeschakeld. Open daarna een nieuw tabblad. |
| **Een andere extensie vervangt ook de nieuw-tabbladpagina.** | Schakel tijdelijk andere extensies uit die eveneens de nieuw-tabbladpagina vervangen. |
| **Wijzigingen worden niet weergegeven.** | Open het extensiebeheer en gebruik bij Schleim OS de knop **Opnieuw laden** of **Vernieuwen**, indien beschikbaar. Open daarna een nieuw tabblad. |
| **Externe inhoud ontbreekt of blijft leeg.** | Controleer je internetverbinding. Sommige aanbieders blokkeren het insluiten van hun pagina's op andere websites. |
| **Instellingen ontbreken na een browserwissel.** | Open **Instellingen → Schleim-account**, meld je aan met hetzelfde GitHub-account en kies **Cloudback-up herstellen**. |
| **Installatie werkt niet in Chrome voor Android.** | Chrome voor Android ondersteunt geen gewone Chrome-extensies. Gebruik een Android-browser die extensies en rechtstreekse ZIP-import ondersteunt. |

## Meer hulp nodig?

Blijft het probleem bestaan, meld het dan via [GitHub Issues](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/issues). Beschrijf welke browser en versie je gebruikt en welke stappen tot het probleem leiden. Deel geen wachtwoorden of vertrouwelijke inloggegevens.

---

[🇩🇪 Deutsche Fehlerbehebung](docs/Deutsch/FEHLERBEHEBUNG.md) · [🇬🇧 English troubleshooting](docs/Englisch/TROUBLESHOOTING.md)

## 💡 Opmerkingen

- Schleim OS vervangt de nieuw-tabbladpagina, niet de volledige browserinterface.
- Incognitovensters kunnen eigen beperkingen hebben.
- Google Chrome voor Android ondersteunt geen gewone desktopextensies.
- Voor externe inhoud kan een internetverbinding nodig zijn.

## 🌐 Talen en documentatie

- [Deutsch – hoofddocumentatie](README.md)
- [English – documentation](README.en.md)
- [Nederlands – hoofddocumentatie](README.nl.md)
- [Installatiehandleiding](docs/Niederländisch/INSTALLATIE.md)
- [Problemen oplossen](docs/Niederländisch/PROBLEMEN-OPLOSSEN.md)
- [Technische opmerkingen](docs/Niederländisch/TECHNISCHE-OPMERKINGEN.md)
- [Documentatieoverzicht – alle talen](docs/README.md)

## 📖 Documentatie in eenvoudige taal

Wil je korte zinnen en eenvoudige uitleg? Bekijk de [Nederlandse documentatie in eenvoudige taal](docs/Leichte-Sprache/Niederländisch/README.md). Je vindt daar ook eenvoudige installatie-instructies, hulp en uitleg over juridische onderwerpen.

## 📁 Projectstructuur

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

## 🔐 Privacy en machtigingen

Schleim OS slaat interface- en personalisatie-instellingen lokaal op in het browserprofiel. De extensie gebruikt de machtigingen die in `manifest.json` worden vermeld. Wanneer externe apps en websites worden geopend, kan er verbinding worden gemaakt met de betreffende aanbieders; ook hun privacybeleid is dan van toepassing.

De extensie-interface bevat geen advertentie-iframes, geen controles of advertenties bereikbaar zijn en geen opstartblokkering vanwege advertenties. Vermeldingen over advertenties in overgenomen juridische teksten hebben betrekking op de daarin beschreven website en niet op advertenties die in de extensie zijn ingebouwd.

## ⚖️ Juridische informatie

- [Algemene voorwaarden & communityrichtlijnen](legal/Niederländisch/ALGEMENE-VOORWAARDEN-EN-COMMUNITYRICHTLIJNEN.md)
- [Privacyverklaring](legal/Niederländisch/PRIVACYBELEID.md)
- [Colofon](legal/Niederländisch/COLOFON.md)

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

## 🤝 Bijdragers & credits

- **Projectontwikkeling en verantwoordelijkheid:** Schnecke Schneck.
- **AI-ondersteuning:** [ChatGPT van OpenAI](https://chatgpt.com/) – ondersteuning bij het bedenken van ideeën, plannen, programmeren, foutopsporing, documentatie en vertalingen.

*Opmerking: ChatGPT is een AI-assistent en geen menselijke persoon of zelfstandige GitHub-bijdrager. Het projectidee, de beslissingen en de verantwoordelijkheid voor Schleim OS liggen bij Schnecke Schneck.*

---

**Schleim OS** wordt ontwikkeld en onderhouden door **Schnecke Schneck**.

© 2026 Schnecke Schneck.
