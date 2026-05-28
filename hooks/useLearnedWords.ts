"use client";

import { useEffect, useState } from "react";
import { loadLearnedWords, saveLearnedWords, type LearnedWordMap } from "@/lib/storage";

export function useLearnedWords() {
  const [learnedWords, setLearnedWords] = useState<LearnedWordMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function syncLearnedWords() {
      setLearnedWords(loadLearnedWords());
      setLoaded(true);
    }

    syncLearnedWords();
    window.addEventListener("learned-words-updated", syncLearnedWords);
    return () => window.removeEventListener("learned-words-updated", syncLearnedWords);
  }, []);

  function toggleLearned(wordId: number) {
    setLearnedWords((current) => {
      const next = { ...current, [wordId]: !current[wordId] };
      saveLearnedWords(next);
      return next;
    });
  }

  return { learnedWords, loaded, toggleLearned };
}
