export type Choice = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type QuestionCategory = "前置詞" | "時制" | "語彙" | "品詞" | "ビジネス英語" | "旅行英語" | "接続詞" | "比較" | "代名詞" | "熟語" | "動詞" | "会話表現" | "依頼表現";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type SceneId =
  | "general"
  | "restaurant"
  | "cafe"
  | "shopping"
  | "taxi"
  | "train"
  | "bus"
  | "airport"
  | "hotel"
  | "sightseeing"
  | "emergency"
  | "immigration"
  | "payment";

export type Question = {
  id: number;
  part: "Part 1" | "Part 2" | "Part 3" | "Part 4" | "Part 5" | "Part 6" | "Part 7";
  category: QuestionCategory | string;
  scene?: SceneId;
  difficulty?: DifficultyLevel;
  context?: string;
  prompt: string;
  subQuestion?: string;
  toeicTip?: string;
  commonMistake?: string;
  travelTip?: string;
  choices: Choice[];
  answerId: Choice["id"];
  explanation: string;
};
