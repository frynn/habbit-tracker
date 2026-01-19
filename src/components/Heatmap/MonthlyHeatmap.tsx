import type { HeatmapValue } from "@/types/heatmap";
import { rateToScale } from "@/assets/helpers";
import { useMemo } from "react";
import { Check, X, Minus } from "lucide-react";

type Props = {
  startDate: string;
  offset: number;
  values: HeatmapValue[];
};

export function MonthlyHeatmap({ startDate, offset, values }: Props) {
  const habitStart = new Date(startDate);

  const months = useMemo(() => {
    const baseMonth = new Date(
      habitStart.getFullYear(),
      habitStart.getMonth() + offset,
      1,
    );

    const result: {
      key: string;
      label: string;
      fullLabel: string;
      value: number;
      completed: boolean;
    }[] = [];

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(
        baseMonth.getFullYear(),
        baseMonth.getMonth() + i,
        1,
      );

      const monthValues = values.filter((v) => {
        const d = new Date(v.date);
        return (
          d.getFullYear() === monthDate.getFullYear() &&
          d.getMonth() === monthDate.getMonth()
        );
      });

      const avgValue =
        monthValues.length > 0
          ? monthValues.reduce((a, b) => a + b.value, 0) / monthValues.length
          : 0;

      const value = rateToScale(avgValue);
      const completed = monthValues.some((v) => rateToScale(v.value) >= 3); // Если есть высокий уровень активности

      result.push({
        key: monthDate.toISOString(),
        label: monthDate.toLocaleString("en-US", { month: "short" }),
        fullLabel: monthDate.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        }),
        value,
        completed,
      });
    }

    return result;
  }, [habitStart, offset, values]);

  const getMonthStatus = (value: number, completed: boolean) => {
    if (value === 0)
      return { icon: <X className="h-3 w-3" />, label: "Missed" };
    if (value >= 3)
      return { icon: <Check className="h-3 w-3" />, label: "Completed" };
    if (value >= 1)
      return { icon: <Minus className="h-3 w-3" />, label: "Partial" };
    return { icon: null, label: "No data" };
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
      {months.map((m) => {
        const scaleClass =
          m.value === 0
            ? "color-empty"
            : m.value >= 3
              ? "color-scale-4"
              : m.value >= 2
                ? "color-scale-3"
                : m.value >= 1
                  ? "color-scale-2"
                  : "color-scale-1";

        const status = getMonthStatus(m.value, m.completed);

        return (
          <div
            key={m.key}
            className={`
              aspect-square rounded border flex flex-col items-center justify-center p-1
              ${scaleClass}
            `}
            title={`${m.fullLabel}: ${status.label} - ${m.value}/4`}
          >
            <div className="text-[10px] font-semibold">{m.label}</div>

            {/* Индикатор статуса */}
            <div className="flex items-center justify-center mt-0.5">
              {status.icon ? (
                <div
                  className={`
                  rounded-full p-0.5 flex items-center justify-center
                  ${
                    m.value >= 3
                      ? "bg-white/30"
                      : m.value >= 1
                        ? "bg-white/20"
                        : "bg-gray-400/20"
                  }
                `}
                >
                  {status.icon}
                </div>
              ) : (
                <div className="text-[8px] opacity-70">-</div>
              )}
            </div>

            {/* Уровень активности (только если есть данные) */}
            {m.value > 0 && m.value < 3 && (
              <div className="text-[7px] font-bold mt-0.5">{m.value}/4</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
