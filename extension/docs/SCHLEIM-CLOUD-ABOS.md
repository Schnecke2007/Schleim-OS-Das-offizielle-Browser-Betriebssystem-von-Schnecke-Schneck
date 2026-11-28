# Schleim Cloud, Speicher und Abos

Die Schleim-Cloud-Oberfläche ist in Schleim OS unter **Einstellungen → Schleim-Konto** verlinkt. Die öffentliche Weboberfläche liegt im Repository unter `site/cloud/index.html` und wird per GitHub Pages bereitgestellt. Die Android-App verwendet dieselbe Extension-Datei: Der Android-Release-Workflow kopiert den Inhalt von `extension/` nach `android/app/src/main/assets/extension/`.

## Oberfläche
- Cloud-Portal mit GitHub-Anmeldung über Supabase Auth.
- Anzeige des Kontos, Tarifs und Speicherverbrauchs nach erfolgreicher Authentifizierung.
- Premium-Tarif: 10 GiB für 2,99 EUR pro Monat.
- Checkout und Kundenportal werden nur aufgerufen, wenn das Backend sie freigibt.
- Erfolgreiche Rückkehr von Stripe ist kein Zahlungsnachweis; Premium wird ausschließlich serverseitig durch den Stripe-Webhook aktiviert.
- Die Seite verwendet nur den öffentlichen Supabase Publishable Key. Service-Role- und Stripe-Schlüssel gehören niemals in Browsercode.

## GitHub Pages
Die Deployment-Aktion liegt in `.github/workflows/deploy-cloud-pages.yml`. In den Repository-Einstellungen muss GitHub Pages einmalig auf **Build and deployment → Source: GitHub Actions** gestellt werden. Danach veröffentlicht der Workflow den Inhalt von `site/`.

Vorgesehene Cloud-Adresse:
`https://schnecke2007.github.io/Schleim-OS-Das-offizielle-Browser-Betriebssystem-von-Schnecke-Schneck/cloud/`

Diese Adresse erst als `SCHLEIM_CLOUD_RETURN_URL` verwenden, wenn GitHub Pages erfolgreich veröffentlicht wurde und die Seite über HTTPS erreichbar ist.

## Supabase Auth
Die Cloud-Seite verwendet GitHub OAuth über Supabase Auth. Dafür muss unter Supabase → Authentication → Sign In / Providers → GitHub der OAuth-Provider eingerichtet werden. Als GitHub-OAuth-Callback-URL ist exakt die Callback-URL einzutragen, die Supabase dort anzeigt. Unter Authentication → URL Configuration muss die oben genannte Cloud-Adresse als Redirect URL erlaubt sein.

Der bestehende GitHub Device Flow des Schleim-Kontos ist **kein** Supabase Auth JWT und wird nicht an die Billing-Funktionen weitergegeben.

## Tarif- und Backendstatus
- Free: 1 GiB.
- Premium: 10 GiB, 2,99 EUR pro Monat.
- Datenbankmigrationen 001 bis 003 wurden im verbundenen Supabase-Projekt angewendet.
- Edge Functions müssen noch deployed und mit Test-Secrets konfiguriert werden.
- Das Backend meldet `payments_enabled: false`; die Weboberfläche hält den Checkout deshalb deaktiviert.
- Die Kundenportal-Funktion ist erst nach Einrichtung und erfolgreichem Test verwendbar.

## Noch nicht produktionsbereit
- Supabase GitHub OAuth muss eingerichtet und getestet werden.
- Die vier Edge Functions müssen deployed und getestet werden.
- Die Stripe-Testkonfiguration und der Webhook müssen Ende-zu-Ende getestet werden.
- Webhook-Idempotenz muss gegen parallele doppelte Zustellungen abgesichert werden.
- Refunds, Disputes und Fraud-Warnungen müssen verarbeitet werden.
- Die Speicherquota muss in der echten Upload-/Löschpipeline serverseitig und atomar erzwungen werden.
- Händler- und Steuerangaben müssen vor dem Verkauf geklärt sein.

**Keine Live-Abbuchungen sind aktiviert.** Livegang erst nach vollständiger Prüfung und ausdrücklicher Freigabe.
