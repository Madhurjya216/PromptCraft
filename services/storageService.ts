import { HistoryItem, OptimizationResult } from "../types";

const STORAGE_KEY = 'promptcraft_history_v1';

export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveResult = (result: OptimizationResult): HistoryItem => {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...result,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    isBookmarked: false,
  };
  
  // Add to beginning of array
  const updatedHistory = [newItem, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return newItem;
};

export const toggleBookmark = (id: string): HistoryItem[] => {
  const history = getHistory();
  const updatedHistory = history.map(item => 
    item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const deleteItem = (id: string): HistoryItem[] => {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};