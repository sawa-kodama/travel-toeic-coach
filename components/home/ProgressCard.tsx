"use client";

import { vocabulary } from "@/data/vocabulary";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { analyzeHistory, levelLabel } from "@/lib/learning";

export function ProgressCard() {
  const { history } = useStudyHistory();
  const { learnedWords } = useLearnedWords();
  const learnedWordsCount = vocabulary.filter((word) => learnedWords[word.id]).length;
  const insights = analyzeHistory(history);

  const stats = [
    { label: "連続学習", value: `${insights.streakDays}`, unit: "日", icon: "🔥" },
    { label: "直近正答率", value: `${insights.recentAccuracy}`, unit: "%", icon: "🎯" },
    { label: "覚えた単語", value: `${learnedWordsCount}`, unit: "語", icon: "📚" },
  ];

  const pace = insights.recentAccuracy >= 80 ? "Great pace" : insights.recentAccuracy >= 60 ? "Good pace" : "Review mode";

  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Progress</p>
          <h2 className="mt-1 font-black text-slate-950">学習状況</h2>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">{pace}</div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.4rem] bg-slate-50 p-3 text-center">
            <p className="text-lg">{stat.icon}</p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {stat.value}<span className="text-xs text-slate-500">{stat.unit}</span>
            </p>
            <p className="mt-1 text-[10px] font-bold text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[1.4rem] bg-brand-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-500">Adaptive Level</p>
            <p className="mt-1 text-lg font-black text-slate-950">{levelLabel(insights.level)}</p>
          </div>
          <p className="text-right text-xs font-bold leading-5 text-slate-500">
            次回は{insights.weakCategories[0] ?? "基礎文法"}を少し多めに出題します。
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>直近の理解度</span>
          <span>{Math.min(insights.recentAccuracy, 100)}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-orange-400" style={{ width: `${Math.min(insights.recentAccuracy || 12, 100)}%` }} />
        </div>
      </div>
    </section>
  );
}
