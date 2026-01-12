import type { HeatmapValue } from "@/types/heatmap";
import { startOfWeek, toISO } from "@/assets/helpers";
type Props = {
  startDate: string;
  offset: number;
  values: HeatmapValue[];
};

/* -------- component -------- */

export function WeeklyHeatmap({ startDate, offset, values }: Props) {
  const base = new Date(startDate);

  // диапазон: 12 недель
  const start = startOfWeek(
    new Date(base.getFullYear(), base.getMonth(), base.getDate() - offset * 7)
  );
  const end = new Date(start);
  end.setDate(start.getDate() + 7 * 12);

  // weekISO -> values[]
  const weekMap = new Map<string, number[]>();

  values.forEach((v) => {
    const d = new Date(v.date);
    if (d < start || d > end) return;

    const weekKey = toISO(startOfWeek(d));
    if (!weekMap.has(weekKey)) weekMap.set(weekKey, []);
    weekMap.get(weekKey)!.push(v.value);
  });

  // формируем недели подряд (даже пустые)
  const weeks: { weekStart: Date; value: number }[] = [];

  for (let i = 0; i < 12; i++) {
    const wStart = new Date(start);
    wStart.setDate(start.getDate() + i * 7);

    const key = toISO(wStart);
    const vals = weekMap.get(key) ?? [];

    const avg =
      vals.length === 0
        ? 0
        : Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);

    weeks.push({
      weekStart: wStart,
      value: avg, // 0..4
    });
  }

  /* -------- render -------- */

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
