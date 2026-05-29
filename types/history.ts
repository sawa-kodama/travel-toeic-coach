import type { DifficultyLevel, SceneId } from "@/types/question";

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
  missedWords?: string[];
};
