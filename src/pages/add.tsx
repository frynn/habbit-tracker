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
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

import {
  createHabit,
  getCategories,
  createCategory,
  type Category,
  type GoalUnit,
  type HabitFrequency,
} from "@/types/habit";

/* ---------------- Options ---------------- */

const HABIT_FREQUENCY_OPTIONS = [
  { label: "Daily", value: "Daily", apiValue: 0 },
  { label: "Weekly", value: "Weekly", apiValue: 1 },
  { label: "Monthly", value: "Monthly", apiValue: 2 },
] as const;

const GOAL_UNIT_OPTIONS = [
  { label: "Times", value: "Times", apiValue: 0 },
  { label: "Steps", value: "Steps", apiValue: 1 },
  { label: "Minutes", value: "Minutes", apiValue: 2 },
  { label: "Kcal", value: "Kcal", apiValue: 3 },
] as const;

/* ---------------- Component ---------------- */

export default function AddHabit() {
  const navigate = useNavigate();

  /* ---------- Categories ---------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryUnit, setNewCategoryUnit] =
    useState<(typeof GOAL_UNIT_OPTIONS)[number]["value"]>("Times");

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;

  useEffect(() => {
    const fetch = async () => {
      const data = await getCategories();
      setCategories(data);

      if (data.length > 0) {
        setCategoryId(data[0].id);
      }
    };

    fetch();
  }, []);

  /* ---------- Habit fields ---------- */
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] =
    useState<(typeof HABIT_FREQUENCY_OPTIONS)[number]["value"]>("Daily");
  const [goalValue, setGoalValue] = useState<number>(0);
  const [goalUnit, setGoalUnit] =
    useState<(typeof GOAL_UNIT_OPTIONS)[number]["value"]>("Steps");

  /* при выборе категории — подставляем её defaultUnit */
  useEffect(() => {
    if (!selectedCategory) return;

    const unit = GOAL_UNIT_OPTIONS.find(
      (u) => u.apiValue === selectedCategory.defaultUnit
    )?.value;

    if (unit) setGoalUnit(unit);
  }, [selectedCategory]);

  /* ---------- Create category ---------- */
  const handleCreateCategory = async () => {
    const unitNum =
      GOAL_UNIT_OPTIONS.find((u) => u.value === newCategoryUnit)?.apiValue ?? 0;

    const created = await createCategory({
      name: newCategoryName,
      defaultUnit: unitNum as GoalUnit,
    });

    setCategories((prev) => [...prev, created]);
    setCategoryId(created.id);

    setIsCreatingCategory(false);
    setNewCategoryName("");
    setGoalUnit(newCategoryUnit);
  };

  /* ---------- Submit habit ---------- */
  const handleSubmit = async () => {
    if (!categoryId) return;

    const freqNum =
      HABIT_FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.apiValue ?? 0;

    const unitNum =
      GOAL_UNIT_OPTIONS.find((u) => u.value === goalUnit)?.apiValue ?? 0;

    await createHabit({
      title,
      frequency: freqNum as HabitFrequency,
      goalValue,
      goalUnit: unitNum as GoalUnit,
      startDate: new Date().toISOString(),
      categoryId,
    });

    navigate("/");
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="max-w-xl space-y-4 px-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h3 className="text-xl font-medium">Create your habit</h3>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Frequency */}
          <div>
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(value) => setFrequency(value as typeof frequency)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HABIT_FREQUENCY_OPTIONS.map((o) => (
                  <SelectItem key={o.apiValue} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={(v) => {
                if (v === "__new__") {
                  setIsCreatingCategory(true);
                } else {
                  setCategoryId(v);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                    {c.isSystem}
                  </SelectItem>
                ))}

                <SelectItem value="__new__">
                  <span className="flex items-center gap-2">
                    <Plus size={14} />
                    New category
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create category */}
          {isCreatingCategory && (
            <div className="space-y-2 rounded border p-3">
              <Label>New category</Label>

              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />

              <Select
                value={newCategoryUnit}
                onValueChange={(value) =>
                  setNewCategoryUnit(value as typeof newCategoryUnit)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u.apiValue} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleCreateCategory}
                disabled={!newCategoryName}
              >
                Create category
              </Button>
            </div>
          )}

          {/* Goal */}
          <div>
            <Label>Goal</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                value={goalValue}
                onChange={(e) => setGoalValue(+e.target.value)}
              />

              <Select
                value={goalUnit}
                onValueChange={(value) => setGoalUnit(value as typeof goalUnit)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u.apiValue} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
