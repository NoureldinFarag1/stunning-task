import { useState, useEffect } from "react";

export type HistoryItem = {
  id: string;
  idea: string;
  prompt: string;
  date: Date;
};

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("StunningTask_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(
          parsed.map(
            (item: {
              id: string;
              idea: string;
              prompt: string;
              date: string;
            }) => ({
              ...item,
              date: new Date(item.date),
            })
          )
        );
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("StunningTask_history", JSON.stringify(history));
    }
  }, [history]);

  const addToHistory = (originalIdea: string, generatedPrompt: string) => {
    const newItem = {
      id: Date.now().toString(),
      idea: originalIdea,
      prompt: generatedPrompt,
      date: new Date(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const updateHistoryItem = (prompt: string) => {
      setHistory((prev) => {
        if (prev.length === 0) return prev;
        const newHistory = [...prev];
        newHistory[0] = { ...newHistory[0], prompt };
        localStorage.setItem("StunningTask_history", JSON.stringify(newHistory));
        return newHistory;
      });
  }

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== id);
      localStorage.setItem("StunningTask_history", JSON.stringify(newHistory));
      return newHistory;
    });
    if (history.length === 1) {
        localStorage.removeItem("StunningTask_history");
    }
  };

  return { history, addToHistory, updateHistoryItem, deleteHistoryItem };
}
