import { NextResponse } from "next/server";
import { CHANGELOG, pathFor, statusLabel } from "@/lib/changelog";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    latest: CHANGELOG[0]?.version ?? null,
    entries: CHANGELOG.map((e) => ({
      version: e.version,
      title: e.title,
      body: e.body,
      details: e.details ?? [],
      date: e.date,
      iso: e.iso,
      status: e.status,
      label: statusLabel(e.status),
      codename: e.codename ?? null,
      notes: e.notes ?? [],
      url: `${SITE_URL}${pathFor(e)}`,
    })),
  });
}
