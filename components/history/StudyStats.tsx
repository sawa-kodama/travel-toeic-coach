"use client";

import { vocabulary } from "@/data/vocabulary";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { analyzeHistory, levelLabel } from "@/lib/learning";

export function StudyStats() {
  const { history } = useStudyHistory();
  const { learnedWords } = useLearnedWords();
  const totalMinutes = history.reduce((sum, item) => sum + item.minutes, 0);
  const learnedWordsCount = vocabulary.filter((word) => learnedWords[word.id]).length;
  const insights = analyzeHistory(history);

  const stats = [
    { label: "連続学習", value: `${insights.streakDays}`, unit: "日", icon: "🔥" },
    { label: "平均正答率", value: `${insights.accuracy}`, unit: "%", icon: "🎯" },
    { label: "学習時間", value: `${totalMinutes}`, unit: "分", icon: "⏱️" },
    { label: "覚えた単語", value: `${learnedWordsCount}`, unit: "語", icon: "📚" },
  ];

  return (
    <section className="space-y-3">
      <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white shadow-card">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Current Coach Profile</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black">{levelLabel(insights.level)}</h2>
            <p className="mt-1 text-sm font-bold text-slate-300">直近正答率 {insights.recentAccuracy}% / 累計 {insights.totalAnswered}問</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-blue-100">自動調整中</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(insights.weakCategories.length > 0 ? insights.weakCategories : ["まだ分析中"]).map((category) => (
            <span key={category} className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-black text-orange-100">苦手: {category}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
      </div>
    </section>
  );
}
