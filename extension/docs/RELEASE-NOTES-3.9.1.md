# Schleim OS 3.9.1 – Fehlerkorrekturen

Diese Version korrigiert Fehler in der Store-Verwaltung, im öffentlichen App-Katalog und in der Projektdokumentation.

## Behobene Probleme

- Das Store-Admin-Portal kann jetzt sowohl Markdown-Einreichungen als auch GitHub-Formulareinreichungen (\`app-submission.yml\`) auslesen.
- Die Kategorien „Suche & Datenschutz“ und „Search & privacy“ werden korrekt der Kategorie \`privacy\` zugeordnet.
- Optionale Hinweise aus GitHub-Formularen werden zur Prüfung im Admin-Portal übernommen.
- Fehlende Einzeldateien für TikTok und NextDNS wurden ergänzt, sodass alle 12 Einträge im Laufzeitkatalog eine passende JSON-Datei im öffentlichen Store besitzen.
- Die Beschreibung von TikTok wurde korrigiert: Die App öffnet die offizielle TikTok-Webseite in einem neuen Browser-Tab; ein eingebetteter TikTok-Feed im Store ist nicht vorhanden.
- Die NextDNS-Beschreibung wurde präzisiert.
- Veraltete Aussagen zur automatischen Browser-Synchronisierung wurden entfernt. Die Personalisierung bleibt lokal und wird über die manuelle JSON-Sicherung übertragen.
- Die Prüfsummen-Datei wird aktualisiert, damit sie zur veröffentlichten Erweiterung passt.

## Prüfung

JavaScript-Syntax, Manifest-JSON, Store-Katalog und die Verweise zwischen Katalogeinträgen und einzelnen Store-Dateien werden geprüft. Ein vollständiger End-to-End-Test in einem echten Chromium-Browser ist nicht Teil dieser Repository-Prüfung.
