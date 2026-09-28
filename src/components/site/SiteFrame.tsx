import { Navbar } from "./Navbar";
import { PromoBar } from "./PromoBar";
import { Footer } from "./Footer";
import { SiteGradient } from "./SiteGradient";
import "./marketing-pages.css";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteGradient />
      <Navbar />
      <PromoBar />
      <div className="relative z-[1]">
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
