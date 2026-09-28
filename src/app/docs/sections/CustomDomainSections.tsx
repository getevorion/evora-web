import {
  DocSection, DocH2, DocH3, DocP,
  Code, CodeBlock, Callout, ProBadge,
  DocTable, DocOl, Divider,
} from "../components";

export function CustomDomainSections() {
  return (
    <>
      <DocSection id="custom-domain">
        <DocH2>
          Custom API domain
          <ProBadge />
        </DocH2>
        <DocP>
          By default your app talks to <Code>api.evora.cx</Code>. A custom domain lets you serve
          the exact same API from a hostname you own — <Code>auth.yourgame.com</Code> — so your
          users&apos; traffic never names Evora. Two things this buys you: if an ISP or network
          firewall blocks <Code>evora.cx</Code>, your app keeps working; and a casual look at your
          binary or its network traffic no longer reveals which auth provider you use.
        </DocP>
        <Callout variant="blue">
          Nothing about the API changes — same endpoints, same keys, same request bodies, same
          responses. Only the hostname on the wire is different. You can switch back at any time.
        </Callout>

        <DocH3>What you need</DocH3>
        <DocTable
          headers={["Requirement", "Detail"]}
          rows={[
            ["A domain you own", "Any registrar — Cloudflare, Namecheap, GoDaddy, Porkbun. You do not need to move the domain to Cloudflare."],
            ["A spare subdomain", "Use one you are not already serving a website from, like auth. or api. Do not use your apex/root domain."],
            ["Pro plan or above", "Custom domains provision a dedicated certificate per app, so they start at Pro."],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="custom-domain-setup">
        <DocH2>Connecting a domain</DocH2>
        <DocP>
          Open your application, go to <Code>Settings → Custom Domain</Code>, and enter the
          hostname you want to use. Leave off <Code>https://</Code> — just the bare name.
        </DocP>
        <DocOl
          items={[
            <>Enter <Code>auth.yourgame.com</Code> and click <strong>Connect domain</strong>. The panel shows a status of <strong>Waiting on DNS</strong>.</>,
            <>Add the DNS records the panel shows you at your registrar (details below). There is one <Code>CNAME</Code> that does the routing, and usually one <Code>TXT</Code> that proves you own the domain.</>,
            <>Come back to the panel. It re-checks every few seconds — you do not need to refresh. Status moves to <strong>Verifying</strong> while the certificate is issued, then <strong>Live</strong>.</>,
            <>Point your app at the new hostname (see below) and ship an update.</>,
          ]}
        />

        <DocH3>The DNS records</DocH3>
        <DocP>
          The exact values are generated per domain and shown in the panel — copy them from there.
          They take one of these shapes:
        </DocP>
        <DocTable
          headers={["Type", "Name", "Points to", "Why"]}
          rows={[
            ["CNAME", "auth.yourgame.com", "ssl.evora.cx", "Routes your hostname to the API."],
            ["TXT", "_cf-custom-hostname.auth.yourgame.com", "(token shown in panel)", "Proves you own the domain so a certificate can be issued for it."],
          ]}
        />
        <Callout variant="amber">
          If your DNS is hosted at Cloudflare, set the <Code>CNAME</Code> record to{" "}
          <strong>DNS only</strong> (grey cloud), not proxied. A proxied record here creates a
          certificate loop and the domain will stay stuck on <strong>Verifying</strong>.
        </Callout>

        <DocH3>How long it takes</DocH3>
        <DocP>
          DNS changes are usually visible within a few minutes but can take up to an hour depending
          on your registrar. Once the records are found, the certificate is typically issued within
          a minute or two. If a domain sits on <strong>Waiting on DNS</strong> for more than an
          hour, re-check that the record <em>Name</em> and <em>Value</em> match the panel exactly —
          a trailing dot or an extra <Code>.yourgame.com</Code> appended by your registrar is the
          usual cause.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="custom-domain-rest">
        <DocH2>Using it — REST API</DocH2>
        <DocP>
          Once the domain is <strong>Live</strong>, swap the base URL everywhere you call the API.
          Nothing else changes.
        </DocP>
        <CodeBlock label="diff">{`- https://api.evora.cx/api/developer-api/apps/YOUR_APP_ID/licenses/authenticate
+ https://auth.yourgame.com/api/developer-api/apps/YOUR_APP_ID/licenses/authenticate`}</CodeBlock>
        <DocP>
          Every endpoint, header, API key, request body and response is identical. If you keep a
          base URL in a config value, this is a one-line change.
        </DocP>
        <CodeBlock label="javascript">{`// before
const API = "https://api.evora.cx/api/developer-api";

// after — your own domain
const API = "https://auth.yourgame.com/api/developer-api";

const res = await fetch(\`\${API}/apps/\${appId}/licenses/authenticate\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${process.env.EVORA_API_KEY}\`,
  },
  body: JSON.stringify({ licenseKey }),
});`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="custom-domain-sdk">
        <DocH2>Using it — C++ SDK</DocH2>
        <DocP>
          The SDK talks to <Code>api.evora.cx</Code> by default. Call{" "}
          <Code>Client::SetApiHost()</Code> once, before you construct your client, with the bare
          hostname. That is the whole change.
        </DocP>
        <CodeBlock label="cpp">{`#include "Evorion.h"

int main() {
    // Route through your connected custom domain. Bare hostname — no
    // "https://", no path. Call this BEFORE constructing the client.
    evorion::Client::SetApiHost("auth.yourgame.com");

    evorion::Client client("OWNER_ID", "APP_ID", "1.0");
    if (!client.Init()) return 1;
    // ... everything else is unchanged
}`}</CodeBlock>

        <DocH3>Certificate pinning still works — automatically</DocH3>
        <DocP>
          The Evorion 4 Umbra SDK pins the TLS certificate chain for defence in depth. You do not need to change,
          rebuild, or ship anything for pinning to keep working on a custom domain: the SDK pins the
          long-lived <em>chain anchors</em> (the certificate authorities), not the short-lived leaf
          certificate. The certificate issued for your hostname chains to the same authorities, so
          it validates against the existing pins with nothing to rotate.
        </DocP>
        <Callout variant="blue">
          This is why custom domains need no per-customer SDK build. Response authenticity does not
          rest on TLS anyway — every server reply is signed with a key compiled into your SDK, so a
          forged certificate buys an attacker nothing.
        </Callout>

        <DocH3>No silent fallback</DocH3>
        <DocP>
          If your custom domain stops resolving, the SDK does <strong>not</strong> quietly fall back
          to <Code>api.evora.cx</Code> — doing so would leak the very hostname you are paying to
          hide. <Code>Init()</Code> fails instead. Ship a build you can update, and treat a
          connect failure as a signal to check your domain rather than something the SDK papers
          over.
        </DocP>
        <DocP>
          To confirm a custom host actually took effect in a diagnostic build, read it back:
        </DocP>
        <CodeBlock label="cpp">{`evorion::Client::SetApiHost("auth.yourgame.com");
// prints "auth.yourgame.com"
std::printf("api host: %s\\n", evorion::Client::GetApiHost().c_str());`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="custom-domain-remove">
        <DocH2>Disconnecting</DocH2>
        <DocP>
          Remove a domain from <Code>Settings → Custom Domain</Code>. The hostname stops answering
          API requests immediately, so <strong>ship an update that points back at</strong>{" "}
          <Code>api.evora.cx</Code> <strong>first</strong> — any build already in your users&apos;
          hands that still points at the removed domain will break. Re-connecting the same domain
          later re-issues its certificate from scratch.
        </DocP>
      </DocSection>
    </>
  );
}
