import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BadgeCheck, Plus, Minus, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressModalProps {
  habitId: string;
  onDone?: (count: number) => void;
  children?: React.ReactNode;
  defaultCount?: number;
  goal?: number;
  goalUnit?: string;
}

export function ProgressModal({
  habitId,
  onDone,
  children,
  defaultCount = 1,
  goal,
  goalUnit = "times",
}: ProgressModalProps) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(defaultCount);
  const [goalPercent, setGoalPercent] = useState(0);

  // Рассчитываем процент от цели
  useEffect(() => {
    if (goal && goal > 0) {
      const percent = Math.min(100, Math.round((count / goal) * 100));
      setGoalPercent(percent);
    }
  }, [count, goal]);

  const handleSubmit = () => {
    if (count > 0) {
      onDone?.(count);
    }
    setCount(defaultCount);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="gap-2">
            <BadgeCheck className="h-4 w-4" />
            Done
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className="sm:max-w-md rounded-lg"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">Track Your Progress</DialogTitle>
              <DialogDescription className="text-sm">
                How much did you complete today?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Counter controls */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrement}
                disabled={count <= 0}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="h-5 w-5" />
              </Button>

              <div className="text-center min-w-[120px]">
                <div className="text-4xl font-bold tracking-tight text-primary">
                  {count}
                </div>
                <div className="text-sm text-muted-foreground">{goalUnit}</div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={increment}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Manual input */}
            <div className="w-full max-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                Or enter exact amount
              </label>
              <Input
                type="number"
                value={count}
                min={0}
                onChange={(e) => setCount(Math.max(0, Number(e.target.value)))}
                className="text-center text-lg"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Goal progress */}
          {goal && goal > 0 && (
            <div className="space-y-2 rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Goal Progress</span>
                </div>
                <span className="text-sm font-medium">
                  {count} / {goal} {goalUnit}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>0%</span>
                  <span
                    className={cn(
                      "font-semibold",
                      goalPercent >= 100
                        ? "text-green-600"
                        : goalPercent >= 75
                          ? "text-amber-600"
                          : "text-primary",
                    )}
                  >
                    {goalPercent}%
                  </span>
                  <span>100%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      goalPercent >= 100
                        ? "bg-green-500"
                        : goalPercent >= 75
                          ? "bg-amber-500"
                          : "bg-primary",
                    )}
                    style={{ width: `${Math.min(100, goalPercent)}%` }}
                  />
                </div>
              </div>
              {goalPercent >= 100 && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium mt-2">
                  <TrendingUp className="h-4 w-4" />
                  Goal achieved! 🎉
                </div>
              )}
            </div>
          )}

          {/* Streak info (можно добавить реальные данные) */}
          <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-primary/5 border">
            <span className="text-muted-foreground">Current streak:</span>
            <span className="font-semibold">7 days 🔥</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={count <= 0}
            className="flex-1 gap-2"
          >
            <BadgeCheck className="h-4 w-4" />
            Save Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
