import type { HeatmapValue } from "@/types/heatmap";

type Props = {
  startDate: string;
  offset: number;
  values: HeatmapValue[];
};

export function MonthlyHeatmap({ values }: Props) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {values.map((m) => (
        <div
          key={m.date}
          className={`h-10 rounded-md border flex items-center justify-center text-xs ${
            m.value > 0 ? "bg-primary/80 text-primary-foreground" : "bg-muted"
          }`}
        >
          {new Date(m.date).toLocaleString("en-US", { month: "short" })}
        </div>
      ))}
    </div>
  );
}
