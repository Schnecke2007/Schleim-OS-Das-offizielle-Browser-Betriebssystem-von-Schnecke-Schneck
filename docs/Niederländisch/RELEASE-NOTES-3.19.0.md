# Schleim OS 3.19.0 – Geschiedenis, veilige DNS en opgeslagen tabbladen

Schleim Browser krijgt drie belangrijke browserfuncties. De Android-app blijft een zelfstandige GeckoView-app. De browser-Extension blijft afzonderlijk beschikbaar.

## Nieuw en verbeterd

- **Browsegeschiedenis:** In het browsermenu staat nu **Geschiedenis**. Daar worden succesvol bezochte HTTP- en HTTPS-pagina's getoond met titel, adres en bezoektijd. De geschiedenis wordt lokaal op het apparaat opgeslagen. Er kunnen maximaal 250 items worden bewaard en je kunt de geschiedenis op elk moment wissen.
- **Vaste veilige DNS-resolver:** Schleim Browser gebruikt voor normale DNS-aanvragen een vast ingestelde DNS-over-HTTPS-resolver. De verbinding is versleuteld via HTTPS. De DNS-modus ligt vast en kan niet in de app worden gewijzigd. In Instellingen staat alleen dat een veilige DNS-verbinding wordt gebruikt.
- **Tabbladen automatisch opslaan:** De laatst geopende maximaal vier tabbladen en het actieve tabblad worden lokaal opgeslagen. Schleim Browser herstelt deze tabbladen bij de volgende start. Per tabblad wordt het laatst geopende adres opgeslagen; de volledige terug-/vooruitgeschiedenis van een pagina wordt niet hersteld.

## Opmerkingen

- De geschiedenis en opgeslagen tabbladen staan lokaal in de appgegevens.
- Als je Schleim Browser verwijdert, kunnen deze gegevens verloren gaan. Maak vooraf een back-up van belangrijke gegevens.
- De release-APK gebruikt de Android-debugondertekening. Bij een nieuwe build kan Android eisen dat je de oude app eerst verwijdert voordat de nieuwe APK kan worden geïnstalleerd.
- GeckoView kan bepaalde systeem- of lokale naamopvragingen buiten de DoH-dienst afhandelen. De vaste DoH-modus geldt voor normale DNS-aanvragen van de browser.

## Versie-informatie

- Schleim OS Extension: **3.19.0**
- Schleim Browser: **0.1.0-alpha29**
- Mozilla GeckoView · Android 8.0+ · ARM64

[Android-browserhandleiding](ANDROID-BROWSER.md) · [GitHub Releases](https://github.com/Schnecke2007/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/releases/latest)
