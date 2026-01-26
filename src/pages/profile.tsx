import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Footprints,
  Book,
  Dumbbell,
  Brush,
  Target,
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Star,
  Award,
  Zap,
  Heart,
  Brain,
  Moon,
  Sun,
  Clock,
  ChevronRight,
  Crown,
  Medal,
  Target as TargetIcon,
  PieChart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { getProfileOverview } from "@/services/habitService";
import type { UserProfileOverviewDto } from "@/types/statistics";
import { PageContainer } from "@/components/PageContainer";
import { cn } from "@/lib/utils";
import { calculateOverallStreaks } from "@/assets/streak-helper";
import { calculateDaysBetween, formatJoinDate } from "@/assets/helpers";

const categoryIcons: Record<string, React.ElementType> = {
  Health: Heart,
  Education: Brain,
  Fitness: Dumbbell,
  default: Target,
};

const getStreakBadgeColor = (streak: number) => {
  if (streak >= 30) return "bg-gradient-to-r from-purple-500 to-pink-500";
  if (streak >= 14) return "bg-gradient-to-r from-orange-500 to-red-500";
  if (streak >= 7) return "bg-gradient-to-r from-yellow-500 to-orange-500";
  return "bg-gradient-to-r from-blue-500 to-cyan-500";
};

const getCompletionLevel = (percentage: number) => {
  if (percentage >= 90)
    return {
      label: "Master",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    };
  if (percentage >= 70)
    return { label: "Advanced", color: "text-blue-600", bg: "bg-blue-500/10" };
  if (percentage >= 50)
    return {
      label: "Intermediate",
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    };
  return { label: "Beginner", color: "text-gray-600", bg: "bg-gray-500/10" };
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfileOverview();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6 p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6 p-4">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <div className="mb-4 text-gray-400">
                <TargetIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
              <p className="text-gray-500 mb-4">Unable to load profile data</p>
              <Button onClick={() => navigate("/")}>Return to Home</Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // Вычисляем данные после загрузки профиля
  const overallStreaks = calculateOverallStreaks(profile.habits);

  // Используем createdAt из профиля или fallback на текущую дату минус 1 год
  const accountCreationDate =
    profile.createdAt ||
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  console.log(profile.createdAt);
  const daysInJourney = calculateDaysBetween(accountCreationDate);

  const joinDateText = formatJoinDate(accountCreationDate);
  const overallLevel = getCompletionLevel(profile.averageCompletionPercentage);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6 p-4">
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
                Your Profile
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your journey and achievements
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-2">
            <Star className="h-3 w-3" />
            {overallLevel.label}
          </Badge>
        </div>

        {/* User Info Card */}
        <Card className="border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {profile.username}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Badge variant="secondary" className="gap-1">
                    <Flame className="h-3 w-3" />
                    <span>Habit Tracker</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{joinDateText}</span>
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Day {daysInJourney}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    of your journey
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Habits</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Moon className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Habits
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {profile.totalHabits}
                      </h3>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Active goals you're tracking
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Completions
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {profile.totalCompletions.toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Successful habit completions
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Avg Completion
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        {profile.averageCompletionPercentage}%
                      </h3>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <Progress
                    value={profile.averageCompletionPercentage}
                    className="h-2 mt-3"
                  />
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Success Level
                      </p>
                      <h3
                        className={cn(
                          "text-2xl font-bold mt-1",
                          overallLevel.color,
                        )}
                      >
                        {overallLevel.label}
                      </h3>
                    </div>
                    <div className={cn("p-2 rounded-lg", overallLevel.bg)}>
                      <Award className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Based on your consistency
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories Progress */}
            {profile.categories.length > 0 && (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Progress by Category
                  </CardTitle>
                  <CardDescription>
                    Your performance across different habit categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.categories.map((cat) => {
                      const Icon =
                        categoryIcons[cat.categoryName] ||
                        categoryIcons.default;
                      const level = getCompletionLevel(
                        cat.completionPercentage,
                      );

                      return (
                        <div key={cat.categoryId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                  {cat.categoryName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {cat.totalHabits}{" "}
                                  {cat.totalHabits === 1 ? "habit" : "habits"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {cat.completionPercentage}%
                              </div>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", level.color)}
                              >
                                {level.label}
                              </Badge>
                            </div>
                          </div>
                          <Progress
                            value={cat.completionPercentage}
                            className="h-2"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Streak Highlights */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Streak Highlights
                </CardTitle>
                <CardDescription>
                  Your current streaks and personal records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                          <Flame className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Current Streak</span>
                      </div>
                      <Badge
                        className={getStreakBadgeColor(overallStreaks.current)}
                      >
                        {overallStreaks.current}{" "}
                        {overallStreaks.current === 1 ? "day" : "days"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {overallStreaks.current > 0
                        ? "Keep it going! You're building momentum."
                        : "Start your streak today!"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Best Streak</span>
                      </div>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500">
                        {overallStreaks.best}{" "}
                        {overallStreaks.best === 1 ? "day" : "days"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {overallStreaks.best > 0
                        ? "Your personal record. Aim to beat it!"
                        : "Set your first record!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Habits Tab */}
          <TabsContent value="habits" className="space-y-6">
            {profile.habits.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Your Habits ({profile.habits.length})
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track performance for each habit
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/")}
                    className="gap-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                    View All
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {profile.habits.map((h) => {
                    const Icon =
                      categoryIcons[h.categoryName] || categoryIcons.default;
                    const level = getCompletionLevel(h.completionPercentage);

                    return (
                      <Card
                        key={h.habitId}
                        className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mt-1">
                                <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                  {h.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className="text-xs">
                                    {h.categoryName}
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {h.totalCompletions} /{" "}
                                    {h.expectedOccurrences} completions
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {h.completionPercentage}%
                              </div>
                              <div className="flex items-center justify-end gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-amber-600">
                                  <Flame className="h-3 w-3" />
                                  {h.currentStreak}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-yellow-600">
                                  <Trophy className="h-3 w-3" />
                                  {h.bestStreak}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <Progress
                              value={h.completionPercentage}
                              className="h-2"
                            />
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Progress</span>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", level.color)}
                              >
                                {level.label}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 text-gray-400">
                    <Target className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Habits Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start tracking your first habit to see progress here
                  </p>
                  <Button onClick={() => navigate("/add")}>
                    Create First Habit
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appearance */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Appearance
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode" className="text-sm">
                        Dark Mode
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={handleDarkModeToggle}
                    />
                  </div>
                </div>

                <Separator />

                {/* Account Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Account Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Username</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {profile.username}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" disabled>
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {profile.email}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" disabled>
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stats Reset */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-red-600 dark:text-red-500">
                    Danger Zone
                  </h4>
                  <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TargetIcon className="h-5 w-5 text-red-600" />
                        <h5 className="font-medium text-red-700 dark:text-red-400">
                          Reset All Progress
                        </h5>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        This will permanently delete all your habit data,
                        streaks, and progress. This action cannot be undone.
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button variant="destructive" size="sm" disabled>
                          Reset All Data
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/export")}
                        >
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Preview */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Your habit tracking milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="size-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Medal className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-bold">{profile.totalHabits}</div>
                    <div className="text-xs text-gray-500">Habits Created</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="size-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-bold">{profile.totalCompletions}</div>
                    <div className="text-xs text-gray-500">Completions</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="size-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-bold">{overallStreaks.current}+</div>
                    <div className="text-xs text-gray-500">Day Streak</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="size-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-bold">{overallLevel.label}</div>
                    <div className="text-xs text-gray-500">Tracker</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
