export function HabitCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-muted rounded" />
        <div className="h-10 flex-1 bg-muted rounded" />
        <div className="h-10 flex-1 bg-muted rounded" />
      </div>

      <div className="h-24 bg-muted rounded" />
    </div>
  );
}
