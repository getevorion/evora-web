import {
  DocSection, DocH2, DocH3, DocP,
  Code, CodeBlock, Callout, ProBadge,
  DocTable, DocUl, Divider,
} from "../components";

function ManagementSections() {
  return (
    <>
      <DocSection id="api-keys">
        <DocH2>API Keys</DocH2>
        <DocP>
          API keys let you manage your applications programmatically from external tools, bots,
          CI/CD pipelines, or your own backend. Instead of using the dashboard manually, you can
          automate license generation, user management, variable updates, and more through the REST
          API.
        </DocP>
        <DocH3>Creating an API key</DocH3>
        <DocP>
          Go to <strong>API Keys</strong> in the developer dashboard. Each key has a name, an
          optional expiry date, and a set of scopes. The key is shown once on creation (format:{" "}
          <Code>ag_sk_...</Code>). Store it securely.
        </DocP>
        <DocH3>Scopes</DocH3>
        <DocTable
          headers={["Scope", "Access"]}
          rows={[
            ["apps:read", "List and view applications, stats, blacklist, whitelist, sessions"],
            ["apps:write", "Create, update, delete apps. Manage blacklist, whitelist, sessions."],
            ["licenses:read", "List and view licenses for an app"],
            ["licenses:write", "Create, update, delete, ban/unban licenses. Bulk operations."],
            ["users:read", "List and view users and their subscriptions"],
            ["users:write", "Create, update, delete, ban/unban users. HWID/device reset. Bulk operations."],
            ["variables:read", "Read app variables and per-user variables"],
            ["variables:write", "Create, update, delete app and per-user variables"],
            ["webhooks:read", "List and view webhooks"],
            ["webhooks:write", "Create, update, delete, test webhooks"],
            ["sellers:read", "List and view seller accounts"],
            ["sellers:write", "Create, update, delete sellers. Manage balances."],
            ["logs:read", "View application logs and log statistics"],
            ["stats:read", "Dashboard analytics: overview, login trends, user growth, aggregates"],
            ["entitlements:read", "View entitlements and their subscription/user bindings"],
            ["entitlements:write", "Create, update, delete, and attach entitlements"],
            ["geo:read", "View geo restriction rules"],
            ["geo:write", "Add, remove, and toggle geo restriction rules"],
            ["floating:read", "View floating license leases and seat usage"],
            ["floating:write", "Revoke floating license leases"],
          ]}
        />
        <DocH3>App-scoped keys</DocH3>
        <DocP>
          A key can optionally be locked to a single application. Scoped keys are rejected on any
          route touching another app, cannot create new applications, and see only their own app in{" "}
          <Code>GET /apps</Code>. Use one per integration so a leaked bot token can&apos;t reach your
          other products.
        </DocP>
        <DocH3>Rate limits</DocH3>
        <DocP>
          Two limits apply. A fixed anti-abuse ceiling of 300 requests/minute per key, and your
          plan&apos;s requests-per-minute quota, which is the one you&apos;ll actually hit — exceeding
          it returns <Code>429</Code> with a <Code>retry_after</Code> value in seconds. You can also
          set a lower <Code>rateLimitPerMinute</Code> on an individual key when handing it to a
          third party.
        </DocP>
        <DocH3>Using an API key</DocH3>
        <CodeBlock>{`Authorization: Bearer ag_sk_your_api_key_here`}</CodeBlock>
        <Callout variant="amber">
          <strong>Never expose API keys in client-side code.</strong> These are server-to-server
          credentials. If a key is compromised, revoke it immediately from the dashboard.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="subscriptions">
        <DocH2>Subscriptions</DocH2>
        <DocP>
          Subscription tiers define the access levels for your application. Each tier has a name,
          a numeric level, and a duration. When a user authenticates, their{" "}
          <Code>subscription</Code> and <Code>subscription_level</Code> fields in{" "}
          <Code>UserData</Code> reflect their active tier.
        </DocP>
        <DocH3>Setting up tiers</DocH3>
        <DocP>
          Create tiers in the dashboard under your app&apos;s <strong>Subscriptions</strong>{" "}
          page, or via the REST API. Each tier needs:
        </DocP>
        <DocTable
          headers={["Field", "Description"]}
          rows={[
            ["name", "Display name (e.g. \"Basic\", \"Premium\", \"Lifetime\")"],
            ["level", "Numeric level. Higher means more access. Use this in your app to gate features."],
            ["duration", "How long the subscription lasts (days, or lifetime)"],
          ]}
        />
        <DocH3>Using tiers in your app</DocH3>
        <CodeBlock>{`auto& user = client.User();

if (user.subscription_level >= 2) {
    enable_advanced_mode();
}

if (user.IsLifetime()) {
    std::cout << "lifetime access\\n";
} else {
    std::cout << "expires in " << user.FormatTimeLeft() << "\\n";
}`}</CodeBlock>
        <DocH3>Assigning subscriptions</DocH3>
        <DocP>
          Users get a subscription when they redeem a license key or when you assign one manually
          through the dashboard or API. Licenses are linked to a subscription tier, so the tier is
          applied automatically on activation.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="blacklist-whitelist">
        <DocH2>Blacklist &amp; Whitelist</DocH2>
        <DocH3>Blacklist</DocH3>
        <DocP>
          Block specific HWIDs or IP addresses from authenticating. Blacklisted devices get{" "}
          <Code>ErrorCode::UserBanned</Code> on any auth attempt. Entries can be added manually or
          triggered automatically by anti-debug detections (when Auto-Ban is enabled) or the abuse
          detection system.
        </DocP>
        <DocH3>Whitelist</DocH3>
        <DocP>
          Restrict authentication to only approved devices. When the whitelist is active for an
          app, only HWIDs or IPs on the list can connect. Everything else is rejected. Useful for
          internal testing, closed beta access, or dedicated device deployments.
        </DocP>
        <DocH3>SDK behavior</DocH3>
        <CodeBlock>{`if (client.IsBlacklisted()) {
    std::cerr << "this device is banned\\n";
    return 1;
}

auto r = client.Login(user, pass);
if (r.blacklisted) {
    std::cerr << "banned\\n";
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="sessions">
        <DocH2>Sessions</DocH2>
        <DocP>
          Every authenticated SDK client creates a session on the server. Sessions are kept alive
          by heartbeats and expire when the client disconnects or stops sending heartbeats.
        </DocP>
        <DocH3>Managing sessions</DocH3>
        <DocP>From the dashboard or the Developer API, you can:</DocP>
        <DocUl
          items={[
            "View active sessions: see every connected client with their username, IP, HWID, connection time, and last heartbeat",
            "Kill a session: forcibly disconnect a specific client. If the client is on WebSocket transport, they receive a \"kill\" push event.",
            "Kill all sessions: disconnect every active client for an app at once",
            "Live stream: the dashboard includes a real-time session feed that updates as clients connect and disconnect",
          ]}
        />
        <DocH3>API endpoints</DocH3>
        <CodeBlock>{`# list active sessions
GET /api/developer-api/apps/:appId/sessions

# kill a specific session
DELETE /api/developer-api/apps/:appId/sessions/:sessionId

# kill all sessions
POST /api/developer-api/apps/:appId/sessions/kill-all`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="sellers">
        <DocH2>
          Sellers
          <ProBadge />
        </DocH2>
        <DocP>
          The seller system lets you create sub-accounts that can generate and distribute licenses
          on your behalf. Each seller has a balance and can only create licenses up to the number
          of credits you assign them.
        </DocP>
        <DocH3>How it works</DocH3>
        <DocUl
          items={[
            "Create a seller: give them a name, set their initial balance, and assign which subscription tiers they can sell",
            "Seller generates licenses: each license costs 1 credit from their balance",
            "Top up balance: add more credits as the seller purchases them from you",
            "Track activity: view the seller's ledger (balance changes) and action log (licenses created, users managed)",
          ]}
        />
        <DocH3>API endpoints</DocH3>
        <CodeBlock>{`# list sellers
GET /api/developer-api/apps/:appId/sellers

# create a seller
POST /api/developer-api/apps/:appId/sellers
  {"name": "reseller1", "balance": 100}

# add credits
POST /api/developer-api/apps/:appId/sellers/:sellerId/balance
  {"amount": 50}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="abuse-detection">
        <DocH2>
          Abuse Detection
          <ProBadge />
        </DocH2>
        <DocP>
          The platform monitors authentication patterns and flags suspicious activity
          automatically. This includes things like rapid HWID changes, mass login attempts,
          credential sharing, and unusual geographic patterns.
        </DocP>
        <DocH3>Features</DocH3>
        <DocUl
          items={[
            "Automated scanning: the system continuously analyzes authentication logs for known abuse patterns",
            "Alerts: suspicious activity generates alerts you can review in the dashboard or pull via the API",
            "Configurable settings: tune detection thresholds per-app (e.g. how many HWID resets before flagging, login rate limits)",
            "Manual scans: trigger a full abuse scan on demand from the dashboard",
          ]}
        />
        <DocP>
          Review alerts and take action (ban, reset HWID, etc.) directly from the alert detail
          view. The system flags suspicious users but doesn&apos;t auto-ban unless you configure
          it to.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="utilities">
        <DocH2>Utility Methods</DocH2>
        <DocP>Helper methods available on the <Code>Client</Code> instance after construction:</DocP>
        <DocTable
          headers={["Method", "Returns", "Description"]}
          rows={[
            ["Initialized()", "bool", "Whether Init() completed successfully"],
            ["Authenticated()", "bool", "Whether Login/Register/License succeeded"],
            ["LastError()", "std::string", "Human-readable last error message"],
            ["LastErrorCode()", "ErrorCode", "Enum value of last error"],
            ["GetSdkVersion()", "std::string", 'SDK version string (e.g. "2.9.7")'],
            ["GetAuthMode()", "std::string", 'App\'s configured auth mode ("license", "user_pass", "both")'],
            ["GetAppName()", "std::string", "Application name from the dashboard"],
            ["IsBlacklisted()", "bool", "Whether current HWID is blacklisted"],
            ["IsWebSocketConnected()", "bool", "Whether the WebSocket connection is active"],
            ["User()", "const UserData&", "Authenticated user's data"],
            ["Wait()", "void", "Blocks until Close() is called or the process exits"],
            ["Close()", "void", "Shuts down all background threads and disconnects"],
          ]}
        />
        <CodeBlock>{`if (!client.Initialized()) {
    std::cerr << "Init failed: " << client.LastError() << "\\n";
    return 1;
}

std::cout << "SDK v" << client.GetSdkVersion() << "\\n";
std::cout << "App: " << client.GetAppName() << "\\n";
std::cout << "Auth mode: " << client.GetAuthMode() << "\\n";

client.Wait();`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="preprocessor">
        <DocH2>Preprocessor Defines</DocH2>
        <DocP>
          Optional defines you can set <strong>before</strong> including <Code>Evorion.h</Code> to
          customize SDK behavior:
        </DocP>
        <DocTable
          headers={["Define", "Effect"]}
          rows={[
            ["EVORION_SDK_VERSION", "Defined automatically by the header. Use for compile-time version checks."],
            ["EVORION_NO_AUTOLINK", "Disables the #pragma comment(lib, ...) directives. Define this if you link system libraries manually or use a custom build system."],
            ["EVORION_NO_ANTIDEBUG", "Strips all anti-debug code at compile time. Useful for debug builds where you need to attach a debugger."],
            ["EVORION_NO_PROTECT", "Strips all code protection macros (PROTECT, PROTECT_SEH, SPLIT, FLOW) so they compile to nothing."],
            ["EVORION_NO_TLS_CALLBACKS", "Disables TLS callback registration. Define this if you handle TLS callbacks yourself or use a packer that conflicts with them."],
          ]}
        />
        <CodeBlock>{`#ifdef _DEBUG
#define EVORION_NO_ANTIDEBUG
#endif

#define EVORION_NO_AUTOLINK

#include "Evorion.h"`}</CodeBlock>
        <DocP>
          When auto-linking is enabled (default), the SDK automatically links:{" "}
          <Code>winhttp</Code>, <Code>crypt32</Code>, <Code>bcrypt</Code>, <Code>wbemuuid</Code>,{" "}
          <Code>gdiplus</Code>, <Code>ole32</Code>, <Code>ws2_32</Code>, <Code>iphlpapi</Code>.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="full-example">
        <DocH2>Full Example</DocH2>
        <DocP>
          A complete integration with auth mode routing, file download, and user data access:
        </DocP>
        <CodeBlock label="main.cpp — full integration">{`#include "Evorion.h"
#include <iostream>
#include <fstream>

int main() {
    EVORION_CLIENT(client,
        "your-owner-uuid",
        "your-app-uuid",
        "1.0",
        evorion::TransportMode::WebSocket,
        true, 30, 500, true
    );

    if (!client.Initialized()) {
        std::cerr << "init failed: " << client.LastError() << "\\n";
        return 1;
    }

    client.OnPush([](const std::string& type, const std::string& payload) {
        if (type == "kill" || type == "ban")
            ExitProcess(0);
    });

    std::string mode = client.GetAuthMode();
    evorion::Result auth;

    if (mode == "license") {
        std::string key;
        std::cout << "License key: ";
        std::getline(std::cin, key);
        auth = client.License(key);
    } else {
        std::string user, pass;
        std::cout << "Username: "; std::getline(std::cin, user);
        std::cout << "Password: "; std::getline(std::cin, pass);
        auth = client.Login(user, pass);
    }

    if (!auth.ok()) {
        std::cerr << auth.message() << "\\n";
        return 1;
    }

    EVORION_AUTH_PROTECT(client, post_auth)
        auto& u = client.User();
        std::cout << "Welcome " << u.username << " (" << u.subscription << ")\\n";
        std::cout << "Time left: " << u.FormatTimeLeft() << "\\n";

        auto file = client.DownloadFile("YOUR_FILE_ID");
        if (file.ok()) {
            auto bytes = file.FileContents();
            std::ofstream out(file.FileName(), std::ios::binary);
            out.write((const char*)bytes.data(), bytes.size());
            std::cout << "saved " << file.FileName() << "\\n";
        }
    EVORION_PROTECT_DONE(post_auth)

    // sealed payload: server-encrypted blob you uploaded on the dashboard.
    // decrypts into a page-locked wipes-on-scope buffer. use for anything
    // worth stealing that would otherwise sit in the .exe.
    static const auto label = evorion::SecureCredential::FromPlain(ES("secure-config"));
    evorion::Client::SealedBytes sealed;
    if (client.FetchSealed(label, 0, sealed) == evorion::ErrorCode::None) {
        my_loader.consume(sealed.data(), sealed.size());
        sealed.wipe();
    }

    client.Wait();
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="macros">
        <DocH2>Macros</DocH2>
        <DocTable
          headers={["Macro", "Purpose"]}
          rows={[
            ["EVSK(\"str\")", "Compile-time encrypted SecureCredential"],
            ["EVORION_CLIENT(var, owner, app, ver, ...)", "Declares a Client with an EVSK-encrypted owner id"],
            ["EVORION_AUTH_PROTECT(client, name) / PROTECT_DONE(name)", "Auth-verified block: _evr_vc gate at entry, fail-closed on invalid session"],
            ["EVORION_LOCKED_INT / _UINT / _INT64(client, name, value)", "Auth-gated constant. .load() returns zero on invalid session"],
            ["EVORION_DYNAPI(dll, api)", "Dynamic API resolution via PEB walk (no IAT entry)"],
            ["EVORION_REQUIRE_AUTH(client)", "Inline check. Returns Client::Authenticated()"],
            ["client.FetchSealed(label, revision, out)", "Fetch a server-encrypted blob into a wipes-on-scope SealedBytes buffer"],
            ["evorion::session::bind_key(auth, label, len, out)", "Derive a 32-byte per-purpose key from the authenticated session"],
            ["evorion::session::compute_hmac(auth, data, len, out)", "Raw HMAC-SHA256 over data under the session-bound key"],
            ["SecureStr(\"str\")", "Compile-time + runtime encrypted string"],
            ["WSecureStr(L\"str\")", "Wide-char compile-time + runtime encrypted string"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="changelog">
        <DocH2>Changelog</DocH2>

        <DocH3>v3.1.0 <span className="text-text-faint text-[12px] font-normal ml-2">Latest</span></DocH3>
        <DocUl
          items={[
            "Renamed plan tiers in dashboard: Platinum is now Pro, Obsidian is now Ultra (no schema changes — your existing licenses, API keys, and SDK behavior are unaffected)",
            "Unified security panel on the developer dashboard — single coverage view instead of per-protection breakdown",
            "Fixed broadcast notification delivery (developer-wide notices)",
            "Fixed sparkline chart rendering at line endpoints",
            "Pie charts now render an empty placeholder when underlying data has no recent activity",
            "Theme toggle no longer renders twice on the landing page",
            "Security cap UI is correctly suppressed for Ultra tier (unlimited)",
          ]}
        />

        <DocH3>v2.9.8</DocH3>
        <DocUl
          items={[
            "Added Developer REST API with scoped API keys",
            "Added seller/reseller system with balance tracking",
            "Added abuse detection and alerting",
            "Added subscription tier management via API",
            "Runtime protection macros overhauled. See Code Protection section for current primitives (EVORION_AUTH_PROTECT, EVORION_LOCKED_INT, EVORION_DYNAPI, SecureStr, sealed payloads, session::bind_key).",
          ]}
        />

        <DocH3>v2.9.7</DocH3>
        <DocUl
          items={[
            "Added DownloadFile(file_id) for encrypted file delivery",
            "Added Result::FileContents() and Result::FileName()",
            "Improved anti-tamper mesh integrity checks",
            "Performance: parallelized security checks on init",
          ]}
        />

        <DocH3>v2.9.5</DocH3>
        <DocUl
          items={[
            "WebSocket transport mode with server push support",
            "Capability-token based authorization flow",
            "DPoP proof-of-possession for request signing",
            "Remote attestation challenge/response system",
          ]}
        />

        <DocH3>v2.9.0</DocH3>
        <DocUl
          items={[
            "Auth mode enforcement (license, user_pass, both)",
            "Automatic heartbeat and anti-debug via constructor",
            "SecureCredential and EVSK() macro for compile-time encryption",
          ]}
        />
      </DocSection>
    </>
  );
}

export { ManagementSections };
