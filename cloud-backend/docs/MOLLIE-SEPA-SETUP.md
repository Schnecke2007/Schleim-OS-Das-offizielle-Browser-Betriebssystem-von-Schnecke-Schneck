# Schleim Cloud – Mollie SEPA-Lastschrift und automatische Abos

## Status und Sicherheitsgrenze

Die Zahlungsart ist für Schleim Cloud festgelegt: **Mollie SEPA-Lastschrift mit automatischer monatlicher Abbuchung**. Diese Dokumentation ist eine Implementierungs- und Freigabecheckliste. Sie bedeutet nicht, dass bereits ein Mollie-Konto verbunden, ein Mandat erteilt, eine Subscription angelegt oder eine Zahlung aktiviert wurde.

Der bestehende Checkout bleibt gesperrt, bis Integration, Identitätsprüfung, Preise, Webhooks, Quota-Enforcement und Tests abgeschlossen sind. Es werden keine echten Zahlungen ausgelöst.

## 1. Mollie-Händlerkonto

1. Ein Mollie-Geschäftskonto für den tatsächlichen Verkäufer einrichten und die Identitäts-/Unternehmensprüfung abschließen.
2. Das Website-Profil für Schleim Cloud vollständig ausfüllen: URL, Kontakt, Handelsname und Supportdaten.
3. Im Dashboard unter **Einstellungen → Zahlungsmethoden** SEPA-Lastschrift beantragen/aktivieren. Mollie prüft die Freischaltung; sie ist nicht automatisch garantiert.
4. Wiederkehrende Zahlungen und die Nutzung der Subscriptions API für das Profil bestätigen.
5. Das Auszahlungskonto im Mollie-Dashboard hinterlegen und verifizieren. Mollie zahlt das verfügbare Guthaben gemäß Auszahlungsplan auf dieses Konto aus.
6. Test- und Live-API-Schlüssel strikt trennen.

