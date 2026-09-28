"use client";

import { Fragment } from "react";
import { Rocket, Package, BookOpen, KeyRound, ShieldCheck, Code2, FileText, Boxes } from "lucide-react";
import {
  DocSection, DocHero, DocH1, DocH2, DocH3, DocLead, DocP,
  Code, Tag, CodeBlock, Callout,
  DocTable, DocOl, DocUl, Divider,
  DocCardGrid, DocCard, DocFrameworkList,
} from "../components";

function SdkReference() {
  return (
    <>
      <DocHero id="overview">
        <DocH1 eyebrow="Get started">Introducing the Evorion documentation</DocH1>
        <DocLead>
          Everything you need to integrate authentication, licensing, file delivery, and runtime
          protection into your native Windows application.
        </DocLead>

        <DocCardGrid>
          <DocCard
            icon={Rocket}
            title="Quick Start"
            desc="Wire up the client, run your first authenticated call, and see the SDK's automatic heartbeat and integrity checks in action."
            href="#quickstart"
          />
          <DocCard
            icon={Package}
            title="Installation"
            desc="Drop the single header + static lib into your project. Zero external dependencies, zero build system changes."
            href="#installation"
          />
          <DocCard
            icon={BookOpen}
            title="Developer Checklist"
            desc="The end-to-end list of what to configure before shipping — auth mode, version policy, integrity, protection macros."
            href="#checklist"
          />
          <DocCard
            icon={KeyRound}
            title="Auth Modes"
            desc="License key, username / password, or both. Learn how the SDK enforces your app's chosen authentication surface."
            href="#auth-modes"
          />
        </DocCardGrid>

        <DocFrameworkList
          heading="Explore the reference"
          lead="Guides and references for every part of the Evorion SDK."
          items={[
            {
              icon: KeyRound,
              title: "Authentication",
              desc: "Login, Register, License, Heartbeat, session variables, and file downloads.",
              href: "#login",
            },
            {
              icon: ShieldCheck,
              title: "Security Notice",
              desc: "The hardening playbook — session-secret pattern, inline refactor, heartbeat.",
              href: "#security-notice-overview",
            },
            {
              icon: ShieldCheck,
              title: "Security",
              desc: "Anti-debug, binary integrity, hardware ID, transport modes, version management.",
              href: "#antidebug",
            },
            {
              icon: Code2,
              title: "Code Protection",
              desc: "CFF, SEH, encryption, sealed values, dynamic API. Ship code that reads garbage.",
              href: "#code-protection",
            },
            {
              icon: FileText,
              title: "Developer API",
              desc: "Automate app, user, license, seller, and webhook management from your backend.",
              href: "#developer-api",
            },
            {
              icon: Boxes,
              title: "Management",
              desc: "API keys, subscriptions, blacklist / whitelist, sessions, sellers, and utilities.",
              href: "#api-keys",
            },
          ]}
        />

        <div className="flex flex-wrap items-center gap-2 text-[13px]" style={{ color: "var(--docs-muted)" }}>
          <span>Requires</span>
          {(["MSVC 2019+", "C++17", "Windows x64"] as const).map((r) => (
            <Tag key={r}>{r}</Tag>
          ))}
        </div>
      </DocHero>

      <Divider />

      <DocSection id="installation">
        <DocH2>Installation</DocH2>
        <DocOl
          items={[
            <Fragment key={0}>
              <strong>Download the SDK</strong> — Grab the latest release from the Evora dashboard.
              You&apos;ll get <Code>Evorion.h</Code> and <Code>Evorion.lib</Code>.
            </Fragment>,
            <Fragment key={1}>
              <strong>Drop into your project</strong> — Place both files alongside your source.
              The header handles all library linking via <Code>#pragma comment(lib, ...)</Code>.
            </Fragment>,
            <Fragment key={2}>
              <strong>Get your credentials</strong> — In the dashboard, go to{" "}
              <strong>Settings → Credentials</strong> to find your App ID and Owner ID for the
              public SDK surface.
            </Fragment>,
          ]}
        />
        <Callout variant="amber">
          <strong>Don&apos;t hardcode credentials in plaintext.</strong> Use the SecureCredential
          system or the <Code>EVSK()</Code> macro to encrypt them at compile time.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="quickstart">
        <DocH2>Quick Start</DocH2>
        <DocP>The simplest integration. Everything runs automatically:</DocP>
        <CodeBlock label="main.cpp">{`#include "Evorion.h"

int main() {
    evorion::Client client(
        "OWNER_ID",
        "APP_ID",
        "1.0",
        evorion::TransportMode::Http,
        true,   // auto_init - calls Init() in constructor
        30,     // heartbeat every 30s
        500,    // anti-debug scan every 500ms
        true    // exit on tamper detection
    );

    if (!client.Initialized()) {
        std::cerr << client.LastError() << "\\n";
        return 1;
    }

    // Session active. Heartbeat & anti-debug running in background.
    auto r = client.Login("user", "pass");
    if (!r.ok()) return 1;

    std::cout << "Welcome, " << client.User().username << "\\n";
    client.Wait();  // blocks forever, keeps heartbeat alive
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="checklist">
        <DocH2>Developer Checklist</DocH2>
        <DocP>What you actually need to do, end to end, before shipping.</DocP>
        <DocOl
          items={[
            "Create a developer account — sign up at the dashboard. Free tier (Core) is enough to evaluate; Pro adds server-decrypted sections and higher limits; Ultra adds attestation depth, seller tooling, and top quotas.",
            <Fragment key={1}>Create an application — in the dashboard, add an app and copy the <Code>app_id</Code>, <Code>app_secret</Code>, and (optional) public key.</Fragment>,
            <Fragment key={2}>Pick an authentication mode — <Code>license</Code> for license-key only, <Code>user_pass</Code> for username/password, or <Code>both</Code>. See Authentication Modes.</Fragment>,
            <Fragment key={3}>Drop the SDK into your project — add the headers and link the static lib. All you need is <Code>#include &lt;evorion/evorion.h&gt;</Code>.</Fragment>,
            <Fragment key={4}>Initialize the client — instantiate <Code>Evorion::Client</Code> with your <Code>app_id</Code>, <Code>app_secret</Code>, and version string. The constructor starts heartbeat and anti-debug automatically.</Fragment>,
            <Fragment key={5}>Wire your auth flow — call <Code>Login()</Code>, <Code>Register()</Code>, or <Code>License()</Code> based on your chosen mode. Inspect the <Code>Result</Code> for the outcome.</Fragment>,
            "Configure version policy — set ok / warn / block rules per version in the dashboard so old clients can't bypass updates.",
            "Enable integrity checking — turn on Anti-Debug, Anti-VM, and Integrity for your app. The SDK will register a golden image on first connect.",
            <Fragment key={8}>Wrap sensitive code with the protection primitives: <Code>EVORION_AUTH_PROTECT</Code> for auth-gated blocks, <Code>EVORION_LOCKED_INT</Code> for auth-gated constants, <Code>EVORION_DYNAPI</Code> to hide imports, <Code>EVSK()</Code> for compile-time string encryption, and <Code>client.FetchSealed</Code> for anything worth stealing that would otherwise sit in the .exe.</Fragment>,
            "Test in transport modes you'll use — HTTPS works everywhere; WebSocket gives lower latency and server push.",
            "Set up sessions and ban policies — pick concurrent session limits, ban triggers, and abuse detection thresholds in the dashboard.",
            "Optionally use the Developer API — issue scoped API keys and automate user, license, or seller management from your own backend.",
            "Ship it — release the build that uploads its own golden image, then push subsequent builds confidently knowing remote attestation will catch tampered binaries.",
          ]}
        />
        <DocH3>Common pitfalls</DocH3>
        <DocUl
          items={[
            "Forgetting to bump the version string when you push a new build — the server will reject the new client until a matching golden image is registered.",
            <Fragment key={1}>Hardcoding plaintext secrets — wrap every credential and API key with <Code>EVSK()</Code>. Plain string literals end up in your binary.</Fragment>,
            <Fragment key={2}>Using <Code>license</Code> auth mode and then calling <Code>Login()</Code> — the SDK will refuse the call. Check your app&apos;s auth mode in the dashboard.</Fragment>,
            <Fragment key={3}>Skipping <Code>Wait()</Code> in console apps — without it, the process exits and the heartbeat dies, which the server treats as session termination.</Fragment>,
            "Disabling Anti-Debug during development — fine while you're stepping through your own code, but never ship a build with it off.",
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="auth-modes">
        <DocH2>Authentication Modes</DocH2>
        <DocP>
          Each application has an auth mode set in the dashboard. The SDK reads it after{" "}
          <Code>Init()</Code> and enforces it on login calls.
        </DocP>
        <DocTable
          headers={["Mode", "Allowed", "Blocked"]}
          rows={[
            ["both", "Login() · Register() · License()", "None"],
            ["license", "License()", "Login() · Register()"],
            ["user_pass", "Login() · Register()", "License()"],
          ]}
        />
        <DocP>
          Calling a blocked method returns <Code>ErrorCode::AuthModeRestricted</Code>. Check the
          mode first to show the right UI:
        </DocP>
        <CodeBlock label="auth_routing.cpp">{`std::string mode = client.GetAuthMode();

if (mode == "license") {
    std::string key;
    std::cout << "License key: ";
    std::getline(std::cin, key);
    auto r = client.License(key);

} else if (mode == "user_pass") {
    std::string user, pass;
    std::cout << "Username: "; std::getline(std::cin, user);
    std::cout << "Password: "; std::getline(std::cin, pass);
    auto r = client.Login(user, pass);

} else {
    // "both" - let the user choose their flow
}`}</CodeBlock>
      </DocSection>
    </>
  );
}

export { SdkReference };
