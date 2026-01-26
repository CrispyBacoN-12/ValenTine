import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipients")
    .select("id, full_name, code, avatar_url")
    .order("code", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).map((r: any) => ({
    id: r.id,
    code: r.code,
    display_name: r.full_name ?? r.code ?? "Unknown",
    photo_url: r.avatar_url ?? "/avatar-placeholder.png",
  }));

  return NextResponse.json(items);
}
