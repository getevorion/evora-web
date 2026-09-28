"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type BtnVariant = "ghost" | "primary" | "danger" | "secondary" | "default" | "outline";

const cls: Record<BtnVariant, string> = {
  ghost: "ev-btn-ghost",
  primary: "ev-btn-primary",
  default: "ev-btn-primary",
  danger: "ev-btn-danger",
  secondary: "ev-btn-ghost",
  outline: "ev-btn-ghost",
};

type Size = "xs" | "sm" | "md" | "lg";

export function EvButton({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  icon,
  iconPosition = "left",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}) {
  const heights: Record<Size, string> = {
    xs: "h-6 text-[11px] px-2",
    sm: "h-7 text-[11px] px-2.5",
    md: "",
    lg: "h-9 text-[13px] px-4",
  };
  return (
    <button
      type="button"
      className={cn(cls[variant], heights[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 className="size-3 animate-spin" />
      ) : icon && iconPosition === "left" ? (
        icon
      ) : null}
      {children}
      {!loading && icon && iconPosition === "right" ? icon : null}
    </button>
  );
}

export function EvLinkButton({
  href,
  children,
  variant = "ghost",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: BtnVariant;
  className?: string;
}) {
  return (
    <a href={href} className={cn(cls[variant], className)}>
      {children}
    </a>
  );
}
