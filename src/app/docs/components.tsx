"use client";

import { ReactNode, useState, isValidElement } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Copy, Info, AlertTriangle, Lightbulb, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

function flatten(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flatten(props.children);
  }
  return "";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function DocSection({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-14 scroll-mt-[80px]">
      {children}
    </section>
  );
}

export function DocHero({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-[80px]">
      {children}
    </section>
  );
}

export function DocH1({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <header className="mb-6">
      {eyebrow ? (
        <p
          className="text-[13px] font-medium mb-3"
          style={{ color: "var(--docs-eyebrow)", letterSpacing: "-0.005em" }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className="text-[2.25rem] font-semibold tracking-[-0.028em] leading-[1.12]"
        style={{ color: "var(--docs-heading)" }}
      >
        {children}
      </h1>
    </header>
  );
}

function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this heading"
      className="absolute -left-6 top-0 bottom-0 w-5 inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity select-none no-underline"
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
      }}
    >
      <span
        className="block h-[18px] w-[3px] rounded-sm"
        style={{ background: "var(--docs-heading-anchor)" }}
        aria-hidden
      />
    </a>
  );
}

export function DocH2({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  const finalId = id || slugify(flatten(children));
  return (
    <h2
      id={finalId}
      className={cn(
        "group relative scroll-mt-[80px] text-[1.5rem] font-semibold tracking-[-0.022em] mt-10 mb-4 leading-[1.28]",
        className
      )}
      style={{ color: "var(--docs-heading)" }}
    >
      {finalId && <HeadingAnchor id={finalId} />}
      {children}
    </h2>
  );
}

export function DocH3({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  const finalId = id || slugify(flatten(children));
  return (
    <h3
      id={finalId}
      className={cn(
        "group relative scroll-mt-[80px] text-[1.09rem] font-semibold tracking-[-0.014em] mt-7 mb-2.5",
        className
      )}
      style={{ color: "var(--docs-heading)" }}
    >
      {finalId && <HeadingAnchor id={finalId} />}
      {children}
    </h3>
  );
}

export function DocLead({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[16px] leading-[1.6] mb-9"
      style={{ color: "var(--docs-lead)" }}
    >
      {children}
    </p>
  );
}

export function DocP({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn("text-[15px] leading-[1.72] mb-5", className)}
      style={{ color: "var(--docs-body)" }}
    >
      {children}
    </p>
  );
}

export function Sig({ children }: { children: ReactNode }) {
  return (
    <div
      className="not-prose text-[14.5px] py-2.5 mb-6 overflow-x-auto leading-[1.55] pl-4 border-l-[2px]"
      style={{
        color: "var(--docs-heading)",
        borderColor: "var(--docs-accent-soft)",
        fontFamily: "var(--font-docs)",
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code
      className="text-[0.86em] px-[6px] py-[1.5px] rounded-[4px] font-mono"
      style={{
        color: "var(--docs-code-fg)",
        background: "var(--docs-code-bg)",
        border: "1px solid var(--docs-code-border)",
      }}
    >
      {children}
    </code>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[12.5px] font-medium rounded-full"
      style={{
        color: "var(--docs-tag-fg)",
        background: "var(--docs-tag-bg)",
        border: "1px solid var(--docs-tag-border)",
        fontFamily: "var(--font-docs)",
      }}
    >
      {children}
    </span>
  );
}

export function DocCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {children}
    </div>
  );
}

export function DocCard({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="doc-card group relative flex flex-col rounded-[12px] p-4 transition-colors"
      style={{
        background: "var(--docs-card-bg)",
        border: "1px solid var(--docs-card-border)",
      }}
    >

      <div className="flex items-center gap-2.5 mb-2">
        <Icon
          className="size-[18px] shrink-0"
          strokeWidth={1.75}
          style={{ color: "var(--docs-heading)" }}
          aria-hidden
        />
        <h3
          className="text-[14.5px] font-semibold leading-[1.3]"
          style={{ color: "var(--docs-heading)" }}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-[13px] leading-[1.55]"
        style={{ color: "var(--docs-muted)" }}
      >
        {desc}
      </p>
    </Link>
  );
}

export function DocFrameworkList({
  heading,
  lead,
  items,
}: {
  heading: string;
  lead?: string;
  items: { icon: LucideIcon; title: string; desc: string; href: string }[];
}) {
  return (
    <section className="not-prose mb-10">
      <h2
        className="text-[1.5rem] font-semibold tracking-[-0.022em] mb-2 leading-[1.28]"
        style={{ color: "var(--docs-heading)" }}
      >
        {heading}
      </h2>
      {lead ? (
        <p
          className="text-[15px] leading-[1.6] mb-8"
          style={{ color: "var(--docs-muted)" }}
        >
          {lead}
        </p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.title}
              href={it.href}
              className="group flex flex-col gap-1.5 transition-opacity"
            >

              <div className="flex items-center gap-2.5">
                <Icon
                  className="size-[18px] shrink-0"
                  strokeWidth={1.75}
                  style={{ color: "var(--docs-heading)" }}
                  aria-hidden
                />
                <h3
                  className="text-[14.5px] font-semibold leading-[1.3]"
                  style={{ color: "var(--docs-heading)" }}
                >
                  {it.title}
                </h3>
              </div>
              <p
                className="text-[13px] leading-[1.55]"
                style={{ color: "var(--docs-muted)" }}
              >
                {it.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

type TT = "kw" | "type" | "str" | "cmt" | "num" | "pp" | "fn" | "plain";

const KWS = new Set([
  "auto","bool","break","case","catch","class","const","constexpr",
  "continue","default","delete","do","else","enum","explicit","false",
  "for","friend","if","inline","int","long","namespace","new","nullptr",
  "operator","private","protected","public","return","short","signed",
  "sizeof","static","struct","switch","template","this","throw","true",
  "try","typedef","typename","union","unsigned","using","virtual","void",
  "volatile","while","override","final","noexcept","decltype",
  "string","cout","cin","cerr","endl",
]);

const TC: Record<TT, string> = {
  kw:    "#c9a0dc",
  type:  "#e5e5e5",
  str:   "#e59f9f",
  cmt:   "#5f6470",
  num:   "#d8b06a",
  pp:    "#c0c0c0",
  fn:    "#e5e5e5",
  plain: "#d7d7d7",
};

function tokenize(src: string): { t: TT; v: string }[] {
  const out: { t: TT; v: string }[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "/" && src[i + 1] === "/") {
      const e = src.indexOf("\n", i);
      out.push({ t: "cmt", v: src.slice(i, e === -1 ? src.length : e) });
      i = e === -1 ? src.length : e;
      continue;
    }
    if (ch === "/" && src[i + 1] === "*") {
      const e = src.indexOf("*/", i + 2);
      out.push({ t: "cmt", v: src.slice(i, e === -1 ? src.length : e + 2) });
      i = e === -1 ? src.length : e + 2;
      continue;
    }
    if (ch === "#") {
      let j = i + 1;
      while (j < src.length && src[j] !== "\n") j++;
      out.push({ t: "pp", v: src.slice(i, j) });
      i = j;
      continue;
    }
    if (ch === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"' && src[j] !== "\n") {
        if (src[j] === "\\") j++;
        j++;
      }
      out.push({ t: "str", v: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (ch === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== "'" && src[j] !== "\n") {
        if (src[j] === "\\") j++;
        j++;
      }
      out.push({ t: "str", v: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(ch) && (i === 0 || !/[a-zA-Z_]/.test(src[i - 1]))) {
      let j = i;
      while (j < src.length && /[0-9a-fA-FxXuUlLfF.]/.test(src[j])) j++;
      out.push({ t: "num", v: src.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < src.length && src[k] === " ") k++;
      let t: TT;
      if (KWS.has(word)) t = "kw";
      else if (src[k] === "(" && !/^[A-Z]/.test(word)) t = "fn";
      else if (/^[A-Z]/.test(word)) t = "type";
      else t = "plain";
      out.push({ t, v: word });
      i = j;
      continue;
    }
    out.push({ t: "plain", v: ch });
    i++;
  }
  return out;
}

function highlight(src: string) {
  return tokenize(src).map((tok, idx) => (
    <span key={idx} style={{ color: TC[tok.t] }}>{tok.v}</span>
  ));
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-colors select-none"
      style={{ color: "var(--docs-code-toolbar-fg)" }}
      aria-label="Copy code"
    >
      {copied ? <Check className="size-3" strokeWidth={2.5} /> : <Copy className="size-3" strokeWidth={2.25} />}
      <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function CodeBlock({ label, children }: { label?: string; children: string }) {
  const trimmed = children.trim();
  const lang = label || "cpp";
  return (
    <div
      className="not-prose relative mb-6 rounded-[12px] overflow-hidden"
      style={{
        background: "var(--docs-code-block-bg)",
        border: "none",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ borderBottom: "none" }}
      >
        <div
          className="text-[12px] font-medium"
          style={{ color: "var(--docs-code-toolbar-fg)", fontFamily: "var(--font-docs)" }}
        >
          {lang}
        </div>
        <CopyBtn text={trimmed} />
      </div>
      <pre className="bg-transparent px-5 pt-2 pb-5 overflow-x-auto text-[13px] font-mono leading-[1.7] whitespace-pre">
        {highlight(trimmed)}
      </pre>
    </div>
  );
}

const CALLOUT_CONFIG = {
  blue: {
    icon: Info,
    accent: "var(--docs-callout-blue-accent)",
    iconColor: "var(--docs-callout-blue-icon)",
    bg: "var(--docs-callout-blue-bg)",
  },
  amber: {
    icon: AlertTriangle,
    accent: "var(--docs-callout-amber-accent)",
    iconColor: "var(--docs-callout-amber-icon)",
    bg: "var(--docs-callout-amber-bg)",
  },
  yellow: {
    icon: Lightbulb,
    accent: "var(--docs-callout-yellow-accent)",
    iconColor: "var(--docs-callout-yellow-icon)",
    bg: "var(--docs-callout-yellow-bg)",
  },
} as const;

export function Callout({
  variant = "blue",
  children,
}: {
  variant?: "blue" | "amber" | "yellow";
  children: ReactNode;
}) {
  const cfg = CALLOUT_CONFIG[variant];
  const Icon = cfg.icon;
  return (
    <div
      className="not-prose flex gap-3 rounded-[10px] px-4 py-3.5 mb-6"
      style={{
        background: cfg.bg,
        borderLeft: `2.5px solid ${cfg.accent}`,
      }}
    >
      <Icon className="size-[15px] shrink-0 mt-[3px]" strokeWidth={2} style={{ color: cfg.iconColor }} />
      <div className="text-[14px] leading-[1.7]" style={{ color: "var(--docs-body)" }}>
        {children}
      </div>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-[1px] text-[11px] font-medium ml-2 align-middle rounded-[4px]"
      style={{
        color: "var(--docs-badge-blue-fg)",
        background: "var(--docs-badge-blue-bg)",
      }}
    >
      {children}
    </span>
  );
}

export function ProBadge() {
  return (
    <span
      className="inline-flex items-center px-1.5 py-[1px] text-[11px] font-medium ml-2 align-middle rounded-[4px]"
      style={{
        color: "var(--docs-badge-amber-fg)",
        background: "var(--docs-badge-amber-bg)",
      }}
    >
      Pro / Ultra
    </span>
  );
}

export function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div
      className="not-prose mb-6 overflow-x-auto rounded-[10px]"
      style={{ border: "1px solid var(--docs-table-border)" }}
    >
      <table className="w-full text-[13.5px] border-collapse">
        <thead>
          <tr style={{ background: "var(--docs-table-head-bg)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2.5 px-4 text-[13px] font-semibold border-b"
                style={{
                  color: "var(--docs-heading)",
                  borderColor: "var(--docs-table-border)",
                  fontFamily: "var(--font-docs)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b last:border-b-0 transition-colors"
              style={{ borderColor: "var(--docs-table-border)" }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="py-2.5 px-4 text-[13.5px] align-top"
                  style={{
                    color: "var(--docs-body)",
                    fontFamily: "var(--font-docs)",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocOl({ items }: { items: (string | ReactNode)[] }) {
  return (
    <ol
      className="list-decimal list-outside pl-5 space-y-2.5 text-[15px] mb-5"
      style={{ color: "var(--docs-body)" }}
    >
      {items.map((item, i) => (
        <li key={i} className="leading-[1.7] pl-1">
          <span style={{ color: "var(--docs-body)" }}>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function DocUl({ items }: { items: (string | ReactNode)[] }) {
  return (
    <ul
      className="list-disc list-outside pl-5 space-y-2 text-[15px] mb-5"
      style={{ color: "var(--docs-body)" }}
    >
      {items.map((item, i) => (
        <li key={i} className="leading-[1.7] pl-1">{item}</li>
      ))}
    </ul>
  );
}

export function StatCards({ cards }: { cards: { val: string; lbl: string }[] }) {
  return (
    <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      {cards.map((c) => (
        <div
          key={c.lbl}
          className="rounded-[10px] px-4 py-3.5"
          style={{
            background: "var(--docs-statcard-bg)",
            border: "1px solid var(--docs-statcard-border)",
          }}
        >
          <div
            className="text-[1.4rem] font-semibold tracking-[-0.02em] leading-none"
            style={{ color: "var(--docs-heading)" }}
          >
            {c.val}
          </div>
          <div className="text-[12.5px] mt-2" style={{ color: "var(--docs-muted)" }}>
            {c.lbl}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Divider() {
  return (
    <hr
      className="my-16 border-0"
      style={{ borderTop: "1px solid var(--docs-divider)" }}
    />
  );
}

export { ChevronRight };
