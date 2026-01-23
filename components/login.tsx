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

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-white px-6">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-300/40 blur-3xl" />
        <div className="absolute top-1/3 left-10 h-[400px] w-[400px] rounded-full bg-rose-300/30 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-fuchsia-300/30 blur-3xl" />
      </div>

      {/* card */}
      <section className="relative w-full max-w-md rounded-3xl border border-rose-100 bg-white/80 p-8 shadow-2xl backdrop-blur">
        <div className="text-center">
          <div className="text-4xl">💌</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            เข้าสู่ระบบเพื่อเปิดจดหมายลับของคุณ
          </p>
        </div>

        <button
          onClick={signInGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 hover:shadow-md active:scale-[0.99]"
        >
          {/* Google icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            aria-hidden
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.01 1.53 7.39 2.81l5.42-5.42C33.52 3.77 29.1 1.5 24 1.5 14.73 1.5 6.98 6.88 3.45 14.64l6.6 5.13C11.8 13.18 17.4 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.53-.14-3-.39-4.42H24v8.36h12.7c-.55 2.95-2.18 5.45-4.64 7.14l7.12 5.52c4.16-3.84 6.32-9.49 6.32-16.6z"
            />
            <path
              fill="#FBBC05"
              d="M10.05 28.77c-.64-1.91-1-3.95-1-6.02s.36-4.11 1-6.02l-6.6-5.13C1.51 15.13.5 19.66.5 24.5s1.01 9.37 2.95 12.9l6.6-5.13z"
            />
            <path
              fill="#34A853"
              d="M24 47.5c5.1 0 9.52-1.68 12.7-4.56l-7.12-5.52c-1.98 1.33-4.5 2.11-7.58 2.11-6.6 0-12.2-3.68-13.95-9.27l-6.6 5.13C6.98 42.12 14.73 47.5 24 47.5z"
            />
          </svg>

          <span>Sign in with Google</span>
        </button>

        <p className="mt-6 text-center text-xs text-gray-400">
          ใช้เพื่อยืนยันตัวตนในการเปิดจดหมายเท่านั้น <br />
          การเขียนจดหมายไม่จำเป็นต้องล็อกอิน
        </p>
      </section>
    </main>
  );
}
