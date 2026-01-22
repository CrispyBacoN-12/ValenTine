"use client";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const signInGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/profile`,
      },
    });
  };

  return <button onClick={signInGoogle}>Sign in with Google</button>;
}
