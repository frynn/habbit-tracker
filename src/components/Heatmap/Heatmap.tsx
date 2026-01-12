import type { HabitFrequency } from "@/types/habit";
import type { HabitProgressDto, HeatmapValue } from "@/types/heatmap";

import { DailyHeatmap } from "./DailyHeatmap";
import { WeeklyHeatmap } from "./WeeklyHeatmap";
import { MonthlyHeatmap } from "./MonthlyHeatmap";
import { HeatmapControls } from "./HeatmapControls";
import { useMemo, useState } from "react";
import { rateToScale } from "@/assets/helpers";

type HeatmapProps = {
  habitId: string;
  startDate: string;
  frequency: HabitFrequency;
  progress: HabitProgressDto[];
};

export function Heatmap({
  habitId,
  startDate,
  frequency,
  progress,
}: HeatmapProps) {
  const [offset, setOffset] = useState(0);

  /**
   * DAILY / MONTHLY:
   * 1 day = 1 cell
   * value = 0..4 (из completionRate)
   */
  const dailyValues: HeatmapValue[] = useMemo(
    () =>
      progress.map((p) => ({
        date: p.date,
        value: rateToScale(p.completionRate),
      })),
    [progress]
  );

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
          values={dailyValues} // ⬅️ ВАЖНО: передаём дневные значения
        />
      )}

      {frequency === "Monthly" && (
        <MonthlyHeatmap
          startDate={startDate}
          offset={offset}
          values={dailyValues}
        />
      )}

      <HeatmapControls
        habitId={habitId}
        onPrev={() => setOffset((o) => o - 1)}
        onNext={() => setOffset((o) => o + 1)}
        canPrev={offset > 0}
        canNext
      />
    </div>
  );
}
