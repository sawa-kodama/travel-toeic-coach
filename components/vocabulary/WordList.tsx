"use client";

import { useMemo, useState } from "react";
import { vocabulary } from "@/data/vocabulary";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { WordCard } from "./WordCard";
import type { VocabularyCategory } from "@/types/vocabulary";

const categories = [
  "All",
  "Business Travel",
  "Airport",
  "Hotel",
  "Restaurant",
  "Cafe",
  "Shopping",
  "Transportation",
  "Taxi",
  "Train",
  "Bus",
  "Sightseeing",
  "Emergency",
  "Immigration",
  "Payment",
] as const;

const pageSize = 50;

type CategoryFilter = "All" | VocabularyCategory;

function getRangeLabel(page: number, total: number) {
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);
  return `${start}-${end}`;
}

export function WordList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [page, setPage] = useState(0);
  const { learnedWords, toggleLearned } = useLearnedWords();

  const words = useMemo(() => vocabulary.map((word) => ({ ...word, learned: Boolean(learnedWords[word.id]) })), [learnedWords]);
  const learnedCount = words.filter((word) => word.learned).length;
  const progress = Math.round((learnedCount / words.length) * 100);

  const categoryStats = useMemo(() => {
    return categories.map((item) => {
      if (item === "All") return { category: item, total: words.length, learned: learnedCount };
      const categoryWords = words.filter((word) => word.category === item);
      return { category: item, total: categoryWords.length, learned: categoryWords.filter((word) => word.learned).length };
    });
  }, [learnedCount, words]);

  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      const matchesQuery = [item.word, item.meaning, item.example, item.exampleJa, item.category, String(item.rank)]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category, words]);

  const pageCount = Math.max(1, Math.ceil(filteredWords.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visibleWords = filteredWords.slice(safePage * pageSize, safePage * pageSize + pageSize);

  function updateCategory(nextCategory: CategoryFilter) {
    setCategory(nextCategory);
    setPage(0);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setPage(0);
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">TOEIC frequent vocabulary</p>
            <p className="mt-2 text-3xl font-black">{learnedCount} / {words.length} 語</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-300">
              TOEIC頻出順を意識した1000語。50語ずつ区切って、旅行・出張シーン別に覚えられます。
            </p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-3xl">📚</div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-300 to-orange-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Current range</p>
          <p className="mt-1 text-xl font-black text-slate-950">{getRangeLabel(safePage, filteredWords.length)}</p>
          <p className="text-xs font-bold text-slate-500">50語ずつ表示</p>
        </div>
        <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Filtered</p>
          <p className="mt-1 text-xl font-black text-slate-950">{filteredWords.length} 語</p>
          <p className="text-xs font-bold text-slate-500">検索・カテゴリ結果</p>
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
        <label className="flex items-center gap-2 rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <span>🔎</span>
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="単語・意味・例文・頻出順位で検索"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {categoryStats.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => updateCategory(item.category)}
            className={item.category === category ? "shrink-0 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-black text-white shadow-card" : "shrink-0 rounded-full bg-white px-4 py-2.5 text-xs font-black text-slate-500 shadow-sm ring-1 ring-slate-100"}
          >
            {item.category === "All" ? "All" : item.category} <span className="opacity-70">{item.learned}/{item.total}</span>
          </button>
        ))}
      </div>

      <div className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
        <p className="px-2 pb-2 text-xs font-black text-slate-500">50語チャンク</p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index)}
              className={index === safePage ? "shrink-0 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-black text-white" : "shrink-0 rounded-full bg-slate-50 px-4 py-2.5 text-xs font-black text-slate-500 ring-1 ring-slate-100"}
            >
              {getRangeLabel(index, filteredWords.length)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <button
          type="button"
          onClick={() => setPage(Math.max(0, safePage - 1))}
          disabled={safePage === 0}
          className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 disabled:opacity-40"
        >
          ← 前の50語
        </button>
        <p className="text-xs font-black text-slate-500">{safePage + 1} / {pageCount}</p>
        <button
          type="button"
          onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
          disabled={safePage >= pageCount - 1}
          className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white disabled:opacity-40"
        >
          次の50語 →
        </button>
      </div>

      <div className="grid gap-3">
        {visibleWords.map((word) => <WordCard key={word.id} word={word} onToggleLearned={toggleLearned} />)}
      </div>

      {visibleWords.length === 0 && (
        <div className="rounded-[1.7rem] bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-black text-slate-700">該当する単語がありません。</p>
          <p className="mt-1 text-xs font-bold text-slate-400">検索語やカテゴリを変えてみてください。</p>
        </div>
      )}
    </section>
  );
}
