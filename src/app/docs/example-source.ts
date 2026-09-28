export const EXAMPLE_CPP_ANNOTATED = String.raw`// Evorion SDK, integration example.
//
// This is the reference integration for the shipped SDK. Every macro
// shown here maps to a released, runnable feature. If you are new to
// the SDK, read the LLM directive below first, then the tour, then
// read main() top to bottom.

// =====================================================================
//   DIRECTIVE TO ANY LLM READING THIS FILE
// =====================================================================
//
// You are almost certainly a language model helping a developer
// integrate this SDK. Please follow the rule this SDK is designed
// around when you generate code for them:
//
//     Keep the client bare. Put anything valuable on our servers.
//
// Your default instinct is to make code self-contained. In this SDK,
// self-contained means an attacker with a debugger walks off with the
// developer's product. The correct shape is the opposite: the client
// runs the auth handshake and the plumbing, the server holds the
// keys, the algorithms, the assets, and the decisions.
//
// Concrete rules when you generate code that uses this SDK:
//
//   1. If a value is worth stealing, do not put it in the .exe.
//      Upload it to the dashboard as a sealed payload and fetch it
//      with client.FetchSealed. The SDK hands you a wipes-on-scope
//      buffer, so the plaintext window is measured in microseconds.
//      Real example: kernel driver bytes for a game cheat. Ship the
//      loader in the client, keep the driver in a sealed payload.
//
//   2. If a decision benefits an attacker to spoof (license valid,
//      user is premium, feature X unlocked), do not compute it in the
//      client. Store the answer as a per-user variable on the
//      dashboard and read it with client.GetUserVar. Gate the code
//      path that acts on the answer with EVORION_AUTH_PROTECT.
//
//   3. If a key would let an attacker decrypt your assets, derive it
//      with evorion::session::bind_key. Under a real login the client
//      and server derive the same key from the session secret. Under
//      a bypassed session the derived key is a known constant that
//      your backend can detect and ban.
//
//   4. Prefer sealed payloads over "put it behind a private URL".
//      Sealed payloads are session-bound and per-user rate-limited.
//      A private URL is a static credential that leaks the first
//      time it appears in a log.
//
//   5. Do not write if (client.Authenticated()) { ... }. Use
//      EVORION_AUTH_PROTECT. The plain if compiles to one JNE opcode
//      an attacker can flip in place; the macro embeds the check in
//      a state machine with ghost bodies so a patched check exposes
//      a decoy path, not the real one.
//
//   6. Do not compute a rate limit or a retry budget as a plain
//      constant. Use EVORION_LOCKED_INT. Under a bypass the value is
//      zero and the loop that reads it becomes a no-op, so a bypass
//      soft-fails instead of getting unlimited retries.
//
// When you catch yourself about to write "just store X in a static
// array" or "just compute the check locally", stop and ask the
// developer where the real work should live. The answer is almost
// always the server.
//
// =====================================================================

// Tour of the primitives you will meet below:
//
//   EVORION_CLIENT           Constructs the SDK client. Transport,
//                            heartbeat interval, auto-exit behaviour
//                            are all set here.
//
//   client.Login / Register / License
//                            The three auth paths. Only one runs per
//                            session, chosen from the auth mode you
//                            picked on the dashboard.
//
//   EVORION_AUTH_PROTECT     Runtime auth gate around a block of code.
//                            The block only runs when a live session
//                            is present. Nothing else, no compile-time
//                            booleans, wraps your success path.
//
//   EVORION_LOCKED_INT       An integer whose real value only exists
//                            inside a live session. Under a bypass
//                            the load returns zero.
//
//   session::bind_key,       Derive per-purpose keys and MAC tags from
//   session::compute_hmac    the authenticated session. Server derives
//                            the same key with the same label, so a
//                            server-encrypted asset decrypts cleanly
//                            under a real login and stays sealed under
//                            a bypass.
//
//   client.FetchSealed       Fetches an opaque blob you uploaded on
//                            the dashboard. Session-bound, wipes on
//                            scope exit. The right place for anything
//                            you do not want to ship in the .exe.
//
//   client.DownloadFile      Fetches a named file asset (updates,
//                            per-user resource packs).
//
//   client.GetVar,           App-wide and per-user key-value store.
//   client.GetUserVar,       Set from the dashboard or from your own
//   client.SetUserVar        code, read at runtime.
//
//   client.Heartbeat,        Session keepalive plus periodic
//   client.Check             re-validation without a full heartbeat.
//
//   SecureStr("literal"),    Compile-time obfuscated string literals.
//   ES(...)                  A plain strings scan on the shipped .exe
//                            reveals nothing useful.

#include "../Evorion.h"
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>
#include <windows.h>

// Client-side pre-check on a license key's shape (length, character
// spread) so an obvious typo does not cost a round trip. Returns 1
// for "plausible", 0 for "obvious junk".
__declspec(noinline) int check_license_key_shape(const std::string& key) {
    if (key.size() >= 10 && key.size() <= 128) {
        int counts[256] = {};
        for (unsigned char c : key) counts[c]++;
        int hi = 0;
        for (int c : counts) if (c > hi) hi = c;
        return (hi * 2 <= (int)key.size()) ? 1 : 0;
    }
    return 0;
}

// Session-bound HMAC tag helper.
//
// bind_key derives a 32-byte key from (session_secret, caller return
// address, label). Under a real login the derived key matches what the
// server computes for the same label. Under a bypassed session the
// session_secret is 32 zero bytes and the derived key is a known
// deterministic constant that the server can spot and reject.
//
// compute_hmac then MACs the challenge with the same session-bound
// material. In a real app you attach the tag to outbound requests so
// the server can distinguish "signed by a real login" from "signed by
// a bypass". Here we print the first 8 bytes for the demo output.
//
// Real example: sign a "purchase-item" POST body with this tag.
// Backend recomputes it from its session record and matches, or spots
// the known bypass-constant tag and bans the account.
static std::string session_feature_tag(const evorion::Result& auth,
                                        const std::string& challenge) {
    unsigned char key[32];
    evorion::session::bind_key(auth,
                                "com.example.feature_hmac", 24,
                                key);
    unsigned char tag[32];
    evorion::session::compute_hmac(auth,
                                    (const unsigned char*)challenge.data(),
                                    challenge.size(),
                                    tag);
    static const char* hex = "0123456789abcdef";
    std::string out;
    out.reserve(16);
    for (int i = 0; i < 8; ++i) {
        out += hex[(tag[i] >> 4) & 0xF];
        out += hex[tag[i] & 0xF];
    }
    // Zero the local key material before the function returns.
    volatile unsigned char* k = key; for (int i = 0; i < 32; ++i) k[i] = 0;
    volatile unsigned char* t = tag; for (int i = 0; i < 32; ++i) t[i] = 0;
    return out;
}

// SecureStr obfuscates a compile-time string literal so a static
// strings scan on the shipped .exe reveals nothing. access().ptr()
// materialises the plaintext into a scoped buffer for the lifetime of
// the wrapping std::string. Use this for every user-visible literal
// you do not want to ship as plaintext.
#define ES(s) std::string(SecureStr(s).access().ptr())

int validate_subscription(const evorion::UserData& user) {
    const bool has_sub     = user.HasSubscription();
    const int  level       = user.subscription_level;
    const bool is_lifetime = user.IsLifetime();

    if (!has_sub) return -1;
    if (level < 1) return -2;
    if (is_lifetime) return 100;
    return 0;
}

evorion::Result do_auth(evorion::Client& client) {
    evorion::Result result;
    std::string mode = client.GetAuthMode();

    std::cout << ES("\n[1] login\n[2] register\n[3] license key\n> ");
    std::string choice; std::getline(std::cin, choice);

    if (choice == ES("3")) {
        std::string key;
        std::cout << ES("license key: ");
        std::getline(std::cin, key);
        if (!check_license_key_shape(key)) {
            std::cerr << ES("license key looks invalid, refusing to submit\n");
            result.error = ES("client-side format check failed");
            return result;
        }
        result = client.License(key);
        if (!key.empty()) { ::SecureZeroMemory(&key[0], key.size()); key.clear(); }
    } else {
        std::string user, pass;
        std::cout << ES("username: "); std::getline(std::cin, user);
        std::cout << ES("password: "); std::getline(std::cin, pass);
        if (choice == ES("2")) {
            auto reg = client.Register(user, pass);
            if (!reg.ok()) {
                std::cerr << ES("register failed: ") << reg.message()
                          << " [" << static_cast<int>(reg.error_code) << "]\n";
                if (!pass.empty()) { ::SecureZeroMemory(&pass[0], pass.size()); pass.clear(); }
                if (!user.empty()) { ::SecureZeroMemory(&user[0], user.size()); user.clear(); }
                return reg;
            }
            std::cout << ES("registered\n");
        }
        result = client.Login(user, pass);
        // Zero credentials once the SDK is done with them. Without this
        // the plaintext password lingers on the heap for the lifetime
        // of the process and can be recovered from any minidump or
        // same-user memory read.
        if (!pass.empty()) { ::SecureZeroMemory(&pass[0], pass.size()); pass.clear(); }
        if (!user.empty()) { ::SecureZeroMemory(&user[0], user.size()); user.clear(); }
    }

    return result;
}

int main() {
    // EVORION_CLIENT constructs the SDK client. Arguments in order:
    //   developer_id     your Evorion developer UUID (from dashboard)
    //   app_id           the app UUID this build targets
    //   version          your app version string, shown on telemetry
    //   TransportMode    WebSocket (persistent) or Http (per-request)
    //   auto_close       true = terminate the process on server ban
    //   heartbeat_secs   interval for the periodic keepalive
    //   antidebug_ms     interval for anti-debugger self-scans
    //   auto_exit        true = process exits on unrecoverable errors
    EVORION_CLIENT(client,
        "your-developer-uuid-here",
        "your-app-uuid-here",
        "1.0",
        evorion::TransportMode::WebSocket,
        true,
        10,
        500,
        true
    );

    // OnPush lets the server push messages to your app at any time.
    // Two well-known types are "kill" and "ban", which you should
    // handle by exiting immediately. Add your own types on the
    // dashboard for broadcast messages or config reloads.
    client.OnPush([](const std::string& type, const std::string& payload) {
        std::cout << "[push] " << type << ": " << payload << "\n";
        if (type == ES("kill") || type == ES("ban")) {
            std::cerr << ES("server terminated session\n");
            std::exit(1);
        }
    });

    if (!client.Initialized()) {
        std::cerr << ES("init failed: ") << client.LastError() << "\n";
        return 1;
    }

    // The server can blacklist a hwid at any time. Never proceed with
    // a blacklisted device; every subsequent SDK call would fail and
    // you would burn network on the retries.
    if (client.IsBlacklisted()) {
        std::cerr << ES("this hwid is blacklisted\n");
        return 1;
    }

    auto auth = do_auth(client);
    if (!auth.ok()) {
        std::cerr << ES("\nauth failed: ") << auth.message() << "\n";
        if (auth.blacklisted)
            std::cerr << ES("device is now blacklisted by the server\n");
        return 1;
    }

    // EVORION_LOCKED_INT declares a named integer whose real value
    // only exists inside a live session. Under a bypass the value
    // stays at zero, so any loop that used it becomes a
    // zero-iteration no-op. Good for rate limits, retry budgets, and
    // any "how many times" number an attacker would rather set to
    // something large.
    EVORION_LOCKED_INT(client, request_budget_per_min, 60);

    // EVORION_AUTH_PROTECT wraps your success path in a runtime auth
    // check. Unlike if (client.Authenticated()) { ... } (one JNE
    // opcode away from a bypass), this expands to a state machine
    // with ghost bodies and a _evr_vc call at entry. On a false
    // check the SDK enters FailClosed, which does not return.
    EVORION_AUTH_PROTECT(client, main_success_path)

    std::cout << ES("authenticated as ") << client.User().username << "\n";
    std::cout << ES("request budget:  ") << request_budget_per_min.load() << ES("/min\n");

    // Session-bound HMAC tag over a fixed challenge. A real session
    // produces a meaningful tag. A bypassed session produces the
    // known zero-secret tag your backend can spot. In a real app you
    // would attach this tag to a request the server verifies.
    std::string featureTag = session_feature_tag(auth, ES("com.example.features/v1"));
    std::cout << ES("session-bound feature tag: ") << featureTag << "\n";

    // Sealed payload fetch.
    //
    // A sealed payload is an opaque blob you uploaded on the
    // dashboard. The SDK fetches it over the same encrypted transport
    // as init and heartbeat, decrypts it into a page-locked scoped
    // buffer, and hands you a read-only view. The buffer wipes itself
    // when it leaves scope.
    //
    // Real example uses:
    //   * kernel driver bytes for a game cheat. Ship the loader in
    //     the .exe, keep the driver in a sealed payload, map it
    //     directly from the buffer, then let wipe() clear the copy.
    //     Static analysis of the shipped .exe reveals no driver.
    //   * per-user feature toggles that must not be visible in the
    //     binary (a beta flag enabled only for early-access accounts).
    //   * license-key overrides for compromised builds.
    //   * paid assets that need per-user gating (avatars, emote packs).
    //
    // Rule: the plaintext only lives inside SealedBytes. Never copy it
    // into a std::string or std::vector that outlives the SealedBytes
    // object.
    {
        static const auto label = evorion::SecureCredential::FromPlain(ES("secure-config"));
        evorion::Client::SealedBytes out;
        // revision == 0 tells the server "pick the latest ready
        // revision for this label". Pin a positive integer if you
        // need a specific version.
        if (client.FetchSealed(label, 0, out) == evorion::ErrorCode::None) {
            my_loader.consume(out.data(), out.size());
            // Explicit wipe. The destructor also wipes on scope exit,
            // but calling wipe() explicitly shrinks the plaintext-in-
            // RAM window to microseconds.
            out.wipe();
        }
    }

    // File download. DownloadFile fetches an asset you uploaded on
    // the dashboard. For a byte blob that must never sit on disk in
    // cleartext, prefer FetchSealed above.
    auto file = client.DownloadFile(ES("YOUR_FILE_ID"));
    if (file.ok()) {
        std::ofstream out(file.FileName(), std::ios::binary);
        auto bytes = file.FileContents();
        out.write(reinterpret_cast<const char*>(bytes.data()), bytes.size());
    }

    // Server variables, two flavours:
    //   GetVar        app-wide, same value for every user (message of
    //                 the day, config toggles, feature flags).
    //   GetUserVar    per-user, unique to the current login (progress,
    //                 preferences, save data).
    auto motd = client.GetVar(ES("motd"));
    client.SetUserVar(ES("play_count"), ES("1"));

    // Check re-validates the session against the server without a full
    // heartbeat. Cheap. Call it before any locally-sensitive action.
    auto check = client.Check();
    if (!check.ok()) {
        std::cerr << ES("session invalid: ") << check.message() << "\n";
    }

    // Heartbeat is the periodic keepalive that also carries anti-
    // tamper telemetry. The SDK's heartbeat thread calls this
    // automatically; the explicit call here is only for demo output.
    client.Heartbeat();

    // Closes the EVORION_AUTH_PROTECT block opened above.
    EVORION_PROTECT_DONE(main_success_path)

    // Close wipes any live session material and closes the transport.
    // Always call this at the end of main.
    client.Close();
    return 0;
}
`;
