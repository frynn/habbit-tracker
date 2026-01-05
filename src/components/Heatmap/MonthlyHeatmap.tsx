import type { HeatmapBaseProps } from "@/types/heatmapBaseProps";

export function MonthlyHeatmap({ startDate, offset }: HeatmapBaseProps) {
  const base = new Date(startDate);
  const year = base.getFullYear() + offset;

  const months = Array.from({ length: 12 }).map((_, i) => ({
    month: i,
    completed: Math.random() > 0.5,
  }));

  return (
    <div>
      <div className="text-center text-sm mb-3 text-muted-foreground">
        {year}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {months.map((m) => (
          <div
            key={m.month}
            className={`h-10 rounded-md border flex items-center justify-center text-xs ${
              m.completed ? "bg-primary/80 text-primary-foreground" : "bg-muted"
            }`}
          >
            {new Date(0, m.month).toLocaleString("en-US", {
              month: "short",
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
