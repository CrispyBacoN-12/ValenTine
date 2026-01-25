import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json().catch(() => ({}));

    const recipient_code = String(body.recipient_code || "").trim();
    const message = String(body.message || "").trim();

    if (!recipient_code) {
      return NextResponse.json({ error: "Missing recipient_code" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is empty" }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000)" }, { status: 400 });
    }

    // 1) หา recipient จาก code
    const { data: recipient, error: recErr } = await supabase
      .from("recipients")
      .select("id")
      .eq("code", recipient_code)
      .single();

    if (recErr || !recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    // 2) insert letter
    const { error: insErr } = await supabase.from("letters").insert({
      recipient_code: recipient.code,
      message,
    });

    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
