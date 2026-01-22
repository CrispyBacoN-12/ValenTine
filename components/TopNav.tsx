"use client";

import Link from "next/link";

export default function TopNav() {
  return (
    <div className="w-full border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 relative flex items-center">
        
        {/* Center menu */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Link href="/" className="font-semibold text-gray-900">
            Valentine
          </Link>
          <Link href="/WriteBoard" className="text-sm text-gray-600 hover:text-gray-900">
            WriteBoard
          </Link>
          <Link href="/letters/inbox" className="text-sm text-gray-600 hover:text-gray-900">
            Inbox
          </Link>
        </div>

        {/* Right text */}
        <div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
          anonymous letters
        </div>
      </div>
    </div>
  );
}
