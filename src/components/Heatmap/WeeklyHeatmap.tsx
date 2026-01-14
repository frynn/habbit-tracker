import type { HeatmapValue } from "@/types/heatmap";
import { startOfWeek, rateToScale } from "@/assets/helpers";

type Props = {
  startDate: string;
  offset: number; // листаем по месяцам
  values: HeatmapValue[];
};

export function WeeklyHeatmap({ startDate, offset, values }: Props) {
  const habitStart = new Date(startDate);

  // 1. Текущий месяц как якорь, сдвиг по offset вперед
  const today = new Date();
  const targetMonth = new Date(
    today.getFullYear(),
    today.getMonth() + offset,
    1
  );
  const month = targetMonth.getMonth();
  const year = targetMonth.getFullYear();

  // 2. Первый понедельник месяца
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekStart = startOfWeek(firstOfMonth);

  const weeks: { weekStart: Date; value: number }[] = [];
  let cursor = new Date(firstWeekStart);

  // 3. Формируем 4 недели
  while (weeks.length < 4) {
    const weekStart = new Date(cursor);
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Неделя пересекает месяц?
    if (weekStart.getMonth() === month || weekEnd.getMonth() === month) {
      let value = 0;
      if (weekEnd >= habitStart) {
        const weekValues = values.filter((v) => {
          const d = new Date(v.date);
          // Сравниваем понедельники
          return startOfWeek(d).getTime() === weekStart.getTime();
        });
        if (weekValues.length > 0) {
          value =
            weekValues.reduce((a, b) => a + b.value, 0) / weekValues.length;
        }
      }
      weeks.push({ weekStart, value });
    }

    cursor.setDate(cursor.getDate() + 7);
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {weeks.map((w) => (
        <div
          key={w.weekStart.toISOString()}
          className={`
            h-10 rounded-md border flex items-center justify-center text-xs
            ${w.value === 0 ? "color-empty" : `color-scale-${w.value}`}
          `}
          title={`Week of ${w.weekStart.toLocaleDateString("en-US")}`}
        >
          {w.weekStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      ))}
    </div>
  );
}
