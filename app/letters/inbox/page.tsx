"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/components/Authcontext";

type InboxItem = {
  id: string;
  message: string;
  created_at: string;
};

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/letters/inbox?limit=100", {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        setErr((data as any)?.error || "Failed to load inbox");
        return;
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load inbox");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AuthProvider>
      <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-white">
        {/* glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="absolute top-1/4 left-10 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute top-1/3 right-10 h-[420px] w-[420px] rounded-full bg-fuchsia-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-6 py-12">
          {/* header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs text-rose-700 shadow-sm backdrop-blur">
                📬 Your Inbox
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Letters to you
              </h1>
              <p className="text-sm text-gray-600">
                ข้อความลับที่ถูกส่งถึงคุณ — อ่านช้า ๆ ก็ได้ 💗
              </p>
            </div>

            <button
              onClick={load}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md active:scale-[0.99]"
            >
              <span className={loading ? "animate-spin" : ""}>⟳</span>
              Refresh
            </button>
          </div>

          {/* error */}
          {err && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm backdrop-blur">
              {err}
            </div>
          )}

          {/* list container */}
          <section className="mt-8 rounded-3xl border border-rose-100 bg-white/70 p-6 shadow-2xl backdrop-blur sm:p-8">
            {/* loading skeleton */}
            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"
                  >
                    <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                      <div className="h-3 w-11/12 animate-pulse rounded bg-gray-100" />
                      <div className="h-3 w-8/12 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* items */}
            {!loading && items.length > 0 && (
              <div className="space-y-4">
                {items.map((x) => (
                  <article
                    key={x.id}
                    className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {/* soft shine */}
                    <div className="pointer-events-none absolute -left-12 -top-12 h-28 w-28 rounded-full bg-rose-200/40 blur-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                    <header className="flex items-start justify-between gap-4">
                      <div className="text-xs text-gray-500">
                        {new Date(x.created_at).toLocaleString()}
                      </div>

                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-700">
                        secret
                      </span>
                    </header>

                    <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                      {x.message}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* empty */}
            {!loading && !err && items.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                <div className="text-3xl">💌</div>
                <div className="text-sm font-medium text-gray-900">
                  No letters yet
                </div>
                <div className="text-sm text-gray-600">
                  ยังไม่มีใครส่งมา…แต่เดี๋ยวก็มีแน่ 😳
                </div>

                <button
                  onClick={load}
                  className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black active:scale-[0.99]"
                >
                  Check again
                </button>
              </div>
            )}
          </section>

          {/* footer note */}
         
        </div>
      </main>
    </AuthProvider>
  );
}
