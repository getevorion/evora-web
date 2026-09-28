import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";

export default function NotFound() {
  return (
    <SiteFrame>
      <section className="relative min-h-[72vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-text-faint font-medium">
            Error 404
          </p>
          <h1 className="mt-4 text-[32px] sm:text-[40px] font-medium tracking-[-0.028em] leading-[1.08] text-text">
            Page not found.
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">
            The page you&apos;re looking for doesn&apos;t exist, has moved, or
            was never here to begin with.
          </p>
          <Link
            href="/"
            style={{ color: "#0a0a0a" }}
            className="mt-8 inline-flex items-center gap-2 px-4 h-10 rounded-full text-[13px] font-medium bg-white shadow-[0_3px_6px_-2px_rgba(0,0,0,0.18),0_1px_1px_rgba(0,0,0,0.12)] hover:bg-[#e6e7ea] transition-colors"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} />
            Back home
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
