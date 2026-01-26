"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Recipient = {
  id: string;
  code: string;
  display_name: string;
  photo_url: string;
};

export default function WriteBoard() {
  const [items, setItems] = useState<Recipient[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErr(null);

    fetch("/api/recipients")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;

        if (d?.error) {
          setErr(d.error);
          setItems([]);
          return;
        }

        setItems(Array.isArray(d) ? d : []);
      })
      .catch(() => !cancelled && setErr("Failed to load recipients"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const hasItems = useMemo(() => items.length > 0, [items.length]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-white">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute top-1/4 left-10 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-[420px] w-[420px] rounded-full bg-fuchsia-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-12">
        {/* header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs text-rose-700 shadow-sm backdrop-blur">
            💌 Secret Valentine Letters
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Choose a person
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Select who you want to write to
          </p>
        </div>

        {/* error */}
        {err && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm backdrop-blur">
            {err}
          </div>
        )}

        {/* grid */}
        <section className="mt-10 rounded-3xl border border-rose-100 bg-white/70 p-6 shadow-2xl backdrop-blur sm:p-8">
          {/* loading skeleton */}
          {loading && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
                >
                  <div className="aspect-square w-full animate-pulse rounded-xl bg-gray-100" />
                  <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {/* empty */}
          {!loading && !err && !hasItems && (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="text-3xl">🌸</div>
              <div className="text-sm font-medium text-gray-800">
                No recipients yet
              </div>
              <div className="text-sm text-gray-500">
                Ask admin to add people to the recipients list.
              </div>
            </div>
          )}

          {/* items */}
          {!loading && hasItems && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {items.map((r) => (
                <Link
                  key={r.id}
                  href={`/write/${r.code}`}
                  className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-rose-200/40 blur-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.photo_url || "/avatar-placeholder.png"}
                      alt={r.display_name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {r.display_name}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Click to write
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center text-xs text-gray-500">
            Tip: การเขียนจดหมายไม่จำเป็นต้องล็อกอิน 💌
          </div>
        </section>
      </div>
    </main>
  );
}
