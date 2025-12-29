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
import { useEffect, useState } from "react";
import { GOAL_UNITS } from "@/types/cfgUnit";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Frequency = "daily" | "weekly" | "monthly";

type GoalUnit = "times" | "steps" | "minutes" | "kcal";
type Category = {
  id: string;
  name: string;
  defaultUnit: GoalUnit;
};

export default function AddHabit() {
  /* ---------- Categories ---------- */
  const initialCategories: Category[] = [
    { id: "health", name: "Health", defaultUnit: "steps" },
    { id: "education", name: "Education", defaultUnit: "minutes" },
    { id: "fitness", name: "Fitness", defaultUnit: "times" },
  ];

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;

  useEffect(() => {
    if (selectedCategory) {
      setGoalUnit(selectedCategory.defaultUnit);
    }
  }, [selectedCategory]);

  /* create category */
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryUnit, setNewCategoryUnit] = useState<GoalUnit>("times");

  /* ---------- Form fields ---------- */
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [goalValue, setGoalValue] = useState<number>(0);
  const [goalUnit, setGoalUnit] = useState<GoalUnit>("times");

  /* ---------- Submit ---------- */
  const handleSubmit = () => {
    const payload = {
      title,
      categoryId,
      frequency,
      goalValue,
      goalUnit,
      startDate: new Date().toISOString(),
    };

    console.log("Create habit payload:", payload);
    // TODO: POST /habits
  };
  const navigate = useNavigate();

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h3 className="text-xl font-medium">Create your habit</h3>
      </div>
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
              value={categoryId ?? ""}
              onValueChange={(value) => {
                if (value === "__new__") {
                  setCreatingCategory(true);
                  setCategoryId(null);
                } else {
                  setCategoryId(value);
                  setCreatingCategory(false);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}

                <SelectItem value="__new__">+ Create new category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {creatingCategory && (
            <div className="space-y-2 rounded-md border p-3">
              <div className="space-y-1">
                <Label>Category name</Label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Nutrition"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <Label>Default unit</Label>
                <Select
                  value={newCategoryUnit}
                  onValueChange={(v) => setNewCategoryUnit(v as GoalUnit)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GOAL_UNITS).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    const name = newCategoryName.trim();
                    if (!name) return;

                    const newCategory: Category = {
                      id: crypto.randomUUID(),
                      name,
                      defaultUnit: newCategoryUnit,
                    };

                    setCategories((prev) => [...prev, newCategory]);
                    setCategoryId(newCategory.id);

                    setNewCategoryName("");
                    setNewCategoryUnit("times");
                    setCreatingCategory(false);

                    // TODO: POST /categories
                  }}
                >
                  Create category
                </Button>
              </div>
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
              value={newCategoryUnit}
              onValueChange={(v) => setNewCategoryUnit(v as GoalUnit)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GOAL_UNITS).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!title || !categoryId || goalValue <= 0}
          >
            Apply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
