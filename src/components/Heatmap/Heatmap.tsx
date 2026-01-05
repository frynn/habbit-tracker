import { useState } from "react";
import type { HabitFrequency } from "@/types/habit";

import { DailyHeatmap } from "./DailyHeatmap";
import { WeeklyHeatmap } from "./WeeklyHeatmap";
import { MonthlyHeatmap } from "./MonthlyHeatmap";
import { HeatmapControls } from "./HeatmapControls";

type HeatmapProps = {
  startDate: string;
  habitId: string;
  frequency: HabitFrequency;
};

export function Heatmap({ startDate, habitId, frequency }: HeatmapProps) {
  const [offset, setOffset] = useState(0);

  return (
    <div className="w-full">
      {frequency === "daily" && (
        <DailyHeatmap startDate={startDate} habitId={habitId} offset={offset} />
      )}

      {frequency === "weekly" && (
        <WeeklyHeatmap
          startDate={startDate}
          habitId={habitId}
          offset={offset}
        />
      )}

      {frequency === "monthly" && (
        <MonthlyHeatmap
          startDate={startDate}
          habitId={habitId}
          offset={offset}
        />
      )}

      <HeatmapControls
        habitId={habitId}
        onPrev={() => setOffset((o) => o - 1)}
        onNext={() => setOffset((o) => o + 1)}
        canPrev={offset > 0}
        canNext={true}
        onDone={(count) => {
          console.log("Отправка прогресса:", count);
          // TODO: здесь будет fetch на бекенд
        }}
      />
    </div>
  );
}
