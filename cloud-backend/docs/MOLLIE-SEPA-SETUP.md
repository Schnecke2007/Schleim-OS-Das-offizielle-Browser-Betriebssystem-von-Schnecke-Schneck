# Schleim Cloud – Mollie SEPA-Lastschrift

## Tarif
- Free: 1 GiB, kostenlos
- Premium: 10 GiB, **2,99 EUR pro Monat**
- Es gibt kein Premium Plus mehr.

## Ablauf
1. Der angemeldete Kunde wählt Premium.
2. Der Server lädt den Preis aus `schleim_plans`; der Client kann keinen Betrag manipulieren.
3. Die Edge Function erstellt ein Mollie-Kundenprofil und eine erste Zahlung mit `sequenceType: first`.
4. Der Kunde wird zu Mollie weitergeleitet und autorisiert dort die erste Zahlung und die künftige SEPA-Lastschrift.
5. Mollie ruft den Webhook auf. Der Server fragt die Zahlung direkt bei Mollie ab und prüft, dass sie bezahlt ist.
6. Der Server prüft ein gültiges SEPA-Lastschriftmandat und legt über die Mollie Subscriptions API ein Abonnement über 2,99 EUR mit Intervall `1 month` an.
7. Weitere Zahlungen werden ebenfalls per Webhook bei Mollie verifiziert. Erst bestätigte bezahlte Zahlungen aktivieren oder verlängern Premium.

## Mollie API und Secrets
Die Implementierung verwendet die Mollie API v2. Erforderliche Supabase Edge Function Secrets:
- `MOLLIE_API_KEY` – zunächst Test-Key
- `MOLLIE_WEBHOOK_URL` – öffentliche HTTPS-URL der deployten Webhook Function
- `SCHLEIM_CLOUD_RETURN_URL` – HTTPS-Rücksprungseite
- `SUPABASE_SERVICE_ROLE_KEY` – nur serverseitig; nie in Client oder Repository

Supabase stellt `SUPABASE_URL` und `SUPABASE_ANON_KEY` im Function-Kontext bereit.

## Händlerkonto und Auszahlung
SEPA-Lastschrift muss im Mollie-Dashboard für das Händlerprofil freigeschaltet sein. Das Auszahlungskonto wird im Mollie-Dashboard hinterlegt; Mollie zahlt nach den geltenden Auszahlungsbedingungen auf dieses Konto aus. Mollie ist kein Ersatz für das Supabase-Backend.

## Noch offene Produktionsarbeiten
- Supabase-Migrationen und Functions deployen und im Testmodus verifizieren.
- GitHub Device Flow sicher an Supabase Auth anbinden; GitHub-Tokens sind keine Supabase JWTs.
- Kündigungsfunktion, Rücklastschrift-/Erstattungsbehandlung und robuste Webhook-Idempotenz ergänzen.
- Server-seitige Upload-Quota erzwingen.
- Perioden- und Zahlungsstatus regelmäßig mit Mollie abgleichen.
- Verkäuferangaben, AGB, Datenschutz, Kündigungsregeln und Supportinformationen vervollständigen.

Der Checkout darf erst nach diesen Arbeiten und ausdrücklicher Produktionsfreigabe live geschaltet werden.
