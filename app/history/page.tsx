import { HistoryList } from "@/components/history/HistoryList";
import { StudyStats } from "@/components/history/StudyStats";
import { PageContainer } from "@/components/layout/PageContainer";

export default function HistoryPage() {
  return (
    <PageContainer>
      <div className="rounded-[2rem] border border-white/80 bg-white/72 p-5 shadow-sm backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">History</p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950">学習履歴</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">続けた分だけ、あなた専用の学習に近づきます。</p>
      </div>
      <StudyStats />
      <HistoryList />
    </PageContainer>
  );
}
