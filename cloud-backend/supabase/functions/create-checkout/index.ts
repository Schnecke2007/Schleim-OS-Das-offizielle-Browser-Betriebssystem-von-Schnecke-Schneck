// Mollie SEPA subscriptions are the selected payment path.
// Keep checkout fail-closed until pricing, identity bridging, provider credentials,
// mandate creation, subscription lifecycle, and verified webhooks are implemented.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });
  return Response.json({
    error: "MOLLIE_NOT_CONFIGURED",
    message: "Mollie SEPA subscription checkout is not enabled. No payment or mandate can be created.",
    next_step: "Configure and test the Mollie customer, mandate, subscription, and verified webhook flow before enabling checkout.",
  }, { status: 503, headers: { ...cors, "Cache-Control": "no-store" } });
});
