"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

export function FloatingSupportButton() {
  const pathname = usePathname();
  const isSupport = pathname === "/support";

  if (isSupport) return null;

  return (
    <Link href="/support">
      <button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-linear-to-br from-pink-500 to-red-500 shadow-elevated hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Dukung BagiBerkah"
      >
        <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Dukung BagiBerkah ❤️
        </span>
      </button>
    </Link>
  );
}
