export type Category = 
  | 'General'
  | 'Code Generation'
  | 'Creative Writing'
  | 'Data Analysis'
  | 'Business Communication'
  | 'Educational Content';

export interface Improvement {
  type: string;
  description: string;
}

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  category: Category;
  improvements: Improvement[];
  analysisNotes: string;
  rating?: number; // 1-5 score given by AI on the original prompt
}

export interface HistoryItem extends OptimizationResult {
  id: string;
  timestamp: number;
  isBookmarked: boolean;
}

export const CATEGORIES: Category[] = [
  'General',
  'Code Generation',
  'Creative Writing',
  'Data Analysis',
  'Business Communication',
  'Educational Content'
];