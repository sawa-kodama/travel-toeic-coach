import type { StudyHistory, CategoryStat, SceneStat } from "@/types/history";
import type { DifficultyLevel, Question, SceneId } from "@/types/question";
import { sceneLabels } from "@/data/questions";

export type LearningInsights = {
  totalSessions: number;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  recentAccuracy: number;
  level: DifficultyLevel;
  streakDays: number;
  weakCategories: string[];
  strongCategories: string[];
  weakScenes: string[];
  strongScenes: string[];
  categoryStats: CategoryStat[];
  sceneStats: SceneStat[];
  missedWords: string[];
};

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function calculateStreakDays(history: StudyHistory[]) {
  const dateSet = new Set(history.map((item) => item.date));
  let streak = 0;
  const cursor = new Date();

  while (dateSet.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function mergeCategoryStats(history: StudyHistory[]): CategoryStat[] {
  const map = new Map<string, CategoryStat>();

  for (const item of history) {
    for (const stat of item.categoryStats ?? []) {
      const current = map.get(stat.category) ?? { category: stat.category, correct: 0, total: 0 };
      current.correct += stat.correct;
      current.total += stat.total;
      map.set(stat.category, current);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function mergeSceneStats(history: StudyHistory[]): SceneStat[] {
  const map = new Map<string, SceneStat>();

  for (const item of history) {
    for (const stat of item.sceneStats ?? []) {
      const current = map.get(stat.scene) ?? { scene: stat.scene, correct: 0, total: 0 };
      current.correct += stat.correct;
      current.total += stat.total;
      map.set(stat.scene, current);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function inferLevel(recentAccuracy: number, totalAnswered: number): DifficultyLevel {
  if (totalAnswered >= 20 && recentAccuracy >= 80) return "advanced";
  if (totalAnswered >= 10 && recentAccuracy >= 60) return "intermediate";
  return "beginner";
}

export function analyzeHistory(history: StudyHistory[]): LearningInsights {
  const totalAnswered = history.reduce((sum, item) => sum + item.total, 0);
  const totalCorrect = history.reduce((sum, item) => sum + item.correct, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const recent = history.slice(0, 5);
  const recentTotal = recent.reduce((sum, item) => sum + item.total, 0);
  const recentCorrect = recent.reduce((sum, item) => sum + item.correct, 0);
  const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : accuracy;

  const categoryStats = mergeCategoryStats(history);
  const sceneStats = mergeSceneStats(history);

  const weakCategories = categoryStats
    .filter((stat) => stat.total >= 2 && Math.round((stat.correct / stat.total) * 100) < 70)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .map((stat) => stat.category)
    .slice(0, 3);

  const strongCategories = categoryStats
    .filter((stat) => stat.total >= 2 && Math.round((stat.correct / stat.total) * 100) >= 80)
    .sort((a, b) => b.correct / b.total - a.correct / a.total)
    .map((stat) => stat.category)
    .slice(0, 3);

  const weakScenes = sceneStats
    .filter((stat) => stat.total >= 2 && Math.round((stat.correct / stat.total) * 100) < 70)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .map((stat) => stat.scene)
    .slice(0, 3);

  const strongScenes = sceneStats
    .filter((stat) => stat.total >= 2 && Math.round((stat.correct / stat.total) * 100) >= 80)
    .sort((a, b) => b.correct / b.total - a.correct / a.total)
    .map((stat) => stat.scene)
    .slice(0, 3);

  const missedWords = Array.from(new Set(history.flatMap((item) => item.missedWords ?? []))).slice(0, 12);

  return {
    totalSessions: history.length,
    totalAnswered,
    totalCorrect,
    accuracy,
    recentAccuracy,
    level: inferLevel(recentAccuracy, totalAnswered),
    streakDays: calculateStreakDays(history),
    weakCategories,
    strongCategories,
    weakScenes,
    strongScenes,
    categoryStats,
    sceneStats,
    missedWords,
  };
}

export function buildCategoryStatsFromAnswers(records: Array<{ question: Question; isCorrect: boolean }>): CategoryStat[] {
  const map = new Map<string, CategoryStat>();

  for (const record of records) {
    const category = record.question.category;
    const current = map.get(category) ?? { category, correct: 0, total: 0 };
    current.total += 1;
    if (record.isCorrect) current.correct += 1;
    map.set(category, current);
  }

  return Array.from(map.values());
}

export function buildSceneStatsFromAnswers(records: Array<{ question: Question; isCorrect: boolean }>): SceneStat[] {
  const map = new Map<string, SceneStat>();

  for (const record of records) {
    const scene = record.question.scene ?? "general";
    const current = map.get(scene) ?? { scene, correct: 0, total: 0 };
    current.total += 1;
    if (record.isCorrect) current.correct += 1;
    map.set(scene, current);
  }

  return Array.from(map.values());
}

export function extractMissedWords(records: Array<{ question: Question; isCorrect: boolean }>) {
  return Array.from(
    new Set(
      records
        .filter((record) => !record.isCorrect)
        .flatMap((record) => record.question.choices.map((choice) => choice.text))
        .filter((word) => /^[A-Za-z][A-Za-z\- ]+$/.test(word))
    )
  ).slice(0, 10);
}

function shuffleWithSeed<T>(items: T[], seed: number) {
  const result = [...items];
  let value = seed + 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const swapIndex = Math.floor((value / 233280) * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function selectAdaptiveQuestions(allQuestions: Question[], insights: LearningInsights, count = 10, seed = 0) {
  const levelRank: Record<DifficultyLevel, number> = { beginner: 1, intermediate: 2, advanced: 3 };
  const targetRank = levelRank[insights.level];
  const weakCategorySet = new Set(insights.weakCategories);
  const weakSceneSet = new Set(insights.weakScenes);

  const scored = shuffleWithSeed(allQuestions, seed).map((question) => {
    const difficulty = question.difficulty ?? "beginner";
    const distance = Math.abs(levelRank[difficulty] - targetRank);
    const scene = question.scene ?? "general";
    const weakCategoryBonus = weakCategorySet.has(question.category) ? 9 : 0;
    const weakSceneBonus = weakSceneSet.has(scene) ? 9 : 0;
    const travelSceneBonus = scene !== "general" ? 3 : 0;
    const conversationBonus = question.prompt.includes("Traveler:") ? 2 : 0;
    return {
      question,
      score: weakCategoryBonus + weakSceneBonus + travelSceneBonus + conversationBonus - distance * 2,
    };
  });

  const selected: Question[] = [];
  const usedIds = new Set<number>();
  const sceneCounts = new Map<string, number>();

  for (const item of scored.sort((a, b) => b.score - a.score)) {
    if (selected.length >= count) break;
    if (usedIds.has(item.question.id)) continue;
    const scene = item.question.scene ?? "general";
    const currentSceneCount = sceneCounts.get(scene) ?? 0;
    if (currentSceneCount >= 3 && selected.length < count - 2) continue;
    selected.push(item.question);
    usedIds.add(item.question.id);
    sceneCounts.set(scene, currentSceneCount + 1);
  }

  for (const question of scored.map((item) => item.question)) {
    if (selected.length >= count) break;
    if (!usedIds.has(question.id)) {
      selected.push(question);
      usedIds.add(question.id);
    }
  }

  return selected.map((question, index) => ({ ...question, id: index + 1 }));
}

export function levelLabel(level: DifficultyLevel) {
  if (level === "advanced") return "Advanced";
  if (level === "intermediate") return "Intermediate";
  return "Beginner";
}

export function sceneLabel(scene?: SceneId | string) {
  return sceneLabels[(scene ?? "general") as SceneId] ?? String(scene ?? "総合");
}
