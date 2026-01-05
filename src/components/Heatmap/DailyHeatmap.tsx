import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import type { HeatmapBaseProps } from "@/types/heatmapBaseProps";

function getMonthRange(base: Date, offset: number) {
  const start = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const end = new Date(base.getFullYear(), base.getMonth() + offset + 1, 0);
  return { start, end };
}

export function DailyHeatmap({ startDate, offset }: HeatmapBaseProps) {
  const base = new Date(startDate);

  const months = [
    getMonthRange(base, offset),
    getMonthRange(base, offset + 1),
    getMonthRange(base, offset + 2),
  ];

  const values = [...Array(365)].map((_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      count: Math.floor(Math.random() * 4),
    };
  });

  return (
    <div className="flex justify-between gap-4">
      {months.map((range, idx) => (
        <div key={idx}>
          <div className="text-center text-sm mb-2 text-muted-foreground">
            {range.start.toLocaleString("en-US", { month: "long" })}
          </div>

          <CalendarHeatmap
            startDate={range.start}
            endDate={range.end}
            values={values}
            showWeekdayLabels={false}
            showMonthLabels={false}
            classForValue={(v) =>
              !v ? "color-scale-0" : `color-scale-${v.count}`
            }
          />
        </div>
      ))}
    </div>
  );
}
