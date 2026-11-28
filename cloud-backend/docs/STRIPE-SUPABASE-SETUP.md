# Schleim Cloud – Stripe- und Supabase-Einrichtung

Dieser Ablauf richtet die Integration zunächst in einer **Stripe-Testumgebung** ein. Keine Live-Zahlungen aktivieren, bevor alle Tests bestanden sind und der Betreiber den Livegang ausdrücklich freigegeben hat.

## 1. Voraussetzungen und Tarif

- Free: 1 GiB
- Premium: 10 GiB
- Premium-Preis: 2,99 EUR pro Monat
- Zahlungsablauf: Stripe Checkout im Abonnementmodus
- Konten, Tarifstatus und Speicherzähler: Supabase

Die Datenbanktabellen und Tarifzeilen wurden im Supabase-Projekt vorbereitet. Die Edge Functions sind noch nicht deployed.

## 2. Supabase Auth zuerst fertigstellen

Die Anwendung muss eine echte Supabase-Auth-Sitzung verwenden. Der GitHub Device Flow allein ist **kein** Supabase JWT und kann nicht direkt an die geschützten Edge Functions weitergegeben werden.

Wenn GitHub als Login verwendet werden soll:

1. GitHub Developer Settings öffnen und eine OAuth App für die Anwendung anlegen.
2. Die von Supabase angezeigte Callback-URL exakt als Authorization callback URL der GitHub OAuth App eintragen.
3. In Supabase Dashboard das Projekt öffnen: Authentication → Sign In / Providers → GitHub.
4. GitHub Client ID und Client Secret dort hinterlegen und GitHub aktivieren.
5. Die erlaubten Redirect URLs in Supabase Authentication → URL Configuration auf die echten HTTPS-Domains der Schleim-Cloud-Anwendung begrenzen.
6. In der Anwendung mit Supabase Auth anmelden und den Supabase Access Token als Bearer Token an die Edge Functions senden.

GitHub OAuth Client Secret niemals in den Browser, in Android-Code, in GitHub-Commits oder in diesen Chat kopieren.

## 3. Stripe-Testprodukt und Preis erstellen

1. Im Stripe Dashboard ausdrücklich den **Testmodus** einschalten bzw. einen separaten Stripe-Sandbox-Bereich öffnen.
2. Produkt „Schleim Cloud Premium – 10 GB“ anlegen.
3. Wiederkehrenden Preis erstellen: 2,99 EUR, monatlich.
4. Die erzeugte Price-ID kopieren. Sie beginnt mit `price_`.
5. In den Payment Method Settings ausschließlich Karten aktivieren, wenn die Anwendung nur Kartenzahlung anbieten soll. Die Integration überlässt Stripe die dynamische Auswahl und sendet absichtlich kein festes `payment_method_types`-Feld.

Nicht in den Live-Modus wechseln, um Testdaten anzulegen.

## 4. Stripe Customer Portal konfigurieren

1. Stripe Dashboard → Settings → Billing → Customer portal öffnen.
2. Portal aktivieren.
3. Kunden erlauben, ihr Abonnement zu kündigen.
4. Optional erlauben, Zahlungsmethoden zu aktualisieren.
5. Kündigungsoptionen und Bestätigungsbildschirm prüfen.
6. Als Rücksprungziel die tatsächliche HTTPS-Adresse der Schleim Cloud verwenden.

Die Funktion `create-customer-portal` erstellt eine kurzlebige Portal-URL für den angemeldeten Supabase-Nutzer. Die App muss daraus einen „Abo verwalten / kündigen“-Button aufrufen und die zurückgegebene URL öffnen.

## 5. Supabase Edge Function Secrets setzen

Öffne das Projekt im Supabase Dashboard und gehe zu **Edge Functions → Secrets**:
https://supabase.com/dashboard/project/hrtunnupqcpklejpfsvq/functions/secrets

Diese Werte serverseitig eintragen:

| Secret | Wert |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe-Test-Restricted-Key (bevorzugt) oder Test-Secret-Key |
| `STRIPE_PREMIUM_PRICE_ID` | Test-Price-ID aus Schritt 3 |
| `STRIPE_WEBHOOK_SECRET` | Signing Secret des Test-Webhooks aus Schritt 6 |
| `SCHLEIM_CLOUD_RETURN_URL` | Tatsächliche HTTPS-Rücksprungadresse der Schleim-Cloud-App |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-Role/Secret-Key dieses Supabase-Projekts, nur serverseitig |

Supabase stellt `SUPABASE_URL` und `SUPABASE_ANON_KEY` für Edge Functions automatisch bereit. Diese Werte nicht als zusätzliche Secrets anlegen, wenn sie bereits injiziert werden.

Wenn du einen Stripe Restricted API Key erstellst, gib ihm nur die für Checkout, Price-Lesen, Subscription-Lesen und Customer-Portal-Sessions notwendigen Berechtigungen. Prüfe die tatsächlichen Berechtigungsnamen im Stripe Dashboard. Ein normaler Secret Key ist nur die Ausweichlösung.

