import type { HeatmapBaseProps } from "@/types/heatmapBaseProps";

export function WeeklyHeatmap({ startDate, offset }: HeatmapBaseProps) {
  const base = new Date(startDate);
  const month = new Date(base.getFullYear(), base.getMonth() + offset, 1);

  const weeks = Array.from({ length: 4 }).map((_, i) => ({
    week: i + 1,
    completed: Math.random() > 0.5,
  }));

  return (
    <div className="w-full flex flex-col">
      <div className="text-center text-sm mb-3 text-muted-foreground">
        {month.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {weeks.map((w) => (
          <div
            key={w.week}
            className={`h-10 rounded-md border flex items-center justify-center text-xs ${
              w.completed ? "bg-primary/80 text-primary-foreground" : "bg-muted"
            }`}
          >
            W{w.week}
          </div>
        ))}
      </div>
    </div>
  );
}
