"use client";

import { useStudyHistory } from "@/hooks/useStudyHistory";
import { percentage } from "@/lib/utils";

export function HistoryList() {
  const { history, resetHistory } = useStudyHistory();

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Timeline</p>
          <h2 className="mt-1 font-black text-slate-950">履歴</h2>
        </div>
        {history.length > 0 && (
          <button type="button" onClick={resetHistory} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-400">
            リセット
          </button>
        )}
      </div>
      <div className="mt-3 grid gap-3">
        {history.length === 0 && (
          <div className="rounded-[1.7rem] bg-white p-5 text-sm leading-6 text-slate-500 shadow-sm ring-1 ring-slate-100">
            まだ履歴がありません。10問ミニ演習を完了すると、ここに記録されます。
          </div>
        )}
        {history.map((item) => (
          <article key={item.id} className="rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl">✍️</span>
                <div>
                  <p className="text-xs font-black text-slate-400">{item.date}</p>
                  <h3 className="mt-1 font-black text-slate-950">{item.title}</h3>
                </div>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">{percentage(item.correct, item.total)}%</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-lg font-black text-slate-950">{item.correct}/{item.total}</p>
                <p className="text-[10px] font-bold text-slate-400">正解数</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-lg font-black text-slate-950">{item.minutes}分</p>
                <p className="text-[10px] font-bold text-slate-400">学習時間</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
