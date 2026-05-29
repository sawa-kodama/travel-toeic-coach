"use client";

import { useEffect, useMemo, useState } from "react";
import { questions as fixedQuestions } from "@/data/questions";
import type { Choice, Question } from "@/types/question";
import { useStudyHistory } from "@/hooks/useStudyHistory";
import { analyzeHistory, buildCategoryStatsFromAnswers, buildSceneStatsFromAnswers, extractMissedWords, levelLabel, sceneLabel, selectAdaptiveQuestions } from "@/lib/learning";
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

function getChoiceText(question: Question, id?: Choice["id"]) {
  return question.choices.find((choice) => choice.id === id)?.text ?? "";
}

function categoryToeicPoint(category: string) {
  const map: Record<string, string> = {
    前置詞: "TOEIC Part 5では、名詞の前後に置かれる前置詞の相性がよく問われます。熟語として覚えると速く解けます。",
    時制: "時制問題は、文中の時を表す語句を先に探すのがコツです。tomorrow, yesterday, already などがヒントになります。",
    語彙: "語彙問題は意味だけでなく、前後の単語との組み合わせで判断します。TOEICではビジネス・旅行文脈の名詞が頻出です。",
    品詞: "品詞問題は空所の前後を見て、名詞・動詞・形容詞・副詞のどれが必要かを先に決めると安定します。",
    ビジネス英語: "TOEICでは依頼・予約・支払い・確認など、実務的な文脈が頻出です。場面ごとの定型表現として覚えましょう。",
    旅行英語: "旅行英語は実際の会話でも使えるため、文法とセットでフレーズごと覚えると定着しやすくなります。",
    接続詞: "接続詞は後ろに主語＋動詞が続くかを確認します。前置詞との違いがTOEICでよく問われます。",
    比較: "比較問題では than, the most, as ... as などのサインを探します。形容詞・副詞の形にも注意します。",
    代名詞: "代名詞問題は、後ろに名詞が続くかどうかで所有格・目的格・所有代名詞を判断します。",
    熟語: "熟語は単語単体ではなく、セットで意味を持ちます。旅行場面でそのまま使える形で覚えましょう。",
    動詞: "助動詞や to の後など、動詞の形を決めるサインを先に探すと解きやすくなります。",
    会話表現: "会話表現は自然な返答パターンが重要です。丁寧表現は旅行先でもTOEICでもよく出ます。",
    依頼表現: "Could you / Could I / Would you mind などの丁寧な依頼表現は、旅行でもTOEICでも頻出です。",
  };
  return map[category] ?? "TOEICでは、空所の前後関係と場面を同時に見ることで正解を選びやすくなります。";
}

function japaneseLearnerPoint(category: string) {
  const map: Record<string, string> = {
    前置詞: "日本語では『に・で・へ』が広く使えるため、英語の at / in / on / to / with の使い分けで迷いやすいです。",
    時制: "日本語は時制の形が英語ほど厳密ではないため、現在・過去・未来・完了の形を文中のヒントから判断する練習が必要です。",
    語彙: "似た形の単語や品詞違いを意味だけで選びがちです。英語では collocation、つまり自然な組み合わせが重要です。",
    品詞: "日本語では語尾変化が少ないため、英語の名詞・形容詞・副詞の形の違いを見落としやすいです。",
    接続詞: "because of / despite などの前置詞句と、because / although などの接続詞を混同しやすいです。後ろの形を見ましょう。",
    比較: "more と most、形容詞と副詞の違いを日本語訳だけで判断すると間違えやすいです。",
    代名詞: "their / them / theirs のように、日本語では同じ『彼らの・彼らを』に見える形を混同しやすいです。",
  };
  return map[category] ?? "日本語訳だけで選ぶと不自然な英語になることがあります。英語の語順とセット表現で確認しましょう。";
}

function travelUsePoint(scene?: string) {
  const map: Record<string, string> = {
    restaurant: "レストランでは注文・おすすめ・会計・アレルギー確認でそのまま使える表現です。声に出して練習すると実践で使いやすくなります。",
    cafe: "カフェではサイズ、氷、ミルク、持ち帰りなどの短い依頼表現が多いです。Could I get ...? と相性が良いです。",
    shopping: "買い物ではサイズ・色・返品・支払いに関する表現が頻出です。店員との短い会話を想定して覚えましょう。",
    taxi: "タクシーでは行き先、降車場所、ルート希望を短く伝える力が重要です。Could you take me to ...? は必須表現です。",
    train: "電車ではホーム、路線、乗り換え、片道・往復などの語彙が重要です。案内表示を読む力にもつながります。",
    bus: "バスでは停留所、料金、降りる場所を確認する表現が役立ちます。短く聞ける形で覚えましょう。",
    airport: "空港では搭乗口、遅延、荷物、チェックインなどTOEICにも旅行にも直結する語彙が多いです。",
    hotel: "ホテルではチェックイン、設備、部屋、依頼表現が中心です。丁寧にお願いする形を覚えると安心です。",
    sightseeing: "観光では集合時間、場所、チケット、案内の表現がよく出ます。時制や前置詞の練習にも向いています。",
    emergency: "トラブル対応では短く正確に困っている内容を伝える必要があります。語彙と依頼表現をセットで覚えましょう。",
    immigration: "入国審査では滞在目的・期間・宿泊先を簡潔に答える表現が重要です。",
    payment: "支払いでは領収書、カード、現金、返金などの語彙が重要です。TOEICのビジネス文脈にもよく出ます。",
  };
  return map[scene ?? "general"] ?? "旅行中に使う場面を想像して、文法だけでなくフレーズとして覚えると実用力が上がります。";
}

