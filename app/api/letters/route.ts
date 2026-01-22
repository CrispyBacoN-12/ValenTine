import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  // ❌ ไม่เช็ค login ตรงนี้
  const body = await req.json().catch(() => ({}));
  const recipient_code = String(body?.recipient_code || "").trim().toUpperCase();
  const message = String(body?.message || "").trim();

  if (!recipient_code) {
    return NextResponse.json({ error: "Missing recipient_code" }, { status: 400 });
  }
  if (!message || message.length < 1) {
    return NextResponse.json({ error: "Message is empty" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // ✅ กันส่งมั่ว: ถ้าคุณมี user token (ตามที่คุณบอกในหน้า WriteBoard)
  // ให้ส่ง header x-user-token มา แล้วเช็คกับ ENV
  const token = req.headers.get("x-user-token") || "";
  if (process.env.USER_TOKEN && token !== process.env.USER_TOKEN) {
    return NextResponse.json({ error: "Invalid user token" }, { status: 401 });
  }

  const { error } = await supabase.from("letters").insert({
    recipient_code,
    message,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
