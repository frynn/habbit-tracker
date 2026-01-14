import { useMemo, useState } from "react";
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
  reloadProgress?: () => void; // если есть refetch
};

export function Heatmap({
  habitId,
  startDate,
  frequency,
  progress,
  reloadProgress,
}: HeatmapProps) {
  const [offset, setOffset] = useState(0);

  // DAILY: 1 день = 1 ячейка
  const dailyValues: HeatmapValue[] = useMemo(
    () =>
      progress.map((p) => ({
        date: p.date,
        value: rateToScale(p.completionRate), // 0..4
      })),
    [progress]
  );

  const weeklyValues: HeatmapValue[] = progress.map((p) => ({
    date: p.date,
    value: rateToScale(p.completionRate),
  }));

  const monthlyValues: HeatmapValue[] = progress.map((p) => ({
    date: p.date, // дата прогресса
    value: rateToScale(p.completionRate), // сразу 0..4
  }));

  //ОБРАБОТКА КНОПКИ DONE
  const handleDone = async (count: number) => {
    const today = new Date().toISOString().slice(0, 10);
    await addOrUpdateHabitProgress(habitId, today, count);
    reloadProgress?.();
  };

  return (
    <div className="w-full">
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

      <HeatmapControls
        habitId={habitId}
        onPrev={() => setOffset((o) => o - 1)}
        onNext={() => setOffset((o) => o + 1)}
        canPrev={offset > 0}
        canNext
        onDone={handleDone}
      />
    </div>
  );
}
