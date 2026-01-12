import { api } from "@/api/client";
import type { Category, CategoryCreateRequest, HabitCreateRequest, HabitDto } from "@/types/habit";
import type { HabitProgressDto } from "@/types/heatmap";

/* ---------------- HABITS ---------------- */

export const createHabit = async (data: HabitCreateRequest): Promise<HabitDto> => {
  const response = await api.post("/habit", data);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/category");
  return response.data;
};

export const createCategory = async (data: CategoryCreateRequest): Promise<Category> => {
  const response = await api.post("/category", data);
  return response.data;
};

export const getHabits = async (categoryIds?: string[]): Promise<HabitDto[]> => {
  const params = categoryIds && categoryIds.length > 0 ? { categories: categoryIds.join(",") } : {};
  const response = await api.get("/habit", { params });
  return response.data;
};

/* ---------------- HABIT PROGRESS (Heatmap) ---------------- */

export const getHabitProgress = async (
  habitId: string,
  from?: string,
  to?: string
): Promise<HabitProgressDto[]> => {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);

  const res = await api.get(`/habit/${habitId}/progress?${params.toString()}`);
  return res.data;
};

export const addOrUpdateHabitProgress = async (
  habitId: string,
  date: string,
  value: number,
  note?: string
): Promise<HabitProgressDto> => {
  const res = await api.post(`/habit/${habitId}/progress`, { date, value, note });
  return res.data;
};