"use client";

import { useMemo, useState } from "react";
import { questions } from "@/data/questions";
import type { Choice, Question } from "@/types/question";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { AnswerChoices } from "./AnswerChoices";
import { ResultSummary } from "./ResultSummary";

export type AnswerRecord = {
  question: Question;
  selectedId: Choice["id"];
  isCorrect: boolean;
};

export function QuestionCard() {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<Choice["id"] | undefined>();
  const [answered, setAnswered] = useState(false);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addHistory } = useStudyHistory();
  const question = questions[index];

  const progress = Math.round(((index + 1) / questions.length) * 100);
  const isCorrect = useMemo(() => selectedId === question.answerId, [selectedId, question.answerId]);
  const correctCount = answerRecords.filter((record) => record.isCorrect).length;

  function handleAnswer() {
    if (!selectedId) return;
    const correct = selectedId === question.answerId;
    setAnswered(true);
    setAnswerRecords((records) => [...records, { question, selectedId, isCorrect: correct }]);
  }

  function handleNext() {
    const finalRecords = answerRecords;
    if (index === questions.length - 1) {
      const finalCorrectCount = finalRecords.filter((record) => record.isCorrect).length;
      if (!saved) {
        addHistory({
          id: Date.now(),
          date: new Date().toISOString().slice(0, 10),
          title: "今日の10問ミニ演習",
          correct: finalCorrectCount,
          total: questions.length,
          minutes: 5,
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

  if (finished) {
    return <ResultSummary correct={correctCount} total={questions.length} records={answerRecords} onRetry={handleRetry} />;
  }

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
        <div className="bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between text-sm">
            <span className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-black text-blue-100">Question {index + 1} / {questions.length}</span>
            <span className="rounded-full bg-orange-400/20 px-3 py-1.5 text-xs font-black text-orange-100">{question.category}</span>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-300 to-orange-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">TOEIC Part 5</p>
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
        {answered ? (index === questions.length - 1 ? "結果を見る" : "次の問題へ") : "回答する"}
      </button>
    </section>
  );
}
