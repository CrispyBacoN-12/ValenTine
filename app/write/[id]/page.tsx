    "use client";

    import { useEffect, useMemo, useState } from "react";
    import { useParams, useRouter } from "next/navigation";
    
type RecipientLite = { id: string; code: string; display_name: string; photo_url: string };

    export default function WritePage() {
      const params = useParams<{ id: string }>();
      const recipientId = params.id;
      const router = useRouter();
const recipientCode = params.id;
      const [recipient, setRecipient] = useState<RecipientLite | null>(null);
      const [message, setMessage] = useState("");
      const [status, setStatus] = useState<string | null>(null);
      const [err, setErr] = useState<string | null>(null);

      const remaining = useMemo(() => 1000 - message.length, [message.length]);

      useEffect(() => {
        fetch("/api/recipients")
          .then(r => r.json())
          .then((list: RecipientLite[] | any) => {
            if (list?.error) return setErr(list.error);
            const found = (list as RecipientLite[]).find(x => x.code === recipientCode) || null;
            setRecipient(found);
          })
          .catch(() => setErr("Failed to load recipient"));
      }, [recipientCode]);
      async function submit() {
        setErr(null);
        setStatus(null);

        const msg = message.trim();
        if (!msg) return setErr("Message is empty");
        if (msg.length > 1000) return setErr("Message too long");
          
const res = await fetch("/api/letters", {
  method: "POST",
  headers: { "content-type": "application/json" },
  credentials: "include", // ✅ ส่ง cookie ไปด้วย
 body: JSON.stringify({
  recipient_code: recipientCode, // ✅ ชื่อตรงกับ server
  message: msg,
}),
});


        const data = await res.json().catch(() => ({}));
        if (!res.ok) return setErr(data?.error || "Failed to send");

        setStatus("Sent ✅");
        setMessage("");
        setTimeout(() => router.push("/"), 700);
      }

      return (
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">Write a letter</h1>

          {recipient ? (
            <div className="flex items-center gap-3 rounded-xl border bg-white p-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={recipient.photo_url} alt={recipient.display_name} className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="font-medium">{recipient.display_name}</div>
                <div className="text-xs text-gray-500">anonymous to receiver</div>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
              Recipient not found (หรือยังโหลดไม่เสร็จ)
            </div>
          )}

          <div className="rounded-xl border bg-white p-3 space-y-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Write something nice..."
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{remaining} chars left</span>
              <button
                onClick={submit}
                className="rounded-lg bg-black px-4 py-2 text-white text-sm hover:opacity-90"
              >
                Send
              </button>
            </div>
          </div>

          {err && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{err}</div>}
          {status && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{status}</div>}
        </div>
      );
    }
