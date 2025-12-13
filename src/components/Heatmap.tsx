import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Settings2,
  BadgeCheck,
} from "lucide-react";

type HeatmapProps = {
  startDate: string; // ISO string из DTO
};

function getMonthRange(base: Date, offset: number) {
  const start = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const end = new Date(base.getFullYear(), base.getMonth() + offset + 1, 0);
  return { start, end };
}

export function Heatmap({ startDate }: HeatmapProps) {
  const habitCreatedAt = new Date(startDate); // дата создания привычки
  const [offset, setOffset] = useState(0);

  // три месяца подряд
  const months = [
    getMonthRange(habitCreatedAt, offset),
    getMonthRange(habitCreatedAt, offset + 1),
    getMonthRange(habitCreatedAt, offset + 2),
  ];

  const canGoPrev = months[0].start > habitCreatedAt;
  const canGoNext = true; // можно ограничить текущей датой при необходимости

  // моковые данные
  const values = [...Array(365)].map((_, i) => {
    const d = new Date(habitCreatedAt);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      count: Math.floor(Math.random() * 4),
    };
  });

  return (
    <div className="w-full">
      {/* Heatmaps */}
      <div className="flex justify-between gap-4">
        {months.map((range, idx) => (
          <div key={idx} className="flex justify-center">
            <div className="heatmap-month">
              <div className="text-center text-sm mb-2 text-muted-foreground capitalize">
                {range.start.toLocaleString("default", { month: "long" })}
              </div>

              <CalendarHeatmap
                startDate={range.start}
                endDate={range.end}
                values={values}
                showWeekdayLabels={false}
                showMonthLabels={false}
                classForValue={(value) =>
                  !value ? "color-scale-0" : `color-scale-${value.count}`
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-1 mt-4">
        <Button variant="default" size="default" className="flex-1">
          Done for today
          <BadgeCheck />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => canGoPrev && setOffset((o) => o - 1)}
          className={`px-3 py-1 border transition ${
            canGoPrev ? "opacity-100" : "opacity-40 cursor-not-allowed"
          }`}
        >
          <ArrowLeftIcon />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => canGoNext && setOffset((o) => o + 1)}
          className={`px-3 py-1 border transition ${
            canGoNext ? "opacity-100" : "opacity-40 cursor-not-allowed"
          }`}
        >
          <ArrowRightIcon />
        </Button>
        <Button variant="outline" size="icon">
          <Settings2 />
        </Button>
      </div>
    </div>
  );
}
