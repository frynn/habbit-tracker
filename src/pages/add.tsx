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

import type { Category, HabitFrequency, GoalUnit } from "@/types/habit";
import {
  createHabit,
  getCategories,
  createCategory,
} from "@/services/habitService";

/* ---------------- Options ---------------- */

const HABIT_FREQUENCY_OPTIONS: HabitFrequency[] = [
  "Daily",
  "Weekly",
  "Monthly",
];
const GOAL_UNIT_OPTIONS: GoalUnit[] = ["Times", "Steps", "Minutes", "Kcal"];

/* ---------------- Component ---------------- */

export default function AddHabit() {
  const navigate = useNavigate();

  /* ---------- Categories ---------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryUnit, setNewCategoryUnit] = useState<GoalUnit>("Times");

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    };
    fetchCategories();
  }, []);

  /* ---------- Habit fields ---------- */
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("Daily");
  const [goalValue, setGoalValue] = useState<number>(0);
  const [goalUnit, setGoalUnit] = useState<GoalUnit>("Steps");

  /* при выборе категории — подставляем её defaultUnit */
  useEffect(() => {
    if (!selectedCategory) return;
    setGoalUnit(selectedCategory.defaultUnit);
  }, [selectedCategory]);

  /* ---------- Create category ---------- */
  const handleCreateCategory = async () => {
    if (!newCategoryName) return;

    const created = await createCategory({
      name: newCategoryName,
      defaultUnit: newCategoryUnit,
    });

    setCategories((prev) => [...prev, created]);
    setCategoryId(created.id);
    setIsCreatingCategory(false);
    setNewCategoryName("");
  };

  /* ---------- Submit habit ---------- */
  const handleSubmit = async () => {
    if (!categoryId || !title || goalValue <= 0) return;

    await createHabit({
      title,
      frequency,
      goalValue,
      goalUnit,
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
              onValueChange={(v) => setFrequency(v as HabitFrequency)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HABIT_FREQUENCY_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
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
              onValueChange={(v) =>
                v === "__new__" ? setIsCreatingCategory(true) : setCategoryId(v)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.isSystem && "(system)"}
                  </SelectItem>
                ))}
                <SelectItem value="__new__">
                  <span className="flex items-center gap-2">
                    <Plus size={14} /> New category
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
                onValueChange={(v) => setNewCategoryUnit(v as GoalUnit)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
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
                onChange={(e) => setGoalValue(Number(e.target.value))}
              />
              <Select
                value={goalUnit}
                onValueChange={(v) => setGoalUnit(v as GoalUnit)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
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
