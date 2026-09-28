"use client";

import React, { useEffect, useRef } from "react";

const LENGTH = 6;

export default function CodeInput({
  value,
  onChange,
  onComplete,
  disabled,
  autoFocus,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(LENGTH, " ").slice(0, LENGTH).split("");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const set = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, LENGTH);
    onChange(clean);
    if (clean.length === LENGTH) onComplete?.(clean);
    return clean;
  };

  const focusAt = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(LENGTH - 1, i))];
    el?.focus();
    el?.select();
  };

  const handleChange = (i: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;

    if (typed.length > 1) {
      const next = set(typed);
      focusAt(next.length);
      return;
    }

    const chars = value.padEnd(LENGTH, " ").slice(0, LENGTH).split("");
    chars[i] = typed;
    const next = set(chars.join("").replace(/\s/g, ""));
    if (next.length < LENGTH) focusAt(i + 1);
    else refs.current[LENGTH - 1]?.blur();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = value.split("");
      if (chars[i]) {
        chars[i] = "";
        set(chars.join(""));
        return;
      }
      chars[i - 1] = "";
      set(chars.join(""));
      focusAt(i - 1);
      return;
    }
    if (e.key === "ArrowLeft") { e.preventDefault(); focusAt(i - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); focusAt(i + 1); }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const next = set(e.clipboardData.getData("text"));
    focusAt(next.length);
  };

  return (
    <div className="ev-code-input" role="group" aria-label="Verification code">
      {Array.from({ length: LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className="ev-code-box"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={LENGTH}
          value={digits[i].trim()}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          data-filled={digits[i].trim() ? "1" : "0"}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
