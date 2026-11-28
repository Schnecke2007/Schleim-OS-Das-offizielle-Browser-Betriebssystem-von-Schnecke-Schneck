# Klarna-Sandbox für Schleim Cloud

## Ziel und Sicherheitsgrenze

Diese Anleitung beschreibt die Vorbereitung eines echten technischen Klarna-Playground-Tests. Der Playground ist Klarna's Testumgebung: Testkäufe werden nicht in der Live-Umgebung verarbeitet und erzeugen keine Rechnungen oder Gebühren. Ausschließlich synthetische Testkundendaten verwenden.

**Wichtig:** Ein normaler Klarna-Kauf ist nicht automatisch ein wiederkehrendes Abonnement. Für automatische Verlängerungen ist der Klarna-Customer-Token-Flow erforderlich. Vor einer Produktivfreigabe muss Klarna die konkrete Händler-/Länder-/Produktkonstellation unterstützen.

## Voraussetzungen, die der Betreiber selbst bereitstellen muss

1. Ein Klarna-Playground-Konto für die Region Europe im Klarna-Partnerportal.
2. Playground API Username/Key ID und Playground API Password/Secret aus den API-Key-Einstellungen.
3. Bestätigung, dass Klarna Payments und Customer Tokens für den Händler und das geplante Abonnementmodell freigeschaltet sind.
4. Produkt- und Checkout-Angaben: vollständiger Unternehmens-/Betreibername, Supportkontakt, Rückerstattungs- und Kündigungsbedingungen sowie korrekte Preis- und Abrechnungsintervalle.

Die Zugangsdaten **niemals** in GitHub, Quellcode, Browser-/Android-Konfiguration oder Chat eintragen. Sie werden später ausschließlich als Supabase Edge Function Secrets hinterlegt:

- `KLARNA_ENVIRONMENT=playground`
- `KLARNA_API_USERNAME`
- `KLARNA_API_PASSWORD`
- `KLARNA_REGION=eu`

Keine dieser Variablen ist derzeit gesetzt. Es gibt noch keine Klarna-Verbindung.

## Geplanter technischer Ablauf

1. Schleim-Konto authentifiziert den Nutzer über die serverseitig verifizierte Supabase-Identität.
2. Backend lädt Tarif, Preis, Währung und Abrechnungsintervall aus einer vertrauenswürdigen Server-Konfiguration. Der Client darf den Preis nicht vorgeben.
3. Backend erstellt die Klarna-Payment-Session mit passender Subscription-Angabe und dem vorgesehenen Tokenisierungs-Intent.
4. Client zeigt den von Klarna vorgesehenen Checkout/SDK-Flow. API-Passwort und Service-Role-Key bleiben auf dem Server.
5. Backend finalisiert die Autorisierung serverseitig und speichert den Customer Token verschlüsselt bzw. in einem zugriffsbeschränkten Feld.
6. Ein serverseitiger Scheduler erstellt Verlängerungen über die Klarna Customer Token API. Jede Abbuchung erhält einen Idempotency-Key; doppelte Jobs dürfen keine Doppelbelastung auslösen.
7. Webhooks/Statusabfragen aktualisieren den Zahlungsstatus. Nur bestätigte Zahlungen dürfen einen kostenpflichtigen Tarif aktivieren.
8. Kündigung, Widerruf des Tokens, fehlgeschlagene Verlängerungen, Rückerstattungen und Mahn-/Retry-Prozesse müssen serverseitig verarbeitet werden.

Die konkrete API-Version, Endpoint-URLs, erforderlichen Request-Felder und Webhook-Signaturprüfung werden unmittelbar vor Implementierung gegen die aktuelle Klarna API-Referenz verifiziert.

## Testfälle

- Playground-Checkout erfolgreich
- Nutzer bricht Checkout ab
- Autorisierung abgelehnt/abgelaufen
- Customer Token erstellt und Status geprüft
- Test-Verlängerung mit Customer Token
- Wiederholter Scheduler-Job (Idempotenz)
- Token widerrufen/ungültig
- Verlängerung fehlgeschlagen und Tarif bleibt korrekt
- Webhook doppelt oder verspätet zugestellt
- Kündigung zum Periodenende und sofortige Kündigung

## Was aktuell noch NICHT aktiv ist

- Kein Klarna-API-Schlüssel hinterlegt
- Keine Klarna-Session und kein Checkout
- Keine Customer Tokens oder wiederkehrenden Zahlungen
- Kein Scheduler, kein Payment-Webhook und keine automatische Tarifaktivierung
- Keine Live-Zahlungen und keine Bankverbindung
- Die in Schleim Cloud definierten Speicherlimits werden noch nicht durch Uploads erzwungen

## Offizielle Klarna-Dokumentation

- [Klarna Integration Checklist](https://docs.klarna.com/acquirer/klarna/get-started/integration-checklist/)
- [Playground und Testzugang](https://docs.klarna.com/acquirer/klarna/resources/developer-tools/testing-payments/before-you-test/)
- [Customer Token](https://docs.klarna.com/acquirer/klarna/web-payments/integrate-with-klarna-payments/tokenized-payments/customer-token/)
- [Charge a subscription](https://docs.klarna.com/acquirer/klarna/web-payments/integrate-with-klarna-payments/tokenized-payments/charge-a-subscription/)
