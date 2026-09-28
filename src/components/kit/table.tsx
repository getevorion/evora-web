"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EvTableHead({
  columns,
  colsClass,
}: {
  columns: ReactNode[];
  colsClass?: string;
}) {
  return (
    <div className={cn("ev-table-head", colsClass)}>
      {columns.map((col, i) => (
        <div key={i} className="ev-th">
          {col}
        </div>
      ))}
    </div>
  );
}

export function EvTableRow({
  children,
  colsClass,
  selected,
  onClick,
  className,
}: {
  children: ReactNode;
  colsClass?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "ev-row",
        colsClass,
        selected && "ev-row-selected",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </li>
  );
}

export function EvCell({
  children,
  mono,
  className,
}: {
  children: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("ev-cell", mono && "ev-cell-mono", className)}>{children}</div>
  );
}

export function EvTableList({ children }: { children: ReactNode }) {
  return <ul className="ev-table">{children}</ul>;
}
