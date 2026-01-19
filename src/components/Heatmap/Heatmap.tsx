import { useMemo, useState, useCallback } from "react";
import type { HabitFrequency } from "@/types/habit";
import type { HabitProgressDto, HeatmapValue } from "@/types/heatmap";

import { DailyHeatmap } from "./DailyHeatmap";
import { WeeklyHeatmap } from "./WeeklyHeatmap";
import { MonthlyHeatmap } from "./MonthlyHeatmap";
import { HeatmapControls } from "./HeatmapControls";

import { rateToScale } from "@/assets/helpers";
import { addOrUpdateHabitProgress } from "@/services/habitService";

type HeatmapProps = {
  habitId: string;
  startDate: string;
  frequency: HabitFrequency;
  progress: HabitProgressDto[];
  reloadProgress?: () => void;
};

const HEATMAP_CONFIG = {
  Daily: { monthsPerView: 3, maxOffset: 6 },
  Weekly: { monthsPerView: 1, maxOffset: 12 },
  Monthly: { monthsPerView: 6, maxOffset: 12 },
};

export function Heatmap({
  habitId,
  startDate,
  frequency,
  progress,
  reloadProgress,
}: HeatmapProps) {
  const [offset, setOffset] = useState(0);
  const config = HEATMAP_CONFIG[frequency];

  const dailyValues: HeatmapValue[] = useMemo(
    () =>
      progress.map((p) => ({
        date: p.date,
        value: rateToScale(p.completionRate),
      })),
    [progress],
  );

  const weeklyValues: HeatmapValue[] = useMemo(
    () =>
      progress.map((p) => ({
        date: p.date,
        value: rateToScale(p.completionRate),
      })),
    [progress],
  );

  const monthlyValues: HeatmapValue[] = useMemo(
    () =>
      progress.map((p) => ({
        date: p.date,
        value: rateToScale(p.completionRate),
      })),
    [progress],
  );

  const handlePrev = useCallback(() => {
    setOffset((o) => Math.max(0, o - 1));
  }, []);

  const handleNext = useCallback(() => {
    setOffset((o) => (o < config.maxOffset ? o + 1 : o));
  }, [config.maxOffset]);

  const handleDone = async (count: number) => {
    const today = new Date().toISOString().slice(0, 10);
    await addOrUpdateHabitProgress(habitId, today, count);
    reloadProgress?.();
  };

  return (
    <div className="w-full space-y-3">
      {/* Индикатор периода - компактный */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium truncate">{frequency} Progress</span>
        <span className="text-xs bg-muted px-1.5 py-0.5 rounded truncate">
          {offset === 0 ? "Current" : `Offset: ${offset}`}
        </span>
      </div>

      {/* Основной heatmap */}
      <div className="bg-card rounded border p-2 overflow-hidden">
        {frequency === "Daily" && (
          <DailyHeatmap
            startDate={startDate}
            offset={offset}
            values={dailyValues}
          />
        )}

        {frequency === "Weekly" && (
          <WeeklyHeatmap
            startDate={startDate}
            offset={offset}
            values={weeklyValues}
          />
        )}

        {frequency === "Monthly" && (
          <MonthlyHeatmap
            startDate={startDate}
            offset={offset}
            values={monthlyValues}
          />
        )}
      </div>

      {/* Управление */}
      <HeatmapControls
        habitId={habitId}
        onPrev={handlePrev}
        onNext={handleNext}
        canPrev={offset > 0}
        canNext={offset < config.maxOffset}
        onDone={handleDone}
      />
    </div>
  );
}
