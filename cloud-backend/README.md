# Schleim OS Cloud Backend

**Tarifmodell:** Free mit 1 GiB sowie genau ein kostenpflichtiger Tarif: Premium mit 10 GiB für **2,99 € pro Monat**.

**Zahlungsdienst:** Stripe Checkout + Stripe Billing mit monatlicher Verlängerung. Die Payment-Method-Auswahl erfolgt dynamisch über Stripe; im Stripe Dashboard sind Karten als einzige gewünschte Methode zu konfigurieren.

Supabase verwaltet Konten, Abos und Speicher. Stripe verarbeitet Zahlungen. Geheimnisse gehören ausschließlich in Supabase Edge Function Secrets. Niemals einen Stripe-Key oder Supabase Service Role Key in Browser-/Android-Code, GitHub oder Chat eintragen.

## Tarifmodell
- Free: 1 GiB, kostenlos
- Premium: 10 GiB, 2,99 EUR pro Monat

Der Client kann weder Preis noch Price-ID vorgeben. Checkout verwendet die serverseitig konfigurierte Stripe Price-ID und prüft, dass sie aktiv ist und exakt 2,99 EUR monatlich kostet.

## Funktionen im Branch
- `account-summary`: authentifizierte Kontoinformationen, Tarif und Speicheranzeige.
- `create-checkout`: authentifizierter Stripe Checkout im Abonnementmodus.
- `create-customer-portal`: authentifizierter Zugang zum Stripe Customer Portal für Aboverwaltung und Kündigung.
- `stripe-webhook`: prüft Stripe-Signaturen und synchronisiert den Abostatus.

Die Checkout-Funktion nutzt keine fest verdrahtete `payment_method_types`-Liste. Die gewünschten Zahlungsmethoden müssen im Stripe Dashboard konfiguriert werden.

## Supabase-Datenbank
Die Migrationen 001 bis 003 wurden im verbundenen Supabase-Projekt angewendet:
- Free 1 GiB / Premium 10 GiB und 2,99 EUR monatlich
- Abonnement- und Speicherzähler-Tabellen
- Webhook-Ereignisprotokoll
- Row Level Security und Indizes

## Benötigte Edge Function Secrets
- `STRIPE_SECRET_KEY`: vorzugsweise ein minimal berechtigter Restricted Key
- `STRIPE_PREMIUM_PRICE_ID`: Stripe Price-ID des 2,99-EUR-Monatspreises
- `STRIPE_WEBHOOK_SECRET`: Signing Secret des Webhook-Endpunkts
- `SCHLEIM_CLOUD_RETURN_URL`: tatsächliche HTTPS-Rücksprungadresse
- `SUPABASE_SERVICE_ROLE_KEY`: ausschließlich serverseitig

Supabase stellt `SUPABASE_URL` und `SUPABASE_ANON_KEY` im Function-Kontext bereit.

Webhook-URL nach Deployment:
`https://hrtunnupqcpklejpfsvq.supabase.co/functions/v1/stripe-webhook`

Der Webhook verarbeitet derzeit `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated` und `customer.subscription.deleted`. Für den Produktionsbetrieb fehlen noch die vollständige Behandlung von Refunds, Disputes und Fraud-Warnungen sowie belastbare End-to-End-Tests.

## Steuerkonfiguration
Der Betreiber hat angegeben, derzeit keine Umsatzsteuer zu erheben. Deshalb bleibt automatische Steuerberechnung ausgeschaltet. Das ist keine steuerrechtliche Einstufung und ersetzt nicht die Prüfung der tatsächlichen Pflichten und Rechnungsangaben.

## Nicht produktionsbereit
- Edge Functions sind derzeit noch nicht deployed.
- Supabase Edge Function Secrets sind noch nicht gesetzt.
- Es gibt noch keine bestätigte Stripe Price-ID oder einen konfigurierten Webhook-Endpunkt.
- Supabase Auth muss als echte Identitätsquelle verwendet werden; der GitHub Device Flow allein ist kein Supabase JWT.
- Die Speicherquota ist noch nicht nachweislich in der vollständigen Upload-Pipeline serverseitig und atomar erzwungen.
- Refund-/Dispute-/Fraud-Behandlung und End-to-End-Tests stehen noch aus.
- Stripe-Händler-/Steuerangaben müssen vom Betreiber vervollständigt und geprüft werden.

**Keine Live-Abbuchungen sind aktiviert.** Livegang erst nach vollständiger Prüfung und ausdrücklicher Freigabe.

## Einrichtung
Die detaillierte Anleitung steht in [STRIPE-SUPABASE-SETUP.md](docs/STRIPE-SUPABASE-SETUP.md).
