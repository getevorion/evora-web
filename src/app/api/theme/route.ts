import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { theme } = (await req.json().catch(() => ({}))) as { theme?: string };
  const value = theme === "light" ? "light" : "dark";
  const res = NextResponse.json({ theme: value });
  res.cookies.set("evora_theme", value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