function wrongChoicePoint(question: Question, selectedId?: Choice["id"]) {
  if (!selectedId || selectedId === question.answerId) return "正解できた問題も、他の選択肢がなぜ違うかを確認すると応用力が上がります。";
  const selected = getChoiceText(question, selectedId);
  const answer = getChoiceText(question, question.answerId);
  return `あなたが選んだ「${selected}」は、この空所の文法・語法には合いません。正解は「${answer}」で、前後の語とのつながりが自然です。`;
}

export function QuestionCard() {
  const { history, addHistory } = useStudyHistory();
  const insights = useMemo(() => analyzeHistory(history), [history]);
  const [sessionSeed, setSessionSeed] = useState(0);
  const activeQuestions = useMemo(() => selectAdaptiveQuestions(fixedQuestions, insights, 10, sessionSeed), [insights, sessionSeed]);
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
      const sceneStats = buildSceneStatsFromAnswers(finalRecords);
      const weakCategories = categoryStats.filter((stat) => stat.correct < stat.total).map((stat) => stat.category).slice(0, 4);
      const weakScenes = sceneStats.filter((stat) => stat.correct < stat.total).map((stat) => stat.scene).slice(0, 4);
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
          sceneStats,
          weakScenes,
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
        <button type="button" onClick={handleReselectQuestions} className="w-full rounded-[1.4rem] bg-slate-950 px-4 py-4 text-sm font-black text-white shadow-card">
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
          <button type="button" onClick={handleReselectQuestions} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
            再選定
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(insights.weakCategories.length > 0 ? insights.weakCategories : ["前置詞", "品詞", "語彙"]).map((category) => (
            <span key={category} className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-black text-orange-600">文法強化: {category}</span>
          ))}
          {(insights.weakScenes.length > 0 ? insights.weakScenes : ["restaurant", "shopping", "taxi"]).map((scene) => (
            <span key={scene} className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-black text-brand-700">シーン強化: {sceneLabel(scene)}</span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card">
        <div className="bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between text-sm">
            <span className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-black text-blue-100">Question {index + 1} / {activeQuestions.length}</span>
            <span className="rounded-full bg-orange-400/20 px-3 py-1.5 text-xs font-black text-orange-100">{sceneLabel(question.scene)}</span>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-300 to-orange-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">TOEIC Part 5 / {question.category}</p>
            {question.difficulty && <p className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">{question.difficulty}</p>}
          </div>
          <p className="mt-3 whitespace-pre-line text-[1.35rem] font-black leading-9 text-slate-950">{question.prompt}</p>
        </div>
      </div>

      <AnswerChoices choices={question.choices} selectedId={selectedId} answerId={question.answerId} answered={answered} onSelect={setSelectedId} />

      {answered && (
        <div className={isCorrect ? "rounded-[1.6rem] bg-emerald-50 p-4 ring-1 ring-emerald-100" : "rounded-[1.6rem] bg-rose-50 p-4 ring-1 ring-rose-100"}>
          <p className={isCorrect ? "font-black text-emerald-700" : "font-black text-rose-700"}>{isCorrect ? "正解です 🎉" : "ここが復習ポイントです"}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">正解: {question.answerId}（{getChoiceText(question, question.answerId)}）</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{question.explanation}</p>

          <div className="mt-4 space-y-3 rounded-[1.2rem] bg-white/70 p-4 ring-1 ring-white/80">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Why</p>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{wrongChoicePoint(question, selectedId)}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-600">TOEIC頻出ポイント</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{categoryToeicPoint(String(question.category))}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-600">日本人が苦手な理由</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{japaneseLearnerPoint(String(question.category))}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-600">旅行英語との関連</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{travelUsePoint(question.scene)}</p>
            </div>
          </div>
        </div>
      )}

      <button type="button" onClick={answered ? handleNext : handleAnswer} disabled={!selectedId} className="w-full rounded-[1.4rem] bg-brand-600 px-4 py-4 text-sm font-black text-white shadow-card disabled:bg-slate-300 disabled:shadow-none">
        {answered ? (index === activeQuestions.length - 1 ? "結果を見る" : "次の問題へ") : "回答する"}
      </button>
    </section>
  );
}
