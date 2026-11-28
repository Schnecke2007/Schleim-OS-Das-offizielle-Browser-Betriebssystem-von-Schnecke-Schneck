// Checkout intentionally fails closed until provider products, webhook handling,
// legal checkout details, and recurring-payment eligibility are configured.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });
  return Response.json({
    error: "PAYMENTS_NOT_CONFIGURED",
    message: "Checkout is disabled. No payment method can be charged.",
    next_step: "Configure and test the provider before enabling subscriptions.",
  }, { status: 503, headers: { ...cors, "Cache-Control": "no-store" } });
});
