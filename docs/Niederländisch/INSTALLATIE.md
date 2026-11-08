# 📥 Schleim OS – Installatiehandleiding

Deze handleiding legt uit hoe je de Schleim OS-browserextensie installeert in compatibele Chromium-browsers op Android en desktop.

## 1. De volledige GitHub-repository downloaden

1. Open de [Schleim OS GitHub-repository](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck).
2. Klik bovenaan op de groene knop **Code**.
3. Kies **Download ZIP**.
4. Sla het ZIP-archief op je apparaat op.

Download op deze manier de **volledige repository**. De browserextensie staat in de submap `extension`. Je hoeft het archief **niet** eerst uit te pakken wanneer je browser rechtstreekse ZIP-import ondersteunt.

## 2. Het ZIP-bestand rechtstreeks in de browser installeren (Android en desktop)

Sommige ondersteunde Chromium-browsers bieden in hun extensiebeheer een functie om ZIP-bestanden te importeren. Dit werkt op Android of desktop wanneer de betreffende browser deze functie aanbiedt.

1. Open het extensiebeheer van je browser.
2. Schakel indien nodig de **ontwikkelaarsmodus** in.
3. Tik of klik op de knop voor het importeren/installeren van bestanden. Deze kan bijvoorbeeld **“From .zip/.crx/.user.js”**, **“Install from ZIP”** of iets vergelijkbaars heten.
4. Selecteer het eerder gedownloade **volledige GitHub-repository-ZIP-bestand**. Je hoeft het ZIP-bestand niet eerst uit te pakken.
5. De browser zou Schleim OS in de submap `extension` van de repository moeten herkennen. Volg de aanwijzingen en bevestig de installatie.

> 💡 **Tip:** Selecteer bij ZIP-import het volledige repository-archief en niet alleen losse bestanden. De exacte naam en locatie van de importknop kunnen per browser en apparaat verschillen.

> ⚠️ **Let op:** Niet elke Chromium-browser ondersteunt rechtstreekse ZIP-import. Als je browser deze optie niet aanbiedt, gebruik dan de alternatieve installatiemethode hieronder.

## 3. Alternatief: installeren via “Uitgepakte extensie laden”

Gebruik deze methode bij browsers die geen rechtstreekse ZIP-import aanbieden, maar wel een lokale extensiemap kunnen laden.

1. Pak het eerder gedownloade volledige GitHub-ZIP-archief uit.
2. Open de uitgepakte repositorymap.
3. Open de submap **`extension`**. In deze map staat het bestand `manifest.json`.
4. Open het extensiebeheer van je browser en schakel de **ontwikkelaarsmodus** in.
5. Kies **“Uitgepakte extensie laden”** of **“Load unpacked”**.
6. Selecteer de map **`extension`** – niet de bovenliggende repositorymap.
7. Open een nieuw tabblad. Schleim OS zou nu moeten starten. 🎉

### Google Chrome, Microsoft Edge en Brave

- **Google Chrome:** Open `chrome://extensions`.
- **Microsoft Edge:** Open `edge://extensions`.
- **Brave:** Open `brave://extensions`.

Schakel de ontwikkelaarsmodus in en kies vervolgens **“Uitgepakte extensie laden”** of **“Load unpacked”**. Selecteer de uitgepakte map `extension` waarin het bestand `manifest.json` staat.

## 4. Na de installatie

Open een nieuw browsertabblad. Als Schleim OS niet verschijnt, controleer dan het extensiebeheer van de browser en raadpleeg de [handleiding voor probleemoplossing](PROBLEMEN-OPLOSSEN.md).

---

[🇩🇪 Deutsche Installationsanleitung](../Deutsch/INSTALLATION.md) · [🇬🇧 English installation guide](../Englisch/INSTALLATION.md)
