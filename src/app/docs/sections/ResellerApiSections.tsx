import {
  DocSection, DocH2, DocH3, DocP,
  Code, CodeBlock, Callout,
  DocTable, Divider,
} from "../components";

function ResellerApiSections() {
  return (
    <>
      <DocSection id="reseller-api">
        <DocH2>Reseller API</DocH2>
        <DocP>
          HTTP API at <Code>https://api.evora.cx/api/reseller-api</Code> for resellers, so a shop,
          Discord bot or fulfilment worker can mint and manage licenses without a browser session.
          Keys are minted at the moment of sale and charged against your credit balance, exactly as
          if you had generated them in the panel.
        </DocP>
        <DocP>
          This exists to replace stocking by hand. Instead of bulk-generating keys in the panel and
          pasting them into your shop&apos;s stock, point your shop&apos;s delivery webhook at this
          API and it mints one on each order.
        </DocP>

        <DocH2 className="mt-6">Base URL</DocH2>
        <CodeBlock>{`https://api.evora.cx/api/reseller-api`}</CodeBlock>

        <DocH2 className="mt-6">Authentication</DocH2>
        <DocP>
          Bearer tokens prefixed <Code>ag_rk_</Code>, created under{" "}
          <Code>Reseller API</Code> in your resell panel. The full key is shown once at creation and
          stored hashed, so if you lose it, revoke it and make another.
        </DocP>
        <CodeBlock>{`curl -H "Authorization: Bearer ag_rk_YOUR_KEY" \\
  https://api.evora.cx/api/reseller-api/me`}</CodeBlock>
        <Callout variant="amber">
          <strong>Server-side only.</strong> An <Code>ag_rk_</Code> key can spend your credit
          balance. It must never reach a browser, a client-side script, or anything you ship to a
          customer. If your shop platform cannot keep a secret, put a small backend in front of it.
        </Callout>

        <DocH3>Scopes</DocH3>
        <DocP>
          Each key carries its own scopes. Grant the least an integration needs: a shop that only
          delivers keys never needs to ban or delete them.
        </DocP>
        <DocTable
          headers={["Scope", "Grants"]}
          rows={[
            ["licenses:generate", "Mint new keys. This is what a shop integration needs."],
            ["licenses:read", "List and look up keys you own."],
            ["licenses:manage", "Reset HWID, ban, unban, delete. Only for something that handles support."],
            ["balance:read", "Read remaining credit per duration."],
            ["webhooks:read", "List webhook endpoints."],
            ["webhooks:write", "Create, edit, delete and test webhook endpoints."],
          ]}
        />
        <Callout variant="blue">
          <strong>API keys cannot create API keys.</strong> Key management lives in the panel under
          session auth only, so a leaked key cannot issue itself a broader one, and revoking it
          genuinely stops the integration.
        </Callout>

        <DocH3>IP allowlist</DocH3>
        <DocP>
          A key can be pinned to one or more addresses or CIDR ranges when you create it. If your
          shop runs on a fixed host, this turns a leaked key into a dead key. Requests from anywhere
          else get <Code>403 ip_not_allowed</Code>.
        </DocP>

        <DocH2 className="mt-6">Rate limits</DocH2>
        <DocP>
          240 requests/minute per key, plus an optional slower per-key limit you can set yourself
          when handing a key to a third-party integration. Over either, you get <Code>429</Code>{" "}
          with <Code>retry_after</Code> in seconds.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="reseller-api-idempotency">
        <DocH2>Idempotency</DocH2>
        <DocP>
          <Code>POST /licenses</Code> requires an <Code>Idempotency-Key</Code> header. It is not
          optional, because this endpoint gets called at the moment money changes hands by a machine
          that will retry on timeout. Without it, a response your shop never received means the
          reseller is charged twice and one batch of keys is minted into the void.
        </DocP>
        <DocP>
          Use any string unique to the order, and reuse the same one on retries. Your shop&apos;s
          order id is the natural choice.
        </DocP>
        <DocTable
          headers={["Situation", "Response"]}
          rows={[
            ["First call with this key", "Mints normally, and the response is stored."],
            ["Retry, same key, same body", "Replays the original response with an Idempotent-Replay: true header. Nothing is minted, nothing is charged."],
            ["Retry while the first is still running", "409 idempotency_in_progress. Retry in a moment. If the original never finished, a retry after 5 minutes takes it over rather than waiting forever."],
            ["Same key, different body", "409 idempotency_key_reused. That is a client bug, so it is surfaced rather than hidden behind a replay."],
            ["Retry after a failure", "Failures are not cached, so a call that hit insufficient_balance can be retried against the same key once you top up."],
          ]}
        />
        <Callout variant="blue">
          Stored responses expire after 24 hours. Beyond that a repeated key is treated as a fresh
          request, so do not rely on it as a permanent dedupe log.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="reseller-api-licenses">
        <DocH2>Minting keys</DocH2>
        <CodeBlock>{`curl -X POST https://api.evora.cx/api/reseller-api/licenses \\
  -H "Authorization: Bearer ag_rk_your_key" \\
  -H "Idempotency-Key: order_10432" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 1, "duration": 1, "expiry": "month", "level": 1}'`}</CodeBlock>
        <CodeBlock label="200 OK">{`{
  "success": true,
  "count": 1,
  "keys": ["A1B2C-D3E4F-G5H6I-J7K8L-M9N0P"],
  "cost": { "unit": "month", "credits": 1 }
}`}</CodeBlock>

        <DocH3>Request body</DocH3>
        <DocTable
          headers={["Field", "Default", "Meaning"]}
          rows={[
            ["amount", "1", "How many keys to mint, 1 to 100."],
            ["expiry", "day", "Which credit bucket to spend, and the unit duration is counted in: hour, day, week, month, 3month, 6month, year, lifetime."],
            ["duration", "1", "How many of that unit each key lasts."],
            ["level", "1", "Subscription level. Must be one your developer allows — see allowed_levels on GET /me."],
            ["mask", "*****-*****-*****-*****-*****", "Key format. Each * becomes a random character."],
            ["note", "null", "Free text stored against the keys, up to 255 chars. Handy for your order id."],
            ["uppercase / lowercase", "true / false", "Character case of generated keys."],
          ]}
        />

        <DocH3>What a mint costs</DocH3>
        <DocP>
          Credits are metered by the access a mint creates, not by the number of keys:
        </DocP>
        <CodeBlock label="rating rule">{`cost = amount * duration     // charged to the bucket named by "expiry"`}</CodeBlock>
        <DocP>
          So thirty separate one-day keys and one thirty-day key both cost thirty day-credits,
          because they grant the same thirty days of access. A single one-month key on a month
          bucket costs one credit, which is the common case and the panel default.
        </DocP>
        <DocTable
          headers={["Request", "Cost"]}
          rows={[
            ["amount 1, duration 1, expiry month", "1 month credit"],
            ["amount 10, duration 1, expiry month", "10 month credits"],
            ["amount 1, duration 30, expiry day", "30 day credits"],
            ["amount 5, duration 24, expiry hour", "120 hour credits"],
          ]}
        />
        <DocP>
          <Code>duration</Code> is capped per unit (8760 hours, 3650 days, 520 weeks, 120 months,
          40 quarters, 20 half-years, 10 years, 1 lifetime). Over the cap you get{" "}
          <Code>400 duration_too_long</Code> rather than a confusing balance error.
        </DocP>

        <DocH3>Quoting before you sell</DocH3>
        <DocP>
          <Code>POST /licenses/quote</Code> takes the same body and prices it without minting
          anything, so your shop can decide whether it can fulfil an order <em>before</em> taking
          the customer&apos;s money.
        </DocP>
        <CodeBlock label="POST /licenses/quote">{`{
  "quote": {
    "unit": "day", "amount": 1, "duration": 30,
    "cost": 30, "available": 120, "affordable": true,
    "durationSeconds": 2592000
  }
}`}</CodeBlock>
        <Callout variant="amber">
          <strong>Check funding before you list a product, not after an order.</strong>{" "}
          A mint you cannot afford returns <Code>402 insufficient_balance</Code> with{" "}
          <Code>required</Code> and <Code>available</Code> in the body — but by then your customer
          has already paid. Quote up front, and subscribe to <Code>balance.low</Code> so restocking
          is prompted rather than discovered.
        </Callout>

        <DocH3>Reading keys back</DocH3>
        <CodeBlock>{`# paginated list of your own keys
curl "https://api.evora.cx/api/reseller-api/licenses?page=1&limit=50&search=order_10432" \\
  -H "Authorization: Bearer ag_rk_your_key"

# a single key by id, for order lookups
curl https://api.evora.cx/api/reseller-api/licenses/LICENSE_ID \\
  -H "Authorization: Bearer ag_rk_your_key"`}</CodeBlock>

        <DocH3>Balance</DocH3>
        <DocP>
          Returned keyed by the same unit names <Code>POST /licenses</Code> accepts, so you can map
          stock to product without translating.
        </DocP>
        <CodeBlock label="GET /balance">{`{
  "balance": {
    "hour": 0, "day": 120, "week": 40, "month": 65,
    "3month": 12, "6month": 4, "year": 2, "lifetime": 0
  },
  "threshold": 5
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="reseller-api-support">
        <DocH2>Support actions</DocH2>
        <DocP>
          These need <Code>licenses:manage</Code>, deliberately separate from{" "}
          <Code>licenses:generate</Code>. HWID reset is the highest-volume request an end user makes,
          so letting your bot handle it takes you out of the loop entirely.
        </DocP>
        <CodeBlock>{`API=https://api.evora.cx/api/reseller-api
H="Authorization: Bearer ag_rk_your_key"

curl -X POST "$API/licenses/$ID/hwid-reset" -H "$H"
curl -X POST "$API/licenses/$ID/ban"   -H "$H" -H "Content-Type: application/json" -d '{"reason":"chargeback"}'
curl -X POST "$API/licenses/$ID/unban" -H "$H"
curl -X DELETE "$API/licenses/$ID"     -H "$H"`}</CodeBlock>

        <DocH2 className="mt-8">Endpoint reference</DocH2>
        <DocTable
          headers={["Method & path", "Scope"]}
          rows={[
            ["GET /me", "none — any valid key"],
            ["GET /balance", "balance:read"],
            ["POST /licenses", "licenses:generate"],
            ["POST /licenses/quote", "balance:read"],
            ["GET /licenses", "licenses:read"],
            ["GET /licenses/:id", "licenses:read"],
            ["POST /licenses/:id/hwid-reset", "licenses:manage"],
            ["POST /licenses/:id/ban", "licenses:manage"],
            ["POST /licenses/:id/unban", "licenses:manage"],
            ["DELETE /licenses/:id", "licenses:manage"],
            ["GET /webhooks", "webhooks:read"],
            ["POST /webhooks", "webhooks:write"],
            ["PUT /webhooks/:id", "webhooks:write"],
            ["DELETE /webhooks/:id", "webhooks:write"],
            ["POST /webhooks/:id/test", "webhooks:write"],
            ["POST /webhooks/:id/rotate-secret", "webhooks:write"],
            ["GET /webhooks/:id/deliveries", "webhooks:read"],
          ]}
        />

        <DocH2 className="mt-8">Error codes</DocH2>
        <DocP>
          Every error carries a stable <Code>code</Code> alongside the human-readable{" "}
          <Code>error</Code>. Branch on the code, never on the message.
        </DocP>
        <DocTable
          headers={["Code", "Status", "Meaning"]}
          rows={[
            ["invalid_api_key", "401", "Unknown, revoked or expired key."],
            ["unauthenticated", "401", "No Authorization header and no panel session."],
            ["ip_not_allowed", "403", "Key is pinned to a different address."],
            ["insufficient_scope", "403", "Key lacks the scope this route needs."],
            ["seller_disabled", "403", "Your reseller account has been disabled by the developer."],
            ["cannot_create_licenses", "403", "Key minting is turned off for your account."],
            ["level_not_allowed", "403", "Requested level is outside the levels you may sell."],
            ["license_limit_reached", "403", "You have hit the total key cap set by the developer."],
            ["app_mismatch", "403", "Key was issued for a different application."],
            ["insufficient_balance", "402", "Not enough credit in that bucket. Body carries required and available. Top up and retry with the same Idempotency-Key."],
            ["duration_too_long", "400", "duration exceeds the cap for that unit."],
            ["idempotency_key_required", "400", "POST /licenses was called without an Idempotency-Key header."],
            ["idempotency_in_progress", "409", "An identical request is still running."],
            ["idempotency_key_reused", "409", "Key reused with a different body."],
            ["license_not_found", "404", "No such key, or it is not one of yours."],
            ["rate_limited", "429", "Over the per-key limit. Honour retry_after."],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="reseller-api-webhooks">
        <DocH2>Webhooks</DocH2>
        <DocP>
          Evora can call your endpoint when something happens to the keys you sold. Add endpoints in
          the panel under <Code>Reseller API</Code>, or over the API with{" "}
          <Code>webhooks:write</Code>. HTTPS only.
        </DocP>

        <DocH3>Events</DocH3>
        <DocTable
          headers={["Event", "Fires when"]}
          rows={[
            ["license.redeemed", "A key you sold was activated by an end user, on any surface: loader, account panel or API."],
            ["balance.low", "A sale took one of your duration buckets down to your threshold."],
          ]}
        />
        <Callout variant="blue">
          <strong>Wire up <Code>balance.low</Code> first.</strong> It fires on the sale that crosses
          the threshold, not on every sale below it, so it arrives while you still have stock to
          sell rather than after an order has already failed. Set the threshold on the same panel
          screen; 0 turns the event off.
        </Callout>

        <DocH3>Payloads</DocH3>
        <CodeBlock label="license.redeemed">{`{
  "event": "license.redeemed",
  "timestamp": "2026-08-07T09:41:22.104Z",
  "license": { "id": "…uuid…", "key": "A1B2C-D3E4F-G5H6I-J7K8L-M9N0P", "level": 1 },
  "user": { "id": "…uuid…", "username": "customer42" },
  "subscription": { "name": "Premium", "expires_at": "2026-09-06T09:41:22.000Z" },
  "extended": false,
  "source": "loader"
}`}</CodeBlock>
        <CodeBlock label="balance.low">{`{
  "event": "balance.low",
  "timestamp": "2026-08-07T09:41:22.104Z",
  "unit": "month",
  "remaining": 4,
  "threshold": 5,
  "seller": { "id": "…uuid…", "username": "yourname" }
}`}</CodeBlock>

        <DocH3>Verifying the signature</DocH3>
        <DocP>
          Every delivery is signed with the secret shown once when you created the endpoint. The
          signature is HMAC-SHA256 over <Code>timestamp + &quot;.&quot; + rawBody</Code>. Verify
          against the <em>raw</em> body, before any JSON parsing.
        </DocP>
        <DocTable
          headers={["Header", "Contains"]}
          rows={[
            ["X-Evora-Signature", "HMAC-SHA256 hex digest."],
            ["X-Evora-Timestamp", "Unix seconds, the value signed alongside the body."],
            ["X-Evora-Event-Id", "Stable id for this event. Retries reuse it, so record it to dedupe."],
            ["X-Evora-Delivery-Attempt", "1 on the first try, incrementing per retry."],
          ]}
        />
        <CodeBlock label="Node — express">{`import crypto from 'node:crypto';

app.post('/evora-hook', express.raw({ type: 'application/json' }), (req, res) => {
  const ts  = req.get('X-Evora-Timestamp');
  const sig = req.get('X-Evora-Signature');

  const expected = crypto.createHmac('sha256', process.env.EVORA_WEBHOOK_SECRET)
    .update(ts).update('.').update(req.body)
    .digest('hex');

  // timing-safe, and length-checked first so timingSafeEqual cannot throw
  const ok = sig && sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return res.sendStatus(401);

  // reject anything older than five minutes so a captured delivery cannot be replayed
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return res.sendStatus(401);

  const event = JSON.parse(req.body.toString());
  // dedupe on X-Evora-Event-Id before acting — retries reuse it
  handle(event);
  res.sendStatus(200);
});`}</CodeBlock>

        <DocH3>Retries</DocH3>
        <DocP>
          A delivery is a success only on a 2xx. Anything else is retried at 30s, 2m, 10m, 30m and
          2h, six attempts in total. After 20 consecutive failures the endpoint is disabled
          automatically and you will see why in the panel; re-enabling it clears the counter.
          Deliveries and their outcomes are listed under{" "}
          <Code>GET /webhooks/:id/deliveries</Code>.
        </DocP>
        <Callout variant="amber">
          Webhooks are notification, not control. If your receiver is down you have lost a
          <em> message</em>, never a key or a credit — the authoritative state is always readable
          from <Code>GET /licenses</Code> and <Code>GET /balance</Code>.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="reseller-api-recipe">
        <DocH2>Recipe: automatic shop delivery</DocH2>
        <DocP>
          The shape below works with any shop platform that can call a URL on a paid order (Sellix,
          Shoppy, a custom store). Your backend holds the key; the shop only ever sees the license
          you hand back.
        </DocP>
        <CodeBlock label="Node — order paid → deliver">{`const API = 'https://api.evora.cx/api/reseller-api';

async function deliver(order) {
  const res = await fetch(\`\${API}/licenses\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.EVORA_RESELLER_KEY}\`,
      'Content-Type': 'application/json',
      // the order id IS the idempotency key. a retried webhook from the shop
      // now replays the same license instead of minting a second one.
      'Idempotency-Key': order.id,
    },
    body: JSON.stringify({
      amount: 1,
      duration: order.months,
      expiry: 'month',
      level: order.tier,
      note: \`order \${order.id}\`,
    }),
  });

  const body = await res.json();

  if (!res.ok) {
    if (body.code === 'insufficient_balance') {
      // body.required / body.available tell you how far short you are.
      // do NOT mark the order fulfilled — top up, then retry with the same
      // Idempotency-Key and this call becomes a normal mint.
      await alertMe(\`need \${body.required} \${body.unit}, have \${body.available}\`);
      return { delivered: false, retryable: true };
    }
    if (body.code === 'idempotency_in_progress') return { delivered: false, retryable: true };
    return { delivered: false, retryable: false, reason: body.code };
  }

  return { delivered: true, key: body.keys[0] };
}`}</CodeBlock>
        <DocP>
          Pair it with a <Code>balance.low</Code> endpoint so restocking is prompted rather than
          discovered, and with <Code>license.redeemed</Code> if you want to know which orders have
          actually been activated.
        </DocP>
      </DocSection>
    </>
  );
}

export { ResellerApiSections };
