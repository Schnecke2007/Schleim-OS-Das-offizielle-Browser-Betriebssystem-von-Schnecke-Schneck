# Fehlerbehebung / Troubleshooting / Problemen oplossen

## 🇩🇪 Deutsch

- **Neuer Tab bleibt unverändert:** Prüfe unter `chrome://extensions`, ob Schleim OS aktiviert ist.
- **Manifestfehler:** Entpacke das GitHub-ZIP vollständig und wähle den Ordner aus, in dem `manifest.json` direkt liegt.
- **ZIP-Datei wurde bei „Entpackte Erweiterung laden“ ausgewählt:** Diese Funktion erwartet einen Ordner. Entpacke das ZIP zuerst und wähle dann den Erweiterungsordner aus.
- **Falscher Ordner ausgewählt:** Wähle nicht den übergeordneten Repository-Ordner, sondern den Ordner, in dem `manifest.json` direkt liegt.
- **Chrome Web Store:** Für eine Veröffentlichung wird ein passendes ZIP-Paket über das Chrome Web Store Developer Dashboard hochgeladen. Das ist nicht die lokale Installation über `chrome://extensions`.
- **Konflikt mit anderer Erweiterung:** Deaktiviere andere Erweiterungen, die ebenfalls die Neuer-Tab-Seite ersetzen.
- **Änderungen fehlen:** Erweiterung unter `chrome://extensions` aktualisieren und einen neuen Tab öffnen.
- **Externe Inhalte fehlen:** Internetverbindung prüfen. Anbieter können Einbettungen blockieren.
- **Android:** Chrome für Android unterstützt keine regulären Desktop-Erweiterungen.

## 🇬🇧 English

- **New tab is unchanged:** Check that Schleim OS is enabled at `chrome://extensions`.
- **Manifest error:** Extract the GitHub ZIP archive completely and select the folder containing `manifest.json` directly.
- **A ZIP file was selected in Load unpacked:** This function expects a folder. Extract the ZIP first, then select the extension folder.
- **Wrong folder selected:** Do not select the parent repository folder. Select the folder where `manifest.json` is located directly.
- **Chrome Web Store:** Publishing requires a suitable ZIP package uploaded through the Chrome Web Store Developer Dashboard. This is different from local installation through `chrome://extensions`.
- **Conflict with another extension:** Disable other extensions that also override the new-tab page.
- **Changes are missing:** Reload the extension at `chrome://extensions` and open a new tab.
- **External content is missing:** Check your internet connection. Some providers block embedded pages.
- **Android:** Chrome for Android does not support regular desktop extensions.

## 🇳🇱 Nederlands

- **Nieuw tabblad verandert niet:** Controleer bij `chrome://extensions` of Schleim OS is ingeschakeld.
- **Manifestfout:** Pak het GitHub-ZIP-archief volledig uit en selecteer de map waarin `manifest.json` rechtstreeks staat.
- **Er is een ZIP-bestand geselecteerd bij Uitgepakte extensie laden:** Deze functie verwacht een map. Pak het ZIP-bestand eerst uit en selecteer daarna de extensiemap.
- **De verkeerde map is geselecteerd:** Selecteer niet de bovenliggende repositorymap, maar de map waarin `manifest.json` rechtstreeks staat.
- **Chrome Web Store:** Voor publicatie is een geschikt ZIP-pakket nodig dat via het Chrome Web Store Developer Dashboard wordt geüpload. Dit is iets anders dan de lokale installatie via `chrome://extensions`.
- **Conflict met een andere extensie:** Schakel andere extensies uit die ook de nieuw-tabbladpagina aanpassen.
- **Wijzigingen ontbreken:** Laad de extensie opnieuw via `chrome://extensions` en open een nieuw tabblad.
- **Externe inhoud ontbreekt:** Controleer de internetverbinding. Sommige aanbieders blokkeren ingesloten pagina's.
- **Android:** Chrome voor Android ondersteunt geen gewone desktopextensies.
