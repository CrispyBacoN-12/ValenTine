import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const recipient_code = body?.recipient_code as string | undefined;
  const messageRaw = body?.message as string | undefined;

  if (!recipient_code) {
    return NextResponse.json({ error: "Missing recipient_code" }, { status: 400 });
  }
  const message = (messageRaw ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // ดึงชื่อผู้ส่งจาก profiles (optional)
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("letters").insert({
    sender_user_id: user.id,
    sender_email: user.email,
    sender_full_name: myProfile?.full_name ?? null,
    recipient_code,
    message,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
