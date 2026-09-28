"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";
import { Logo } from "./Logo";
import { AuthNav } from "./AuthNav";

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(NAV[0].section);

  useEffect(() => {
    if (pathname !== "/") return;

    const ids = NAV.map((item) => item.section);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const fromHash = window.location.hash.replace("#", "");
    if (ids.includes(fromHash)) setActiveSection(fromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-32% 0px -58% 0px",
        threshold: [0.08, 0.18, 0.32, 0.5],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="snav">
      <nav className="snav-inner" aria-label="Main">
        <div className="snav-left">
          <Link href="/" aria-label="Home" className="snav-brand">
            <Logo size={22} withWordmark={false} />
          </Link>

          <ul className="snav-links">
            {NAV.map((item) => {
              const active =
                item.href.startsWith("/") && !item.href.startsWith("/#")
                  ? pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                  : pathname === "/" && activeSection === item.section;
              return (
                <li key={item.href}>
                  <a href={item.href} data-active={active ? "true" : undefined}>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="snav-actions">
          <AuthNav />
        </div>
      </nav>
    </header>
  );
}
