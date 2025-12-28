export function EmptyHabitsState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-sm">No habits found for the selected filters.</p>
      <p className="text-xs mt-1">
        Try selecting another category or clear filters.
      </p>
    </div>
  );
}
