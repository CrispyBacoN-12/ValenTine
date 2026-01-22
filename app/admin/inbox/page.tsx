"use client";

import { useEffect, useState } from "react";

type InboxItem = {
  id: string;
  message: string;
  created_at: string;
};

export default function Page() {
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
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs text-rose-700 shadow-sm backdrop-blur">
              📬 Admin Inbox
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
              Letters
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              กล่องจดหมายทั้งหมดที่ส่งเข้ามา
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-xl border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md active:scale-[0.99]"
          >
            Refresh
          </button>
        </div>

        {err && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm backdrop-blur">
            {err}
          </div>
        )}

        <section className="rounded-3xl border border-rose-100 bg-white/70 p-6 shadow-2xl backdrop-blur">
          {loading && (
            <div className="rounded-2xl border border-rose-100 bg-white p-5 text-sm text-gray-600">
              Loading...
            </div>
          )}

          {!loading && items.length === 0 && !err && (
            <div className="py-14 text-center">
              <div className="text-3xl">💌</div>
              <div className="mt-2 text-sm font-medium text-gray-900">
                No letters yet
              </div>
              <div className="mt-1 text-sm text-gray-600">
                ยังไม่มีข้อความเข้ามา
              </div>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="space-y-4">
              {items.map((x) => (
                <article
                  key={x.id}
                  className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"
                >
                  <div className="text-xs text-gray-500">
                    {new Date(x.created_at).toLocaleString()}
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm text-gray-800">
                    {x.message}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
