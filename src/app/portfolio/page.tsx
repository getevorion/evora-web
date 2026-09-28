import type { Metadata } from "next";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioWork } from "@/components/portfolio/PortfolioWork";
import { PortfolioStats } from "@/components/portfolio/PortfolioStats";
import { PortfolioAbout } from "@/components/portfolio/PortfolioAbout";
import { PortfolioSkills } from "@/components/portfolio/PortfolioSkills";
import { PortfolioContact } from "@/components/portfolio/PortfolioContact";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Portfolio",
  description:
    "Hypervisors, custom virtualization, anti-tamper SDKs, and AI-augmented reverse engineering — the work behind Evora.",
  path: "/portfolio",
  keywords: ["hypervisor development", "anti-tamper sdk", "reverse engineering portfolio"],
});

export default function PortfolioHome() {
  return (
    <div className="pf-page pf-container">
      <PortfolioHero />
      <PortfolioWork />
      <PortfolioStats />
      <PortfolioSkills />
      <PortfolioAbout />
      <PortfolioContact />
    </div>
  );
}
