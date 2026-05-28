import { PageContainer } from "@/components/layout/PageContainer";
import { ProgressCard } from "@/components/home/ProgressCard";
import { QuickActionGrid } from "@/components/home/QuickActionGrid";
import { TodayCard } from "@/components/home/TodayCard";

export default function HomePage() {
  return (
    <PageContainer>
      <div className="rounded-[2rem] border border-white/80 bg-white/72 p-5 shadow-sm backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">Your daily coach</p>
        <h1 className="mt-2 text-[1.65rem] font-black leading-tight text-slate-950">
          旅行英語もTOEICも、今日の10問から。
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          5分で解いて、苦手を見つけて、明日の学習を少しずつあなた向けに育てます。
        </p>
      </div>
      <TodayCard />
      <ProgressCard />
      <QuickActionGrid />
    </PageContainer>
  );
}
