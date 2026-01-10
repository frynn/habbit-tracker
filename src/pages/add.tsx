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
import { ArrowLeft } from "lucide-react";
import { createHabit, getCategories } from "@/types/habit"; // API функции
import type { GoalUnit, HabitFrequency } from "@/types/habit";

/* ---------------- Types ---------------- */
type Category = {
  id: string;
  name: string;
  defaultUnit: GoalUnit;
};

/* ---------------- Options ---------------- */
const HABIT_FREQUENCY_OPTIONS: {
  label: string;
  value: string;
  apiValue: HabitFrequency;
}[] = [
  { label: "Daily", value: "Daily", apiValue: 0 },
  { label: "Weekly", value: "Weekly", apiValue: 1 },
  { label: "Monthly", value: "Monthly", apiValue: 2 },
];

const GOAL_UNIT_OPTIONS: {
  label: string;
  value: string;
  apiValue: GoalUnit;
}[] = [
  { label: "Times", value: "Times", apiValue: 0 },
  { label: "Steps", value: "Steps", apiValue: 1 },
  { label: "Minutes", value: "Minutes", apiValue: 2 },
  { label: "Kcal", value: "Kcal", apiValue: 3 },
];

/* ---------------- Component ---------------- */
export default function AddHabit() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // возвращает Category[]
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  /* ---------- Form fields ---------- */
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<string>("Daily");
  const [goalValue, setGoalValue] = useState<number>(0);
  const [goalUnit, setGoalUnit] = useState<string>("Steps");

  useEffect(() => {
    if (selectedCategory)
      setGoalUnit(
        GOAL_UNIT_OPTIONS.find(
          (u) => u.apiValue === selectedCategory.defaultUnit
        )?.value ?? "Steps"
      );
  }, [selectedCategory]);

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    if (!categoryId) return;

    // Конвертация строк в числа для API
    const freqNum =
      HABIT_FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.apiValue ?? 0;
    const goalUnitNum =
      GOAL_UNIT_OPTIONS.find((u) => u.value === goalUnit)?.apiValue ?? 1;

    const payload = {
      title,
      frequency: freqNum,
      goalValue,
      goalUnit: goalUnitNum,
      startDate: new Date().toISOString(),
      categoryId,
    };

    try {
      await createHabit(payload);
      navigate("/");
    } catch (error) {
      console.error("Failed to create habit", error);
      alert("Не удалось создать привычку");
    }
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
            <Select value={frequency} onValueChange={(v) => setFrequency(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {HABIT_FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.apiValue} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value)}
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
              </SelectContent>
            </Select>
          </div>

          {/* Goal */}
          <div className="space-y-1">
            <Label>Goal</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                value={goalValue}
                onChange={(e) => setGoalValue(Number(e.target.value))}
              />

              <Select value={goalUnit} onValueChange={(v) => setGoalUnit(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_UNIT_OPTIONS.map((unit) => (
                    <SelectItem key={unit.apiValue} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
