# Schleim Cloud – Produktivbetrieb mit Klarna

## Status und wichtige Grenze

Diese Anleitung beschreibt die Verbindung für den Livebetrieb. Sie aktiviert selbst keine Zahlung und ersetzt weder die Freischaltung durch Klarna noch das Deployment in Supabase. Der bestehende Checkout bleibt gesperrt, bis alle folgenden Punkte nachweislich eingerichtet und getestet sind.

**Klarna ist der einzige vorgesehene Zahlungsdienst.** Es wird kein Stripe-, PayPal- oder anderer Zahlungsadapter ergänzt.

## 1. Klarna-Händlerkonto freischalten

1. Im [Klarna Partner Portal](https://portal.klarna.com/) mit dem Händlerkonto anmelden, das für Schleim OS verwendet werden soll.
2. Prüfen, ob ein aktiver Vertrag für Klarna Payments besteht und Deutschland sowie EUR abgedeckt sind.
3. Klarna schriftlich bestätigen lassen, dass Customer Tokens für wiederkehrende Abonnements (merchant-initiated recurring charges) für genau dieses Händlerkonto und die gewählte Klarna-Integration freigeschaltet sind.
4. Die für das gewählte Produkt passende Produktions-API-Zugangsdaten im Partner Portal erzeugen. Nicht Test- und Live-Zugangsdaten verwechseln. Je nach Klarna-Produkt unterscheiden sich API-Authentifizierung und Webhook-Verwaltung; keine Zugangsdaten eines anderen Klarna-Produkts verwenden.
5. Den genauen API-Produkttyp, die Produktions-Basis-URL, die unterstützte Customer-Token-API, Webhook-Events und das Signaturverfahren mit Klarna bestätigen.

Offizielle Einstiege:
- [Klarna API authentication](https://docs.klarna.com/acquirer/klarna/get-started/integration-resilience/authentication/)
- [Klarna Partner Portal – API credentials](https://docs.klarna.com/acquirer/klarna-network/setup-your-integration/connection-configuration/manage-your-api-credentials/)
- [Customer Tokens für wiederkehrende Zahlungen](https://docs.klarna.com/acquirer/klarna/web-payments/integrate-with-klarna-payments/tokenized-payments/customer-token/)
- [Subscription renewals](https://docs.klarna.com/acquirer/klarna/web-payments/integrate-with-klarna-payments/tokenized-payments/charge-a-subscription/)

## 2. Produkt- und Vertragsangaben festlegen

Vor dem Einschalten des Checkouts müssen diese verbindlichen Werte feststehen:
- Rechtlicher Verkäufer/Vertragspartner und ladungsfähige Anschrift
- Impressum, Datenschutzerklärung, AGB und Widerrufs-/Kündigungsinformationen
- Support-E-Mail und erreichbarer Kundenservice
- Endpreise inklusive anwendbarer Steuern
- Abrechnungsintervall, Verlängerungszeitpunkt und Kündigungswirkung
- Regeln für fehlgeschlagene Zahlungen, Rückerstattungen und Zugriffsende

Die im Code vorhandenen Speichermengen sind derzeit Free 1 GiB, Premium 10 GiB und Premium Plus 50 GiB. Für Premium und Premium Plus fehlen noch verbindliche Verkaufspreise. Ohne diese Preise darf der Server keinen Checkout erzeugen.

## 3. Supabase produktiv verbinden

Projekt: `https://hrtunnupqcpklejpfsvq.supabase.co`

Im Supabase Dashboard:
1. SQL-Migrationen nach Prüfung in der richtigen Reihenfolge ausführen.
2. Edge Functions aus `cloud-backend/supabase/functions` deployen.
3. In **Edge Functions → Secrets** ausschließlich serverseitige Geheimnisse setzen.
4. Produktions-Datenbank-Backups, Auth-Schutz, Rate Limits und Monitoring aktivieren.
5. Deployment-Logs und Fehlermeldungen prüfen.

Geheimnisse gehören niemals in GitHub, Browser-Code, Android-Code oder Chat. Insbesondere den Supabase Service-Role-Key niemals teilen. Klarna-Live-API-Schlüssel und Webhook-Signaturschlüssel nur als Supabase Secrets speichern.

## 4. Schleim-Konto-Identität

Der aktuelle Schleim-Konto-Login nutzt GitHub Device Flow. Ein GitHub-Access-Token ist **kein** Supabase-Auth-JWT. Es darf nicht als Supabase-Bearer-Token weitergereicht werden.

Vor dem produktiven Abo-Betrieb muss eine sichere serverseitige Identitätsbrücke eingerichtet werden. Sie muss:
- GitHub-Token serverseitig bei GitHub validieren,
- eine stabile GitHub-Benutzer-ID mit genau einem internen Schleim-Konto verknüpfen,
- Kontoverknüpfung und Token-Widerruf behandeln,
- niemals GitHub-Tokens oder interne Admin-Schlüssel an den Client weitergeben,
- dieselbe interne Benutzer-ID für Abo, Speicher und Dateien verwenden.

Bis diese Brücke live getestet ist, darf kein Client ein Abo für eine nicht verifizierte Identität starten.

## 5. Speicherlimits serverseitig erzwingen

Die Quoten dürfen nicht nur in der Oberfläche angezeigt werden. Jeder Upload muss über einen vertrauenswürdigen Serverpfad laufen:
- Identität und aktiven Tarif prüfen,
- tatsächliche Dateigröße vor dem Upload prüfen,
- parallele Uploads transaktionssicher gegen Überbuchung schützen,
- belegten Speicher serverseitig aktualisieren,
- Löschungen und fehlgeschlagene Uploads konsistent verbuchen,
- direkten Client-Schreibzugriff auf den Bucket verhindern.

Limits: Free 1 GiB, Premium 10 GiB, Premium Plus 50 GiB. Bestehende GitHub-Backup-Repositories sind nicht automatisch Teil dieses Supabase-Speicherkontingents.

## 6. Klarna-Abos und Tarifaktivierung

Der Server definiert Tarif-ID, Preis, EUR-Währung und Intervall. Der Client darf weder Betrag noch Tariflimit bestimmen.

Der produktive Ablauf muss:
1. authentifizierten Schleim-Konto-Nutzer prüfen,
2. eine Klarna-Session für den serverseitig festgelegten Tarif erzeugen,
3. den Klarna-Checkout mit ausdrücklicher Zustimmung zur wiederkehrenden Belastung anzeigen,
4. die erfolgreiche Autorisierung serverseitig abschließen,
5. einen für wiederkehrende Händlerbelastungen geeigneten Customer Token sicher speichern,
6. Verlängerungen zeitgesteuert serverseitig ausführen,
7. pro Verlängerung einen eindeutigen Idempotency-Key verwenden,
8. nur nach bestätigter Zahlung den kostenpflichtigen Tarif aktivieren bzw. verlängern,
9. fehlgeschlagene Zahlungen, Wiederholungen, Rückerstattungen und Widerrufe verarbeiten.

Klarna beschreibt Customer Tokens als gespeicherte Zahlungsmethode mit Einwilligung für spätere Belastungen. Ein Token muss mit dem passenden Subscription-Intent erstellt werden; falscher Token-Scope ist nicht austauschbar.

## 7. Webhooks und Ereignisverarbeitung

Vor der Implementierung muss der konkrete Klarna-Produktpfad bestätigt werden. Die klassische Klarna Payments API und Klarna Network APIs haben unterschiedliche Authentifizierungs-, Webhook- und Event-Verträge. Sie dürfen nicht vermischt werden.

Für den bestätigten Webhook-Vertrag muss der Server:
- HTTPS verwenden,
- die Klarna-Signatur nach der produktspezifischen Dokumentation verifizieren,
- Event-ID und Rohereignis dauerhaft speichern,
- Duplikate idempotent quittieren,
- Verarbeitung asynchron ausführen,
- nur verifizierte und fachlich passende Zahlungsereignisse auf den Abo-Status anwenden.

Webhooks sind kein Ersatz für den Abgleich des Zahlungsstatus. Ein regelmäßiger Reconciliation-Job muss offene oder verspätete Ereignisse nachprüfen.

## 8. Kündigung

Der Kündigen-Button muss eine authentifizierte Serveraktion auslösen, nicht nur die Oberfläche ändern. Vorgesehener sicherer Standard:
- keine weitere Verlängerung planen,
- Klarna Customer Token nach bestätigter Kündigung widerrufen,
- Kündigungszeitpunkt und Ende des bezahlten Zeitraums speichern,
- Premium-Zugriff bis zum bezahlten Periodenende erhalten,
- danach automatisch auf Free mit 1 GiB zurückstufen,
- bei Überschreitung des Free-Limits keine weiteren Uploads erlauben und bestehende Dateien nicht stillschweigend löschen.

Die konkrete Kündigungswirkung muss vor dem Verkauf in AGB und Checkout klar angegeben werden. Sofortige Kündigung mit sofortigem Entzug des Zugriffs ist eine andere Vertragsregel und darf nicht stillschweigend angenommen werden.

## 9. Produktionsfreigabe – Checkliste

- [ ] Klarna Live-Händlerkonto und Vertrag aktiv
- [ ] Customer Tokens / recurring merchant-initiated payments für das konkrete Konto bestätigt
- [ ] Klarna API-Produkt, API-Version und Produktions-URLs bestätigt
- [ ] Produktions-API-Schlüssel und Webhook-Signaturschlüssel sicher in Supabase Secrets hinterlegt
- [ ] Rechtliche Verkäuferangaben, AGB, Datenschutz und Kündigungsbedingungen vollständig
- [ ] Preise und Abrechnungsintervalle verbindlich festgelegt
- [ ] GitHub-Identität sicher mit Schleim-Konto verknüpft
- [ ] Upload-Quota serverseitig erzwungen und getestet
- [ ] Checkout, Customer Token, Verlängerung, Idempotenz und Fehlerpfade geprüft
- [ ] Webhook-Signatur, Duplikate und Statusabgleich geprüft
- [ ] Kündigung und Rückstufung geprüft
- [ ] Android- und Browser-Client gegen dasselbe Backend getestet
- [ ] Ausdrückliche Produktionsfreigabe durch den Betreiber erteilt

Bis alle Pflichtpunkte erfüllt sind, bleibt der Live-Checkout deaktiviert. Es werden keine echten Zahlungen ausgelöst.
