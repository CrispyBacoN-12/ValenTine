import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // ✅ ไม่ต้อง require login เพราะหน้า WriteBoard ต้อง public

  const { data, error } = await supabase
    .from("recipients")
    .select("id, full_name, email, code, avatar_url")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).map((r: any) => ({
    id: r.id,
    code: r.code,
    display_name: r.full_name ?? r.email ?? r.code ?? "Unknown",
    photo_url: r.photo_url ?? "/avatar-placeholder.png",
  }));

  return NextResponse.json(items);
}
