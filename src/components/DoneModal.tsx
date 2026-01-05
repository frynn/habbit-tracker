import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BadgeCheck } from "lucide-react";

export function ProgressModal({
  habitId,
  onDone,
}: {
  habitId: string;
  onDone?: (count: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const handleSubmit = () => {
    if (count > 0) {
      console.log(
        `Отправка прогресса на бэкенд: habitId=${habitId}, count=${count}`
      );
      onDone?.(count); // вызываем заглушку
    }
    setCount(0);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex-1">
          Done for today
          <BadgeCheck className="ml-1" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] rounded-md">
        <DialogHeader>
          <DialogTitle>Mark Habit Done</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Manage your application settings here.
        </DialogDescription>

        <div className="flex flex-col gap-4 mt-2">
          <label className="flex flex-col gap-1">
            Amount
            <Input
              type="number"
              value={count}
              min={0}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </label>

          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full">
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
