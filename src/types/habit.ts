import { api } from "@/api/client";

export type HabitFrequency = 0 | 1 | 2; // 0 = Daily, 1 = Weekly, 2 = Monthly
export type GoalUnit = 0 | 1 | 2 | 3;   // 0 = Times, 1 = Steps, 2 = Minutes, 3 = Kcal

export interface HabitCreateRequest {
  title: string;
  frequency: HabitFrequency;
  goalValue: number;
  goalUnit: GoalUnit;
  startDate: string;
  categoryId: string; // Guid
}

// Для получения привычек можно оставить "человекочитаемый" вариант
export type HabitDto = {
  id: string;            // Guid -> string
  title: string;
  frequency: HabitFrequency;
  startDate: string;     // ISO string
  categoryId: string;
  categoryName?: string;
  goal?: number;
  goalUnit?: GoalUnit;
}

// Категории
export type Category = {
  id: string;       // Guid
  name: string;
  defaultUnit: GoalUnit;
};

export const createHabit = async (data: HabitCreateRequest) => {
  const response = await api.post("/habit", data);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/category");
  return response.data;
};