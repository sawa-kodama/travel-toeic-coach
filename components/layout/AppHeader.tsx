export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-hero text-xl shadow-card">✈️</div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-brand-600">Travel TOEIC</p>
            <h1 className="text-lg font-black leading-tight text-slate-950">Coach</h1>
          </div>
        </div>
        <div className="rounded-full border border-amber-100 bg-amber-soft px-3 py-1.5 text-xs font-black text-orange-600 shadow-sm">
          🔥 3 days
        </div>
      </div>
    </header>
  );
}
