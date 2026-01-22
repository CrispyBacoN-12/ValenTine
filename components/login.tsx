"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const signInGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/WriteBoard`,
      },
    });
  };

  return <button onClick={signInGoogle}>Sign in with Google</button>;
}