Offizielle Dokumentation:
- [SEPA Direct Debit](https://docs.mollie.com/docs/sepa-direct-debit)
- [Recurring payments und Subscriptions API](https://docs.mollie.com/docs/recurring-payments)
- [Mandates API](https://docs.mollie.com/reference/mandates-api)
- [SEPA-Lastschrift aktivieren](https://help.mollie.com/hc/de/articles/360014304619-Wie-aktiviere-ich-SEPA-Lastschrift-als-Zahlungsmethode)

## 2. Erstautorisierung und Mandat

Für automatische Folgezahlungen muss der Kunde ausdrücklich zustimmen. Die Integration muss den von Mollie dokumentierten Erstzahlungs-/Mandatsablauf verwenden und anschließend den Mandatsstatus prüfen. Erst ein gültiges Mandat darf für ein Abo verwendet werden.

Die Checkout-Oberfläche muss vor der Zustimmung klar zeigen:
- rechtlichen Zahlungsempfänger und Kontakt,
- genauen monatlichen Betrag inklusive Steuern,
- Abrechnungsintervall und ersten Abbuchungstermin,
- dass künftige Beträge automatisch per SEPA-Lastschrift eingezogen werden,
- Laufzeit, Kündigungsweg und Kündigungswirkung,
- Hinweise zu Rücklastschriften und fehlgeschlagenen Zahlungen.

Die Einwilligung und der vom Anbieter gelieferte Mandatsbezug müssen serverseitig nachvollziehbar gespeichert werden. Keine IBAN oder Zahlungsdaten in Logs, Analytics oder Client-Speicher schreiben.

## 3. Tarifpreise

Die vorhandenen Limits sind:
- Free: 1 GiB
- Premium: 10 GiB
- Premium Plus: 50 GiB

**Die monatlichen Preise für Premium und Premium Plus sind noch nicht festgelegt.** Vor der Implementierung des produktiven Checkout-Preises müssen diese Beträge bestätigt werden. Der Server muss Preis und Tarif ausschließlich aus einer vertrauenswürdigen Tarifkonfiguration lesen. Niemals Client-Beträge übernehmen.

## 4. Serverseitiger Zahlungsablauf

Die geplante Implementierung in Supabase Edge Functions muss:
1. Supabase-Session und interne Schleim-Konto-Identität prüfen.
2. Tarif-ID und Betrag serverseitig laden.
3. Mollie-Kundenprofil sicher anlegen oder wiederverwenden.
4. Mollie-Erstzahlung zur Autorisierung der wiederkehrenden SEPA-Lastschrift erzeugen.
5. Erst nach bestätigtem Erstzahlungsergebnis und gültigem Mandat die monatliche Subscription über die Mollie Subscriptions API erstellen.
6. Mollie-Kunden-ID, Mandats-ID und Subscription-ID serverseitig mit dem internen Nutzer verknüpfen.
7. Verlängerungen und Statuswechsel über Webhooks und serverseitigen Statusabruf abgleichen.
8. Nur bei erfolgreich bestätigter Zahlung den Tarif aktivieren oder den bezahlten Zeitraum verlängern.

Mollie-Dokumentation beschreibt, dass Subscriptions mit gültigem bzw. ausstehendem Mandat erstellt werden und die Folgezahlungen im Hintergrund ausgelöst werden. Die konkreten Statusübergänge müssen gegen die aktuelle API-Dokumentation implementiert werden.

## 5. Webhooks und Idempotenz

- Ausschließlich HTTPS verwenden.
- Webhook-Eingaben als nicht vertrauenswürdig behandeln; Zahlungsstatus serverseitig über die Mollie API abrufen.
- Ereignisse dauerhaft speichern und mit eindeutiger Provider-ID idempotent verarbeiten.
- Doppelte Webhook-Aufrufe dürfen keine doppelte Verlängerung oder Tarifaktivierung verursachen.
- Verzögerte, fehlgeschlagene, zurückgebuchte und erstattete Lastschriften berücksichtigen.
- Regelmäßigen Reconciliation-Job für offene/verspätete Zahlungen vorsehen.
- Webhook-Endpoint darf keine Zugangsdaten oder Zahlungsdetails in Antworten oder Logs ausgeben.

SEPA-Lastschriften haben ein Rücklastschrift-/Chargeback-Risiko und eine Settlement-Verzögerung. Eine angelegte Zahlung ist daher nicht automatisch gleichbedeutend mit endgültig verfügbarem Geld. Produktzugriff und Mahn-/Kulanzprozess müssen diese Zustände sauber unterscheiden.

## 6. Kündigung

Der Kündigen-Button muss eine authentifizierte Backend-Aktion auslösen:
- Mollie-Subscription kündigen bzw. weitere Abbuchungen stoppen,
- Kündigung und Providerantwort dauerhaft speichern,
- Bestätigung und Enddatum an den Nutzer zurückgeben,
- Zugriff gemäß den vorab angezeigten Vertragsbedingungen bis zum bezahlten Periodenende erhalten,
- danach auf Free mit 1 GiB zurückstufen,
- bei Überschreitung des Free-Limits neue Uploads blockieren, aber bestehende Dateien nicht stillschweigend löschen.

Kündigung darf nicht nur lokal in der Oberfläche simuliert werden.

## 7. Supabase und Identität

Projekt: `https://hrtunnupqcpklejpfsvq.supabase.co`

Der bisherige Login verwendet GitHub Device Flow. Ein GitHub-Access-Token ist kein Supabase-Auth-JWT. Vor dem Checkout muss eine sichere serverseitige Identitätsbrücke eingerichtet werden, die GitHub-Identität verifiziert und eine interne Schleim-Konto-ID liefert.

Mollie-API-Schlüssel und `SUPABASE_SERVICE_ROLE_KEY` ausschließlich als Supabase Edge Function Secrets speichern. Niemals in GitHub, Browser-/Android-Code oder Chat eintragen.

## 8. Speicherlimits

Die Tarifanzeige ist keine Quota-Durchsetzung. Jeder Upload muss über einen vertrauenswürdigen Serverpfad laufen, der Nutzer, tatsächliche Dateigröße und aktuelles Kontingent prüft. Direkte Client-Schreibrechte auf den Storage-Bucket dürfen diese Prüfung nicht umgehen. Parallele Uploads müssen transaktionssicher gegen Überbuchung geschützt werden.

## 9. Freigabe-Checkliste

- [ ] Mollie-Händlerkonto und Website-Profil verifiziert
- [ ] Auszahlungskonto im Mollie-Dashboard bestätigt
- [ ] SEPA-Lastschrift für das Profil freigeschaltet
- [ ] Wiederkehrende Zahlungen/Subcriptions API nutzbar
- [ ] Monatliche Premium- und Premium-Plus-Preise festgelegt
- [ ] Verkäuferangaben, AGB, Datenschutz, Kündigungs- und Rückerstattungsregeln vollständig
- [ ] SEPA-Mandat und Erstautorisierung im Testmodus geprüft
- [ ] Mollie Subscription API und Webhooks implementiert und getestet
- [ ] Idempotenz, Rücklastschriften, fehlgeschlagene Zahlungen und Reconciliation getestet
- [ ] Kündigung stoppt Folgeabbuchungen nachweislich
- [ ] GitHub-Identitätsbrücke produktionsreif
- [ ] Speicherquota serverseitig erzwungen
- [ ] Browser- und Android-Clients vollständig getestet
- [ ] Ausdrückliche Produktionsfreigabe erteilt

Bis alle Pflichtpunkte erfüllt sind, bleibt der Live-Checkout deaktiviert.
