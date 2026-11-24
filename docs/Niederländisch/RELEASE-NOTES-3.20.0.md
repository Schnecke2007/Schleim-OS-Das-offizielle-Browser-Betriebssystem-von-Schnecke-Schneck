# Schleim OS 3.20.0 – Welkomstscherm, Gastmodus en cloudback-up van de browser

## Schleim Browser voor Android

- **Welkomstscherm:** Bij de eerste start legt een korte uitleg die je kunt overslaan de belangrijkste onderdelen uit: het Schleim OS-startscherm, tabbladen en geschiedenis, bladwijzers en wachtwoordbeheer, add-ons, account/cloud en Gastmodus. Je kunt met Vorige/Volgende navigeren of direct beginnen met browsen.
- **Privé-Gastmodus:** Gasttabbladen gebruiken privé-GeckoView-sessies. Geschiedenis, tabbladen, bladwijzers, wachtwoorden, formuliergegevens en websitegegevens worden niet opgeslagen in het normale browserprofiel en niet naar de cloud geüpload. Account- en synchronisatiefuncties en add-onbeheer zijn in Gastmodus uitgeschakeld. Het normale profiel blijft gescheiden en ongewijzigd.
- **Bladwijzers:** Webpagina's kunnen worden opgeslagen, opnieuw geopend, bewerkt en verwijderd.
- **Wachtwoordbeheer:** GeckoView herkent inlogformulieren. Nieuwe of gewijzigde inloggegevens worden alleen na uitdrukkelijke bevestiging opgeslagen. De wachtwoordkluis wordt versleuteld en beschermd met Android Keystore. Voor het openen van de beheerder is de veilige schermvergrendeling van het apparaat vereist; suggesties en automatisch invullen kunnen worden ingeschakeld.
- **Schleim-account in Instellingen:** Het accountgedeelte staat nu onder **Browsermenu → Instellingen → Schleim-account**. Back-up en herstel blijven geblokkeerd totdat het aanmelden bij GitHub is gelukt.
- **Aanmelden met GitHub-apparaatcode:** Eerst opent de GitHub App-pagina voor **Schleim OS Account** in een nieuw browsertabblad. Na de installatie kun je dat tabblad sluiten. Kies **Verder – apparaatcode tonen** om de apparaatcodeprocedure te starten. De code verschijnt in de browser, wordt automatisch gekopieerd en de GitHub-pagina voor apparaatmachtiging opent in een ander tabblad. De app controleert de aanmelding automatisch.
- **Versleutelde profiel synchroniseren:** De browser gebruikt de privérepository schleim-os-cloud. Deze wordt bij de eerste succesvolle aanmelding aangemaakt als deze nog niet bestaat. De profielback-up wordt vóór het uploaden versleuteld met AES-256-GCM. De back-up bevat lokale browserinstellingen, geschiedenis, opgeslagen tabbladen, bladwijzers, de wachtwoordkluis, add-onmetadata en beschikbare XPI-installatiepakketten met hun in-/uitgeschakelde status. Automatische back-up is optioneel. Voor herstel op een ander apparaat zijn hetzelfde GitHub-account en het back-upwachtwoord nodig.

## Oplossingen en technische opmerkingen

- Bij het herstellen wordt de add-onlijst vergeleken, worden opgeslagen XPI-pakketten opnieuw geïnstalleerd en wordt de in-/uitgeschakelde status hersteld als het bijbehorende installatiebestand in de back-up staat.
- Profielwijzigingen tijdens een lopende upload worden klaargezet voor een volgende automatische back-up.
- De instelling voor de desktopweergave wordt uit de opgeslagen profielinstellingen hersteld.
- De bestaande donkerbruine interface blijft behouden.
- De bestaande DNS-over-HTTPS-/NextDNS-configuratie is niet gewijzigd. Instellingen tonen nog steeds alleen de algemene status van de beveiligde DNS-verbinding.

## Grenzen van profiel synchroniseren

Websitecookies en actieve websitesessies, formulierinvoer, privégegevens van afzonderlijke extensies en gewone downloads maken geen deel uit van deze browserback-up. XPI-pakketten kunnen alleen worden hersteld als het installatiebestand lokaal beschikbaar is en in de back-up is opgenomen. De volledige terug-/vooruitnavigatiestatus per webpagina wordt niet overgedragen.

## Versies

- Browser-Extension: **3.20.0**
- Schleim Browser voor Android: **0.1.0-alpha30**
- Mozilla GeckoView · Android 8.0+ · ARM64

De Android-APK gebruikt nog steeds de standaard Android-debugondertekening. Afhankelijk van de build moet de oude app mogelijk worden verwijderd voordat de nieuwe APK kan worden geïnstalleerd. Maak een back-up van lokale gegevens voordat je de oude app verwijdert.
