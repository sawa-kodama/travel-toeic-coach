"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/practice", label: "演習", icon: "✍️" },
  { href: "/vocabulary", label: "単語", icon: "📚" },
  { href: "/history", label: "履歴", icon: "📈" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-3 pb-3">
      <div className="grid grid-cols-4 rounded-[1.7rem] border border-white/80 bg-white/88 p-1.5 shadow-float backdrop-blur-xl">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-[1.25rem] px-2 py-2 text-[11px] font-black text-slate-400",
                active && "bg-brand-600 text-white shadow-card"
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
