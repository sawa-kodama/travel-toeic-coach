import { PageContainer } from "@/components/layout/PageContainer";
import { WordList } from "@/components/vocabulary/WordList";

export default function VocabularyPage() {
  return (
    <PageContainer>
      <div className="rounded-[2rem] border border-white/80 bg-white/72 p-5 shadow-sm backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">Vocabulary</p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950">単語帳</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">旅行でもTOEICでも使う語彙から優先して覚えます。</p>
      </div>
      <WordList />
    </PageContainer>
  );
}
