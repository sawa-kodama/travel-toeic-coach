import Link from "next/link";
import { percentage } from "@/lib/utils";
import type { AnswerRecord } from "./QuestionCard";

export function ResultSummary({ correct, total, records, onRetry }: { correct: number; total: number; records: AnswerRecord[]; onRetry: () => void }) {
  const rate = percentage(correct, total);
  const reviewRecords = records.filter((record) => !record.isCorrect);

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] bg-hero p-6 text-center text-white shadow-float">
        <p className="text-sm font-black text-blue-100">演習完了・履歴に保存しました</p>
        <h2 className="mt-3 text-5xl font-black">{correct}/{total}</h2>
        <p className="mt-2 text-sm font-bold text-blue-50">正答率 {rate}%</p>
        <div className="mx-auto mt-5 h-3 max-w-56 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white" style={{ width: `${rate}%` }} />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">
          {rate >= 80 ? "とても良いペースです。明日はスピードも意識して解きましょう。" : "間違えた問題の解説を読み、同じ文法パターンをもう一度確認しましょう。"}
        </p>
      </div>

      {reviewRecords.length > 0 && (
        <div className="rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="font-black text-slate-950">復習する問題</h3>
          <div className="mt-3 grid gap-3">
            {reviewRecords.map((record) => (
              <article key={record.question.id} className="rounded-[1.25rem] bg-rose-50 p-3 text-sm ring-1 ring-rose-100">
                <p className="font-bold leading-6 text-slate-800">{record.question.prompt}</p>
                <p className="mt-2 text-xs font-black text-rose-700">あなたの回答: {record.selectedId} / 正解: {record.question.answerId}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{record.question.explanation}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3">
        <button type="button" onClick={onRetry} className="rounded-[1.4rem] bg-brand-600 px-4 py-4 text-sm font-black text-white shadow-card">もう一度解く</button>
        <Link href="/history" className="rounded-[1.4rem] bg-slate-100 px-4 py-4 text-center text-sm font-black text-slate-700">履歴を見る</Link>
      </div>
    </section>
  );
}
