"use client";

import React, { useMemo } from "react";

export type Strength = 0 | 1 | 2 | 3 | 4;

const LABELS: Record<Strength, string> = {
  0: "Too short",
  1: "Weak",
  2: "Fair",
  3: "Strong",
  4: "Excellent",
};

const SHAPES = [
  "password", "passwd", "qwerty", "asdf", "zxcv", "letmein", "welcome",
  "admin", "iloveyou", "monkey", "dragon", "football", "evora",
];

function hasSequence(value: string): boolean {
  const s = value.toLowerCase();
  let run = 1;
  for (let i = 1; i < s.length; i++) {
    const step = s.charCodeAt(i) - s.charCodeAt(i - 1);
    if (step === 1 || step === -1) {
      run += 1;
      if (run >= 4) return true;
    } else {
      run = 1;
    }
  }
  return false;
}

function hasLongRepeat(value: string): boolean {
  return /(.)\1{2,}/.test(value);
}

export function scorePassword(value: string): Strength {
  if (value.length < 8) return 0;

  const classes =
    (/[a-z]/.test(value) ? 1 : 0) +
    (/[A-Z]/.test(value) ? 1 : 0) +
    (/\d/.test(value) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(value) ? 1 : 0);

  let points = 0;
  if (value.length >= 8) points += 1;
  if (value.length >= 12) points += 1;
  if (value.length >= 16) points += 1;
  if (value.length >= 20) points += 1;

  points += Math.max(0, classes - 1);

  const lower = value.toLowerCase();
  const shaped = SHAPES.some((w) => lower.includes(w));

  if (shaped) points -= 3;
  if (hasSequence(value)) points -= 2;
  if (hasLongRepeat(value)) points -= 1;
  if (new Set(value).size <= 4) points -= 2;

  if (points <= 1) return 1;
  if (points <= 3) return 2;
  if (points <= 5) return 3;
  return 4;
}

export default function PasswordStrength({ value }: { value: string }) {
  const score = useMemo(() => scorePassword(value), [value]);

  if (!value) return null;

  return (
    <div className="ev-pw-meter" data-score={score}>
      <div className="ev-pw-track" aria-hidden="true">
        {[1, 2, 3, 4].map((seg) => (
          <span key={seg} className="ev-pw-seg" data-on={score >= seg ? "1" : "0"} />
        ))}
      </div>
      <p className="ev-pw-label" aria-live="polite">
        {LABELS[score]}
        {score === 0 && <span className="ev-pw-hint"> · 8 characters minimum</span>}
      </p>
    </div>
  );
}
