import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import jwt from "jsonwebtoken";

function isAdmin(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return false;

  try {
    const p = jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as any;
    return p?.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const display_name = (body?.display_name as string)?.trim();
  const photo_url = (body?.photo_url as string)?.trim();
  const to_email = (body?.to_email as string)?.trim();

  if (!display_name || !photo_url || !to_email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("recipients")
    .insert({ display_name, photo_url, to_email, is_active: true })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data?.id });
}
