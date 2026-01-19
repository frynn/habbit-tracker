import type { HeatmapValue } from "@/types/heatmap";
import { startOfWeek } from "@/assets/helpers";
import { useMemo } from "react";
import { Check, X, Minus } from "lucide-react";

type Props = {
  startDate: string;
  offset: number;
  values: HeatmapValue[];
};

export function WeeklyHeatmap({ startDate, offset, values }: Props) {
  const habitStart = new Date(startDate);
  const today = new Date();

  const weeks = useMemo(() => {
    const targetMonth = new Date(
      today.getFullYear(),
      today.getMonth() + offset,
      1,
    );
    const month = targetMonth.getMonth();
    const year = targetMonth.getFullYear();

    const firstOfMonth = new Date(year, month, 1);
    const firstWeekStart = startOfWeek(firstOfMonth);

    const result: { weekStart: Date; value: number; completed: boolean }[] = [];
    let cursor = new Date(firstWeekStart);

    while (result.length < 4) {
      const weekStart = new Date(cursor);
      const weekEnd = new Date(cursor);
      weekEnd.setDate(weekEnd.getDate() + 6);

      if (weekStart.getMonth() === month || weekEnd.getMonth() === month) {
        let value = 0;
        let completed = false;

        if (weekEnd >= habitStart) {
          const weekValues = values.filter((v) => {
            const d = new Date(v.date);
            return startOfWeek(d).getTime() === weekStart.getTime();
          });

          if (weekValues.length > 0) {
            const avgValue =
              weekValues.reduce((a, b) => a + b.value, 0) / weekValues.length;
            value = Math.round(avgValue);
            completed = weekValues.some((v) => v.value >= 3); // Если есть высокий уровень активности
          }
        }

        result.push({ weekStart, value, completed });
      }
      cursor.setDate(cursor.getDate() + 7);
    }

    return result;
  }, [habitStart, offset, today, values]);

  const getWeekStatus = (value: number, completed: boolean) => {
    if (value === 0)
      return { icon: <X className="h-2.5 w-2.5" />, label: "Missed" };
    if (value >= 3)
      return { icon: <Check className="h-3 w-3" />, label: "Completed" };
    if (value >= 1)
      return { icon: <Minus className="h-2.5 w-2.5" />, label: "Partial" };
    return { icon: null, label: "No data" };
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      {weeks.map((w, idx) => {
        const scaleClass =
          w.value === 0
            ? "color-empty"
            : w.value >= 3
              ? "color-scale-4"
              : w.value >= 2
                ? "color-scale-3"
                : w.value >= 1
                  ? "color-scale-2"
                  : "color-scale-1";

        const status = getWeekStatus(w.value, w.completed);

        return (
          <div
            key={w.weekStart.toISOString()}
            className={`
              aspect-square rounded border flex flex-col items-center justify-center p-1
              ${scaleClass}
            `}
            title={`Week ${idx + 1} (${w.weekStart.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}): ${status.label} - ${w.value}/4`}
          >
            <div className="text-[9px] font-semibold mb-0.5">W{idx + 1}</div>

            {/* Индикатор статуса */}
            <div className="flex items-center justify-center">
              {status.icon && (
                <div
                  className={`
                  rounded-full p-0.5 flex items-center justify-center
                  ${
                    w.value >= 3
                      ? "bg-white/30"
                      : w.value >= 1
                        ? "bg-white/20"
                        : "bg-gray-400/20"
                  }
                `}
                >
                  {status.icon}
                </div>
              )}
            </div>

            {/* Уровень активности (опционально) */}
            {w.value > 0 && w.value < 3 && (
              <div className="text-[6px] font-bold mt-0.5">{w.value}/4</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
