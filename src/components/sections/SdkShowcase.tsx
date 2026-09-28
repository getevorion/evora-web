"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const SAMPLES: Record<string, string> = {
  "client init": `#include "Evorion.h"

EVORION_CLIENT(
    client,
    "your-owner-id",      // sealed at compile time via EVSK
    "your-app-id",
    "1.0.0",
    evorion::TransportMode::WebSocket
);

if (auto r = client.Init(); !r.ok()) {
    std::cerr << r.message() << "\n";
    return 1;
}`,
  login: `auto r = client.Login(username, password);
if (!r.ok()) {
    switch (r.error_code) {
        case evorion::ErrorCode::HwidMismatch:        /* device locked */ break;
        case evorion::ErrorCode::SubscriptionExpired: /* renew */         break;
        case evorion::ErrorCode::UserBanned:          /* blocked */       break;
        default: break;
    }
    return;
}

const auto& u = client.User();
std::cout << u.username << " " << u.FormatTimeLeft();`,
  protect: `// control flow flattening with SEH fallback
int validate(const evorion::UserData& user) {
    int result = 0;
    EVORION_PROTECT(validate)
        bool sub = user.HasSubscription();
        EVORION_SPLIT(validate, 1)
        if (!sub) result = -1;
        EVORION_SPLIT(validate, 2)
        if (sub && user.IsLifetime()) result = 100;
    EVORION_PROTECT_DONE(validate)
    return result;
}

// encrypted region, decrypted at runtime by Shield
__declspec(noinline) int hot_path() {
    EVORION_ENCRYPT_BEGIN;
    /* sensitive logic */
    EVORION_ENCRYPT_END;
}`,
  push: `client.OnPush([](const std::string& type, const std::string& payload_json) {
    if (type == "antidebug.trip") { /* react */ }
    if (type == "license.revoked") { client.Close(); }
    if (type == "user.var.changed") { /* refresh ui */ }
});

client.Wait();   // blocks until Close()`,
};

const KEYS = Object.keys(SAMPLES);

export function SdkShowcase() {
  return (
    <section id="docs" className="section-anchor py-20 sm:py-24">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="The SDK"
            title="Read the actual code."
            description={<>Direct excerpts from <code>Evorion.h</code>. No marketing pseudo-code.</>}
            className="mb-10 max-w-xl"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <Tabs defaultValue={KEYS[0]} className="max-w-3xl mx-auto">
            <TabsList className="mx-auto">
              {KEYS.map((k) => (
                <TabsTrigger key={k} value={k}>
                  {k}
                </TabsTrigger>
              ))}
            </TabsList>
            {KEYS.map((k) => (
              <TabsContent key={k} value={k} className="mt-4">
                <div className="hairline rounded-xl bg-bg-elevated overflow-hidden">
                  <div className="hairline-b px-4 py-2.5 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-text-faint/40" />
                    <span className="size-2 rounded-full bg-text-faint/40" />
                    <span className="size-2 rounded-full bg-text-faint/40" />
                    <span className="ml-2 text-[11px] text-text-faint font-mono">
                      example.cpp
                    </span>
                  </div>
                  <pre className="m-0 border-0 rounded-none bg-transparent text-[12.5px] leading-[1.65]">
                    <code>{SAMPLES[k]}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
