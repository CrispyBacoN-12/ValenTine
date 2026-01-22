"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();
  useEffect(() => {
    (async () => {
      try {
        // 1) Ensure user exists
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;

        if (!user) {
          window.location.href = "/login";
          return;
        }

        // 2) Try fetch profile
        const { data: p1, error: p1Err } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (p1Err) throw p1Err;

        // 3) If missing -> create (upsert) then refetch
        if (!p1) {
          const { error: upsertErr } = await supabase
            .from("profiles")
            .upsert(
              { id: user.id, email: user.email, updated_at: new Date().toISOString() },
              { onConflict: "id" }
            );

          if (upsertErr) throw upsertErr;

          const { data: p2, error: p2Err } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (p2Err) throw p2Err;
          setProfile(p2);
        } else {
          setProfile(p1);
        }
      } catch (e: any) {
        console.error(e);
        alert(e?.message ?? "Unexpected error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) alert(error.message);
    else alert("Saved!");
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile</div>;

 return (
  <div
    style={{
      maxWidth: 420,
      margin: "40px auto",
      padding: 24,
      borderRadius: 16,
      background: "#ffffff",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
    }}
  >
    {/* Avatar */}
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
      <img
        src={profile.avatar_url || "/avatar-placeholder.png"}
        alt="Profile avatar"
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #f1f1f1",
        }}
      />
    </div>

    {/* Name */}
    <h2
      style={{
        textAlign: "center",
        margin: "8px 0 4px",
        fontSize: 22,
        fontWeight: 600,
      }}
    >
      {profile.full_name || "Unnamed User"}
    </h2>

    {/* Email */}
    <p
      style={{
        textAlign: "center",
        color: "#666",
        fontSize: 14,
        marginBottom: 24,
      }}
    >
      {profile.email}
    </p>

    {/* Form */}
    <div style={{ display: "grid", gap: 14 }}>
      <label style={{ fontSize: 13, color: "#555" }}>
        Full name
        <input
          value={profile.full_name ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, full_name: e.target.value })
          }
          style={{
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />
      </label>

      <label style={{ fontSize: 13, color: "#555" }}>
        Avatar URL
        <input
          value={profile.avatar_url ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, avatar_url: e.target.value })
          }
          style={{
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />
      </label>

      <button
        onClick={save}
        style={{
          marginTop: 12,
          padding: "12px 16px",
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Save Profile
      </button>
    </div>
  </div>
);

}
