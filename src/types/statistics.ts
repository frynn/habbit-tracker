export type UserProfileOverviewDto = {
  userId: string;
  email: string;
  username: string;

  totalHabits: number;
  totalCompletions: number;
  averageCompletionPercentage: number;

  habits: HabitStatisticsDto[];
  categories: CategoryStatisticsDto[];
};

export type HabitStatisticsDto = {
  habitId: string;
  title: string;
  categoryName: string; 
  totalCompletions: number;
  expectedOccurrences: number;
  completionPercentage: number;
  currentStreak: number;
  bestStreak: number;
};

export type CategoryStatisticsDto = {
  categoryId: string | null;
  categoryName: string;
  totalHabits: number;
  totalCompletions: number;
  completionPercentage: number;
};
