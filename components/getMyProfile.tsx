import { createClient } from "@/lib/supabase/client"; // ของคุณ

const supabase = createClient();

export async function getMyProfile() {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    // ยังไม่ล็อกอิน
    return { user: null, profile: null };
  }

  // 1) ลองดึงโปรไฟล์
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("id,email,full_name,avatar_url,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  // 2) ถ้าไม่มีโปรไฟล์ (null) ให้สร้างให้เลย
  if (!profile && !profileErr) {
    const { data: created, error: createErr } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
      })
      .select("id,email,full_name,avatar_url,updated_at")
      .single();

    if (createErr) throw createErr;
    return { user, profile: created };
  }

  if (profileErr) throw profileErr;
  return { user, profile };
}
