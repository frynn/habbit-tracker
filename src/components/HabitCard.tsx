import {
  Heart, // Health
  Dumbbell, // Fitness
  BookOpen, // Education
  Brain, // Learning
  DollarSign, // Finance
  Users, // Social
  Briefcase, // Work
  Home, // Daily/Routine
  Music, // Hobbies/Entertainment
  Utensils, // Cooking
  ShoppingBag, // Shopping
  Car, // Travel
  Coffee, // Morning Routine
  Moon, // Evening Routine
  Gamepad2, // Gaming
  Camera, // Photography
  PenTool, // Art/Creativity
  Smile, // Mindfulness
  Target, // Goals
  TrendingUp, // Productivity
  Zap, // Energy
  Leaf, // Wellness
  Watch, // Time Management
  MessageSquare, // Communication
  Code, // Programming/Tech
  Brush, // Default
} from "lucide-react";
import { Heatmap } from "@/components/Heatmap/Heatmap";
import type { HabitDto, HabitFrequency, GoalUnit } from "@/types/habit";
import React from "react";

/* ---------------- Types ---------------- */

type HabitCardProps = {
  habit: HabitDto & {
    streak?: number;
    completionPercent?: number;
  };
};

/* ---------------- Category Mapping ---------------- */

// Основные категории с точными совпадениями
const categoryIcons: Record<string, React.ElementType> = {
  // Health & Wellness
  Health: Heart,
  Wellness: Heart,
  Medical: Heart,
  Healthcare: Heart,

  // Fitness & Sports
  Fitness: Dumbbell,
  Exercise: Dumbbell,
  Workout: Dumbbell,
  Sports: Dumbbell,
  Gym: Dumbbell,
  Running: Dumbbell,
  Yoga: Dumbbell,

  // Education & Learning
  Education: BookOpen,
  Learning: Brain,
  Study: BookOpen,
  Reading: BookOpen,
  School: BookOpen,
  University: BookOpen,
  Knowledge: Brain,

  // Finance & Money
  Finance: DollarSign,
  Money: DollarSign,
  Savings: DollarSign,
  Budget: DollarSign,
  Investing: DollarSign,
  Financial: DollarSign,

  // Social & Relationships
  Social: Users,
  Friends: Users,
  Family: Users,
  Relationships: Users,
  Community: Users,
  Networking: Users,

  // Work & Career
  Work: Briefcase,
  Career: Briefcase,
  Business: Briefcase,
  Job: Briefcase,
  Professional: Briefcase,
  Office: Briefcase,

  // Daily Life & Routine
  Daily: Home,
  Routine: Home,
  Morning: Coffee,
  Evening: Moon,
  Household: Home,
  Chores: Home,

  // Hobbies & Entertainment
  Hobbies: Music,
  Entertainment: Music,
  Gaming: Gamepad2,
  Music: Music,
  Art: PenTool,
  Creativity: PenTool,
  Photography: Camera,
  Cooking: Utensils,
  Baking: Utensils,
  Shopping: ShoppingBag,
  Travel: Car,
  Gardening: Leaf,

  // Personal Development
  Productivity: TrendingUp,
  Goals: Target,
  Mindfulness: Smile,
  Meditation: Smile,
  "Time Management": Watch,
  Energy: Zap,
  Communication: MessageSquare,

  // Technology
  Programming: Code,
  Tech: Code,
  Coding: Code,
  Software: Code,

  // Default fallback
  Other: Brush,
  Misc: Brush,
  General: Brush,
  Uncategorized: Brush,
};

// Функция для поиска иконки (case-insensitive)
const getCategoryIcon = (categoryName: string): React.ElementType => {
  if (!categoryName || categoryName.trim() === "") {
    return Brush;
  }

  // Приводим к lowercase для сравнения
  const normalized = categoryName.trim().toLowerCase();

  // Ищем точное совпадение (case-insensitive)
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (key.toLowerCase() === normalized) {
      return icon;
    }
  }

  // Ищем частичное совпадение
  for (const [key, icon] of Object.entries(categoryIcons)) {
    const keyLower = key.toLowerCase();
    if (normalized.includes(keyLower) || keyLower.includes(normalized)) {
      return icon;
    }
  }

  // Проверяем общие слова
  if (normalized.includes("health") || normalized.includes("wellness"))
    return Heart;
  if (
    normalized.includes("fit") ||
    normalized.includes("exercise") ||
    normalized.includes("sport")
  )
    return Dumbbell;
  if (
    normalized.includes("learn") ||
    normalized.includes("study") ||
    normalized.includes("read")
  )
    return BookOpen;
  if (
    normalized.includes("finance") ||
    normalized.includes("money") ||
    normalized.includes("budget")
  )
    return DollarSign;
  if (
    normalized.includes("social") ||
    normalized.includes("friend") ||
    normalized.includes("family")
  )
    return Users;
  if (
    normalized.includes("work") ||
    normalized.includes("career") ||
    normalized.includes("job")
  )
    return Briefcase;
  if (
    normalized.includes("daily") ||
    normalized.includes("routine") ||
    normalized.includes("home")
  )
    return Home;
  if (normalized.includes("hobby") || normalized.includes("entertain"))
    return Music;

  // Возвращаем Brush по умолчанию
  return Brush;
};

/* ---------------- Other Helpers ---------------- */

const frequencyLabel: Record<HabitFrequency, string> = {
  Daily: "Daily",
  Weekly: "Weekly",
  Monthly: "Monthly",
};

const goalUnitLabel: Record<GoalUnit, string> = {
  Times: "times",
  Steps: "steps",
  Minutes: "minutes",
  Kcal: "kcal",
};

/* ---------------- Component ---------------- */

export function HabitCard({ habit }: HabitCardProps) {
  const Icon = getCategoryIcon(habit.categoryName || "");

  const streakDays = habit.currentStreak ?? 0;
  const completionPercent =
    habit.completionPercent ??
    Math.round(
      habit.progress?.length
        ? (habit.progress.filter((p) => p.completed).length /
            habit.progress.length) *
            100
        : 0,
    );
  const progressValue =
    habit.progress && habit.progress.length > 0
      ? habit.progress[habit.progress.length - 1].value
      : 0;

  return (
    <div className="flex flex-col w-full border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 size-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
          <Icon className="size-5 text-primary dark:text-primary-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {habit.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {habit.categoryName && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {habit.categoryName}
              </span>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {frequencyLabel[habit.frequency]} • Goal: {habit.goal}{" "}
              {goalUnitLabel[habit.goalUnit]}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col items-center p-2 rounded bg-gray-50 dark:bg-gray-700/50">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {streakDays}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Streak
          </span>
        </div>

        <div className="flex flex-col items-center p-2 rounded bg-gray-50 dark:bg-gray-700/50">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {completionPercent}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Completed
          </span>
        </div>

        <div className="flex flex-col items-center p-2 rounded bg-gray-50 dark:bg-gray-700/50">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {progressValue}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {goalUnitLabel[habit.goalUnit]}
          </span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {habit.frequency} Progress
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {habit.frequency === "Daily"
                ? "3 months"
                : habit.frequency === "Weekly"
                  ? "4 weeks"
                  : "6 months"}
            </span>
          </div>
        </div>

        <div className="rounded border border-gray-200 dark:border-gray-700 p-2 bg-gray-50/50 dark:bg-gray-800/30">
          <Heatmap
            habitId={habit.id}
            startDate={habit.startDate}
            frequency={habit.frequency}
            progress={habit.progress}
          />
        </div>
      </div>
    </div>
  );
}
