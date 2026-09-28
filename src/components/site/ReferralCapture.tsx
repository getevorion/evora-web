"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const STORAGE_KEY = 'evora_ref';
const CODE_RE = /^[A-Za-z0-9]{4,16}$/;

export default function ReferralCapture() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (!ref || !CODE_RE.test(ref)) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, ref.toUpperCase());
      }
    } catch {
    }
  }, [searchParams, pathname]);

  return null;
}
