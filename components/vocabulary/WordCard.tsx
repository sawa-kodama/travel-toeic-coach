import type { VocabularyWord } from "@/types/vocabulary";

export function WordCard({ word, onToggleLearned }: { word: VocabularyWord; onToggleLearned: (wordId: number) => void }) {
  return (
    <article className="rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-600">#{word.rank}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">{word.category}</span>
          </div>
          <p className="mt-2 text-xl font-black text-slate-950">{word.word}</p>
          <p className="mt-1 text-sm font-black text-brand-700">{word.meaning}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleLearned(word.id)}
          className={word.learned ? "shrink-0 rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-card" : "shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-500"}
        >
          {word.learned ? "✓" : "未"}
        </button>
      </div>
      <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4 ring-1 ring-slate-100">
        <p className="text-sm font-bold leading-6 text-slate-800">{word.example}</p>
        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{word.exampleJa}</p>
      </div>
      <button
        type="button"
        onClick={() => onToggleLearned(word.id)}
        className={word.learned ? "mt-3 w-full rounded-[1.2rem] bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-card" : "mt-3 w-full rounded-[1.2rem] bg-slate-100 px-4 py-3 text-xs font-black text-slate-500"}
      >
        {word.learned ? "覚えた ✓" : "覚えたにする"}
      </button>
    </article>
  );
}
