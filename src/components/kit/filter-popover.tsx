"use client";

import { useState } from "react";

export function FilterPopover({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div className="ev-popover-anchor">
      <button
        type="button"
        className={`ev-pill ${open ? "ev-pill-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {current}
        <span className="ev-pill-caret" aria-hidden />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="ev-popover-dismiss"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="ev-popover-menu" role="menu">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="menuitem"
                className={`ev-popover-item ${o.value === value ? "ev-popover-item-active" : ""}`}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
