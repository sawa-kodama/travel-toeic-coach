import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LearningProfile = {
  level?: "beginner" | "intermediate" | "advanced";
  recentAccuracy?: number;
  totalAnswered?: number;
  weakCategories?: string[];
};

type GeneratedChoice = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

type GeneratedQuestion = {
  id: number;
  part: "Part 5";
  category: string;
  prompt: string;
  choices: GeneratedChoice[];
  answerId: "A" | "B" | "C" | "D";
  explanation: string;
};

function normalizeLevel(profile?: LearningProfile) {
  if (profile?.level) return profile.level;
  const accuracy = profile?.recentAccuracy;
  if (typeof accuracy !== "number") return "beginner";
  if (accuracy >= 80) return "advanced";
  if (accuracy >= 60) return "intermediate";
  return "beginner";
}

function fallbackQuestions(level: string): GeneratedQuestion[] {
  const label = level === "advanced" ? "応用" : level === "intermediate" ? "標準" : "基礎";
  return [
    {
      id: 1,
      part: "Part 5",
      category: `${label}・前置詞`,
      prompt: "The hotel is located ___ the station.",
      choices: [
        { id: "A", text: "near" },
        { id: "B", text: "nearly" },
        { id: "C", text: "nearby" },
        { id: "D", text: "nearing" },
      ],
      answerId: "A",
      explanation: "near は前置詞として「〜の近くに」を表します。nearly は副詞で「ほとんど」という意味です。",
    },
    {
      id: 2,
      part: "Part 5",
      category: `${label}・品詞`,
      prompt: "Please make a ___ for two nights.",
      choices: [
        { id: "A", text: "reserve" },
        { id: "B", text: "reservation" },
        { id: "C", text: "reserved" },
        { id: "D", text: "reserving" },
      ],
      answerId: "B",
      explanation: "make a reservation で「予約する」という決まった表現です。a の後ろには名詞が入ります。",
    },
  ];
}

function toTenQuestions(questions: GeneratedQuestion[], level: string): GeneratedQuestion[] {
  const base = questions.length > 0 ? questions : fallbackQuestions(level);
  return Array.from({ length: 10 }, (_, index) => {
    const source = base[index % base.length];
    return { ...source, id: index + 1 };
  });
}

function validateQuestions(value: unknown, level: string): GeneratedQuestion[] {
  if (!value || typeof value !== "object") return toTenQuestions([], level);
  const maybeQuestions = (value as { questions?: unknown }).questions;
  if (!Array.isArray(maybeQuestions)) return toTenQuestions([], level);

  const valid = maybeQuestions
    .map((item, index) => {
      const question = item as Partial<GeneratedQuestion>;
      const choices = Array.isArray(question.choices) ? question.choices : [];
      const normalizedChoices = choices
        .filter((choice): choice is GeneratedChoice => {
          return (
            !!choice &&
            typeof choice === "object" &&
            ["A", "B", "C", "D"].includes((choice as GeneratedChoice).id) &&
            typeof (choice as GeneratedChoice).text === "string"
          );
        })
        .slice(0, 4);

      if (
        typeof question.prompt !== "string" ||
        normalizedChoices.length !== 4 ||
        !["A", "B", "C", "D"].includes(String(question.answerId)) ||
        typeof question.explanation !== "string"
      ) {
        return undefined;
      }

      return {
        id: index + 1,
        part: "Part 5" as const,
        category: typeof question.category === "string" ? question.category : "TOEIC Part 5",
        prompt: question.prompt,
        choices: normalizedChoices,
        answerId: question.answerId as "A" | "B" | "C" | "D",
        explanation: question.explanation,
      };
    })
    .filter((question): question is GeneratedQuestion => Boolean(question));

  return toTenQuestions(valid, level);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const body = (await request.json().catch(() => ({}))) as { profile?: LearningProfile };
    const profile = body.profile ?? {};
    const level = normalizeLevel(profile);
    const weakCategories = profile.weakCategories?.length ? profile.weakCategories.join("、") : "未特定";
    const recentAccuracy = typeof profile.recentAccuracy === "number" ? `${profile.recentAccuracy}%` : "未計測";
    const totalAnswered = typeof profile.totalAnswered === "number" ? profile.totalAnswered : 0;

    const prompt = `
あなたはTOEIC Part 5専門の英語コーチです。
旅行英語にも役立つTOEIC Part 5風の4択問題を10問作ってください。

ユーザー情報:
- 推定レベル: ${level}
- 直近正答率: ${recentAccuracy}
- 累計回答数: ${totalAnswered}
- 苦手カテゴリ: ${weakCategories}

出題方針:
- Part 5形式の短い英文穴埋め問題にする
- 選択肢はA/B/C/Dの4つ
- answerIdは必ずA/B/C/Dのどれか
- 日本語解説を付ける
- 旅行、ホテル、空港、レストラン、移動、出張の文脈を多めにする
- beginnerなら基礎語彙・前置詞・品詞を多めにする
- intermediateなら時制・接続詞・比較・語法を入れる
- advancedなら分詞構文、関係詞、語彙の微妙な違いも入れる
- 苦手カテゴリがある場合は少し多めに含める

返答は必ず次のJSON形式だけにしてください。Markdownは禁止です。
{
  "questions": [
    {
      "id": 1,
      "part": "Part 5",
      "category": "品詞",
      "prompt": "The hotel staff responded ___ to the guest's request.",
      "choices": [
        { "id": "A", "text": "quick" },
        { "id": "B", "text": "quickly" },
        { "id": "C", "text": "quicker" },
        { "id": "D", "text": "quickness" }
      ],
      "answerId": "B",
      "explanation": "動詞respondedを修飾するため、副詞quicklyが正解です。"
    }
  ]
}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You generate high-quality TOEIC Part 5 practice questions and return valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI API error", detail);
      return NextResponse.json({ error: "AI question generation failed." }, { status: 502 });
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ questions: fallbackQuestions(level) });
    }

    const parsed = JSON.parse(content) as unknown;
    const generatedQuestions = validateQuestions(parsed, level);

    return NextResponse.json({ questions: generatedQuestions, profile: { level, recentAccuracy, weakCategories } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
