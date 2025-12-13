export type HabitDto = {
    id: string;            // Guid -> string
    title: string;
    frequency: string;
    startDate: string;     // DateTime -> ISO string
    categoryId: string;
    categoryName?: string;
}