import { Footprints, Book, Dumbbell, Brush } from "lucide-react";
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

/* ---------------- Helpers ---------------- */

const categoryIcons: Record<string, React.ElementType> = {
  Health: Footprints,
  Education: Book,
  Fitness: Dumbbell,
  default: Brush,
};

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
  const Icon = categoryIcons[habit.categoryName ?? ""] || categoryIcons.default;

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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {frequencyLabel[habit.frequency]} • Goal: {habit.goal}{" "}
            {goalUnitLabel[habit.goalUnit]}
          </p>
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
