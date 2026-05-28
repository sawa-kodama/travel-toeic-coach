import { PageContainer } from "@/components/layout/PageContainer";
import { QuestionCard } from "@/components/practice/QuestionCard";

export default function PracticePage() {
  return (
    <PageContainer>
      <div className="rounded-[2rem] border border-white/80 bg-white/72 p-5 shadow-sm backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">Practice</p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950">今日の10問ミニ演習</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">選択肢を選んで、すぐに解説を確認できます。</p>
      </div>
      <QuestionCard />
    </PageContainer>
  );
}
