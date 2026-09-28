"use client";

import type { ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { EvButton } from "./button";

export function EvSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "size-4" : size === "lg" ? "size-8" : "size-6";
  return <Loader2 className={`${s} animate-spin text-[color:var(--dev-brand)]`} />;
}

export function EvEmpty({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ev-empty">
      {icon ? (
        <div className="ev-empty-icon text-[color:var(--dev-muted)] [&>svg]:size-6">{icon}</div>
      ) : null}
      <div className="ev-empty-copy">
        <p className="text-[13px] font-[510] text-[color:var(--dev-text)]">{title}</p>
        {description ? (
          <p className="text-[12px] mt-1 text-[color:var(--dev-subtle)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="ev-empty-action">{action}</div> : null}
    </div>
  );
}

export function EvError({
  message = "something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="ev-empty">
      <div className="ev-empty-icon text-[color:var(--dev-status-danger)] [&>svg]:size-6">
        <AlertCircle />
      </div>
      <div className="ev-empty-copy">
        <p className="text-[13px] font-[510] text-[color:var(--dev-text)]">{message}</p>
      </div>
      {onRetry ? (
        <div className="ev-empty-action">
          <EvButton variant="ghost" onClick={onRetry}>
            try again
          </EvButton>
        </div>
      ) : null}
    </div>
  );
}

export const Spinner = EvSpinner;
export const EmptyState = EvEmpty;
export const ErrorState = EvError;
