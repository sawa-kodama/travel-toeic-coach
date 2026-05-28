export type Choice = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type QuestionCategory = "前置詞" | "時制" | "語彙" | "品詞" | "ビジネス英語" | "旅行英語" | "接続詞" | "比較" | "代名詞" | "熟語" | "動詞";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type Question = {
  id: number;
  part: "Part 5";
  category: QuestionCategory | string;
  difficulty?: DifficultyLevel;
  prompt: string;
  choices: Choice[];
  answerId: Choice["id"];
  explanation: string;
};
