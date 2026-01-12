import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import type { HeatmapValue } from "@/types/heatmap";

type Props = {
  startDate: string;
  offset: number;
  values: HeatmapValue[];
};

function getMonthRange(base: Date, offset: number) {
  const start = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const end = new Date(base.getFullYear(), base.getMonth() + offset + 1, 0);
  return { start, end };
}

export function DailyHeatmap({ startDate, offset, values }: Props) {
  const base = new Date(startDate);

  const months = [
    getMonthRange(base, offset),
    getMonthRange(base, offset + 1),
    getMonthRange(base, offset + 2),
  ];

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
            classForValue={(v) => {
              if (!v || v.value === 0) return "color-empty";
              return `color-scale-${v.value}`;
            }}
          />
        </div>
      ))}
    </div>
  );
}
