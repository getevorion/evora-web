import { Fragment } from "react";
import {
  DocSection, DocH2, DocH3, DocP,
  Sig, Code, CodeBlock, Callout, ProBadge,
  DocTable, DocOl, DocUl, Divider,
} from "../components";

function SecuritySections() {
  return (
    <>
      <DocSection id="antidebug">
        <DocH2>
          Anti-Debug &amp; Anti-Tamper
          <ProBadge />
        </DocH2>
        <DocP>
          The SDK runs anti-debug scans in a background thread at the interval you specify.
          Detections are reported to the server. When <strong>Auto-Ban</strong> is enabled in the
          dashboard, the device gets blacklisted immediately.
        </DocP>
        <CodeBlock>{`evorion::Client client(
    owner, app, ver,
    evorion::TransportMode::Http,
    true,   // auto_init
    30,     // heartbeat
    500,    // anti-debug scan every 500ms
    true    // auto_exit - kills process on detection
);
// anti-debug is now running. nothing else to do.`}</CodeBlock>
        <DocH3>What it covers</DocH3>
        <DocUl
          items={[
            "User-mode and kernel debuggers attached to the process.",
            "Runtime code and API hooking.",
            "In-memory tampering with the loader's code.",
            "Emulator and virtualisation environments used to bypass runtime checks.",
            "Manual mappers and other non-standard module loading.",
          ]}
        />
        <Callout variant="blue">
          The specific mechanisms behind each detection change between releases and are
          intentionally not documented — the surface visible to an attacker reading these docs
          is the smallest possible slice of what the SDK actually enforces.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="integrity">
        <DocH2>
          Binary Integrity &amp; Remote Attestation
          <ProBadge />
        </DocH2>
        <DocP>
          Server-driven memory attestation verifies that your application&apos;s code
          hasn&apos;t been modified at runtime. The server holds a &quot;golden image&quot; of
          your binary&apos;s <Code>.text</Code> section and periodically challenges connected
          clients to prove their in-memory code matches.
        </DocP>

        <DocH3>How it works</DocH3>
        <DocOl
          items={[
            <Fragment key={1}>
              <strong>Upload.</strong> Upload your compiled binary (or pre-extracted .text section)
              to the dashboard. The server extracts and stores the .text section encrypted with
              AES-256-GCM.
            </Fragment>,
            <Fragment key={2}>
              <strong>Enable.</strong> Toggle integrity checking on for your application in Binary
              Integrity settings.
            </Fragment>,
            <Fragment key={3}>
              <strong>Challenge.</strong> During heartbeats, the server picks random regions of
              .text and sends an attestation challenge with a fresh nonce.
            </Fragment>,
            <Fragment key={4}>
              <strong>Proof.</strong> The SDK reads its own memory at those offsets, computes{" "}
              <Code>HMAC-SHA256(regions || nonce, BUILD_SECRET)</Code>, and returns the proof.
            </Fragment>,
            <Fragment key={5}>
              <strong>Verify.</strong> Server verifies the proof against its golden image.
              Mismatch → <Code>IntegrityViolation</Code>.
            </Fragment>,
          ]}
        />

        <DocH3>Dashboard setup</DocH3>
        <DocP>
          Navigate to your app&apos;s <strong>Binary Integrity</strong> page. Two upload modes:
        </DocP>
        <DocTable
          headers={["Mode", "Description"]}
          rows={[
            ["Binary Upload", "Drag & drop your compiled .exe, .dll, or .sys. The server automatically extracts the .text section via its PE parser."],
            ["Hash Upload", "Paste a pre-extracted .text section as base64. Use this if you extract the .text section yourself or from a CI pipeline."],
          ]}
        />
        <Callout variant="blue">
          The version you specify when uploading <strong>must match</strong> the version string
          your SDK client reports in its constructor.
        </Callout>

        <DocH3>SDK integration</DocH3>
        <DocP>
          Remote attestation is <strong>fully automatic</strong>. Once integrity checking is
          enabled and a golden image is registered for your version, the SDK handles challenges
          during heartbeats with zero extra code on your part.
        </DocP>
        <CodeBlock>{`// no special code needed, attestation runs inside Heartbeat()
EVORION_CLIENT(client,
    "OWNER_ID",
    "APP_ID",
    "1.0.0",
    evorion::TransportMode::Http,
    true, 30, 500, true
);

if (!client.Initialized()) return 1;
auto login = client.Login("user", "pass");
if (!login.ok()) return 1;

while (running) {
    auto hb = client.Heartbeat();
    if (!hb.ok()) {
        if (hb.error_code == evorion::ErrorCode::IntegrityViolation)
            std::cerr << "Integrity violation detected\\n";
        break;
    }
    Sleep(30000);
}`}</CodeBlock>

        <DocH3>Attestation protocol</DocH3>
        <DocTable
          headers={["Property", "Detail"]}
          rows={[
            ["Regions", "Random .text offsets per challenge, can't precompute"],
            ["Nonce", "32-byte fresh nonce per challenge, prevents replay"],
            ["Algorithm", "Multiple HMAC variants (0–3), defeats generic hash emulators"],
            ["Secret", "HMAC keyed with build secret, can't forge without extracting it"],
          ]}
        />

        <DocH3>Golden image self-registration</DocH3>
        <DocP>
          When your app connects for the first time and no golden image exists for its version,
          the SDK <strong>automatically extracts its own in-memory .text section</strong> and
          uploads it to the server. No manual upload needed for every build.
        </DocP>
        <Callout variant="amber">
          If you use packers (Themida, VMProtect, etc.), upload the <strong>fully packed</strong>{" "}
          binary. Self-modifying code that alters <Code>.text</Code> at runtime will cause false
          positives.
        </Callout>

        <DocH3>Golden image CLI tool</DocH3>
        <DocP>
          For CI/CD pipelines, use the <Code>extract-golden-image.mjs</Code> tool (shipped in{" "}
          <Code>sdk/tools/</Code>) to extract and upload golden images as a post-build step:
        </DocP>
        <CodeBlock>{`# Extract from compiled binary and upload
node extract-golden-image.mjs MyApp.exe <app_id> <version> --api-key <key>

# For packed binaries: dump at runtime, then upload the dump
MyApp.exe --dump-golden golden.bin
node extract-golden-image.mjs golden.bin <app_id> <version> --raw --api-key <key>

# Extract only (don't upload)
node extract-golden-image.mjs MyApp.exe <app_id> <version> --dump-only`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="hwid">
        <DocH2>Hardware ID</DocH2>
        <Sig>std::string evorion::hwid::Generate()</Sig>
        <DocP>
          Generates a stable hardware fingerprint for the current machine. Used internally for
          HWID lock, but you can also use it for your own device tracking.
        </DocP>
        <CodeBlock>{`std::string hwid = evorion::hwid::Generate();
std::cout << "Device: " << hwid << "\\n";`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="secure-creds">
        <DocH2>Secure Credentials</DocH2>
        <DocP>
          Plaintext strings sit in the binary at rest. <Code>SecureCredential</Code> encrypts them
          at compile time so there&apos;s nothing to find in a hex editor or string dump.
        </DocP>

        <DocH3>EVSK macro</DocH3>
        <DocP>
          The fastest way. Wrap your owner id or any other sensitive literal into a{" "}
          <Code>SecureCredential</Code> with compile-time encryption:
        </DocP>
        <CodeBlock label="recommended approach">{`evorion::Client client(
    EVSK("your-owner-uuid"),
    "your-app-uuid",
    "1.0"
);`}</CodeBlock>

        <DocH3>EVORION_CLIENT macro</DocH3>
        <DocP>
          All-in-one shorthand that wraps the owner id automatically and forwards the remaining
          constructor arguments:
        </DocP>
        <CodeBlock label="one-liner">{`EVORION_CLIENT(client, "owner-uuid", "app-uuid", "1.0", evorion::TransportMode::WebSocket);`}</CodeBlock>

        <DocH3>SecureCredential class</DocH3>
        <DocTable
          headers={["Method", "Description"]}
          rows={[
            ["FromHex(hex, key_seed)", "Construct from hex-encoded encrypted blob"],
            ["FromPlain(text)", "Wrap plaintext (debug/testing only)"],
            ["decrypt()", "Decrypt and return plaintext"],
            ["has_value()", "Whether the credential contains data"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="transport">
        <DocH2>Transport Modes</DocH2>
        <DocP>The SDK supports two transport modes:</DocP>
        <DocTable
          headers={["Mode", "Use Case"]}
          rows={[
            ["TransportMode::Http", "Standard HTTPS request/response. Simpler, works behind restrictive firewalls. Default."],
            ["TransportMode::WebSocket", "Persistent connection. Enables server push (OnPush()), remote kill/ban, real-time variable updates."],
          ]}
        />
        <Callout variant="blue">
          All API methods (<Code>Login</Code>, <Code>Check</Code>, <Code>GetVar</Code>,{" "}
          <Code>DownloadFile</Code>, etc.) work identically on both transports. The only
          difference is that WebSocket enables <Code>OnPush()</Code> callbacks.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="version-mgmt">
        <DocH2>Version Management</DocH2>
        <DocP>
          The server checks the SDK version and your app version on every <Code>Init()</Code>.
          Configure version policies per-application in the dashboard:
        </DocP>
        <DocTable
          headers={["Policy", "Behavior"]}
          rows={[
            ["ok", "Version is accepted. Normal operation."],
            ["warn", "Version is outdated but allowed. Init() succeeds. The server may include an update_url in the response."],
            ["block", "Version is rejected. Init() fails with ErrorCode::VersionBlocked. The user must update."],
          ]}
        />
        <Callout variant="blue">
          Set the <Code>version</Code> parameter in the constructor to your app&apos;s actual
          version string. The server matches against the version rules you configure per-app in
          the dashboard.
        </Callout>
      </DocSection>
    </>
  );
}

export { SecuritySections };
