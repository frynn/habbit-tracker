import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner"; // Изменено: используем sonner вместо useToast

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Target,
  Calendar,
  Tag,
  BarChart3,
  Clock,
  TrendingUp,
  X,
  Check,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import type {
  Category,
  HabitFrequency,
  GoalUnit,
  HabitCreateRequest,
} from "@/types/habit";
import {
  createHabit,
  getCategories,
  createCategory,
} from "@/services/habitService";
import { PageContainer } from "@/components/PageContainer";
import { cn } from "@/lib/utils";

/* ---------------- Options ---------------- */

const HABIT_FREQUENCY_OPTIONS: {
  value: HabitFrequency;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "Daily",
    label: "Daily",
    description: "Track every day",
    icon: Clock,
  },
  {
    value: "Weekly",
    label: "Weekly",
    description: "Track once a week",
    icon: Calendar,
  },
  {
    value: "Monthly",
    label: "Monthly",
    description: "Track once a month",
    icon: BarChart3,
  },
];

const GOAL_UNIT_OPTIONS: GoalUnit[] = ["Times", "Steps", "Minutes", "Kcal"];

const FREQUENCY_DEFAULT_GOALS = {
  Daily: { value: 1, unit: "Times" as GoalUnit },
  Weekly: { value: 3, unit: "Times" as GoalUnit },
  Monthly: { value: 10, unit: "Times" as GoalUnit },
};

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
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      } catch (error) {
        toast.error("Failed to load categories", {
          description: "Please try again later.",
        });
      }
    };
    fetchCategories();
  }, []);

  /* ---------- Habit fields ---------- */
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("Daily");
  const [goalValue, setGoalValue] = useState<number>(1);
  const [goalUnit, setGoalUnit] = useState<GoalUnit>("Times");

  /* при выборе категории — подставляем её defaultUnit */
  useEffect(() => {
    if (!selectedCategory) return;
    setGoalUnit(selectedCategory.defaultUnit);
  }, [selectedCategory]);

  /* при изменении частоты - предлагаем дефолтное значение цели */
  useEffect(() => {
    const defaultGoal = FREQUENCY_DEFAULT_GOALS[frequency];
    if (goalValue === 0 || goalValue === 1) {
      setGoalValue(defaultGoal.value);
    }
    if (goalUnit === "Times") {
      setGoalUnit(defaultGoal.unit);
    }
  }, [frequency, goalValue, goalUnit]);

  /* ---------- Create category ---------- */
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name required", {
        description: "Please enter a name for your category.",
      });
      return;
    }

    try {
      const created = await createCategory({
        name: newCategoryName,
        defaultUnit: newCategoryUnit,
      });

      setCategories((prev) => [...prev, created]);
      setCategoryId(created.id);
      setIsCreatingCategory(false);
      setNewCategoryName("");

      toast.success("Category created", {
        description: `${newCategoryName} has been added to your categories.`,
      });
    } catch (error) {
      toast.error("Failed to create category", {
        description: "Please try again.",
      });
    }
  };

  /* ---------- Submit habit ---------- */
  const handleSubmit = async () => {
    if (!categoryId) {
      toast.error("Category required", {
        description: "Please select or create a category for your habit.",
      });
      return;
    }

    if (!title.trim()) {
      toast.error("Title required", {
        description: "Please give your habit a name.",
      });
      return;
    }

    if (goalValue <= 0) {
      toast.error("Invalid goal", {
        description: "Goal must be greater than 0.",
      });
      return;
    }

    try {
      const habitData: HabitCreateRequest = {
        title,
        frequency,
        goalValue,
        goalUnit,
        startDate: new Date().toISOString(),
        categoryId,
      };

      await createHabit(habitData);

      toast.success("Habit created!", {
        description: `${title} has been added to your habits.`,
      });

      navigate("/");
    } catch (error) {
      toast.error("Failed to create habit", {
        description: "Please try again.",
      });
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Create New Habit
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Build a new healthy habit step by step
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-primary/10 to-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">New Habit</span>
          </div>
        </div>

        {/* Main form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  Habit Details
                </CardTitle>
                <CardDescription>
                  Define your habit's name, frequency and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <span className="font-semibold">Habit Name</span>
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Morning Meditation, Daily Reading"
                    className="text-lg"
                  />
                </div>

                <Separator />

                {/* Frequency */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">Tracking Frequency</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {HABIT_FREQUENCY_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFrequency(option.value)}
                          className={cn(
                            "p-4 rounded-lg border transition-all duration-200 text-left",
                            "hover:border-primary/50 hover:bg-primary/5",
                            frequency === option.value
                              ? "border-primary bg-primary/10 ring-1 ring-primary/20"
                              : "border-gray-200 dark:border-gray-700",
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-5 w-5" />
                            <span className="font-semibold">
                              {option.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Category */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="font-semibold">Category</span>
                  </Label>

                  {!isCreatingCategory ? (
                    <div className="space-y-3">
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{c.name}</span>
                                {c.defaultUnit && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs"
                                  >
                                    {c.defaultUnit}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                          <SelectItem value="__new__">
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" /> Create New Category
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Quick category badges */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 w-full">
                            Quick select:
                          </p>
                          {categories.slice(0, 4).map((category) => (
                            <Badge
                              key={category.id}
                              variant={
                                categoryId === category.id
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => setCategoryId(category.id)}
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold">New Category</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setIsCreatingCategory(false);
                            setNewCategoryName("");
                          }}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="category-name">Category Name</Label>
                          <Input
                            id="category-name"
                            placeholder="e.g., Fitness, Learning, Health"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            autoFocus
                          />
                        </div>

                        <div>
                          <Label htmlFor="category-unit">Default Unit</Label>
                          <Select
                            value={newCategoryUnit}
                            onValueChange={(v) =>
                              setNewCategoryUnit(v as GoalUnit)
                            }
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

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim()}
                            className="flex-1"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Category
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsCreatingCategory(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Goal */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">Daily Goal</span>
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal-value">Target Amount</Label>
                      <div className="relative">
                        <Input
                          id="goal-value"
                          type="number"
                          min={1}
                          value={goalValue}
                          onChange={(e) =>
                            setGoalValue(Math.max(1, Number(e.target.value)))
                          }
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          {goalUnit}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="goal-unit">Unit of Measurement</Label>
                      <Select
                        value={goalUnit}
                        onValueChange={(v) => setGoalUnit(v as GoalUnit)}
                      >
                        <SelectTrigger id="goal-unit">
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

                  {/* Quick goal suggestions based on frequency */}
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Suggested goals for {frequency.toLowerCase()} habits:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[1, 5, 10, 20, 30].map((value) => (
                        <Badge
                          key={value}
                          variant="outline"
                          className={cn(
                            "cursor-pointer hover:bg-primary/10",
                            goalValue === value &&
                              "bg-primary text-primary-foreground",
                          )}
                          onClick={() => setGoalValue(value)}
                        >
                          {value} {goalUnit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Preview & Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Habit Preview</CardTitle>
                <CardDescription>
                  This is how your habit will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {title || "Your Habit Name"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {frequency} • Goal: {goalValue} {goalUnit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div className="text-lg font-bold">0</div>
                    <div className="text-xs text-gray-500">Streak</div>
                  </div>
                  <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div className="text-lg font-bold">0%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                  <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div className="text-lg font-bold">{goalValue}</div>
                    <div className="text-xs text-gray-500">Target</div>
                  </div>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-sm">
                    {selectedCategory
                      ? `This habit will be tracked in "${selectedCategory.name}" category.`
                      : "Select a category to see where this habit will be organized."}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !categoryId || goalValue <= 0}
                    className="w-full h-12 text-base font-semibold"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Create Habit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="w-full"
                  >
                    Cancel
                  </Button>

                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4">
                    <p>You can always edit or delete this habit later.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm">
                    Start with small, achievable goals to build momentum.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm">
                    Be consistent with your chosen frequency.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm">
                    Use meaningful categories for better organization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
