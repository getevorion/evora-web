import type { Metadata } from "next";
import { PortfolioBends } from "@/components/portfolio/PortfolioBends";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { PortfolioNav } from "@/components/portfolio/PortfolioNav";
import { RevealOnScroll } from "@/components/portfolio/RevealOnScroll";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import "./portfolio.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio · Evora",
    template: "%s · Evora",
  },
  description:
    "Hypervisors, custom virtualization, anti-tamper SDKs, and AI-augmented reverse engineering.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="portfolio-root"
      data-theme="dark"
      className="pf-root pf-stage relative flex min-h-[100dvh] min-h-[100svh] flex-col"
    >
      <SmoothScroll />
      <RevealOnScroll />
      <PortfolioBends />
      <PortfolioNav />
      <main className="flex-1">{children}</main>
      <PortfolioFooter />
    </div>
  );
}
