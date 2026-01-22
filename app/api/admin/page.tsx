"use client";

import { useEffect, useState } from "react";
import {
  getAdminToken, setAdminToken, clearAdminToken,
  getUserToken, setUserToken, clearUserToken
} from "@/lib/authstore";

type AdminLetter = {
  id: string;
  recipient_id: string;
  to_email_snapshot: string;
  from_email_snapshot: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  // user token (dev)
  const [userTok, setUserTokState] = useState("");
  const [userMsg, setUserMsg] = useState<string | null>(null);

  // admin auth
  const [password, setPassword] = useState("");
  const [adminTok, setAdminTokState] = useState<string | null>(null);
  const [adminErr, setAdminErr] = useState<string | null>(null);

  // admin data
  const [letters, setLetters] = useState<AdminLetter[]>([]);
  const [dataErr, setDataErr] = useState<string | null>(null);

  // add recipient
  const [rName, setRName] = useState("");
  const [rPhoto, setRPhoto] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rStatus, setRStatus] = useState<string | null>(null);

  useEffect(() => {
    setAdminTokState(getAdminToken());
    setUserTokState(getUserToken() || "");
  }, []);

  function saveUserToken() {
    const t = userTok.trim();
    if (!t) return setUserMsg("empty token");
    setUserToken(t);
    setUserMsg("saved ✅");
    setTimeout(() => setUserMsg(null), 900);
  }
  function wipeUserToken() {
    clearUserToken();
    setUserTokState("");
    setUserMsg("cleared");
    setTimeout(() => setUserMsg(null), 900);
  }

  async function adminLogin() {
    setAdminErr(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setAdminErr(data?.error || "Login failed");
    setAdminToken(data.adminToken);
    setAdminTokState(data.adminToken);
    setPassword("");
  }

  async function loadLetters() {
    setDataErr(null);
    const tok = adminTok || getAdminToken();
    if (!tok) return setDataErr("No admin token. Login first.");

    const res = await fetch("/api/admin/letters", {
      headers: { authorization: `Bearer ${tok}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setDataErr(data?.error || "Failed to load");
    setLetters(data);
  }

  function logoutAdmin() {
    clearAdminToken();
    setAdminTokState(null);
    setLetters([]);
  }

  async function addRecipient() {
    setRStatus(null);
    const tok = adminTok || getAdminToken();
    if (!tok) return setRStatus("No admin token");

    const res = await fetch("/api/admin/recipients", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${tok}`,
      },
      body: JSON.stringify({
        display_name: rName.trim(),
        photo_url: rPhoto.trim(),
        to_email: rEmail.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setRStatus(data?.error || "Failed");
    setRStatus("Added ✅");
    setRName(""); setRPhoto(""); setREmail("");
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Admin</h1>

      {/* User token dev panel */}
      <section className="rounded-xl border bg-white p-4 space-y-3">
        <div className="font-medium">User Token (for testing send/inbox)</div>
        <div className="text-xs text-gray-500">
          วาง user JWT จากระบบเดิมของคุณตรงนี้ (ชั่วคราว) เพื่อให้หน้า Write/Inbox เรียก API ได้
        </div>
        <textarea
          value={userTok}
          onChange={(e) => setUserTokState(e.target.value)}
          rows={3}
          className="w-full rounded-lg border px-3 py-2 text-xs"
          placeholder="paste user JWT here..."
        />
        <div className="flex items-center gap-2">
          <button onClick={saveUserToken} className="rounded-lg bg-black px-3 py-2 text-white text-sm">
            Save user token
          </button>
          <button onClick={wipeUserToken} className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50">
            Clear
          </button>
          {userMsg && <span className="text-xs text-gray-600">{userMsg}</span>}
        </div>
      </section>

      {/* Admin auth */}
      <section className="rounded-xl border bg-white p-4 space-y-3">
        <div className="font-medium">Admin Login (password → adminToken)</div>

        {!adminTok ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full sm:w-80 rounded-lg border px-3 py-2 text-sm"
              placeholder="ADMIN_PASSWORD"
            />
            <button onClick={adminLogin} className="rounded-lg bg-black px-4 py-2 text-white text-sm">
              Login
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded-md">Logged in ✅</div>
            <button onClick={logoutAdmin} className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50">
              Logout
            </button>
          </div>
        )}

        {adminErr && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{adminErr}</div>}
      </section>

      {/* Add recipient */}
      <section className="rounded-xl border bg-white p-4 space-y-3">
        <div className="font-medium">Add Recipient</div>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            value={rName}
            onChange={(e) => setRName(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="display_name"
          />
          <input
            value={rPhoto}
            onChange={(e) => setRPhoto(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="photo_url"
          />
          <input
            value={rEmail}
            onChange={(e) => setREmail(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="to_email"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={addRecipient} className="rounded-lg bg-black px-4 py-2 text-white text-sm">
            Add
          </button>
          {rStatus && <span className="text-xs text-gray-600">{rStatus}</span>}
        </div>
      </section>

      {/* View letters */}
      <section className="rounded-xl border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Letters (admin view)</div>
          <button onClick={loadLetters} className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50">
            Load
          </button>
        </div>

        {dataErr && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{dataErr}</div>}

        <div className="space-y-3">
          {letters.map(l => (
            <div key={l.id} className="rounded-xl border bg-gray-50 p-3">
              <div className="text-xs text-gray-600">
                {new Date(l.created_at).toLocaleString()} • {l.status}
              </div>
              <div className="mt-1 text-xs text-gray-700">
                <span className="font-medium">From:</span> {l.from_email_snapshot}{" "}
                <span className="font-medium">To:</span> {l.to_email_snapshot}
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm">{l.message}</div>
            </div>
          ))}
          {!dataErr && letters.length === 0 && (
            <div className="text-sm text-gray-600">No data loaded.</div>
          )}
        </div>
      </section>
    </div>
  );
}
