import { api } from "@/api/client";

/* ---------------- Enums (numeric) ---------------- */

export type HabitFrequency = 0 | 1 | 2; // Daily, Weekly, Monthly
export type GoalUnit = 0 | 1 | 2 | 3;   // Times, Steps, Minutes, Kcal

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
  categoryId: string;
  categoryName?: string;
  goal?: number;
  goalUnit?: GoalUnit;
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

/* ---------------- API ---------------- */

export const createHabit = async (data: HabitCreateRequest) => {
  const response = await api.post("/habit", data);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/category");
  return response.data;
};

export const createCategory = async (
  data: CategoryCreateRequest
): Promise<Category> => {
  const response = await api.post("/category", data);
  return response.data;
};

/* ---------------- Get habits ---------------- */

/**
 * Получение привычек с сервера
 * @param categoryIds опциональный массив id категорий для фильтрации
 */
export const getHabits = async (
  categoryIds?: string[]
): Promise<HabitDto[]> => {
  const params = categoryIds && categoryIds.length > 0
    ? { categories: categoryIds.join(",") }
    : {};

  const response = await api.get("/habit", { params });
  return response.data;
};
