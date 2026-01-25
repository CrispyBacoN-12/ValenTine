"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type RecipientLite = {
  id: string;
  code: string;
  display_name: string;
  photo_url: string;
};

export default function WritePage() {
  const params = useParams<{ id: string }>(); // ✅ ให้ชื่อ param เป็น code
  const router = useRouter();

  const recipientCode = (params?.id || "").toString().toUpperCase();

  const [recipient, setRecipient] = useState<RecipientLite | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loadingRecipient, setLoadingRecipient] = useState(true);
  const [sending, setSending] = useState(false);

  const remaining = useMemo(() => 1000 - message.length, [message.length]);
  const tooLong = message.length > 1000;

  useEffect(() => {
    let cancelled = false;
    setLoadingRecipient(true);
    setErr(null);

    fetch("/api/recipients")
      .then((r) => r.json())
      .then((list: RecipientLite[] | any) => {
        if (cancelled) return;
        if (list?.error) return setErr(list.error);
console.log("params =", params);
console.log("recipientCode =", recipientCode);

        const found =
          (list as RecipientLite[]).find(
            (x) => x.code?.toUpperCase() === recipientCode
          ) || null;

        setRecipient(found);
      })
      .catch(() => !cancelled && setErr("Failed to load recipient"))
      .finally(() => !cancelled && setLoadingRecipient(false));

    return () => {
      cancelled = true;
    };
  }, [recipientCode]);

  async function submit() {
    setErr(null);
    setStatus(null);

    const msg = message.trim();
    if (!recipientCode) return setErr("Missing recipient code");
    if (!msg) return setErr("Message is empty");
    if (msg.length > 1000) return setErr("Message too long (max 1000)");

    try {
      setSending(true);

      // ✅ ส่งแบบ public: ไม่ต้อง login
      const res = await fetch("/api/letters/send", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          // ถ้าคุณใช้ user token กัน spam ให้เปิดบรรทัดนี้
          // "x-user-token": localStorage.getItem("si135_user_token") ?? "",
        },
        body: JSON.stringify({
          recipient_code: recipientCode,
          message: msg,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setErr(data?.error || "Failed to send");

      setStatus("Sent ✅");
      setMessage("");
      setTimeout(() => router.push("/"), 800);
    } catch (e: any) {
      setErr(e?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-white">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute top-1/4 left-10 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-[420px] w-[420px] rounded-full bg-fuchsia-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 py-12">
        {/* header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs text-rose-700 shadow-sm backdrop-blur">
            💌 Write a Secret Letter
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Write a letter
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            เขียนความในใจแบบไม่เปิดเผยตัวตน
          </p>
        </div>

        {/* recipient card */}
        <section className="mt-8 rounded-3xl border border-rose-100 bg-white/70 p-6 shadow-2xl backdrop-blur sm:p-8">
          {err && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
              {err}
            </div>
          )}

          {status && (
            <div className="mb-4 rounded-2xl border border-green-200 bg-green-50/80 p-4 text-sm text-green-700">
              {status}
            </div>
          )}

          {loadingRecipient ? (
            <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ) : recipient ? (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipient.photo_url}
                    alt={recipient.display_name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {recipient.display_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    anonymous to receiver
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                {recipientCode}
              </span>
            </div>
          ) : (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50/80 p-4 text-sm text-yellow-800">
              Recipient not found (หรือยังโหลดไม่เสร็จ)
            </div>
          )}

          {/* textarea */}
          <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={9}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
              placeholder="ถึงคุณคนนั้น…&#10;&#10;วันนี้เราอยากบอกว่า..."
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs">
                <span className={tooLong ? "text-red-600" : "text-gray-500"}>
                  {remaining} chars left
                </span>
                {tooLong && (
                  <span className="ml-2 text-xs text-red-600">
                    (เกิน 1000 ตัวอักษร)
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.back()}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 active:scale-[0.99]"
                >
                  Back
                </button>

                <button
                  onClick={submit}
                  disabled={
                    sending ||
                    loadingRecipient ||
                    !recipient ||
                    !message.trim() ||
                    tooLong
                  }
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send 💌"}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            หลังส่งแล้วระบบจะพากลับหน้าแรกอัตโนมัติ
          </p>
        </section>
      </div>
    </main>
  );
}
