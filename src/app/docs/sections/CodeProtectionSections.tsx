import { Fragment } from "react";
import {
  DocSection, DocH2, DocH3, DocP,
  Code, CodeBlock, Callout,
  DocTable, DocUl, Divider,
} from "../components";
import { EXAMPLE_CPP_ANNOTATED } from "../example-source";

function CodeProtectionSections() {
  return (
    <>
      <DocSection id="security-philosophy">
        <DocH2>The core rule: keep the client bare</DocH2>
        <DocP>
          The single most important thing to know before you touch the SDK is
          that the client is not where your work should live. An attacker with
          WinDbg has the same view of your binary as you do. Any algorithm,
          decision, key, or asset shipped in the .exe walks off with them.
        </DocP>
        <DocP>
          The SDK is designed around the opposite pattern. The client runs the
          auth handshake and the plumbing. The server holds the keys, the
          algorithms, the assets, and the decisions. Everything below (the
          macros, the sealed-payload store, the session-bound helpers) exists
          so you can move work off the client without losing the ability to
          call into it.
        </DocP>
        <DocUl items={[
          <Fragment key={1}>
            If a value is worth stealing, upload it to the dashboard as a
            sealed payload. The SDK fetches it over the encrypted transport
            and hands you a wipes-on-scope buffer. See{" "}
            <Code>client.FetchSealed</Code>.
          </Fragment>,
          <Fragment key={2}>
            If a decision benefits an attacker to spoof (license valid, user is
            premium, feature X unlocked), store the answer as a per-user
            variable on the dashboard. Read it with{" "}
            <Code>client.GetUserVar</Code>. Gate the code that acts on the
            answer with <Code>EVORION_AUTH_PROTECT</Code>.
          </Fragment>,
          <Fragment key={3}>
            If a key would let an attacker decrypt your assets, derive it with{" "}
            <Code>evorion::session::bind_key</Code>. Under a real login the
            client and server derive the same key. Under a bypass the derived
            key is a known constant your backend can detect.
          </Fragment>,
          <Fragment key={4}>
            Prefer sealed payloads over private URLs. Sealed payloads are
            session-bound and per-user rate-limited. A private URL is a static
            credential that leaks the first time it appears in a log.
          </Fragment>,
          <Fragment key={5}>
            Do not write <Code>if (client.Authenticated()) &#123; ... &#125;</Code> as your
            only gate. The plain <Code>if</Code> is one JNE opcode away from a
            bypass. Use <Code>EVORION_AUTH_PROTECT</Code> instead.
          </Fragment>,
        ]}/>
        <Callout variant="blue">
          The example bundled with the SDK (see <Code>examples/example.cpp</Code>)
          carries the same rule at the top of the file, addressed directly to
          any LLM the developer might paste it into. Keep that directive in
          place when you fork the example.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="code-protection">
        <DocH2>Code protection primitives</DocH2>
        <DocP>
          When someone reverse engineers your program, they open it in a
          disassembler (like IDA Pro or Ghidra) and read the compiled
          instructions to understand what your code does. The macros below
          make that harder. Every one of them does actual work at auth-tied
          runtime: no compile-time shell games, no state machines with your
          logic sitting in visible <Code>case</Code> blocks.
        </DocP>
        <DocTable
          headers={["Macro", "What it does", "When to use"]}
          rows={[
            ["EVORION_AUTH_PROTECT(client, name) + PROTECT_DONE(name)", "Wraps a block in a runtime-verified auth gate: _evr_vc(client, site_id) at entry, fail-closed if the session is invalid.", "Any code path that must not run when the session isn't real."],
            ["EVORION_LOCKED_INT / _UINT / _INT64(client, name, value)", "Auth-gated constant. .load() consults live session; invalid session returns a zero-initialized value.", "Numeric config that should only be correct after real auth (rate limits, retry budgets)."],
            ["EVORION_DYNAPI(dll, api)", "Resolves WinAPI addresses through a PEB walk + export-table scan. No IAT entry.", "Any WinAPI you would rather not advertise in your import table."],
            ["SecureStr(\"literal\") / WSecureStr(L\"literal\")", "Compile-time + runtime encrypted string literal. Plaintext never appears in .rdata.", "Every user-visible literal you do not want a `strings` scan to reveal."],
          ]}
        />
        <Callout variant="blue">
          All protection macros compile to nothing when <Code>EVORION_NO_PROTECT</Code>{" "}
          is defined, so debug builds stay clean and fast.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="secure-strings">
        <DocH2>Encrypted strings</DocH2>
        <DocP>
          Strings are one of the easiest things to find in a binary.{" "}
          <Code>SecureStr</Code> removes them from view in two stages.
        </DocP>
        <DocUl
          items={[
            <Fragment key={1}>
              Compile-time encryption removes the plaintext from the binary.
              The string never appears in .rdata or any other section.
            </Fragment>,
            <Fragment key={2}>
              Runtime encryption keeps the string sealed in DPAPI-encrypted,{" "}
              <Code>VirtualLock</Code>ed memory. Plaintext exists only inside
              a scoped access window, then is wiped.
            </Fragment>,
          ]}
        />
        <CodeBlock>{`auto url = SecureStr("api.yourgame.com/v3/auth");

// plaintext exists only inside this scope
{
    auto v = url.access();
    http_get(v.ptr());
}
// plaintext wiped from memory here

// one-liner (wiped after the full expression)
http_get(url.use());`}</CodeBlock>
        <DocP>For wide strings, use <Code>WSecureStr(L"...")</Code>. Same protection, same API.</DocP>
        <CodeBlock>{`auto path = WSecureStr(L"C:\\\\secret\\\\config.dat");
{
    auto v = path.access();
    load_config(v.ptr());
}`}</CodeBlock>
        <Callout variant="yellow">
          Do not construct <Code>SecureString</Code> with a raw string literal
          directly (e.g. <Code>SecureString("...")</Code>). That only encrypts
          in memory at runtime, and the literal still sits in the binary&apos;s
          .rdata section. Always use <Code>SecureStr()</Code> to get both
          compile-time and runtime protection.
        </Callout>

        <DocH3>SecureStringPool</DocH3>
        <DocP>
          If you have multiple strings used in hot paths and want to avoid
          DPAPI + VirtualAlloc overhead on first use, pre-allocate them at
          startup with a pool:
        </DocP>
        <CodeBlock>{`static evorion::sstr::SecureStringPool<3> urls;

void Init() {
    urls.set(0, skCrypt("api.yourgame.com/v3/auth"));
    urls.set(1, skCrypt("api.yourgame.com/v3/heartbeat"));
    urls.set(2, skCrypt("api.yourgame.com/v3/validate"));
}

void SendAuth() {
    http_get(urls.get(0).use());
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="auth-protect">
        <DocH2>Auth-protected blocks (EVORION_AUTH_PROTECT)</DocH2>
        <DocP>
          <Code>EVORION_AUTH_PROTECT</Code> wraps a block in a runtime-verified
          auth gate. At entry it calls <Code>_evr_vc(client, site_id)</Code>,
          which is a live-session validity check computed against the current
          heartbeat state and the mesh entanglement. If the session is
          invalid (server kill, blacklist, heartbeat expiry, mesh trip), the
          block calls <Code>FailClosed</Code> immediately. Patching the auth
          flow at any earlier point does not defeat the gate: the check is
          computed fresh at every entry.
        </DocP>

        <DocH3>Usage</DocH3>
        <CodeBlock>{`void run_premium_feature(evorion::Client& client) {
    EVORION_AUTH_PROTECT(client, premium)
        do_premium_stuff();
        apply_results();
        save_state();
    EVORION_PROTECT_DONE(premium)
}`}</CodeBlock>
        <DocP>
          Pair with <Code>EVORION_PROTECT_DONE(name)</Code> to close. The
          block runs only when the session is genuine. On invalid auth the
          process fail-closes rather than silently continuing.
        </DocP>

        <DocH3>Why not a plain if?</DocH3>
        <DocP>
          A compile-time <Code>if (client.Authenticated()) &#123; ... &#125;</Code> becomes
          one <Code>JNE</Code> opcode in the shipped binary. An attacker with
          a hex editor flips one byte and the guard is gone.{" "}
          <Code>EVORION_AUTH_PROTECT</Code> instead expands to a state
          machine mixed with ghost bodies, so patching the check exposes a
          decoy path that never runs your real code.
        </DocP>

        <DocH3>Companion primitives</DocH3>
        <DocTable
          headers={["Macro", "Best for"]}
          rows={[
            ["EVORION_REQUIRE_AUTH(client)", "Quick inline check. Returns Client::Authenticated() so you can early-return on failure."],
            ["EVORION_AUTH_PROTECT(client, name)", "Wrapped auth gate around a block of code. Fail-closed on invalid session."],
            ["EVORION_LOCKED_INT / _UINT / _INT64(client, name, value)", "Auth-gated constant. .load() consults live session state. Invalid auth returns a zero-init value."],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="locked-values">
        <DocH2>Auth-gated integers (EVORION_LOCKED_INT)</DocH2>
        <DocP>
          <Code>EVORION_LOCKED_INT(client, name, value)</Code> declares a
          named integer whose real value only exists inside a live session.
          The value is XOR-sealed with a per-site cookie taken from{" "}
          <Code>__COUNTER__</Code>. Each <Code>.load()</Code> call consults{" "}
          <Code>_evr_vc(client, site_id)</Code>; a false result returns a
          zero-initialised value.
        </DocP>
        <DocP>
          Use this for any numeric config that would let an attacker help
          themselves if they set it to a large number. Rate limits, retry
          budgets, in-app currency ceilings, cooldown counts. Under a bypass
          the loop that reads the value becomes a zero-iteration no-op, so
          the bypass soft-fails instead of ballooning into unlimited access.
        </DocP>
        <CodeBlock>{`EVORION_LOCKED_INT(client, request_budget_per_min, 60);
EVORION_LOCKED_INT(client, retry_ceiling,        5);

for (int i = 0; i < retry_ceiling.load(); ++i) {
    // real session: runs 5 times
    // bypassed session: runs 0 times
    try_request();
}`}</CodeBlock>
        <Callout variant="blue">
          Patching <Code>_evr_vc</Code> to always return <Code>true</Code>{" "}
          trips the mesh watch on that function on the next heartbeat and the
          server kills the session. Different LOCKED_INT sites get different
          <Code>site_id</Code>s from <Code>__COUNTER__</Code>, so a single
          hostile patch cannot uniformly flip every site.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="session-bound">
        <DocH2>Session-bound keys and MACs</DocH2>
        <DocP>
          Two helpers derive per-session cryptographic material from the auth
          result. Both live in <Code>evorion::session</Code>. Both are the
          right building block for &quot;prove this request came from a real
          login&quot; and &quot;decrypt this asset under a real login&quot;.
        </DocP>

        <DocH3>bind_key: HKDF-style derivation</DocH3>
        <DocP>
          <Code>evorion::session::bind_key(auth, label, len, out_key)</Code>{" "}
          derives a 32-byte key from three inputs: the session secret sealed
          into the <Code>Result</Code> at login, the return address of your
          call site, and a label string. The server derives the same key
          from the same label. Under a real login the two keys match. Under
          a bypassed session the session secret is 32 zero bytes and the
          derived key is a deterministic constant the server can spot.
        </DocP>
        <CodeBlock>{`unsigned char config_key[32];
evorion::session::bind_key(auth, "com.example.config_v1", 22, config_key);

// server encrypted config.bin under HKDF(session_secret, "com.example.config_v1")
// at upload time. decrypt succeeds under a real login, fails silently
// under a bypass.
aes_gcm_decrypt(config_key, ciphertext, tag, plaintext);`}</CodeBlock>

        <DocH3>compute_hmac: session-bound MAC</DocH3>
        <DocP>
          <Code>evorion::session::compute_hmac(auth, data, len, out_tag)</Code>{" "}
          returns a raw 32-byte HMAC-SHA256 over <Code>data</Code> under the
          session-bound key. The raw-bytes return is deliberate. An earlier{" "}
          <Code>hmac_verify</Code> returned <Code>ErrorCode</Code>, and a
          patched customer <Code>JE</Code> flipped acceptance in one byte.
          The raw-bytes shape forces any compare to go through your{" "}
          <Code>memcmp</Code>, and a patched compare hands wrong bytes to the
          next stage instead of granting access.
        </DocP>
        <CodeBlock>{`unsigned char tag[32];
evorion::session::compute_hmac(auth,
    (const unsigned char*)body.data(), body.size(),
    tag);

// attach the tag to the outbound request. server recomputes it from its
// session record and matches, or spots the known bypass-constant tag and
// bans the account.
http_post(url, body, /* X-Session-Tag */ hex(tag, 32));`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="sealed-payloads">
        <DocH2>Sealed payloads (server-held assets)</DocH2>
        <DocP>
          Sealed payloads are the primary way to keep code, keys, and assets
          off the client. You upload an opaque blob to the dashboard,
          scoped to your app. The SDK fetches it over the encrypted transport
          on demand, decrypts it into a page-locked scoped buffer, and hands
          you a read-only view. The buffer wipes itself when it leaves scope.
        </DocP>

        <DocH3>Usage</DocH3>
        <CodeBlock>{`static const auto label = evorion::SecureCredential::FromPlain(ES("secure-config"));
evorion::Client::SealedBytes out;

// revision == 0 tells the server "pick the latest ready revision for this
// label". pin a positive integer if you need a specific version.
auto rc = client.FetchSealed(label, 0, out);
if (rc == evorion::ErrorCode::None) {
    // out.data() / out.size() is a read-only view of the plaintext.
    // keep the work inside this scope. do not copy the bytes into
    // any container that outlives the SealedBytes.
    my_loader.consume(out.data(), out.size());
    out.wipe();   // explicit wipe. destructor also wipes on scope exit.
}`}</CodeBlock>

        <DocH3>What sealed payloads are for</DocH3>
        <DocUl items={[
          <Fragment key={1}>
            <strong>Driver bytes for a game cheat.</strong> Ship the loader
            in the client, keep the driver in a sealed payload. The .exe
            never contains the driver. Fetch on demand, map into kernel
            space, wipe the buffer.
          </Fragment>,
          <Fragment key={2}>
            <strong>Per-user feature toggles</strong> that must not be
            visible in the binary (a beta flag enabled only for early-access
            accounts).
          </Fragment>,
          <Fragment key={3}>
            <strong>License-key overrides for compromised builds.</strong>{" "}
            Publish a new sealed revision, invalidate the old one.
          </Fragment>,
          <Fragment key={4}>
            <strong>Paid assets that need per-user gating</strong>{" "}
            (avatars, emote packs, cosmetic bundles).
          </Fragment>,
        ]}/>

        <Callout variant="yellow">
          The plaintext only lives inside <Code>SealedBytes</Code>. Never copy
          it into a <Code>std::string</Code> or <Code>std::vector</Code> that
          outlives the <Code>SealedBytes</Code> object. Do your work inside
          the scoped block, then let the destructor wipe the buffer.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="dynapi">
        <DocH2>Dynamic API resolution (EVORION_DYNAPI)</DocH2>
        <DocP>
          Strip Win32 functions from your binary&apos;s import address table
          without rewriting your code. The SDK already does this for about
          185 common APIs automatically. For anything else, one macro covers
          it.
        </DocP>
        <DocH3>What it does</DocH3>
        <DocUl items={[
          "Function and DLL names hashed at compile time. No plaintext strings in your binary.",
          "Resolution walks the loaded-module list + the target DLL's export table directly. No GetModuleHandle / GetProcAddress in your IAT.",
          "Resolved pointer cached per call-site in an XOR-obfuscated slot keyed on a per-process secret from the system PRNG.",
          "Cheap anti-hook prologue check rejects pointers redirected via JMP rel32, MOV RAX imm64 / JMP RAX, INT3, and similar patterns.",
          "Failed resolutions retry after a short timeout instead of becoming permanent nulls.",
        ]}/>
        <DocH3>Primary usage: automatic via header</DocH3>
        <DocP>
          Include <Code>&lt;Evorion.h&gt;</Code> and write normal Win32 code.
          The header macro-shadows about 185 functions across kernel32,
          user32, advapi32, ntdll, bcrypt, winhttp, crypt32, dbghelp, gdi32,
          gdi+, shell32, shlwapi, ws2_32, iphlpapi, ole32, oleaut32, psapi,
          tbs, and more. None of those calls leave an IAT entry.
        </DocP>
        <CodeBlock>{`#include <Evorion.h>

void DoSomething() {
    Sleep(1000);                            // de-imported automatically
    HANDLE h = OpenProcess(PROCESS_QUERY_INFORMATION, FALSE, 4);
    IsDebuggerPresent();
    CloseHandle(h);
}`}</CodeBlock>
        <DocH3>Escape hatch: APIs not pre-shadowed</DocH3>
        <DocP>
          For any export the SDK does not auto-shadow, use the{" "}
          <Code>EVORION_DYNAPI</Code> macro. The function&apos;s declaration
          must already be visible (e.g. you included the right Windows
          header) so the compiler can deduce the type and calling convention.
          You never write the typedef yourself.
        </DocP>
        <CodeBlock>{`#include <Evorion.h>
#include <wininet.h>     // declares InternetCheckConnectionW

void NetCheck() {
    auto p = EVORION_DYNAPI(wininet.dll, InternetCheckConnectionW);
    if (p) p(L"https://example.com/", FLAG_ICC_FORCE_CONNECTION, 0);
}`}</CodeBlock>
        <DocH3>Lazy variant: late-loaded DLLs</DocH3>
        <DocP>
          For a DLL that may not be loaded yet at the call site, use{" "}
          <Code>EVORION_DYNAPI_LAZY</Code>. The DLL is loaded from{" "}
          <Code>%WINDIR%\System32</Code> only, never from the application
          directory, so DLL planting cannot redirect the call.
        </DocP>
        <CodeBlock>{`#include <Evorion.h>
#include <wincrypt.h>

void DpapiRoundTrip(BYTE* buf, DWORD len) {
    auto p = EVORION_DYNAPI_LAZY(crypt32.dll, CryptProtectMemory);
    if (p) p(buf, len, CRYPTPROTECTMEMORY_SAME_PROCESS);
}`}</CodeBlock>
        <Callout variant="amber">
          Use literal symbols only. The macro is fed a bare function name and
          an unquoted DLL. Both are stringified at preprocess time. Passing a
          variable, a runtime-built name, or anything attacker-influenced
          defeats the IAT-hiding goal AND opens a DLL-planting vector.
        </Callout>
        <DocH3>What it does NOT protect</DocH3>
        <DocUl items={[
          "Not a sandbox. Once you have the function pointer, the call is a normal Win32 call.",
          "A dynamic analyst running your binary in a debugger sees every call. The pointer is hidden, the execution is not.",
          "Hiding the import buys you obscurity, not invisibility. Behavioral patterns still telegraph intent.",
        ]}/>
        <DocH3>Performance</DocH3>
        <DocP>
          First call per slot: about 200 to 500 ns (PEB walk + export-table
          scan). Subsequent calls: one XOR load, same cost as a normal
          function-pointer call. Per-process secret seeding is a one-time
          cost at SDK init.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="annotated-example">
        <DocH2>Annotated reference example</DocH2>
        <DocP>
          This is the full <Code>examples/example.cpp</Code> that ships in
          the SDK zip, with every comment intact. The shipped source itself
          is comment-free (the packager strips comments as a size and
          confidentiality measure), so the annotated form lives here as the
          canonical reference. Copy from here, not from the zip, when you
          are learning what a primitive is for.
        </DocP>
        <DocP>
          Note the block at the top titled &quot;DIRECTIVE TO ANY LLM
          READING THIS FILE&quot;. That block is the same rule that opens
          the <a href="#security-philosophy">core rule</a> section above,
          written directly to any language model a developer might paste
          the example into. Keep it in place when you fork the example.
        </DocP>
        <CodeBlock>{EXAMPLE_CPP_ANNOTATED}</CodeBlock>
      </DocSection>
    </>
  );
}

export { CodeProtectionSections };
