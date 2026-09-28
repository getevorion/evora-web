import { Fragment } from "react";
import {
  DocSection, DocH2, DocH3, DocP,
  Code, CodeBlock, Callout,
  DocTable, DocUl, Divider,
} from "../components";

function SecurityNoticeSections() {
  return (
    <>
      <DocSection id="security-notice-overview">
        <DocH2>Security Notice — Read Before Shipping</DocH2>
        <Callout variant="amber">
          The Evorion SDK protects what it sees. Everything in your loader&apos;s <Code>.text</Code>{" "}
          that doesn&apos;t flow through the SDK is your responsibility. The recipes below are the
          difference between &quot;cracked in 2 bytes&quot; and &quot;weeks of work per build.&quot; Skipping any of
          them measurably lowers your protection — see <Code>Limitations</Code> below for the
          per-recipe failure mode.
        </Callout>

        <DocH3>What Evorion protects</DocH3>
        <DocUl
          items={[
            <Fragment key={0}><strong>License validation</strong> — server-issued, HWID-bound, anti-replay.</Fragment>,
            <Fragment key={1}><strong>Session secrets</strong> — per-session AES-256 key material derived only when the license is valid.</Fragment>,
            <Fragment key={2}><strong>Payload distribution</strong> — encrypted blobs you serve to your users, decrypted at runtime only with a valid session.</Fragment>,
            <Fragment key={3}><strong>Binary integrity of the SDK itself</strong> — internal CFF + sealed cookies + integrity mesh detect tampering of the lib.</Fragment>,
            <Fragment key={4}><strong>Anti-replay</strong> — session secrets rotate via heartbeat; stolen tokens expire fast.</Fragment>,
            <Fragment key={5}><strong>Anti-emulation</strong> — best-effort detection of sandboxes and Unicorn-class emulators.</Fragment>,
          ]}
        />

        <DocH3>What Evorion CANNOT protect</DocH3>
        <DocP>Evorion is a library. It cannot protect what it never sees.</DocP>
        <DocTable
          headers={["Threat", "Why Evorion cannot help"]}
          rows={[
            [
              "Inline plaintext cheat code in your .text",
              "If your aimbot is plaintext machine code at fixed offsets in your binary, no auth check can hide it. Reverser disassembles your loader, finds the cheat, runs it standalone. Refactor required (Recipe 2).",
            ],
            [
              "Hardcoded crypto keys in your binary",
              "XOR keys, AES keys, secret salts compiled into your loader will be extracted in minutes. Treat your binary as public.",
            ],
            [
              "Plaintext URLs to payloads",
              "Even on private CDNs, plaintext URLs leak via static analysis. Use SessionFetch so the URL is server-issued per-session.",
            ],
            [
              "popen(\"curl ...\") / system(\"...\")",
              "Visible process command-lines + no TLS validation + child-process injection surface. Use Client::SessionFetch (in-process mbedTLS with cert pinning).",
            ],
            [
              "Customer-side branches you \"trust\"",
              "if (license_ok) do_thing() is a 1-byte patch site regardless of how hardened the bool is. Use aes_gcm_decrypt(r, ...) so the success path computes garbage on bypass.",
            ],
            [
              "Loader compiled with -O0 / no symbol stripping",
              "Symbols and function shapes survive. Strip PDBs and ship optimized release builds. Wrap sensitive functions with EVORION_AUTH_PROTECT (runtime auth gate), gate their constants with EVORION_LOCKED_INT, and move anything worth stealing off the client entirely with client.FetchSealed.",
            ],
            [
              "Crash dumps with debug symbols",
              "WER + minidumps reveal call stacks. Strip PDB, ship with /Brepro and stripped debug info.",
            ],
            [
              "Server-side account compromise",
              "If your Evora account is breached, license issuance is the attacker's problem to forge. Treat the account like a code-signing cert.",
            ],
            [
              "Nation-state with unlimited time and binary in hand",
              "Out of scope. The plan slows down adversaries; it does not make reverse engineering impossible.",
            ],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="security-notice-recipe-1">
        <DocH2>Recipe 1 — Replace your auth check with the consumer transfer flow</DocH2>
        <Callout variant="amber">
          This is the single most important recipe. ~95% of cracks in the wild are this missing
          step. If you do nothing else from this page, do this.
        </Callout>

        <DocH3>Wrong — vulnerable to a 1-byte jnz flip</DocH3>
        <CodeBlock>{`auto r = client.License(key);
if (!r.ok()) return 1;
// success path — entirely your code:
auto blob = curlDownload("https://my-cdn.example/payload.bin");
for (size_t i = 0; i < blob.size(); ++i) blob[i] ^= kStaticKey[i & 15];
manualMap(blob, "TargetGame.exe");`}</CodeBlock>

        <DocH3>Right — immune to byte patching (v3.6 transfer flow)</DocH3>
        <CodeBlock>{`#include "Evorion.h"
...
auto r = client.License(key);
// NOTE: no early return on !r.ok().  the transfer below IS the gate.
std::vector<uint8_t> blob;
client.SessionFetch("https://payloads.evora.lol/" + r.payload_token(), blob);
std::vector<uint8_t> plain(blob.size() - 28);   // 12B nonce + 16B GCM tag
size_t plain_len = plain.size();
evorion::session::transfer(r, blob.data(), blob.size(),
                            plain.data(), &plain_len);
manualMap(plain, "TargetGame.exe");`}</CodeBlock>

        <DocP>
          If someone patches your <Code>jnz</Code>, the transfer produces zero bytes and{" "}
          <Code>manualMap</Code> crashes the target&apos;s remote thread. <strong>No payload
          loads.</strong> The success path exists only when the session is real; there is no
          boolean for the attacker to flip.
        </DocP>
        <DocP>
          The transfer call is also tied to your calling site, so patches applied later — to
          your <em>transfer</em> call site itself, not just an earlier <Code>jnz</Code> — are
          detected by the SDK&apos;s{" "}
          <a href="#security-notice-auto-armed" style={{ textDecoration: "underline" }}>
            automatic protection layers
          </a>{" "}
          and result in an unrecoverable session.
        </DocP>
        <Callout variant="blue">
          For customers who ship assets bundled with their build (rather than
          fetched per-session), use <Code>session::bind_key(r, label, len, out)</Code>{" "}
          to derive a stable 32-byte key tied to the session; encrypt at build
          time with the same label, decrypt at runtime with the returned key.
          Between <Code>transfer</Code> and <Code>bind_key</Code> the entire
          &quot;auth-gated content delivery&quot; problem is covered — you
          should not need any other primitive.  Older integrations calling{" "}
          <Code>aes_gcm_decrypt</Code> keep working for payloads already
          shipped, but the compiler will warn at each call site so new code
          migrates to <Code>transfer</Code>.
        </Callout>

        <Callout variant="amber">
          <strong>Recipe 1 is an architectural pattern, not a drop-in
          replacement for <Code>if (r.ok())</Code>.</strong>{" "}
          <Code>session::transfer</Code> does not return &quot;may I proceed&quot;
          — it decrypts. On a bypass, the output is 32 zeros, and the gate is
          your <em>success path panicking naturally on garbage input</em>. That
          only holds when your success path is actually coupled to the
          decrypted material: a manual-map target, a JIT blob, a decryption
          key for the routine main() calls next. If your app just does &quot;log
          in and run my normal features&quot; with nothing server-encrypted in
          between, there is nothing for <Code>transfer</Code> to gate.
        </Callout>

        <DocP>
          For that case, the fix is not to try to force <Code>transfer</Code>
          in — it is to identify what in your success path is <em>worth</em>{" "}
          gating on the session and route it through <Code>bind_key</Code>: a
          config that resolves your endpoints, a feature-flag decoder, the
          licence-check routine itself, a small piece of hot logic. Encrypt
          it at build time under a labelled <Code>bind_key</Code> derivation;
          at runtime, main() cannot function until a real session yields the
          same key. The point of both primitives is the same: <strong>make
          the success path structurally depend on cryptographic material only
          a genuine session produces</strong>, so there is no boolean between
          &quot;got a session&quot; and &quot;did the work&quot; for an
          attacker to patch.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="security-notice-auto-armed">
        <DocH2>Automatic protection</DocH2>
        <DocP>
          The SDK arms a set of runtime protections the moment{" "}
          <Code>Evorion.lib</Code> is linked into your build. There is nothing to call, configure,
          or enable. These layers are the safety net for integrations that ship without the
          post-build packer — they raise the cost of a scripted crack from seconds to hours plus
          detection risk. They do not substitute for shipping through <Code>evora-protect</Code>{" "}
          for high-value binaries.
        </DocP>

        <DocH3>Tamper detection at your call sites</DocH3>
        <DocP>
          When your code calls into any Evorion gate, the SDK ties the check to the surrounding
          bytes of your calling code. If those bytes are modified later — a static patch of your
          binary, an in-memory hook, or a runtime rewrite — the session becomes unrecoverable and
          the process is retired unpredictably. You do not need to know when or how; the check is
          continuous for the lifetime of the process.
        </DocP>
        <Callout variant="blue">
          The transfer flow in Recipe 1 pairs with this layer. Use both: the transfer flow
          removes the branch an attacker would try to patch in the first place, and this layer
          detects patches applied to whatever code paths remain.
        </Callout>

        <DocH3>Anti-dump</DocH3>
        <DocP>
          Standard process-dumping tools that scan memory for a binary&apos;s signature,
          reconstruct its import table, or rebuild a runnable file from a paused process do not
          succeed against an Evorion-linked build. Attempts to attach and dump produce broken
          output that will not run. Repeat attempts do not converge on a working dump — the
          protection is re-applied continuously in the background.
        </DocP>

        <DocH3>Anti-debug and anti-instrumentation</DocH3>
        <DocP>
          Debuggers, memory scanners, and known reverse-engineering tools observed alongside the
          protected process cause it to become unrecoverable. This begins before your{" "}
          <Code>main()</Code> runs, so an attacker cannot &quot;attach before the checks start.&quot;
          Detection is silent — there is no message box, no clean exit code, no stack trace back
          to a check site.
        </DocP>
        <Callout variant="blue">
          The detection surface is deliberately curated to avoid legitimate development tools a
          sysadmin might have open. If you encounter a false positive that trips on a mainstream
          tool, contact <Code>night@evora.cx</Code>.
        </Callout>

        <DocH3>What these layers do not replace</DocH3>
        <DocP>
          The automatic layers are runtime defences. They do not:
        </DocP>
        <DocUl
          items={[
            "Protect inline plaintext logic in your loader's .text (see Recipe 2).",
            <Fragment key={0}>Substitute for a full off-the-client posture, where the sensitive bytes live in a sealed payload and the loader fetches them at runtime via <Code>client.FetchSealed</Code>. The static analyst sees the loader, not the payload.</Fragment>,
            "Defend against kernel-mode attackers with unlimited time. See Limitations below.",
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="security-notice-recipe-2">
        <DocH2>Recipe 2 — Refactor inline sensitive code out of your loader</DocH2>
        <DocP>
          If your sensitive code is inline C++ in your loader&apos;s <Code>.text</Code>, the SDK
          physically cannot protect it. Someone who flips your <Code>jnz</Code> reaches
          your inline instructions directly, with no encryption to defeat.
        </DocP>
        <DocP>Lift it:</DocP>
        <DocUl
          items={[
            "Move the sensitive logic into a separate DLL or position-independent shellcode.",
            <Fragment key={0}>Encrypt the blob at build time with a session-derived key (any AES-GCM tool; the key material is your business — the SDK never sees your build-time blobs).</Fragment>,
            <Fragment key={1}>Serve it from your CDN behind a signed URL your server issues per-session.</Fragment>,
            <Fragment key={2}>At runtime: <Code>Client::SessionFetch</Code> → <Code>evorion::session::transfer(r, ...)</Code> → <Code>VirtualAlloc PAGE_EXECUTE_READWRITE</Code> → <Code>memcpy</Code> → call.</Fragment>,
          ]}
        />
        <DocP>
          Someone who patches your <Code>jnz</Code> gets garbage instructions in RWX memory; the
          process crashes on the first <Code>call</Code>.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="security-notice-recipe-3">
        <DocH2>Recipe 3 — Configure heartbeat for resident loaders</DocH2>
        <CodeBlock>{`evorion::Client client(
    owner_id, app_id, "1.0.0",
    TransportMode::Http,
    /*auto_init=*/true,
    /*heartbeat_interval=*/30,   // seconds — keep ≤ 30 for live sessions
    /*antidebug_interval=*/500,
    /*auto_exit=*/true);`}</CodeBlock>
        <DocP>
          Heartbeat rotates <Code>session_secret</Code>. Mid-session license revocation
          invalidates the secret on the next tick — anti-replay is automatic. Server-side{" "}
          <Code>OnPush</Code> callbacks for <Code>kill</Code>/<Code>ban</Code> terminate the
          session out of band on the same channel.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="security-notice-do-dont">
        <DocH2>Do — explicit list</DocH2>
        <DocUl
          items={[
            <Fragment key={0}>Use <Code>evorion::session::transfer(r, ...)</Code> to deliver any server-issued content the customer&apos;s success path <em>actually uses</em>. It is the right answer for &quot;receive authenticated bytes and use them&quot; — but only when your success path is coupled to those bytes. If it isn&apos;t, see Recipe 1&apos;s architectural note.</Fragment>,
            <Fragment key={1}>Use <Code>evorion::session::bind_key(r, label, len, out)</Code> when you ship encrypted assets bundled with your build — encrypt at build time with the same label, decrypt at runtime with the returned key. This is the ONE right answer for &quot;session-bound derived key.&quot;</Fragment>,
            <Fragment key={2}>Use <Code>Client::SessionFetch(...)</Code> for <strong>all</strong> downloads (in-process TLS, cert pinned).</Fragment>,
            <Fragment key={3}>Wrap sensitive code with <Code>EVORION_AUTH_PROTECT</Code> for auth-gated blocks, <Code>EVSK()</Code> for compile-time string encryption, and <Code>client.FetchSealed</Code> for anything worth stealing that would otherwise sit in the .exe.</Fragment>,
            <Fragment key={4}>Auth-gate sensitive constants with <Code>EVORION_LOCKED_INT</Code>. <Code>.load()</Code> consults live session state — a bypassed session returns a zero-initialized value.</Fragment>,
            <Fragment key={5}>Set <Code>heartbeat_interval</Code> ≤ 30 seconds for live / resident loaders.</Fragment>,
            <Fragment key={6}>Strip symbols, PDB paths, and debug info from release builds.</Fragment>,
            <Fragment key={7}>Build with deterministic linker flags (<Code>/Brepro</Code>) so leaked timestamps don&apos;t fingerprint your machine.</Fragment>,
            <Fragment key={8}>Ship optimized release builds (<Code>-O2</Code> at minimum) — unoptimized code preserves function shapes and symbol structure.</Fragment>,
            <Fragment key={9}>Implement Recipe 1 even if you don&apos;t think you need it — it costs 5 lines.</Fragment>,
            <Fragment key={10}>Keep your Evora account credentials in a hardware-backed secret store.</Fragment>,
            <Fragment key={11}>Rotate license keys quarterly.</Fragment>,
            <Fragment key={12}>Monitor your owner dashboard for unexpected HWID changes and failure-rate spikes.</Fragment>,
          ]}
        />

        <DocH2>Don&apos;t — explicit list</DocH2>
        <DocUl
          items={[
            <Fragment key={0}>Don&apos;t hardcode XOR keys, AES keys, or salts in your loader.</Fragment>,
            <Fragment key={1}>Don&apos;t write static URLs to payload CDNs (use <Code>SessionFetch</Code> + server-issued URL).</Fragment>,
            <Fragment key={2}>Don&apos;t use <Code>popen</Code> / <Code>system</Code> / <Code>ShellExecute</Code> / <Code>CreateProcess</Code> for downloads.</Fragment>,
            <Fragment key={3}>Don&apos;t use <Code>curl -k</Code> (insecure flag disables TLS validation — defeats the entire chain).</Fragment>,
            <Fragment key={4}>Don&apos;t gate your success path on <Code>if (r.ok())</Code>, <Code>if (client.Authenticated())</Code>, or any other <Code>if (some-boolean-derived-from-auth)</Code>. The pattern is the vulnerability; the compiler will warn you at every such call site. The right shape is to make the success path structurally depend on cryptographic material only a real session can produce — via <Code>session::transfer</Code> (server-issued content) or <Code>session::bind_key</Code> (build-time-bundled content), whichever matches your app. See Recipe 1 for the case where neither naturally fits.</Fragment>,
            <Fragment key={5}>Don&apos;t compare an HMAC or key you derived from the session against an expected value in an <Code>if</Code>. If you find yourself writing <Code>if (memcmp(computed, expected) == 0) work();</Code>, you have re-created the same patchable branch. Use the derived value as key material for whatever comes next (<Code>bind_key</Code> + your own AEAD).</Fragment>,
            <Fragment key={6}>Don&apos;t store sensitive code inline in your loader&apos;s <Code>.text</Code> as plaintext.</Fragment>,
            <Fragment key={7}>Don&apos;t log <Code>r.session_secret()</Code> bytes — not to stdout, stderr, files, debug output, or anywhere persistent.</Fragment>,
            <Fragment key={8}>Don&apos;t cache decrypted payloads on disk — they&apos;re in RWX memory only.</Fragment>,
            <Fragment key={9}>Don&apos;t ship debug builds (<Code>EVORION_VERBOSE</Code> defined) to customers — log strings leak everything.</Fragment>,
            <Fragment key={10}>Don&apos;t compile with PDB paths reachable from the binary&apos;s <Code>.rdata</Code> (use <Code>/PDBALTPATH:%_PDB%</Code>).</Fragment>,
            <Fragment key={11}>Don&apos;t ship <Code>OutputDebugString</Code> calls in release builds — debuggers attach silently to read them.</Fragment>,
            <Fragment key={12}>Don&apos;t bundle <Code>evr_diag.log</Code> / <Code>evr_crash.dmp</Code> in your release artifacts.</Fragment>,
            <Fragment key={13}>Don&apos;t roll your own anti-debug on top of textbook checks — the SDK already covers anti-debug automatically and layered ad-hoc checks are trivially bypassed while adding maintenance cost.</Fragment>,
            <Fragment key={14}>Don&apos;t reuse license keys across customers (the server rotates on misuse).</Fragment>,
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="security-notice-limitations">
        <DocH2>Limitations — what happens if you skip each recipe</DocH2>
        <DocTable
          headers={["If you skip…", "…expected outcome"]}
          rows={[
            [
              "Recipe 1 (session::transfer)",
              "1-byte jnz flip and your success path runs anyway. Same crack that triggered this whole hardening exercise. The automatic protection above raises the cost but is not a full substitute for using the transfer flow.",
            ],
            [
              "Recipe 2 (refactor inline)",
              "The SDK runs perfectly, returns a valid session_secret, the flipped jnz skips your decrypt call and runs your inline logic anyway. Auth becomes decorative.",
            ],
            [
              "Recipe 3 (heartbeat)",
              "Stolen session_secret works until process death (could be hours). No revocation.",
            ],
            [
              "Strip symbols / PDB",
              "Your function names + paths land in the release binary. Reverser already has half of IDA's job done for them.",
            ],
            [
              "EVORION_VERBOSE left on in release",
              "Log file evr_diag.log written to disk; debug-string artifacts in .rdata; failure reasons leaked to any reader.",
            ],
            [
              "TLS pinning / SessionFetch",
              "MitM swaps your payload; you become a vector.",
            ],
          ]}
        />

        <Callout variant="amber">
          Even with all recipes followed, Evorion does NOT guarantee absolute resistance:
          a nation-state with unlimited time and your binary in hand will eventually defeat
          any commercial protection. The plan slows them down; it does not stop them.
          If <Code>evora.cx</Code>&apos;s server is compromised, attackers can issue valid
          sessions — your defense at that point is account hygiene, not the SDK.
          Side-channels (timing, power, EM) are out of scope for a userspace library.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="security-notice-incident">
        <DocH2>If you suspect a crack</DocH2>
        <DocUl
          items={[
            <Fragment key={0}><strong>Don&apos;t panic</strong> — file a ticket at <Code>night@evora.cx</Code> with the leaked binary if you have it.</Fragment>,
            <Fragment key={1}><strong>Check your build</strong> — verify Recipes 1 + 2 are in place; ~95% of cracks are missing Recipe 1.</Fragment>,
            <Fragment key={2}><strong>Check telemetry</strong> — your owner dashboard shows per-license HWID counts and failure-rate spikes; a sudden spike usually precedes a public crack by hours.</Fragment>,
            <Fragment key={3}><strong>Rotate</strong> — push a build with new payload encryption keys and new license issuance keys. Old cracked builds stop working on the next session refresh.</Fragment>,
            <Fragment key={4}><strong>Report indicators</strong> — share tool signatures with the Evora team; we update the global blocklist.</Fragment>,
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="security-notice-reporting">
        <DocH2>Reporting a vulnerability in the SDK itself</DocH2>
        <DocP>
          <Code>night@evora.cx</Code>. PGP key in your owner dashboard. Bounty program
          details on the Trust page.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="security-notice-glossary">
        <DocH2>Glossary</DocH2>

        <DocH3>The two consumer primitives</DocH3>
        <DocP>
          Every legitimate customer use case maps to one of these two. If you
          are reaching for anything else, you are either rebuilding the
          patchable-boolean pattern by hand or duplicating what one of these
          already does.
        </DocP>
        <DocTable
          headers={["Term", "Meaning"]}
          rows={[
            ["session::transfer(r, in, in_len, out, out_len)", "Receive server-issued authenticated bytes. AEAD binds authenticity + confidentiality in one operation; output IS the payload the customer's success path needs. On a bypass, output is zero-filled. There is no verify step to branch on — the crypto output is the gate."],
            ["session::bind_key(r, label, len, out_key)", "Derive a 32-byte per-purpose key tied to the session, for encrypting assets you ship with your build. Encrypt at build time with the same label; decrypt at runtime with the returned key. The customer's downstream AES-GCM decrypt succeeds only when the derived key matches — no branch, the key IS the gate."],
          ]}
        />

        <DocH3>Supporting API</DocH3>
        <DocTable
          headers={["Term", "Meaning"]}
          rows={[
            ["Result::session_secret()", "32-byte key material populated only when the session is genuine. Consumed internally by the two primitives above. Do NOT touch it directly — indexing / comparing / branching on session_secret bytes rebuilds the same patchable-boolean footgun the transfer flow eliminates."],
            ["SessionFetch", "In-process TLS-pinned download. Replaces popen(\"curl ...\")."],
            ["Session secret", "Per-session 32-byte derived key material rotated by heartbeat.  Feeds both consumer primitives."],
            ["HWID", "Hardware ID hash derived from CPUID + SMBIOS + TPM endorsement key. License is bound to first-seen HWID by default."],
            ["Heartbeat", "Periodic re-auth that rotates the session secret. Default 30 s. Reduce for higher-security flows."],
            ["Automatic protection", "The set of runtime defences (tamper detection, anti-dump, anti-debug) that fire once Evorion.lib is linked, without customer configuration. See the Automatic protection section for what it covers."],
          ]}
        />

        <DocH3>Legacy — do not use in new integrations</DocH3>
        <DocP>
          These names are still callable so existing integrations compile and
          existing payloads decrypt. All emit compiler deprecation warnings at
          the call site; migrate to <Code>session::transfer</Code> or{" "}
          <Code>session::bind_key</Code>.
        </DocP>
        <DocTable
          headers={["Term", "Why not to use"]}
          rows={[
            ["Result::ok()", "Boolean auth status. One-byte JZ→JMP patch and the success path runs anyway. Structurally couple your success path to session-derived cryptographic material (session::transfer for server-issued content, session::bind_key for build-time-bundled content) rather than to this bool. See Recipe 1's architectural note."],
            ["Client::Authenticated()", "Same shape as Result::ok(). Same crack. Same fix."],
            ["session::aes_gcm_decrypt(r, ...)", "Predecessor of session::transfer with a different AAD. Kept so existing payloads decrypt; new code should use session::transfer."],
            ["session::hmac_verify(r, ...)", "Returned a bool-shaped ErrorCode. Customers wrote `if (hmac_verify(...) == None) { work; }` — the same patchable branch we're eliminating."],
            ["session::compute_hmac(r, data, len, out)", "Standalone HMAC primitive. Only load-bearing when the output is used as key material downstream — and that use case is already covered by bind_key + your own AEAD. If you find yourself using compute_hmac, you almost certainly wanted bind_key."],
            ["xor_in_place", "Removed. The old body XORed against session_secret; on a bypass leaving the secret at zeros, output equalled input — a total defeat of the load-bearing model.  Symbol is gone; call sites now fail to compile."],
          ]}
        />
      </DocSection>
    </>
  );
}

export { SecurityNoticeSections };
