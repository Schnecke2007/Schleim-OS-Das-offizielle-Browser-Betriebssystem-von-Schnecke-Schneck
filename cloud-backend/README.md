# Schleim OS Cloud Backend

**Zahlungsdienst: ausschließlich Klarna.** Es wird kein anderer Zahlungsanbieter integriert. Der Live-Checkout bleibt gesperrt, bis Klarna-Händlerfreigabe, Produktionszugangsdaten, verbindliche Preise, Identitätsbrücke, serverseitige Speicherquoten und vollständige Tests vorliegen.

Die Supabase-Projektadresse und der öffentliche Publishable Key wurden in der Erweiterung hinterlegt. Ein Publishable Key ist für Client-Anwendungen vorgesehen und kein Administrationsschlüssel. Den `SUPABASE_SERVICE_ROLE_KEY` niemals in Browser-/Android-Code, GitHub oder Chat eintragen. Er gehört ausschließlich als geschütztes Supabase Edge Function Secret auf den Server.

Architektur: Schleim OS Extension und Android-App verwenden dasselbe Supabase-Backend. Supabase Auth/Identitätsbrücke identifiziert Nutzer; PostgreSQL verwaltet Tarife, Abos und Speicherverbrauch; Supabase Storage speichert Dateien. Der Server muss jede Berechtigung und jedes Kontingent erzwingen.

## Tarifmodell

- Free: 1 GiB
- Premium: 10 GiB – Verkaufspreis noch festzulegen
- Premium Plus: 50 GiB – Verkaufspreis noch festzulegen

Preise, Währung und Intervall werden ausschließlich serverseitig festgelegt. Kein Checkout darf einen vom Client gelieferten Betrag übernehmen.

## Status

Das bestehende PR-Grundgerüst enthält Tabellen, RLS, die Kontoübersicht und eine bewusst gesperrte Checkout-Funktion. Es ist **noch kein produktives Abosystem**: Die Identitätsbrücke, Quota-Enforcement, Klarna-Integration, Scheduler, Webhook-Verarbeitung und Kündigungsaktion müssen noch implementiert und auf dem echten Supabase-Projekt deployed werden.

## Produktionsverbindung

Siehe [Klarna Production Setup](docs/KLARNA-PRODUCTION-SETUP.md) für die vollständige Verbindung und Checkliste.

Wesentliche Voraussetzungen:
1. Klarna Live-Händlerkonto mit Klarna Payments für Deutschland/EUR.
2. Schriftliche Bestätigung, dass Customer Tokens und wiederkehrende Händlerbelastungen für das konkrete Händlerkonto und API-Produkt freigeschaltet sind.
3. Produktionszugangsdaten und – falls der gewählte Produktpfad Webhooks vorsieht – Webhook-Signaturschlüssel.
4. Rechtliche Verkäuferangaben, Supportkontakt, AGB, Datenschutz, Kündigungsregeln und verbindliche Preise.
5. Sicherer GitHub-Login-zu-Schleim-Konto-Identitätsfluss; GitHub Device Flow Access Tokens sind keine Supabase Auth JWTs.
6. Servergeprüfte Uploads, Scheduler, idempotente Zahlungsereignisse, automatische Tarifaktivierung und Kündigung.

## Klarna

Klarna ist der einzige geplante Zahlungsdienst. Wiederkehrende Abos verwenden den passenden Klarna Customer-Token-Flow. Ein gewöhnlicher einmaliger Klarna-Kauf genügt nicht. API-Produkt, API-Version, Authentifizierung und Webhook-Vertrag müssen zum Händlerkonto passen; klassische Klarna Payments und Klarna Network APIs dürfen nicht vermischt werden.

API-Schlüssel, Customer Tokens und Webhook-Signaturschlüssel gehören ausschließlich in geschützte Server-Secrets bzw. verschlüsselte serverseitige Speicherung. Keine Zugangsdaten in dieses Repository schreiben.

## Sicherheit und Bereitstellung

- RLS für Nutzerdaten und keine clientseitigen Schreibrechte für Abos/Quota.
- Jeder Upload wird serverseitig authentifiziert, auf Dateigröße und Kontingent geprüft und transaktionssicher verbucht.
- Nur verifizierte Zahlungsvorgänge aktivieren oder verlängern Premium.
- Kündigung stoppt weitere Verlängerungen, widerruft das Klarna-Token und behält den bezahlten Zugriff bis zum Periodenende; danach Rückstufung auf Free.
- Webhooks müssen produktspezifisch signaturgeprüft, dauerhaft gespeichert und idempotent verarbeitet werden.
- Keine echten Abbuchungen vor ausdrücklicher Produktionsfreigabe.
