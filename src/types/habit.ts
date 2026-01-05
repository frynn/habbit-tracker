export type HabitDto = {
    id: string;            // Guid -> string
    title: string;
    frequency: "daily" | "weekly" | "monthly";
    startDate: string;     // DateTime -> ISO string
    categoryId: string;
    categoryName?: string;
    goal?: number;     // сколько нужно выполнить
    goalUnit?: string; // единица измерения (шаги, раз и т.д.)
}

export type HabitFrequency = "daily" | "weekly" | "monthly";