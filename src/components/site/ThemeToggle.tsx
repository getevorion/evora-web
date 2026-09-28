"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [, start] = useTransition();

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "light" || t === "dark") setTheme(t);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";

    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { transition: none !important; }";
    document.head.appendChild(style);

    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);

    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });

    start(async () => {
      try {
        await fetch("/api/theme", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ theme: next }),
        });
      } catch {}
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggle}
      className={cn(className)}
    >
      {theme === "dark" ? <Sun className="size-[16px]" strokeWidth={1.75} /> : <Moon className="size-[16px]" strokeWidth={1.75} />}
    </Button>
  );
}
