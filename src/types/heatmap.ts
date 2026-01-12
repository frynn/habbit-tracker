export type HeatmapValue = {
  date: string;
  value: number;
};


export type HabitProgressDto = {
  date: string; // "2026-01-12"
  value: number;
  completed: boolean;
  completionRate: number;
};