"use client";

import { vocabulary } from "@/data/vocabulary";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { percentage } from "@/lib/utils";

export function StudyStats() {
  const { history } = useStudyHistory();
  const { learnedWords } = useLearnedWords();
  const totalCorrect = history.reduce((sum, item) => sum + item.correct, 0);
  const totalQuestions = history.reduce((sum, item) => sum + item.total, 0);
  const totalMinutes = history.reduce((sum, item) => sum + item.minutes, 0);
  const learnedWordsCount = vocabulary.filter((word) => learnedWords[word.id]).length;

  const stats = [
    { label: "学習日数", value: `${history.length}`, unit: "日", icon: "🔥" },
    { label: "平均正答率", value: `${percentage(totalCorrect, totalQuestions)}`, unit: "%", icon: "🎯" },
    { label: "学習時間", value: `${totalMinutes}`, unit: "分", icon: "⏱️" },
    { label: "覚えた単語", value: `${learnedWordsCount}`, unit: "語", icon: "📚" },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-2xl">{stat.icon}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">Stats</p>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {stat.value}<span className="text-sm text-slate-500">{stat.unit}</span>
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
