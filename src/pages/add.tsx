import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

type Frequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "3_times_week"
  | "2_times_week";

type GoalUnit = "times" | "steps" | "minutes";

export default function AddHabit() {
  /* ---------- Categories ---------- */
  const defaultCategories = [
    "Health",
    "Productivity",
    "Education",
    "Fitness",
    "Finance",
    "Mindfulness",
    "Work",
    "Hobby",
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [category, setCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  /* ---------- Form fields ---------- */
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [goalValue, setGoalValue] = useState<number>(0);
  const [goalUnit, setGoalUnit] = useState<GoalUnit>("times");

  /* ---------- Submit ---------- */
  const handleSubmit = () => {
    const payload = {
      title,
      category,
      frequency,
      goalValue,
      goalUnit,
      startDate: new Date().toISOString(),
    };

    console.log("Create habit payload:", payload);
    // TODO: POST /habits
  };

  return (
    <div className="max-w-xl space-y-4">
      <h3 className="text-xl font-medium pl-2">Create your habit</h3>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {/* Title */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Walk 10 000 steps"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-1">
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as Frequency)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="3_times_week">3 times a week</SelectItem>
                <SelectItem value="2_times_week">2 times a week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label>Category</Label>

            <Select
              value={category ?? ""}
              onValueChange={(value) => {
                if (value === "__new__") {
                  setCreatingCategory(true);
                  setCategory(null);
                } else {
                  setCategory(value);
                  setCreatingCategory(false);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}

                <SelectItem value="__new__">+ Create new category</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {creatingCategory && (
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                autoFocus
              />
              <Button
                variant="outline"
                onClick={() => {
                  const name = newCategory.trim();
                  if (!name || categories.includes(name)) return;

                  setCategories((prev) => [...prev, name]);
                  setCategory(name);
                  setNewCategory("");
                  setCreatingCategory(false);
                }}
              >
                <CheckIcon className="size-4" />
              </Button>
            </div>
          )}

          {/* Goal */}
          <Label>Goal</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              value={goalValue}
              onChange={(e) => setGoalValue(+e.target.value)}
              placeholder="10 000"
            />

            <Select
              value={goalUnit}
              onValueChange={(v) => setGoalUnit(v as GoalUnit)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="times">Times</SelectItem>
                <SelectItem value="steps">Steps</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!title || !category || goalValue <= 0}
          >
            Apply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
