// utils/streak-helpers.ts

/**
 * Рассчитывает общий текущий стрик на основе всех привычек
 */
export function calculateOverallCurrentStreak(habits: Array<{ currentStreak: number }>): number {
  if (!habits || habits.length === 0) return 0;
  
  // Возвращаем максимальный текущий стрик среди всех привычек
  return Math.max(...habits.map(h => h.currentStreak || 0));
}

/**
 * Рассчитывает общий лучший стрик на основе всех привычек
 */
export function calculateOverallBestStreak(habits: Array<{ bestStreak: number }>): number {
  if (!habits || habits.length === 0) return 0;
  
  // Возвращаем максимальный лучший стрик среди всех привычек
  return Math.max(...habits.map(h => h.bestStreak || 0));
}

/**
 * Рассчитывает общие стрики (текущий и лучший)
 */
export function calculateOverallStreaks(habits: Array<{ currentStreak: number, bestStreak: number }>) {
  if (!habits || habits.length === 0) {
    return { current: 0, best: 0 };
  }
  
  const currentStreaks = habits.map(h => h.currentStreak || 0);
  const bestStreaks = habits.map(h => h.bestStreak || 0);
  
  return {
    current: Math.max(...currentStreaks),
    best: Math.max(...bestStreaks)
  };
}