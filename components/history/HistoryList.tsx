"use client";

import { useStudyHistory } from "@/hooks/useStudyHistory";
import { percentage } from "@/lib/utils";
import { sceneLabel } from "@/lib/learning";

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
            まだ履歴がありません。10問ミニ演習を完了すると、正答率・苦手カテゴリ・苦手シーン・問題別ログがここに記録されます。
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
                <p className="text-lg font-black text-slate-950">{item.answerDetails?.length ?? 0}件</p>
                <p className="text-[10px] font-bold text-slate-400">問題別ログ</p>
              </div>
            </div>

            {Boolean(item.weakCategories?.length || item.weakScenes?.length || item.missedWords?.length) && (
              <div className="mt-3 rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100">
                {item.weakCategories?.length ? (
                  <p className="text-xs font-black text-orange-700">苦手カテゴリ: {item.weakCategories.join(" / ")}</p>
                ) : null}
                {item.weakScenes?.length ? (
                  <p className="mt-1 text-xs font-black text-brand-700">苦手シーン: {item.weakScenes.map((scene) => sceneLabel(scene)).join(" / ")}</p>
                ) : null}
                {item.missedWords?.length ? (
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-600">復習語句: {item.missedWords.slice(0, 6).join("・")}</p>
                ) : null}
              </div>
            )}

            {item.answerDetails?.length ? (
              <details className="mt-3 rounded-2xl bg-slate-50 p-3">
                <summary className="cursor-pointer text-xs font-black text-slate-500">問題別ログを見る</summary>
                <div className="mt-3 grid gap-2">
                  {item.answerDetails.map((detail, index) => (
                    <div key={`${detail.questionId}-${index}`} className="rounded-xl bg-white p-3 text-xs leading-5 ring-1 ring-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-black text-slate-800">Q{index + 1} / {sceneLabel(detail.scene)} / {detail.category}</p>
                        <span className={detail.isCorrect ? "rounded-full bg-emerald-50 px-2 py-1 font-black text-emerald-600" : "rounded-full bg-rose-50 px-2 py-1 font-black text-rose-600"}>
                          {detail.isCorrect ? "正解" : "復習"}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-slate-500">{detail.prompt}</p>
                      <p className="mt-2 font-bold text-slate-600">選択: {detail.selectedText} / 正解: {detail.answerText}</p>
                    </div>
                  ))}
                </div>
              </details>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
