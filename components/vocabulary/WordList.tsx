"use client";

import { useMemo, useState } from "react";
import { vocabulary } from "@/data/vocabulary";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { WordCard } from "./WordCard";

const categories = ["All", "Hotel", "Airport", "Restaurant", "Transportation", "Business Travel"] as const;

export function WordList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const { learnedWords, toggleLearned } = useLearnedWords();

  const words = useMemo(() => vocabulary.map((word) => ({ ...word, learned: Boolean(learnedWords[word.id]) })), [learnedWords]);
  const learnedCount = words.filter((word) => word.learned).length;
  const progress = Math.round((learnedCount / words.length) * 100);

  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      const matchesQuery = [item.word, item.meaning, item.example, item.category].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category, words]);

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Learned words</p>
            <p className="mt-2 text-3xl font-black">{learnedCount} / {words.length} 語</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">📚</div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-300 to-orange-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
        <label className="flex items-center gap-2 rounded-[1.25rem] bg-slate-50 px-4 py-3">
          <span>🔎</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="単語・意味で検索"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={item === category ? "shrink-0 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-black text-white shadow-card" : "shrink-0 rounded-full bg-white px-4 py-2.5 text-xs font-black text-slate-500 shadow-sm ring-1 ring-slate-100"}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredWords.map((word) => <WordCard key={word.id} word={word} onToggleLearned={toggleLearned} />)}
      </div>
    </section>
  );
}