**Wichtig:** Secret-Werte niemals an ChatGPT senden. Nicht in GitHub Secrets, Quellcode, README, Browsercode oder Android-APK schreiben. Bereits früher offengelegte Schlüssel nicht erneut verwenden.

## 6. Stripe-Test-Webhook anlegen

Nach dem Deployment lautet die Webhook-Adresse:

`https://hrtunnupqcpklejpfsvq.supabase.co/functions/v1/stripe-webhook`

Im Stripe-Testmodus einen Webhook-Endpunkt für diese URL anlegen. Die Funktion verarbeitet derzeit diese Ereignisse:

- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Das angezeigte Signing Secret (beginnt üblicherweise mit `whsec_`) als `STRIPE_WEBHOOK_SECRET` in Supabase speichern.

Vor einem echten Produktionsbetrieb muss die Ereignisbehandlung zusätzlich um Refund-, Dispute- und Fraud-Ereignisse erweitert und getestet werden, insbesondere `charge.refunded`, `charge.dispute.created` und `radar.early_fraud_warning.created`. Der aktuelle Webhook ist deshalb noch keine vollständige Produktionslösung.

## 7. Edge Functions deployen

Erst nachdem Auth und die benötigten Secrets korrekt eingerichtet sind, diese vier Funktionen aus dem GitHub-Branch `feature/schleim-cloud-subscriptions` deployen:

- `account-summary` – Kontostatus und Speicherlimit
- `create-checkout` – authentifizierten Checkout starten
- `create-customer-portal` – Abo verwalten und kündigen
- `stripe-webhook` – Stripe-Ereignisse signaturgeprüft verarbeiten

Deployment über Supabase CLI im Ordner `cloud-backend`:

```bash
supabase login
supabase link --project-ref hrtunnupqcpklejpfsvq
supabase functions deploy account-summary
supabase functions deploy create-checkout
supabase functions deploy create-customer-portal
supabase functions deploy stripe-webhook
supabase functions list
```

Die Webhook-Funktion muss ohne Supabase-JWT-Prüfung erreichbar sein, prüft aber zwingend die Stripe-Signatur selbst. Die drei Nutzerfunktionen müssen JWT-geschützt bleiben.

## 8. Tests vor dem Livegang

- Neuer Supabase-Nutzer erhält Free mit 1 GiB.
- Nicht angemeldete Nutzer können keinen Checkout und kein Kundenportal starten.
- Checkout akzeptiert ausschließlich die serverseitig hinterlegte Price-ID.
- Der Preis ist aktiv und entspricht exakt 2,99 EUR monatlich.
- Premium wird erst nach bestätigter Zahlung über den Webhook aktiv.
- Fehlgeschlagene Zahlung führt zum vorgesehenen Status und nicht zu einer unberechtigten Premium-Freischaltung.
- Kündigung im Customer Portal wird über Stripe-Webhooks in Supabase synchronisiert.
- Doppelte Webhook-Zustellung verändert den Abostatus nicht mehrfach.
- Der Storage-Upload kann das Tariflimit nicht umgehen.

**Speicherlimit:** Der aktuelle Stand enthält den Speicherzähler, erzwingt aber noch nicht nachweislich jedes Upload-/Löschereignis. Vor dem Livegang muss die tatsächliche Upload-Pipeline so angepasst werden, dass jeder Schreibvorgang serverseitig und atomar gegen das Kontingent geprüft wird. Ein bloßer Zähler oder eine UI-Anzeige reicht nicht.

## 9. Steuer- und Händlerangaben

Der Betreiber hat angegeben, derzeit keine Umsatzsteuer zu erheben. Daher ist automatische Steuerberechnung im Checkout derzeit ausgeschaltet. Das ist keine rechtliche Einstufung. Vor dem Verkauf sind die tatsächlichen steuerlichen Pflichten, Rechnungsangaben und gegebenenfalls die Kleinunternehmerregelung mit einer qualifizierten Stelle zu klären.

Im Stripe-Konto fehlen laut bisheriger Prüfung noch Angaben zur Hauptgeschäftsadresse bzw. die Tax Settings sind nicht vollständig. Keine Adresse oder Steuerregistrierung erfinden und keine Registrierung automatisch hinzufügen. Eine Stripe-Tax-Registrierung dokumentiert eine bereits bestehende Registrierung; sie ersetzt nicht die Anmeldung bei der zuständigen Behörde.

## 10. Livegang

Erst nach erfolgreichem Testbetrieb, abgeschlossener Händler-/Steuerprüfung, vollständigem Webhook, serverseitiger Speicherquota, getesteter Kündigung und ausdrücklicher Freigabe:

1. Live-Produkt und Live-Preis erstellen.
2. Live-Restricted-Key und Live-Webhook-Signing-Secret erzeugen.
3. Live-Secrets in Supabase eintragen.
4. Live-Webhook-Endpunkt mit denselben benötigten Ereignissen anlegen.
5. Edge Functions deployen und Testtransaktion kontrolliert prüfen.
6. Erst dann Checkout in der Anwendung sichtbar schalten.

Es wurden in diesem Setup keine Live-Produkte, Live-Preise, Live-Webhooks oder Live-Abbuchungen aktiviert.
