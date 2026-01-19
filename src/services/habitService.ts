import { api } from "@/api/client";
import type {
  HabitCreateRequest,
  HabitDto,
  Category,
  CategoryCreateRequest,
} from "@/types/habit";
import type { HabitProgressDto } from "@/types/heatmap";
import type { UserProfileOverviewDto } from "@/types/statistics";

/* ---------------- HABITS ---------------- */

export const createHabit = async (data: HabitCreateRequest): Promise<HabitDto> => {
  const response = await api.post("/habit", data);
  return response.data;
};

export const getHabits = async (): Promise<HabitDto[]> => {
  const response = await api.get("/habit");
  return response.data;
};

export const getHabitById = async (habitId: string): Promise<HabitDto> => {
  const res = await api.get(`/habit/${habitId}`);
  return res.data;
};

export const searchHabits = async (query: string): Promise<HabitDto[]> => {
  const res = await api.get("/habit/search", { params: { query } });
  return res.data;
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  await api.delete(`/habit/${habitId}`);
};

/* ---------------- CATEGORIES ---------------- */

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/category");
  return response.data;
};

export const createCategory = async (data: CategoryCreateRequest): Promise<Category> => {
  const response = await api.post("/category", data);
  return response.data;
};

/* ---------------- HABIT PROGRESS ---------------- */

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

/* ---------------- PROFILE / OVERVIEW ---------------- */

export const getProfileOverview = async (): Promise<UserProfileOverviewDto> => {
  const res = await api.get("/habit/profile/overview");
  return res.data;
};
