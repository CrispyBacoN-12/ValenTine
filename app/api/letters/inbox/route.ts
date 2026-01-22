import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("code")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.code) {
    return NextResponse.json({ error: "No profile code yet" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("letters")
    .select("id, message, created_at, sender_full_name, sender_email")
    .eq("recipient_code", profile.code)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
