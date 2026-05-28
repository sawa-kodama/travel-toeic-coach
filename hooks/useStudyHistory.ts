"use client";

import { useEffect, useState } from "react";
import { loadHistory, saveHistory } from "@/lib/storage";
import type { StudyHistory } from "@/types/history";

export function useStudyHistory() {
  const [history, setHistory] = useState<StudyHistory[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function syncHistory() {
      setHistory(loadHistory());
      setLoaded(true);
    }

    syncHistory();
    window.addEventListener("study-history-updated", syncHistory);
    return () => window.removeEventListener("study-history-updated", syncHistory);
  }, []);

  function addHistory(item: StudyHistory) {
    const next = [item, ...loadHistory()];
    saveHistory(next);
    setHistory(next);
  }

  function resetHistory() {
    const next: StudyHistory[] = [];
    setHistory(next);
    saveHistory(next);
  }

  return { history, loaded, addHistory, resetHistory };
}
