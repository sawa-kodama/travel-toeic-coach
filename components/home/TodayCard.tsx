import Link from "next/link";

export function TodayCard() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-hero p-5 text-white shadow-float">
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15" />
      <div className="absolute bottom-4 right-5 text-6xl opacity-20">🛫</div>
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-1.5 text-xs font-black text-blue-50 backdrop-blur">
          <span>今日の学習</span>
          <span className="h-1 w-1 rounded-full bg-white/70" />
          <span>約5分</span>
        </div>
        <h2 className="mt-4 text-3xl font-black leading-tight">10問ミニ演習</h2>
        <p className="mt-3 max-w-[18rem] text-sm font-medium leading-6 text-blue-50">
          TOEIC Part 5風の問題で、旅行中にも使える文法と語彙を確認します。
        </p>
        <Link
          href="/practice"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-brand-700 shadow-card"
        >
          今日の演習を始める <span>→</span>
        </Link>
      </div>
    </section>
  );
}
