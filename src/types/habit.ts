/* ---------------- Enums (string, backend-aligned) ---------------- */

import type { HabitProgressDto } from "./heatmap";

export type HabitFrequency = "Daily" | "Weekly" | "Monthly";
export type GoalUnit = "Times" | "Steps" | "Minutes" | "Kcal";

/* ---------------- Habit ---------------- */

export interface HabitCreateRequest {
  title: string;
  frequency: HabitFrequency;
  goalValue: number;
  goalUnit: GoalUnit;
  startDate: string;
  categoryId: string;
}

export type HabitDto = {
  id: string;
  title: string;
  frequency: HabitFrequency;
  startDate: string;

  goal: number;
  goalUnit: GoalUnit;

  categoryId: string;
  categoryName?: string;

  progress: HabitProgressDto[];
};

/* ---------------- Category ---------------- */

export type Category = {
  id: string;
  name: string;
  defaultUnit: GoalUnit;
  isSystem: boolean;
  habitCount: number;
};

export interface CategoryCreateRequest {
  name: string;
  defaultUnit: GoalUnit;
}
