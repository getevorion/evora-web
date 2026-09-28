import {
  DocSection, DocH2, DocH3, DocP,
  Code, CodeBlock, Callout,
  DocTable, Divider,
} from "../components";

function DevApiSections() {
  return (
    <>
      <DocSection id="developer-api">
        <DocH2>Developer API</DocH2>
        <DocP>
          HTTP API at <Code>https://api.evora.cx/api/developer-api</Code> for the same
          operations as the dashboard: users, licenses, webhooks, stats, and more. Every route
          requires a valid API key with the right scopes.
        </DocP>
        <DocH2 className="mt-6">Base URL</DocH2>
        <CodeBlock>{`https://api.evora.cx/api/developer-api`}</CodeBlock>
        <DocH2 className="mt-6">Quick start</DocH2>
        <CodeBlock>{`curl -H "Authorization: Bearer ag_sk_YOUR_KEY" \\
  https://api.evora.cx/api/developer-api/users`}</CodeBlock>
        <CodeBlock>{`# generate 10 licenses, 30 days each, level 1
curl -X POST https://api.evora.cx/api/developer-api/apps/YOUR_APP_ID/licenses \\
  -H "Authorization: Bearer ag_sk_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 10, "duration": 30, "expiry": 86400, "level": 1}'`}</CodeBlock>
        <CodeBlock>{`# ban a user
curl -X POST https://api.evora.cx/api/developer-api/users/USER_ID/ban \\
  -H "Authorization: Bearer ag_sk_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"reason": "TOS violation"}'`}</CodeBlock>
        <Callout variant="blue">
          <strong>Duration is <Code>duration</Code> &times; <Code>expiry</Code> seconds.</strong>{" "}
          <Code>expiry</Code> is the unit multiplier — <Code>86400</Code> for days,{" "}
          <Code>3600</Code> for hours, <Code>60</Code> for minutes. Set{" "}
          <Code>duration: 0</Code> for a lifetime key. Unknown fields are ignored, so a typo
          silently yields a default 1-day key — copy the shape above exactly.
        </Callout>
        <DocH2 className="mt-6">Response shape</DocH2>
        <DocP>
          Responses are plain JSON objects; most list endpoints return their collection at a named
          key (for example <Code>{"{ apps, total, page, limit }"}</Code>). Errors use standard HTTP
          status codes with <Code>{"{ error: '...' }"}</Code>, and several endpoints add a stable{" "}
          <Code>code</Code> field you can branch on.
        </DocP>
        <DocH2 className="mt-6">Rate limits</DocH2>
        <DocP>
          A fixed 300 requests/minute per-key ceiling, plus your plan&apos;s requests-per-minute
          quota — the latter is the limit you&apos;ll normally meet. Over either, you get{" "}
          <Code>429</Code> with <Code>retry_after</Code> (seconds). Expired or over-quota
          subscriptions return <Code>402</Code>.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="developer-api-recipes">
        <DocH2>Recipe: a Discord bot</DocH2>
        <DocP>
          The bot holds the API key on your server and never exposes it. A typical purchase-to-access
          flow is three calls: create the customer, generate a key, redeem it for them.
        </DocP>
        <CodeBlock label="Node — /redeem command">{`const API = 'https://api.evora.cx/api/developer-api';
const H = {
  'Authorization': \`Bearer \${process.env.EVORA_KEY}\`,
  'Content-Type': 'application/json',
};

// 1. Create the customer account (password is required, 6+ chars)
const { user } = await fetch(\`\${API}/users\`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ username: discordName, password: generatedPassword }),
}).then(r => r.json());

// 2. Redeem a key on their behalf — server-to-server, no password needed
const res = await fetch(\`\${API}/users/\${user.id}/redeem\`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ licenseKey: keyFromCustomer }),
});
const body = await res.json();

if (!res.ok) {
  // Stable codes: INVALID_KEY, KEY_BANNED, KEY_PAUSED, ALREADY_REDEEMED,
  // NOT_FOR_THIS_USER, HWID_MISMATCH, NO_BENEFIT, QUOTA_EXCEEDED
  return reply(\`Could not redeem: \${body.error}\`);
}
reply(\`Activated \${body.data.subscriptionName} until \${body.data.expiresAt ?? 'forever'}\`);`}</CodeBlock>
        <DocP>
          Redemption here behaves exactly as it does in the loader and the account panel — same
          validation, same no-benefit protection, same events. Point a webhook at your bot to hear{" "}
          <Code>license.used</Code> regardless of where the redemption happened; the payload&apos;s{" "}
          <Code>source</Code> field tells you which surface it came from.
        </DocP>
        <DocH3>Linking Discord accounts</DocH3>
        <DocP>
          There is no built-in Discord ID field. Store it as a per-user variable and look users up
          by username:
        </DocP>
        <CodeBlock>{`# tag the Evora user with their Discord id
curl -X POST "$API/apps/$APP_ID/users/$USER_ID/variables" \\
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \\
  -d '{"var_key": "discord_id", "var_value": "123456789012345678"}'

# later: resolve a customer by name
curl "$API/apps/$APP_ID/users/lookup?username=someuser" -H "Authorization: Bearer $KEY"`}</CodeBlock>

        <DocH2 className="mt-8">Recipe: a customer panel</DocH2>
        <DocP>
          Your panel&apos;s <em>backend</em> holds the API key and proxies every call. The browser
          must never see an <Code>ag_sk_</Code> key — CORS blocks direct browser calls precisely so
          this mistake is hard to make.
        </DocP>
        <CodeBlock label="Panel login → your own session">{`// Verify the customer's credentials against Evora
const r = await fetch(\`\${API}/apps/\${APP_ID}/users/authenticate\`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ username, password }),
});
const data = await r.json();
if (!data.authenticated) return renderLoginError();

// Evora does not issue a browser session — you mint your own cookie here.
req.session.evoraUserId = data.user.id;

// data.subscription: { level, name, expiresAt, hwid, paused, active }
// The "active" flag is false when expired OR paused — the same verdict the SDK reaches.`}</CodeBlock>
        <DocP>
          To let a customer launch the protected app straight from your panel, mint a one-time,
          HWID-bound exchange token and hand it to your loader, which trades it for a real SDK
          session. Your panel never handles the customer&apos;s password.
        </DocP>
        <CodeBlock label="Panel SSO into the SDK">{`// 1. Panel backend mints the token (TTL 30-300s, one-time use)
const { exchange_token } = await fetch(
  \`\${API}/users/\${userId}/issue-session-token\`,
  { method: 'POST', headers: H,
    body: JSON.stringify({ appId: APP_ID, hwid: clientHwid, ttlSeconds: 120 }) },
).then(r => r.json());

// 2. Your loader posts it to the SDK proxy endpoint to obtain a session
//    POST /api/v2/proxy/login-by-token  { exchange_token, hwid }`}</CodeBlock>
        <Callout variant="amber">
          The token is bound to the exact HWID you pass and can be redeemed once. It is refused for
          banned users and for users without a subscription to that app.
        </Callout>
        <DocH2 className="mt-8">Recipe: a panel for a license-only app</DocH2>
        <DocP>
          If your app uses <Code>auth_mode: license</Code>, your customers have no username or
          password — their key <em>is</em> their credential. Authenticate them with the key instead;
          everything after that point is identical to the user/password panel above, because both
          endpoints return the same <Code>user</Code> and <Code>subscription</Code> envelope.
        </DocP>
        <CodeBlock label="Panel login by license key">{`const r = await fetch(\`\${API}/apps/\${APP_ID}/licenses/authenticate\`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ licenseKey: keyFromCustomer }),
});
const data = await r.json();

if (data.authenticated) {
  req.session.evoraUserId = data.user.id;   // your own session, as before
  render(data.subscription);                // level, name, expiresAt, hwid, paused, active
} else if (data.code === 'LICENSE_NOT_ACTIVATED') {
  // Valid key, never used in the app yet. data.license has status/level.
  render('Key valid — launch the app once to activate it.');
} else {
  render('Invalid license key');            // 401, or 403 if banned
}`}</CodeBlock>
        <DocP>
          Once you have <Code>data.user.id</Code>, HWID reset, subscription lookups and{" "}
          <Code>issue-session-token</Code> SSO all work exactly as they do for user/password apps.
          HWID reset and ban also accept a raw license key in place of the license id, if you would
          rather not resolve the user first.
        </DocP>
        <Callout variant="amber">
          Do not build a key login on <Code>GET /licenses?search=</Code>. That parameter is a
          substring match intended for dashboard search — using it as a login lets someone probe
          partial keys. <Code>/licenses/authenticate</Code> matches the whole key only and is
          rate-limited per key.
        </Callout>

        <DocH2 className="mt-8">Password reset</DocH2>
        <DocP>
          <strong>Evora issues and verifies; you deliver.</strong> There is no &quot;forgot
          password&quot; email sent from our side — your customers are yours, and most of them have
          no email address on file anyway. Instead you mint a single-use token and send it over
          whatever channel you already use (a Discord DM, your own mail provider, a link on your
          panel), then fulfil it.
        </DocP>
        <CodeBlock label="1. Mint a token (your bot or panel backend)">{`const r = await fetch(\`\${API}/users/\${userId}/password-reset\`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ ttlSeconds: 1800 }),   // 5 min – 24 h, default 30 min
});
const { reset_token, expires_at } = await r.json();

// Deliver it yourself — it is NOT retrievable again.
await discord.users.send(discordId,
  \`Reset link: https://lunar.com/reset?token=\${reset_token} (expires \${expires_at})\`);`}</CodeBlock>
        <CodeBlock label="2. Fulfil it when they submit a new password">{`await fetch(\`\${API}/password-reset/fulfil\`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ token, newPassword }),
});
// -> { success: true, userId, username, sessions_terminated }`}</CodeBlock>
        <DocTable
          headers={["Property", "Behaviour"]}
          rows={[
            ["Storage", "Only a SHA-256 hash is stored — a database leak is not replayable"],
            ["Single use", "Fulfilling marks it used; a replay returns INVALID_TOKEN"],
            ["Siblings", "Fulfilling (or any password change) voids every other outstanding token for that user"],
            ["Sessions", "A successful reset kills the user's live SDK sessions"],
            ["Tenancy", "A token can only be fulfilled by the developer who owns the user"],
            ["Limits", "Max 3 live tokens per user; 5 issues/min per user; expired/used/unknown all return the same error"],
          ]}
        />
        <Callout variant="amber">
          Because you identify the user before minting (by <Code>userId</Code>, not by an email
          form), this endpoint is not a user-enumeration oracle. Keep it that way in your panel:
          respond identically whether or not the account exists.
        </Callout>

        <DocH2 className="mt-8">Freezing a subscription</DocH2>
        <DocP>
          Freezing banks the remaining time and stops the clock; resuming converts the banked
          seconds back into a fresh expiry. Enable <Code>allow_subscription_pause</Code> on the
          application first, or the pause call returns <Code>PAUSE_NOT_ENABLED</Code>.
        </DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["POST", "/users/:userId/subscriptions/:appId/pause", "Freeze — banks remaining seconds"],
            ["POST", "/users/:userId/subscriptions/:appId/unpause", "Resume — restores banked time"],
            ["POST", "/apps/:appId/licenses/:licenseId/pause", "Freeze a single license key"],
            ["POST", "/apps/:appId/licenses/:licenseId/unpause", "Resume a single license key"],
          ]}
        />
        <DocP>
          Resuming is intentionally not gated on the app flag, so turning the feature off never
          strands customers who are already frozen. A paused subscription reports{" "}
          <Code>active: false</Code> from both authenticate endpoints, matching what the SDK does.
        </DocP>

        <DocH3>Self-service actions</DocH3>
        <DocTable
          headers={["Panel feature", "Endpoint"]}
          rows={[
            ["Redeem a key", "POST /users/:userId/redeem"],
            ["Show subscriptions (incl. lapsed)", "GET /users/:userId/subscriptions?includeExpired=true"],
            ["Reset HWID (cooldown enforced)", "POST /users/:userId/reset-hwid"],
            ["Reset device binding", "POST /users/:userId/reset-device"],
            ["Change password", "PUT /users/:userId"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-apps">
        <DocH2>Applications</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: apps:read / apps:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps", "List your applications"],
            ["GET", "/apps/:appId", "Get application details"],
            ["POST", "/apps", "Create application"],
            ["PUT", "/apps/:appId", "Update application"],
            ["DELETE", "/apps/:appId", "Delete application"],
            ["GET", "/apps/:appId/stats", "Get app statistics"],
          ]}
        />
        <DocP>
          Two fields on <Code>PUT /apps/:appId</Code> govern the end-user account surface:
        </DocP>
        <DocTable
          headers={["Field", "Values", "Meaning"]}
          rows={[
            ["twofa_policy", "disabled | optional | required", "Whether your users may (or must) enrol a second factor. Defaults to optional."],
            ["stats_public", "true | false", "Publishes user/licence/online counts to the SDK via FetchStats. Defaults to false."],
          ]}
        />
        <Callout variant="amber">
          <strong>stats_public is a disclosure, not a display setting.</strong>{" "}
          It puts your user and licence totals inside a binary you have shipped to the
          public. Turn it on only if those numbers are ones you would publish.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="developer-api-statistics">
        <DocH2>Statistics</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scope: stats:read</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/stats/overview", "Extended overview (users, licenses, sessions, auth trends)"],
            ["GET", "/apps/:appId/stats/logins", "Login activity by day (?days=30)"],
            ["GET", "/apps/:appId/stats/users", "User growth over time (?days=30)"],
            ["GET", "/apps/:appId/stats/licenses", "License status breakdown"],
            ["GET", "/apps/:appId/stats/sessions", "Session trends (?days=7)"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-users">
        <DocH2>Users</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: users:read / users:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["POST", "/apps/:appId/users/authenticate", "Verify user credentials (panel login)"],
            ["GET", "/apps/:appId/users/lookup?username=", "Look up user by username"],
            ["GET", "/users", "List users (paginated, ?appId= filter)"],
            ["GET", "/users/:userId", "Get single user"],
            ["POST", "/users", "Create user (username + password required)"],
            ["PUT", "/users/:userId", "Update user (username, email, password)"],
            ["DELETE", "/users/:userId", "Delete user"],
            ["POST", "/users/:userId/ban", "Ban user (optional HWID/IP blacklist cascade)"],
            ["POST", "/users/:userId/unban", "Unban user"],
            ["POST", "/users/:userId/reset-hwid", "Reset HWID (cooldown enforced)"],
            ["POST", "/users/:userId/reset-device", "Reset device binding"],
            ["GET", "/users/:userId/2fa", "Two-factor state (enabled, backup codes left, lockout)"],
            ["DELETE", "/users/:userId/2fa", "Support reset — clears 2FA and ends live sessions"],
            ["POST", "/users/:userId/redeem", "Redeem a license key for this user (licenses:write)"],
            ["POST", "/users/:userId/password-reset", "Mint a single-use reset token (you deliver it)"],
            ["POST", "/password-reset/fulfil", "Consume a reset token and set the new password"],
            ["POST", "/users/:userId/subscriptions/:appId/pause", "Freeze a subscription (banks remaining time)"],
            ["POST", "/users/:userId/subscriptions/:appId/unpause", "Resume a frozen subscription"],
            ["POST", "/users/:userId/issue-session-token", "Mint a one-time SDK login token (SSO)"],
            ["GET", "/users/:userId/subscriptions", "List subscriptions (?includeExpired=true)"],
            ["POST", "/users/:userId/subscriptions", "Add subscription"],
            ["POST", "/users/:userId/subscriptions/extend", "Extend subscription"],
            ["DELETE", "/users/:userId/subscriptions/:appId", "Remove subscription"],
            ["POST", "/users/bulk", "Bulk ban/unban/delete/reset-hwid/extend"],
          ]}
        />
        <Callout variant="blue">
          <strong>DELETE /users/:userId/2fa is the only way to remove a second factor
          without presenting a code.</strong>{" "}
          That is why it lives on your developer key rather than the SDK — a self-service
          &quot;turn it off&quot; would defeat the feature. Use it when a customer has lost
          both their authenticator and their backup codes. Their live sessions are ended
          with the reset, on the assumption the reason may have been a compromise.
        </Callout>
        <Callout variant="amber">
          Usernames are lowercased and must use only letters, numbers, underscore, hyphen, and
          period — the same rules the SDK applies at login. A password of at least 6 characters is
          required; there is no way for an end-user to set one later on their own.
        </Callout>
        <Callout variant="blue">
          On an app with <Code>auth_mode: license</Code>, granting a subscription directly is
          rejected with <Code>AUTH_MODE_REQUIRES_LICENSE</Code>. The SDK reaches those customers
          only through a redeemed key, so a keyless grant would create an account nobody could ever
          log in as — use <Code>POST /users/:userId/redeem</Code> instead.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="developer-api-licenses">
        <DocH2>Licenses</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: licenses:read / licenses:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/licenses", "List licenses (paginated, searchable)"],
            ["GET", "/apps/:appId/licenses/:licenseId", "Get single license"],
            ["POST", "/apps/:appId/licenses", "Generate licenses"],
            ["PUT", "/apps/:appId/licenses/:licenseId", "Update license"],
            ["DELETE", "/apps/:appId/licenses/:licenseId", "Delete license"],
            ["POST", "/apps/:appId/licenses/:id/ban", "Ban license"],
            ["POST", "/apps/:appId/licenses/:id/unban", "Unban license"],
            ["POST", "/apps/:appId/licenses/:id/reset-hwid", "Reset license HWID"],
            ["POST", "/apps/:appId/licenses/:keyOrId/expiry", "Extend or reduce expiry by a signed delta (takes the raw key)"],
            ["POST", "/apps/:appId/licenses/bulk", "Bulk actions — see below"],
            ["POST", "/apps/:appId/licenses/authenticate", "Verify a key and resolve its customer (panel login)"],
          ]}
        />
        <DocH3>Bulk actions</DocH3>
        <DocP>
          This endpoint performs actions on existing licenses; it does not create them (to generate
          many at once, use <Code>amount</Code> on <Code>POST /licenses</Code>). Send an{" "}
          <Code>action</Code> plus its required fields. Unknown actions are rejected with{" "}
          <Code>400</Code>.
        </DocP>
        <CodeBlock>{`# ban specific licenses
{ "action": "ban_selected", "ids": ["uuid", "..."], "reason": "chargeback" }

# extend every license in the app by 7 days
{ "action": "extend_all", "durationSeconds": 604800, "sourceFilter": "all" }`}</CodeBlock>
        <DocTable
          headers={["Action", "Requires"]}
          rows={[
            ["delete_selected / ban_selected / unban_selected", "ids[] (reason optional for ban)"],
            ["pause_selected / unpause_selected / reset_hwid_selected", "ids[]"],
            ["extend_selected", "ids[], durationSeconds"],
            ["delete_unused / delete_all", "—"],
            ["add_time", "durationSeconds (applies to unused keys)"],
            ["ban_all / unban_all / pause_all / unpause_all / reset_hwid_all / delete_all_matching", "sourceFilter: all | developer | reseller"],
            ["extend_all", "durationSeconds, sourceFilter"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-variables">
        <DocH2>Variables</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: variables:read / variables:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/variables", "List app variables"],
            ["GET", "/apps/:appId/variables/:key", "Get one variable by key"],
            ["POST", "/apps/:appId/variables", "Create or update a variable (upsert)"],
            ["PUT", "/apps/:appId/variables/:key", "Update variable by key"],
            ["DELETE", "/apps/:appId/variables/:key", "Delete variable by key"],
            ["DELETE", "/apps/:appId/variables", "Delete all app variables"],
            ["GET", "/apps/:appId/user-variables", "List every user variable in the app"],
            ["GET", "/apps/:appId/users/:userId/variables", "List one user's variables"],
            ["POST", "/apps/:appId/users/:userId/variables", "Set a user variable"],
            ["DELETE", "/apps/:appId/users/:userId/variables/:varKey", "Delete a user variable"],
            ["DELETE", "/apps/:appId/users/:userId/variables", "Delete all of a user's variables"],
          ]}
        />
        <Callout variant="blue">
          Variables are addressed by their <Code>var_key</Code>, not by an id. <Code>PUT</Code> is
          an upsert, so writing to an unknown key creates it.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="developer-api-webhooks">
        <DocH2>Webhooks</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: webhooks:read / webhooks:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/webhooks", "List webhooks"],
            ["POST", "/apps/:appId/webhooks", "Create webhook"],
            ["PUT", "/apps/:appId/webhooks/:webhookId", "Update webhook"],
            ["DELETE", "/apps/:appId/webhooks/:webhookId", "Delete webhook"],
            ["POST", "/apps/:appId/webhooks/:webhookId/test", "Test webhook"],
            ["GET", "/apps/:appId/events", "Read the event stream (catch-up, logs:read)"],
          ]}
        />

        <DocH3>Reseller account-sharing</DocH3>
        <DocP>
          <Code>seller.sharing_detected</Code> fires when one of your resellers&apos; panel
          accounts first looks like it is being driven by more than one person. Three
          independent signals feed it, so no single evasion defeats detection: distinct device
          fingerprints (a VPN changes the IP, not the GPU), geographic dispersion between those
          devices, and distinct panel sessions live on distinct networks at the same moment.
        </DocP>
        <CodeBlock label="seller.sharing_detected">{`{
  "event": "seller.sharing_detected",
  "alert_id": "…uuid…",
  "seller": { "id": "…uuid…", "username": "reseller42" },
  "severity": "high",                       // low | medium | high | critical
  "signals": {
    "device_spread": true,                  // 3+ distinct machines in 14 days
    "geo_dispersion": true,                 // 2+ locations, 150km+ apart
    "concurrent_now": true                  // live sessions on 2+ networks
  },
  "device_count": 4,
  "location_count": 2,
  "max_distance_km": 912,
  "concurrent": true,
  "locations": [
    { "city": "Warsaw", "country": "PL", "lat": 52.23, "lon": 21.01,
      "device_count": 2, "ip_prefixes": ["31.0.34.0/24"],
      "login_count": 18, "first_seen": "…", "last_seen": "…" }
  ],
  "window_days": 14,
  "timestamp": "2026-08-07T10:12:44.201Z"
}`}</CodeBlock>
        <Callout variant="blue">
          <strong>It fires once per alert, not once per login.</strong> A shared account logs in
          constantly; re-notifying on every login would be a delivery flood rather than a signal.
          The alert is refreshed in place as evidence accumulates, and you read the current state
          from <Code>GET /apps/:appId/seller-sharing-alerts</Code> and resolve it with{" "}
          <Code>POST /apps/:appId/seller-sharing-alerts/:alertId/review</Code> (
          <Code>reviewed</Code>, <Code>confirmed</Code> or <Code>dismissed</Code>).
        </Callout>
        <Callout variant="amber">
          <strong>Treat it as evidence, not a verdict.</strong> Two devices in two cities is also
          what a reseller with a laptop and a phone on holiday looks like. It never blocks a
          reseller&apos;s login, and it deliberately cannot see sharing inside one household —
          two people on the same home network collapse to one location and one network by design,
          because the alternative false-positives on every family that owns two computers.
        </Callout>

        <DocH3>Verify every payload</DocH3>
        <DocP>
          If the webhook has a secret, each request carries{" "}
          <Code>X-Evora-Timestamp</Code> and <Code>X-Evora-Signature</Code>. An endpoint that
          doesn&apos;t check them can be driven by anyone who learns its URL — a forged{" "}
          <Code>license.used</Code> is all it takes to make a bot grant access.
        </DocP>
        <CodeBlock label="Node — verify before trusting anything">{`import crypto from 'node:crypto';

// The RAW body, before JSON.parse — re-serializing changes the bytes and the
// signature will never match.
app.post('/hooks/evora', express.raw({ type: 'application/json' }), (req, res) => {
  const ts  = req.header('X-Evora-Timestamp') ?? '';
  const sig = req.header('X-Evora-Signature') ?? '';

  const expected = crypto.createHmac('sha256', process.env.EVORA_WEBHOOK_SECRET)
    .update(ts).update('.').update(req.body)
    .digest('hex');

  const ok = sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return res.status(401).end();

  // Reject replays of an old, validly-signed request.
  if (Math.abs(Date.now() - Date.parse(ts)) > 5 * 60_000) return res.status(401).end();

  const event = JSON.parse(req.body.toString());

  // Retries reuse the same id — record it and ignore repeats, or a redelivery
  // grants twice.
  if (alreadyProcessed(req.header('X-Evora-Event-Id'))) return res.status(200).end();

  handle(event);
  res.status(200).end();   // anything non-2xx is treated as a failure and retried
});`}</CodeBlock>

        <DocH3>Delivery guarantees</DocH3>
        <DocP>
          Delivery is <strong>at-least-once</strong>. A non-2xx response is retried with
          exponential backoff — 6 attempts over roughly two hours — after which the event stays
          in the stream but is not retried again. An endpoint that keeps failing is
          auto-disabled and you are notified.
        </DocP>
        <Callout variant="blue">
          The retry window is short on purpose. Enforcement is pull-based — the SDK re-reads
          state from the database on every heartbeat — so a missed webhook can never grant or
          extend access. For anything longer than a brief outage, use the event stream below;
          that is the durable path.
        </Callout>

        <DocH3>Catching up with the event stream</DocH3>
        <DocP>
          Every event is recorded <em>whether or not a webhook is configured</em>. Rather than
          reconciling by walking all your users on a timer, poll the cursor and get only what
          changed.
        </DocP>
        <CodeBlock label="Catch up after downtime">{`let cursor = loadCursor();          // persist this

const r = await fetch(
  \`\${API}/apps/\${APP_ID}/events?since=\${cursor ?? ''}&limit=200\`,
  { headers: H },
).then(r => r.json());

for (const e of r.events) applyToPortal(e);   // e.type, e.payload, e.seq
saveCursor(r.next_cursor);                    // resume here next time`}</CodeBlock>
        <DocP>
          Order is by <Code>seq</Code>, a monotonic integer. Don&apos;t page by timestamp — two
          events can share a millisecond, and a clock adjustment can make a time-based cursor
          skip or repeat rows.
        </DocP>

        <DocH3>Events</DocH3>
        <DocTable
          headers={["Event", "Fires when"]}
          rows={[
            ["user.register", "An end-user registers through the SDK"],
            ["user.login", "An end-user authenticates"],
            ["user.banned / user.unbanned", "You ban or reinstate a customer"],
            ["license.used", "A key is redeemed — from any surface; check `source`"],
            ["subscription.created", "A customer gains a subscription (key or API grant)"],
            ["subscription.extended", "Time is added to an existing subscription"],
            ["subscription.paused / .resumed", "A subscription is frozen or resumed"],
            ["subscription.removed", "A subscription is revoked"],
            ["hwid.reset", "A customer's hardware binding is cleared"],
            ["blacklist.blocked", "A blacklisted HWID/IP/username is refused"],
            ["anti_debug / anti_vm / anti_hv / anti_http_debug / anti_attach .detected", "SDK protection triggers"],
          ]}
        />
        <Callout variant="amber">
          There is deliberately no <Code>subscription.expired</Code>. Expiry isn&apos;t an action
          anything performs — it&apos;s <Code>expires_at</Code> passing while nobody is looking.
          Derive it from the <Code>expiry</Code> field, or read <Code>subscription.active</Code>{" "}
          from either authenticate endpoint, which applies exactly the rule the SDK does.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="developer-api-access-lists">
        <DocH2>Blacklist &amp; Whitelist (API)</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: apps:read / apps:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/blacklist", "List blacklist entries"],
            ["POST", "/apps/:appId/blacklist", "Add blacklist entry"],
            ["DELETE", "/apps/:appId/blacklist/:entryId", "Remove blacklist entry"],
            ["GET", "/apps/:appId/whitelist", "List whitelist entries"],
            ["POST", "/apps/:appId/whitelist", "Add whitelist entry"],
            ["DELETE", "/apps/:appId/whitelist/:entryId", "Remove whitelist entry"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-sellers">
        <DocH2>Sellers (API)</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: sellers:read / sellers:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/sellers", "List sellers"],
            ["GET", "/apps/:appId/sellers/:sellerId", "Get seller"],
            ["POST", "/apps/:appId/sellers", "Create seller"],
            ["PUT", "/apps/:appId/sellers/:sellerId", "Update seller"],
            ["POST", "/apps/:appId/sellers/:sellerId/balance", "Add balance"],
            ["DELETE", "/apps/:appId/sellers/:sellerId", "Delete seller"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-logs-sessions">
        <DocH2>Logs &amp; Sessions (API)</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: logs:read / apps:read (sessions)</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/logs", "List logs (filter by type, user, date)"],
            ["GET", "/apps/:appId/logs/stats", "Log statistics"],
            ["GET", "/apps/:appId/sessions", "List active sessions"],
            ["DELETE", "/apps/:appId/sessions/:sessionId", "Kill session"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-subscription-tiers">
        <DocH2>Subscription Tiers (API)</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: apps:read / apps:write</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/subscriptions", "List subscription tiers"],
            ["POST", "/apps/:appId/subscriptions", "Create subscription tier"],
            ["PUT", "/apps/:appId/subscriptions/:id", "Update subscription tier"],
            ["DELETE", "/apps/:appId/subscriptions/:id", "Delete subscription tier"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-advanced">
        <DocH2>Entitlements, Geo &amp; Floating</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">
          Scopes: entitlements:read/write &middot; geo:read/write &middot; floating:read/write
        </DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/apps/:appId/entitlements", "List entitlements"],
            ["POST", "/apps/:appId/entitlements", "Create entitlement"],
            ["PUT", "/apps/:appId/entitlements/:entitlementId", "Update entitlement"],
            ["DELETE", "/apps/:appId/entitlements/:entitlementId", "Delete entitlement"],
            ["GET", "/apps/:appId/subscriptions/:subscriptionId/entitlements", "Entitlements on a tier"],
            ["POST", "/apps/:appId/subscriptions/:subscriptionId/entitlements", "Attach entitlement to a tier"],
            ["GET", "/apps/:appId/users/:userId/entitlements", "Resolve a user's entitlements"],
            ["GET", "/apps/:appId/geo-rules", "List geo rules"],
            ["POST", "/apps/:appId/geo-rules", "Add geo rule"],
            ["DELETE", "/apps/:appId/geo-rules/:ruleId", "Remove geo rule"],
            ["PUT", "/apps/:appId/geo-enabled", "Enable/disable geo restrictions"],
            ["GET", "/apps/:appId/floating/leases", "List floating leases"],
            ["DELETE", "/apps/:appId/floating/leases/:leaseId", "Revoke a lease"],
            ["GET", "/apps/:appId/users/:userId/floating/seats", "Seat usage for a user"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-clients">
        <DocH2>Clients &amp; Sellers</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scopes: sellers:read / sellers:write</DocP>
        <DocP>
          Clients are sub-accounts you grant management access to specific apps. They share the{" "}
          <Code>sellers:*</Code> scopes with reseller endpoints.
        </DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[
            ["GET", "/clients", "List clients"],
            ["POST", "/clients", "Create client"],
            ["PUT", "/clients/:clientId", "Update client"],
            ["DELETE", "/clients/:clientId", "Delete client"],
            ["GET", "/clients/:clientId/apps", "List a client's app access"],
            ["POST", "/clients/:clientId/apps", "Grant app access"],
            ["DELETE", "/clients/:clientId/apps/:appId", "Revoke app access"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="developer-api-quota">
        <DocH2>Quota</DocH2>
        <DocP className="text-text-faint text-[12.5px] -mt-2">Scope: apps:read</DocP>
        <DocTable
          headers={["Method", "Path", "Description"]}
          rows={[["GET", "/quota", "Plan quota, current usage, and subscription state"]]}
        />
        <DocP>
          Returns <Code>quota</Code>, <Code>usage</Code>, <Code>limits</Code> (apps, clients,
          requests per day/minute) and <Code>subscription</Code> (expiry, days remaining, grace
          period). Poll this instead of guessing why a <Code>402</Code> or <Code>429</Code>{" "}
          appeared.
        </DocP>
      </DocSection>
    </>
  );
}

export { DevApiSections };
