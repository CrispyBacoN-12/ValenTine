import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // 1) Require login
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Fetch recipients
  const { data, error } = await supabase
    .from("recipients")
    .select("id, full_name, email, code")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3) Shape for UI
 const items = (data ?? []).map((r: any) => ({
  id: r.id,
  code: r.code, // ✅ เพิ่ม
  display_name: r.full_name ?? r.email ?? r.code ?? "Unknown",
  photo_url: "/avatar-placeholder.png",
}));

  return NextResponse.json(items);
}
