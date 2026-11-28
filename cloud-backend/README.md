# Schleim OS Cloud Backend

**Geplanter Zahlungsdienst: Mollie mit SEPA-Lastschrift und monatlichen Abonnements.** Kunden müssen ein ausdrückliches SEPA-Mandat erteilen. Erst danach darf Mollie wiederkehrende Abbuchungen ausführen. Der Live-Checkout bleibt gesperrt, bis Händlerfreigabe, Preise, Identitätsbrücke, Webhooks, serverseitige Speicherquoten und vollständige Tests eingerichtet sind.

Die Supabase-Projektadresse und der öffentliche Publishable Key wurden in der Erweiterung hinterlegt. Ein Publishable Key ist für Client-Anwendungen vorgesehen und kein Administrationsschlüssel. Den `SUPABASE_SERVICE_ROLE_KEY` niemals in Browser-/Android-Code, GitHub oder Chat eintragen. Er gehört ausschließlich als geschütztes Supabase Edge Function Secret auf den Server.

Architektur: Schleim OS Extension und Android-App verwenden dasselbe Supabase-Backend. Supabase Auth/Identitätsbrücke identifiziert Nutzer; PostgreSQL verwaltet Tarife, Abos und Speicherverbrauch; Supabase Storage speichert Dateien. Der Server muss jede Berechtigung und jedes Kontingent erzwingen.

## Tarifmodell

- Free: 1 GiB
- Premium: 10 GiB – Verkaufspreis noch festzulegen
- Premium Plus: 50 GiB – Verkaufspreis noch festzulegen

Preise, Währung und Intervall werden ausschließlich serverseitig festgelegt. Kein Checkout darf einen vom Client gelieferten Betrag übernehmen.

## Zahlungsablauf

1. Der Kunde wählt Premium oder Premium Plus und sieht Preis, monatliches Intervall, Kündigungsbedingungen und Verkäuferangaben.
2. Der Server erstellt bzw. verknüpft ein Mollie-Kundenprofil.
3. Der Kunde erteilt über einen von Mollie unterstützten Erstzahlungs-/Autorisierungsablauf ausdrücklich das Mandat für künftige SEPA-Lastschriften.
4. Der Server prüft den Mandatsstatus und erstellt das monatliche Mollie-Abonnement.
5. Mollie sendet Zahlungsereignisse an den HTTPS-Webhook. Der Server verifiziert den Zahlungsstatus direkt bei Mollie, verarbeitet Ereignisse idempotent und aktiviert/verlängert den Tarif erst bei bestätigter Zahlung.
6. Bei Kündigung wird die Mollie-Abonnementverlängerung serverseitig gestoppt. Der bezahlte Zugriff bleibt gemäß den angezeigten Vertragsbedingungen bis zum Periodenende erhalten.

SEPA-Lastschriften können zurückgegeben werden. Fehlgeschlagene oder zurückgebuchte Zahlungen müssen deshalb den Status `past_due` bzw. einen definierten Sperr-/Kulanzprozess auslösen; ein Checkout-Redirect allein ist niemals ein Zahlungsnachweis.

## Status

Das bestehende PR-Grundgerüst enthält Tabellen, RLS, die Kontoübersicht und eine bewusst gesperrte Checkout-Funktion. Es ist **noch kein produktives Abosystem**: Die Mollie-Integration, Kunden-/Mandatsverwaltung, Subscriptions API, Webhook-Verarbeitung, Kündigungsaktion, Scheduler, Identitätsbrücke und Quota-Enforcement müssen noch implementiert und auf dem echten Supabase-Projekt deployed werden.

## Produktionsverbindung

Siehe [Mollie SEPA Subscription Setup](docs/MOLLIE-SEPA-SETUP.md) für Voraussetzungen und Checkliste.

Wesentliche Voraussetzungen:
1. Mollie-Händlerkonto und Freischaltung von SEPA-Lastschrift sowie wiederkehrenden Zahlungen.
2. Mollie API-Zugangsdaten und öffentlicher HTTPS-Webhook-Endpunkt.
3. Verbindliche Preise für Premium und Premium Plus.
4. Rechtliche Verkäuferangaben, Supportkontakt, AGB, Datenschutz, Kündigungs- und Rückerstattungsregeln.
5. Sicherer GitHub-Login-zu-Schleim-Konto-Identitätsfluss; GitHub Device Flow Access Tokens sind keine Supabase Auth JWTs.
6. Serverseitige Upload-Quoten, Zahlungsstatusabgleich, Scheduler, Idempotenz und Kündigung.
7. Durchgängige Tests im Mollie-Testmodus vor jeder Live-Freigabe.

## Sicherheit und Bereitstellung

- RLS für Nutzerdaten und keine clientseitigen Schreibrechte für Abos/Quota.
- Jeder Upload wird serverseitig authentifiziert, auf Dateigröße und Kontingent geprüft und transaktionssicher verbucht.
- Nur serverseitig bestätigte, erfolgreiche Mollie-Zahlungen aktivieren oder verlängern Premium.
- Mollie-API-Schlüssel und Supabase Service-Role-Key ausschließlich als geschützte Supabase Edge Function Secrets speichern.
- Webhooks müssen authentifiziert/verifiziert, dauerhaft protokolliert und idempotent verarbeitet werden.
- Keine echten Abbuchungen vor ausdrücklicher Produktionsfreigabe.
