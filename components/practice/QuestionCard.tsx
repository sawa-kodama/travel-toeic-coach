"use client";

import { useEffect, useMemo, useState } from "react";
import { questions as fixedQuestions } from "@/data/questions";
import type { Choice, Question } from "@/types/question";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { analyzeHistory, buildCategoryStatsFromAnswers, extractMissedWords, levelLabel, selectAdaptiveQuestions } from "@/lib/learning";
import { AnswerChoices } from "./AnswerChoices";
import { ResultSummary } from "./ResultSummary";

export type AnswerRecord = {
  question: Question;
  selectedId: Choice["id"];
  isCorrect: boolean;
};

function todayTitle(level: string) {
  if (level === "advanced") return "応用レベル・今日の10問";
  if (level === "intermediate") return "標準レベル・今日の10問";
  return "基礎レベル・今日の10問";
}

export function QuestionCard() {
  const { history, addHistory } = useStudyHistory();
  const insights = useMemo(() => analyzeHistory(history), [history]);
  const [sessionSeed, setSessionSeed] = useState(0);
  const activeQuestions = useMemo(() => selectAdaptiveQuestions(fixedQuestions, insights, 10), [insights, sessionSeed]);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<Choice["id"] | undefined>();
  const [answered, setAnswered] = useState(false);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);

  const question = activeQuestions[index];
  const progress = Math.round(((index + 1) / activeQuestions.length) * 100);
  const isCorrect = useMemo(() => selectedId === question.answerId, [selectedId, question.answerId]);
  const correctCount = answerRecords.filter((record) => record.isCorrect).length;

  useEffect(() => {
    setIndex(0);
    setSelectedId(undefined);
    setAnswered(false);
    setAnswerRecords([]);
    setFinished(false);
    setSaved(false);
  }, [sessionSeed]);

  function handleAnswer() {
    if (!selectedId) return;
    const correct = selectedId === question.answerId;
    setAnswered(true);
    setAnswerRecords((records) => [...records, { question, selectedId, isCorrect: correct }]);
  }

  function handleNext() {
    if (index === activeQuestions.length - 1) {
      const finalRecords = answerRecords;
      const finalCorrectCount = finalRecords.filter((record) => record.isCorrect).length;
      const accuracy = Math.round((finalCorrectCount / activeQuestions.length) * 100);
      const categoryStats = buildCategoryStatsFromAnswers(finalRecords);
      const weakCategories = categoryStats
        .filter((stat) => stat.correct < stat.total)
        .map((stat) => stat.category)
        .slice(0, 4);
      const missedWords = extractMissedWords(finalRecords);

      if (!saved) {
        addHistory({
          id: Date.now(),
          date: new Date().toISOString().slice(0, 10),
          title: todayTitle(insights.level),
          correct: finalCorrectCount,
          total: activeQuestions.length,
          minutes: 5,
          level: insights.level,
          accuracy,
          weakCategories,
          categoryStats,
          missedWords,
        });
        setSaved(true);
      }
      setFinished(true);
      return;
    }

    setIndex((current) => current + 1);
    setSelectedId(undefined);
    setAnswered(false);
  }

  function handleRetry() {
    setIndex(0);
    setSelectedId(undefined);
    setAnswered(false);
    setAnswerRecords([]);
    setFinished(false);
    setSaved(false);
  }

  function handleReselectQuestions() {
    setSessionSeed((value) => value + 1);
  }

  if (finished) {
    return (
      <section className="space-y-4">
        <ResultSummary correct={correctCount} total={activeQuestions.length} records={answerRecords} onRetry={handleRetry} />
        <button
          type="button"
          onClick={handleReselectQuestions}
          className="w-full rounded-[1.4rem] bg-slate-950 px-4 py-4 text-sm font-black text-white shadow-card"
        >
          学習履歴に合わせて次の10問を選ぶ
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[1.6rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black text-brand-700">履歴に合わせて自動選定中</p>
            <p className="mt-1 text-[11px] font-bold text-slate-500">
              推定レベル: {levelLabel(insights.level)} / 直近正答率 {insights.recentAccuracy}% / 連続 {insights.streakDays}日
            </p>
          </div>
          <button
            type="button"
            onClick={handleReselectQuestions}
            className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white"
          >
            再選定
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(insights.weakCategories.length > 0 ? insights.weakCategories : ["前置詞", "品詞", "語彙"]).map((category) => (
            <span key={category} className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-black text-orange-600">
              強化: {category}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
        <div className="bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between text-sm">
            <span className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-black text-blue-100">Question {index + 1} / {activeQuestions.length}</span>
            <span className="rounded-full bg-orange-400/20 px-3 py-1.5 text-xs font-black text-orange-100">{question.category}</span>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-300 to-orange-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">TOEIC Part 5</p>
            {question.difficulty && <p className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">{question.difficulty}</p>}
          </div>
          <p className="mt-3 text-[1.35rem] font-black leading-9 text-slate-950">{question.prompt}</p>
        </div>
      </div>

      <AnswerChoices choices={question.choices} selectedId={selectedId} answerId={question.answerId} answered={answered} onSelect={setSelectedId} />

      {answered && (
        <div className={isCorrect ? "rounded-[1.6rem] bg-emerald-50 p-4 ring-1 ring-emerald-100" : "rounded-[1.6rem] bg-rose-50 p-4 ring-1 ring-rose-100"}>
          <p className={isCorrect ? "font-black text-emerald-700" : "font-black text-rose-700"}>{isCorrect ? "正解です 🎉" : "ここが復習ポイントです"}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">正解: {question.answerId}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{question.explanation}</p>
        </div>
      )}

      <button
        type="button"
        onClick={answered ? handleNext : handleAnswer}
        disabled={!selectedId}
        className="w-full rounded-[1.4rem] bg-brand-600 px-4 py-4 text-sm font-black text-white shadow-card disabled:bg-slate-300 disabled:shadow-none"
      >
        {answered ? (index === activeQuestions.length - 1 ? "結果を見る" : "次の問題へ") : "回答する"}
      </button>
    </section>
  );
}
