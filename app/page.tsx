"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const normalized = useMemo(
    () => code.trim().replace(/\s+/g, "").toUpperCase(),
    [code]
  );

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-white">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute top-1/4 left-10 h-[420px] w-[420px] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-[420px] w-[420px] rounded-full bg-fuchsia-200/30 blur-3xl" />
      </div>

      {/* center container */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        {/* badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-xs text-rose-700 shadow-sm backdrop-blur">
          💌 Secret Valentine Letters 
        </div>

        {/* hero */}
        <h1 className="text-center text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          จดหมายลับวันวาเลนไทน์
        </h1>
        <p className="mt-4 max-w-2xl text-center text-base leading-relaxed text-gray-600 sm:text-lg">
          บอกความในใจแบบไม่ต้องเปิดเผยตัวตน  
          <br className="hidden sm:block" />
          แค่ข้อความ กับความรู้สึกจริง ๆ ก็พอแล้ว
        </p>

        {/* action card */}
     <section className="mt-10 w-full max-w-4xl rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-2xl backdrop-blur sm:p-10">
  <div className="grid gap-6 sm:grid-cols-2">
    
    {/* ช่องซ้าย */}
    <button
      onClick={() => router.push("/WriteBoard")}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl
                 bg-gradient-to-r from-rose-500 to-pink-500
                 px-6 py-6 text-left text-white shadow-lg
                 transition hover:brightness-105 active:scale-[0.98]"
    >
      <span className="absolute right-5 top-5 text-xl">❤️</span>

      <div>
        <div className="text-sm opacity-90">เริ่มเลย</div>
        <div className="mt-1 text-2xl font-semibold">
          เขียนจดหมายลับ
        </div>
      </div>

      <div className="mt-6 text-sm opacity-90">
        ส่งความในใจแบบไม่เปิดเผยตัวตน
      </div>
    </button>

    {/* ช่องขวา */}
    <button
      onClick={() => router.push("/letters/inbox")}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl
                 bg-gradient-to-r from-pink-500 to-rose-500
                 px-6 py-6 text-left text-white shadow-lg
                 transition hover:brightness-105 active:scale-[0.98]"
    >
      <span className="absolute right-5 top-5 text-xl">📬</span>

      <div>
        <div className="text-sm opacity-90">มีจดหมายถึงคุณ</div>
        <div className="mt-1 text-2xl font-semibold">
          เปิดจดหมาย
        </div>
      </div>

      <div className="mt-6 text-sm opacity-90">
        อ่านจดหมายลับที่คนพิเศษส่งมา
      </div>
    </button>

  </div>
</section>


        {/* footer */}
        <footer className="mt-10 text-center text-xs text-gray-500">
          Made for Valentine’s • ส่งด้วยความกล้าเล็ก ๆ ของหัวใจ 💞
        </footer>
      </div>
    </main>
  );
}

function Trust({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-white px-4 py-3 shadow-sm">
      <span>{icon}</span>
      <span className="font-medium">{title}</span>
    </div>
  );
}
