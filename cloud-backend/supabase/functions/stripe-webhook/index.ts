import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const STRIPE_API = "https://api.stripe.com/v1";
const encoder = new TextEncoder();
function hex(bytes: Uint8Array): string { return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join(""); }

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = header.split(",").map((part) => part.split("="));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !/^\d+$/.test(timestamp) || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
  const expected = hex(new Uint8Array(signed));
  return signatures.some((signature) => {
    if (signature.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    return diff === 0;
  });
}

async function stripeGet(path: string, secret: string) {
  const response = await fetch(`${STRIPE_API}${path}`, { headers: { Authorization: `Bearer ${secret}` } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Stripe API request failed: ${response.status}`);
  return data;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!supabaseUrl || !serviceKey || !stripeKey || !webhookSecret) return new Response("Not configured", { status: 503 });

  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  if (!signature || !(await verifyStripeSignature(payload, signature, webhookSecret))) return new Response("Invalid Stripe signature", { status: 400 });

  let event: any;
  try { event = JSON.parse(payload); } catch { return new Response("Invalid JSON", { status: 400 }); }
  if (!event?.id || !event?.type || !event?.data?.object) return new Response("Invalid event", { status: 400 });

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: prior } = await admin.from("schleim_billing_events").select("status")
    .eq("provider", "stripe").eq("provider_event_id", event.id).maybeSingle();
  if (prior?.status === "processed") return new Response("Already processed", { status: 200 });

  try {
    const object = event.data.object;
    if (event.type === "checkout.session.completed") {
      const subscriptionId = typeof object.subscription === "string" ? object.subscription : object.subscription?.id;
      const userId = object.client_reference_id || object.metadata?.schleim_user_id;
      if (subscriptionId && typeof userId === "string" && object.metadata?.plan_id === "premium") {
        const { error } = await admin.from("schleim_subscriptions").upsert({
          user_id: userId, plan_id: "premium", status: "pending", provider: "stripe",
          provider_customer_id: typeof object.customer === "string" ? object.customer : object.customer?.id,
          provider_subscription_id: subscriptionId, updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        if (error) throw error;
      }
    } else if (["invoice.paid", "invoice.payment_failed", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      const subscriptionId = typeof object.subscription === "string" ? object.subscription :
        (typeof object.id === "string" && object.id.startsWith("sub_") ? object.id : null);
      if (subscriptionId) {
        const subscription = await stripeGet(`/subscriptions/${encodeURIComponent(subscriptionId)}`, stripeKey);
        const userId = subscription?.metadata?.schleim_user_id;
        if (typeof userId !== "string" || subscription?.metadata?.plan_id !== "premium") throw new Error("Stripe subscription metadata mismatch");

        let status = "pending";
        if (event.type === "invoice.paid") status = "active";
        if (event.type === "invoice.payment_failed") status = "past_due";
        if (event.type === "customer.subscription.deleted" || subscription.status === "canceled") status = "canceled";
        if (event.type === "customer.subscription.updated" && subscription.status === "active") status = "active";
        if (event.type === "customer.subscription.updated" && subscription.status === "past_due") status = "past_due";

        const periodEnd = typeof subscription.current_period_end === "number"
          ? new Date(subscription.current_period_end * 1000).toISOString() : null;
        const { error } = await admin.from("schleim_subscriptions").upsert({
          user_id: userId, plan_id: status === "active" ? "premium" : "free", status,
          provider: "stripe",
          provider_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id,
          provider_subscription_id: subscription.id, current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        if (error) throw error;
      }
    }

    await admin.from("schleim_billing_events").upsert({
      provider: "stripe", provider_event_id: event.id, event_type: event.type,
      status: "processed", processed_at: new Date().toISOString(), error_message: null,
    }, { onConflict: "provider,provider_event_id" });
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook processing failed:", event.id, error);
    await admin.from("schleim_billing_events").upsert({
      provider: "stripe", provider_event_id: event.id, event_type: event.type,
      status: "failed", error_message: error instanceof Error ? error.message.slice(0, 500) : "Unknown error",
    }, { onConflict: "provider,provider_event_id" });
    return new Response("Webhook processing failed", { status: 500 });
  }
});
