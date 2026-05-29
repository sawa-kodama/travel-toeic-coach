"use client";

import { vocabulary } from "@/data/vocabulary";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { analyzeHistory, levelLabel, sceneLabel } from "@/lib/learning";

type StatRow = {
  label: string;
  correct: number;
  total: number;
};

function accuracy(correct: number, total: number) {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

function CoachBar({ row, tone = "orange" }: { row: StatRow; tone?: "orange" | "blue" }) {
  const value = accuracy(row.correct, row.total);
  const color = tone === "blue" ? "bg-brand-500" : "bg-orange-400";
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black text-slate-700">{row.label}</p>
        <p className="text-xs font-black text-slate-400">{value}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-[10px] font-bold text-slate-400">{row.correct}/{row.total} 正解</p>
    </div>
  );
}

function coachComment(weakestCategory: string, weakestScene: string, totalAnswered: number) {
  if (totalAnswered === 0) return "まずは10問ミニ演習を1回完了しましょう。問題ごとの文法・旅行シーン・正誤が記録され、次回から分析が始まります。";
  return `次回は「${weakestScene}」の場面で「${weakestCategory}」を重点的に確認しましょう。問題ごとの正誤ログをもとに、苦手な文法と旅行シーンを自動で見える化しています。`;
}

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
    { label: "問題別ログ", value: `${insights.answerDetails.length}`, unit: "件", icon: "🧠" },
  ];

  const weakCategoryRows: StatRow[] = insights.categoryStats
    .filter((stat) => stat.total > 0)
    .sort((a, b) => accuracy(a.correct, a.total) - accuracy(b.correct, b.total))
    .slice(0, 4)
    .map((stat) => ({ label: stat.category, correct: stat.correct, total: stat.total }));

  const weakSceneRows: StatRow[] = insights.sceneStats
    .filter((stat) => stat.total > 0)
    .sort((a, b) => accuracy(a.correct, a.total) - accuracy(b.correct, b.total))
    .slice(0, 4)
    .map((stat) => ({ label: sceneLabel(stat.scene), correct: stat.correct, total: stat.total }));

  const strongestCategory = insights.strongCategories[0] ?? (weakCategoryRows.length > 0 ? "もう少し演習で判定" : "分析中");
  const weakestCategory = insights.weakCategories[0] ?? weakCategoryRows[0]?.label ?? "分析中";
  const strongestScene = insights.strongScenes[0] ? sceneLabel(insights.strongScenes[0]) : weakSceneRows.length > 0 ? "もう少し演習で判定" : "分析中";
  const weakestScene = insights.weakScenes[0] ? sceneLabel(insights.weakScenes[0]) : weakSceneRows[0]?.label ?? "分析中";

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
            <span key={category} className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-black text-orange-100">文法: {category}</span>
          ))}
          {(insights.weakScenes.length > 0 ? insights.weakScenes : ["restaurant", "shopping", "taxi"]).map((scene) => (
            <span key={scene} className="rounded-full bg-blue-400/20 px-3 py-1 text-xs font-black text-blue-100">場面: {sceneLabel(scene)}</span>
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

      <div className="rounded-[1.8rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Weakness Dashboard</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">苦手分析ダッシュボード</h2>
        <p className="mt-2 text-xs font-bold leading-5 text-slate-500">演習完了時に、1問ごとの「文法カテゴリ・旅行シーン・正誤」を保存して分析します。</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100">
            <p className="text-[10px] font-black text-orange-500">重点文法</p>
            <p className="mt-1 text-lg font-black text-slate-950">{weakestCategory}</p>
          </div>
          <div className="rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
            <p className="text-[10px] font-black text-brand-600">重点シーン</p>
            <p className="mt-1 text-lg font-black text-slate-950">{weakestScene}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
            <p className="text-[10px] font-black text-emerald-600">得意文法</p>
            <p className="mt-1 text-lg font-black text-slate-950">{strongestCategory}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100">
            <p className="text-[10px] font-black text-blue-600">得意シーン</p>
            <p className="mt-1 text-lg font-black text-slate-950">{strongestScene}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-black text-slate-500">文法カテゴリ別</p>
            <div className="mt-2 grid gap-2">
              {weakCategoryRows.length > 0 ? weakCategoryRows.map((row) => <CoachBar key={row.label} row={row} tone="orange" />) : <p className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-400">演習を完了すると文法別の傾向が表示されます。</p>}
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-slate-500">旅行シーン別</p>
            <div className="mt-2 grid gap-2">
              {weakSceneRows.length > 0 ? weakSceneRows.map((row) => <CoachBar key={row.label} row={row} tone="blue" />) : <p className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-400">演習を完了するとレストラン・買い物・交通などの傾向が表示されます。</p>}
            </div>
          </div>
        </div>

        {insights.recentMistakes.length > 0 && (
          <div className="mt-4 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
            <p className="text-xs font-black text-rose-600">最近のミス</p>
            <div className="mt-2 grid gap-2">
              {insights.recentMistakes.slice(0, 4).map((mistake, index) => (
                <div key={`${mistake.questionId}-${index}`} className="rounded-xl bg-white p-3 text-xs leading-5 text-slate-600">
                  <p className="font-black text-slate-800">{sceneLabel(mistake.scene)} / {mistake.category}</p>
                  <p className="mt-1">選択: {mistake.selectedText} → 正解: {mistake.answerText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-xs font-black text-blue-200">Coach Note</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-100">{coachComment(weakestCategory, weakestScene, insights.totalAnswered)}</p>
        </div>
      </div>
    </section>
  );
}
