export function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay() || 7; // 1..7
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function rateToScale(rate: number) {
  if (rate <= 0) return 0;
  if (rate < 0.25) return 1;
  if (rate < 0.5) return 2;
  if (rate < 0.75) return 3;
  return 4;
}

export function getCompletionStatus(value: number) {
  if (value >= 3) return { status: "completed", color: "green", icon: "✓" };
  if (value >= 1) return { status: "partial", color: "yellow", icon: "–" };
  return { status: "missed", color: "gray", icon: "✗" };
}


/**
 * Рассчитывает количество дней между двумя датами
 */
export function calculateDaysBetween(startDate: string | Date, endDate: string | Date = new Date()): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Убеждаемся, что даты валидны
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1;
  }
  
  // Приводим обе даты к началу дня (00:00:00)
  const startAtMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endAtMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  // Разница в миллисекундах
  const diffInMs = endAtMidnight.getTime() - startAtMidnight.getTime();
  
  // Конвертируем в дни
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // Возвращаем минимум 1 день
  return Math.max(1, diffInDays);
}

/**
 * Форматирует дату в человекочитаемый формат
 */
export function formatJoinDate(date: string | Date): string {
  const joinDate = new Date(date);
  
  if (isNaN(joinDate.getTime())) {
    return "Recently";
  }
  
  const now = new Date();
  const yearsDiff = now.getFullYear() - joinDate.getFullYear();
  const monthsDiff = now.getMonth() - joinDate.getMonth();
  
  if (yearsDiff > 0) {
    return `Since ${joinDate.getFullYear()}`;
  } else if (monthsDiff >= 6) {
    return "Since this year";
  } else {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long',
      day: 'numeric'
    };
    return `Joined ${joinDate.toLocaleDateString('en-US', options)}`;
  }
}

/**
 * Получает год из даты
 */
export function getYearFromDate(date: string | Date): number {
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
}
