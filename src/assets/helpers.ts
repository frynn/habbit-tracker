export function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay() || 7; // 1..7
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function rateToScale(rate: number) {
  if (rate <= 0) return 0;
  if (rate < 0.25) return 1;
  if (rate < 0.5) return 2;
  if (rate < 0.75) return 3;
  return 4;
}

export function getCompletionStatus(value: number) {
  if (value >= 3) return { status: "completed", color: "green", icon: "✓" };
  if (value >= 1) return { status: "partial", color: "yellow", icon: "–" };
  return { status: "missed", color: "gray", icon: "✗" };
}
