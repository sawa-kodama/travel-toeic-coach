import { history as initialHistory } from "@/data/history";
import { vocabulary } from "@/data/vocabulary";
import type { StudyHistory } from "@/types/history";

export const STORAGE_KEYS = {
  history: "travel-toeic-coach:history",
  learnedWords: "travel-toeic-coach:learned-words",
} as const;

export type LearnedWordMap = Record<number, boolean>;

export function loadHistory(): StudyHistory[] {
  if (typeof window === "undefined") return initialHistory;

  const raw = window.localStorage.getItem(STORAGE_KEYS.history);
  if (!raw) return initialHistory;

  try {
    const parsed = JSON.parse(raw) as StudyHistory[];
    return Array.isArray(parsed) ? parsed : initialHistory;
  } catch {
    return initialHistory;
  }
}

export function saveHistory(history: StudyHistory[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  window.dispatchEvent(new Event("study-history-updated"));
}

export function addHistoryItem(item: StudyHistory) {
  const current = loadHistory();
  const next = [item, ...current];
  saveHistory(next);
  return next;
}

export function loadLearnedWords(): LearnedWordMap {
  const initial = Object.fromEntries(vocabulary.map((word) => [word.id, word.learned])) as LearnedWordMap;
  if (typeof window === "undefined") return initial;

  const raw = window.localStorage.getItem(STORAGE_KEYS.learnedWords);
  if (!raw) return initial;

  try {
    return { ...initial, ...(JSON.parse(raw) as LearnedWordMap) };
  } catch {
    return initial;
  }
}

export function saveLearnedWords(learnedWords: LearnedWordMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.learnedWords, JSON.stringify(learnedWords));
  window.dispatchEvent(new Event("learned-words-updated"));
}
