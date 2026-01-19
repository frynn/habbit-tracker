import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import type { HabitDto } from "@/types/habit";

import { deleteHabit, getHabitById } from "@/services/habitService";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Heatmap } from "@/components/Heatmap/Heatmap";
import {
  Footprints,
  Book,
  Dumbbell,
  Brush,
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  BarChart3,
  Flame,
  Trophy,
  CalendarDays,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ---------------- Icons ---------------- */

const categoryIcons: Record<string, React.ElementType> = {
  Health: Footprints,
  Education: Book,
  Fitness: Dumbbell,
};

const frequencyIcons: Record<string, React.ElementType> = {
  Daily: Clock,
  Weekly: Calendar,
  Monthly: BarChart3,
};

/* ---------------- Component ---------------- */

export function HabitDetails() {
  const { habitId } = useParams<{ habitId: string }>();
  const navigate = useNavigate();

  const [habit, setHabit] = useState<HabitDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!habitId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const habitData = await getHabitById(habitId);
        setHabit(habitData);
      } catch (error) {
        console.error("Failed to load habit details:", error);
        setHabit(null);
        toast.error("Failed to load habit details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [habitId]);

  const handleDelete = async () => {
    if (!habitId || isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteHabit(habitId);
      toast.success("Habit deleted successfully");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete habit. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = () => {
    navigate(`/habits/${habitId}/edit`);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-3xl mx-auto space-y-6 p-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </PageContainer>
    );
  }

  if (!habit) return <Navigate to="/" replace />;

  const Icon = categoryIcons[habit.categoryName ?? ""] ?? Brush;
  const FrequencyIcon = frequencyIcons[habit.frequency] ?? Clock;

  /* ---------------- Stats ---------------- */
  const completedDays = habit.progress.filter((p) => p.completed).length;
  const totalDays = habit.progress.length;
  const currentStreak = habit.currentStreak || 0;
  const bestStreak = habit.bestStreak || 0;

  const completionPercent =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const averageCompletion =
    totalDays > 0
      ? Math.round(
          (habit.progress.reduce((sum, p) => sum + p.completionRate, 0) /
            totalDays) *
            100,
        ) / 100
      : 0;

  return (
    <>
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6 p-4">
          {/* Header with back button */}
          <div className="flex items-center justify-between gap-4">
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
                  Habit Details
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track and manage your habit progress
                </p>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Habit info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Habit info card */}
              <Card className="border border-gray-200 dark:border-gray-700 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "size-16 rounded-xl flex items-center justify-center",
                          "bg-gradient-to-br from-primary/10 to-primary/5",
                          "dark:from-primary/20 dark:to-primary/10",
                        )}
                      >
                        <Icon className="size-8 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {habit.title}
                          </h2>
                          <Badge variant="secondary" className="gap-1">
                            <FrequencyIcon className="h-3 w-3" />
                            {habit.frequency}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Target className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Goal:</span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {habit.goal} {habit.goalUnit}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Started:</span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {new Date(habit.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Category:</span>
                            <Badge variant="outline">
                              {habit.categoryName || "Uncategorized"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {completedDays}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Completed
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      out of {totalDays}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {completionPercent}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Success Rate
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      overall
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {currentStreak}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Current Streak
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      days in a row
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {bestStreak}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Best Streak
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      all time record
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Heatmap section */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Activity Calendar
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Track your {habit.frequency.toLowerCase()} progress
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-heatmap-scale-1"></div>
                        <span>Low</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-heatmap-scale-4"></div>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/30">
                    <Heatmap
                      habitId={habit.id}
                      startDate={habit.startDate}
                      frequency={habit.frequency}
                      progress={habit.progress}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Actions & Info */}
            <div className="space-y-6">
              {/* Actions card */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleEdit}
                      className="w-full justify-start gap-2"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Habit
                    </Button>
                    <Button
                      onClick={() => setShowDeleteDialog(true)}
                      className="w-full justify-start gap-2"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Habit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Progress insights */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Progress Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Consistency
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {completionPercent >= 80
                            ? "Excellent! You're very consistent with this habit."
                            : completionPercent >= 60
                              ? "Good job! Keep going to build a strong habit."
                              : "Keep at it! Consistency will improve over time."}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Habit Stats
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Created
                          </span>
                          <span className="font-medium">
                            {new Date(habit.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Frequency
                          </span>
                          <span className="font-medium">{habit.frequency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Goal
                          </span>
                          <span className="font-medium">
                            {habit.goal} {habit.goalUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/")}
                      className="w-full justify-start gap-2"
                      variant="ghost"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to All Habits
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full justify-start gap-2"
                      variant="ghost"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Refresh Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md border-0 shadow-2xl">
          <div className="flex flex-col items-center text-center p-2">
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <div className="rounded-full bg-destructive/20 p-3">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
            </div>

            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Delete Habit Forever?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-left">
                      This action{" "}
                      <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                        cannot be undone
                      </span>
                      . All your progress, streaks, and statistics will be
                      permanently deleted.
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {habit.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{habit.frequency}</span>
                          <span>•</span>
                          <span>
                            {habit.goal} {habit.goalUnit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                        <div className="font-bold">{completedDays}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                        <div className="font-bold">{currentStreak}</div>
                        <div className="text-xs text-gray-500">Streak</div>
                      </div>
                      <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                        <div className="font-bold">{completionPercent}%</div>
                        <div className="text-xs text-gray-500">Success</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm pt-2">
                    Are you absolutely sure you want to delete this habit and
                    all its data?
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 w-full mt-6">
              <AlertDialogCancel
                className="flex-1 order-2 sm:order-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 order-1 sm:order-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Forever
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
