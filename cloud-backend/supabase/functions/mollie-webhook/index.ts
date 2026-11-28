import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const MOLLIE_API = "https://api.mollie.com/v2";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const mollieKey = Deno.env.get("MOLLIE_API_KEY");
  const webhookUrl = Deno.env.get("MOLLIE_WEBHOOK_URL");
  if (!supabaseUrl || !serviceKey || !mollieKey || !webhookUrl) return new Response("Not configured", { status: 503 });

  const form = await req.formData().catch(() => null);
  const paymentId = form?.get("id");
  if (typeof paymentId !== "string" || !paymentId.startsWith("tr_")) return new Response("Missing payment id", { status: 400 });

  const admin = createClient(supabaseUrl, serviceKey);
  try {
    // Mollie webhooks only carry a resource ID. Always retrieve the resource
    // from Mollie; never trust a client or webhook-supplied payment status.
    const paymentResponse = await fetch(`${MOLLIE_API}/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${mollieKey}` },
    });
    if (!paymentResponse.ok) throw new Error("Could not verify payment with Mollie");
    const payment = await paymentResponse.json();

    const userId = payment?.metadata?.schleim_user_id;
    if (payment?.metadata?.purpose !== "premium_subscription_first_payment" ||
        payment?.metadata?.plan_id !== "premium" ||
        typeof userId !== "string" ||
        payment?.amount?.currency !== "EUR" ||
        payment?.amount?.value !== "2.99") {
      return new Response("Payment metadata mismatch", { status: 400 });
    }

    if (payment.status !== "paid") {
      await admin.from("schleim_billing_events").upsert({
        provider: "mollie",
        provider_event_id: paymentId,
        event_type: `payment.${payment.status}`,
        status: "processed",
        processed_at: new Date().toISOString(),
      }, { onConflict: "provider,provider_event_id" });
      return new Response("OK", { status: 200 });
    }

    const customerId = payment.customerId;
    if (typeof customerId !== "string" || !customerId.startsWith("cst_")) throw new Error("Mollie customer missing");

    const mandatesResponse = await fetch(`${MOLLIE_API}/customers/${customerId}/mandates`, {
      headers: { Authorization: `Bearer ${mollieKey}` },
    });
    if (!mandatesResponse.ok) throw new Error("Could not verify SEPA mandate");
    const mandates = await mandatesResponse.json();
    const validMandate = (mandates?._embedded?.mandates ?? []).find((m: any) =>
      m.status === "valid" && m.method === "directdebit"
    );
    if (!validMandate) throw new Error("No valid SEPA direct debit mandate after first payment");

    const subscriptionResponse = await fetch(`${MOLLIE_API}/customers/${customerId}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mollieKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `schleim-premium-${paymentId}`,
      },
      body: JSON.stringify({
        amount: { currency: "EUR", value: "2.99" },
        interval: "1 month",
        description: "Schleim Cloud Premium – 10 GB",
        method: "directdebit",
        mandateId: validMandate.id,
        webhookUrl,
        metadata: { schleim_user_id: userId, plan_id: "premium" },
      }),
    });
    const subscription = await subscriptionResponse.json().catch(() => ({}));
    if (!subscriptionResponse.ok) throw new Error("Mollie subscription creation failed");

    const { error: updateError } = await admin.from("schleim_subscriptions").upsert({
      user_id: userId,
      plan_id: "premium",
      status: "incomplete",
      provider: "mollie",
      provider_customer_id: customerId,
      provider_mandate_id: validMandate.id,
      provider_subscription_id: subscription.id,
      current_period_end: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (updateError) throw updateError;

    await admin.from("schleim_billing_events").upsert({
      provider: "mollie",
      provider_event_id: paymentId,
      event_type: "payment.paid",
      status: "processed",
      processed_at: new Date().toISOString(),
    }, { onConflict: "provider,provider_event_id" });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Mollie webhook processing failed:", error);
    await admin.from("schleim_billing_events").upsert({
      provider: "mollie",
      provider_event_id: paymentId,
      event_type: "payment.webhook",
      status: "failed",
      error_message: error instanceof Error ? error.message.slice(0, 500) : "Unknown error",
    }, { onConflict: "provider,provider_event_id" });
    return new Response("Temporary processing failure", { status: 500 });
  }
});
