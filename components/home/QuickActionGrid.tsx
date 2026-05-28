import Link from "next/link";

const actions = [
  { href: "/practice", title: "10問演習", description: "今日の問題を解く", icon: "✍️", accent: "bg-blue-50 text-brand-700" },
  { href: "/vocabulary", title: "単語帳", description: "旅行×TOEIC語彙", icon: "📚", accent: "bg-orange-50 text-orange-600" },
  { href: "/history", title: "履歴", description: "伸びを確認する", icon: "📈", accent: "bg-emerald-50 text-emerald-600" },
];

export function QuickActionGrid() {
  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Shortcut</p>
          <h2 className="mt-1 font-black text-slate-950">クイックアクセス</h2>
        </div>
      </div>
      <div className="mt-3 grid gap-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="group flex items-center gap-3 rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-sm">
            <span className={`flex h-13 w-13 items-center justify-center rounded-[1.25rem] p-3 text-2xl ${action.accent}`}>{action.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-black text-slate-950">{action.title}</span>
              <span className="text-sm font-medium text-slate-500">{action.description}</span>
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-2 text-sm font-black text-slate-400 group-active:bg-slate-100">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
