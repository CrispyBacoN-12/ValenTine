import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();

  // 1) ต้อง login
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) หา recipient_code ของ user จาก profiles
  const { data: prof, error: profErr } = await supabase
    .from("profiles")
    .select("code")
    .eq("id", user.id)
    .single();

  if (profErr || !prof?.code) {
    return NextResponse.json({ error: "No recipient code on profile" }, { status: 400 });
  }

  // 3) pagination/limit
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);

  // 4) ดึงเฉพาะจดหมายที่ส่งมาหา code นี้
  const { data, error } = await supabase
    .from("letters")
    .select("id, message, created_at") // ✅ user ไม่เห็นคนส่ง (anonymous)
    .eq("recipient_code", prof.code)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data ?? []);
}
