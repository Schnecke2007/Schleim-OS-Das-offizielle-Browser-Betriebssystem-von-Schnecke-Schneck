# Schleim OS 3.18.0 – Contextmenu, afdrukken en bestandsacties

Schleim Browser verbetert de bediening van de Android-browser. De oorspronkelijke Chromium-Extension blijft afzonderlijk beschikbaar en wordt niet vervangen door de Android-app.

## Nieuw en verbeterd

- **Contextmenu door lang indrukken:** Houd een link, afbeelding, video of audio-item lang ingedrukt. Schleim Browser opent een native Android-contextmenu met passende acties.
- **Links en bestanden downloaden:** Links kunnen worden geopend, in een nieuw tabblad worden geopend, gedownload of als adres worden gekopieerd.
- **Media downloaden:** Afbeeldingen, video's en audiobestanden kunnen worden geopend, gedownload of als adres worden gekopieerd wanneer de pagina een directe HTTP(S)-bron aanbiedt.
- **Pagina afdrukken:** Het contextmenu biedt ook **Pagina afdrukken** wanneer je gewone pagina-inhoud lang indrukt, dus niet alleen links of media. Je kunt ook **Browsermenu → Afdrukken** gebruiken om de huidige webpagina naar het native Android-afdruksysteem te sturen. Kies een printer of sla de pagina op als PDF.
- **Extensies openen:** De extensiebeheerder toont **Openen** wanneer een add-on een optiespagina of een geschikte homepage aanbiedt. De ingebouwde Schleim OS-Extension opent de Schleim OS-startpagina.
- **Extensies beheren:** Activeren, deactiveren en verwijderen blijven beschikbaar in dezelfde extensiebeheerder.
- **Mozilla Firefox Add-ons:** De extensiebeheerder opent opnieuw de officiële [Firefox Add-ons-catalogus](https://addons.mozilla.org/firefox/). Compatibele, door Mozilla ondertekende XPI-bestanden kunnen worden gedownload en in Schleim Browser worden geïnstalleerd.

## Downloads in de release

- **Schleim-OS-Extension.zip** – de oorspronkelijke browser-Extension.
- **Browser-OS-Extension-Template.zip** – een neutrale Extension-sjabloon.
- **Schleim-Browser-Android-0.1.0-alpha25.apk** – de zelfstandige Android-app.
- **Schleim-Browser-Android-Studio-Template.zip** – het neutrale Android Studio-project.
- **Schleim-OS-SHA256SUMS.txt** – SHA-256-controlesommen van de releasebestanden.

## Opmerkingen en bekende beperkingen

- Downloads van bestanden en media vereisen een direct HTTP(S)-adres. Beveiligde, dynamisch gegenereerde of blob-bronnen en streaming-/DRM-inhoud zijn niet altijd als één bestand te downloaden.
- De knop **Openen** verschijnt alleen wanneer een add-on een optiespagina of een geschikte homepage aanbiedt. Niet iedere extensie heeft een eigen openingspagina.
- Schleim Browser ondersteunt door Mozilla ondertekende XPI-extensies. Chrome-CRX-bestanden kunnen niet rechtstreeks in GeckoView worden geïnstalleerd.
- Android 8.0 of nieuwer en een 64-bits ARM-apparaat (arm64-v8a) zijn vereist.
- Camera- en microfoonopnamen blijven uitgeschakeld in de Android-app.
- De APK is een debug-build. Door verschillen in ondertekeningssleutels kan het nodig zijn de vorige versie eerst te verwijderen voordat de update kan worden geïnstalleerd.

## Versie-informatie

- Schleim OS Extension: **3.18.0**
- Schleim Browser: **0.1.0-alpha25**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android-browserhandleiding](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
