import type { DifficultyLevel } from "@/types/question";

export type CategoryStat = {
  category: string;
  correct: number;
  total: number;
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
  categoryStats?: CategoryStat[];
  missedWords?: string[];
};
