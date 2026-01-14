import type { HeatmapValue } from "@/types/heatmap";
import { rateToScale } from "@/assets/helpers";

type Props = {
  startDate: string;
  offset: number; // листаем по месяцам (0 = текущий месяц)
  values: HeatmapValue[];
};

export function MonthlyHeatmap({ startDate, offset, values }: Props) {
  const habitStart = new Date(startDate);

  // 1. Берём первый месяц исходя из startDate + offset
  const baseMonth = new Date(
    habitStart.getFullYear(),
    habitStart.getMonth() + offset,
    1
  );

  const months: { key: string; label: string; value: number }[] = [];

  // 2. Формируем 6 месяцев
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(
      baseMonth.getFullYear(),
      baseMonth.getMonth() + i,
      1
    );

    // 3. Фильтруем значения по этому месяцу
    const monthValues = values.filter((v) => {
      const d = new Date(v.date);
      return (
        d.getFullYear() === monthDate.getFullYear() &&
        d.getMonth() === monthDate.getMonth()
      );
    });

    // 4. Берём среднее значение и переводим через rateToScale
    const avgValue =
      monthValues.length > 0
        ? monthValues.reduce((a, b) => a + b.value, 0) / monthValues.length
        : 0;

    const value = rateToScale(avgValue);

    months.push({
      key: monthDate.toISOString(),
      label: monthDate.toLocaleString("en-US", { month: "short" }),
      value,
    });
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {months.map((m) => (
        <div
          key={m.key}
          className={`
            h-10 rounded-md border flex items-center justify-center text-xs
            ${m.value === 0 ? "color-empty" : `color-scale-${m.value}`}
          `}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
}
