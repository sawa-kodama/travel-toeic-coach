import type { Choice, DifficultyLevel, SceneId } from "@/types/question";

export type CategoryStat = {
  category: string;
  correct: number;
  total: number;
};

export type SceneStat = {
  scene: SceneId | string;
  correct: number;
  total: number;
};

export type AnswerDetail = {
  questionId: number;
  prompt: string;
  category: string;
  scene: SceneId | string;
  difficulty?: DifficultyLevel;
  selectedId: Choice["id"];
  selectedText: string;
  answerId: Choice["id"];
  answerText: string;
  isCorrect: boolean;
};

export type StudyHistory = {
  id: number;
  date: string;
  title: string;
  correct: number;
  total: number;
  minutes: number;
  level?: DifficultyLevel;
  accuracy?: number;
  weakCategories?: string[];
  weakScenes?: string[];
  categoryStats?: CategoryStat[];
  sceneStats?: SceneStat[];
  answerDetails?: AnswerDetail[];
  missedWords?: string[];
};
