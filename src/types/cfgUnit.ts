import type { GoalUnit } from "./goalUnit";

export const GOAL_UNITS: Record<
  GoalUnit,
  { label: string }
> = {
  times: { label: "Times" },
  steps: { label: "Steps" },
  minutes: { label: "Minutes" },
  kcal: { label: "Kcal" },
};
