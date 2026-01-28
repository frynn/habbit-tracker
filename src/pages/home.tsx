import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import type { HabitDto, Category } from "@/types/habit";
import { HabitCard } from "@/components/HabitCard";
import { HabitCardSkeleton } from "@/components/CardSkeleton";
import { EmptyHabitsState } from "@/components/EmptyHabitsState";
import { HabitSearch } from "@/components/HabitSearch";

import { getHabits } from "@/services/habitService";
import { getCategories } from "@/services/habitService";
import { PageContainer } from "@/components/PageContainer";

type FilterCategory = {
  id: string;
  name: string;
};

export default function Home() {
  /* ---------- Data ---------- */
  const [habits, setHabits] = useState<HabitDto[]>([]);
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- Filters ---------- */
  const [selected, setSelected] = useState<string[]>(["all"]);
  const [debouncedSelected, setDebouncedSelected] = useState<string[]>(["all"]);
  const [isFiltering, setIsFiltering] = useState(false);

  /* ---------- Fetch habits + categories ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [habitsData, categoriesData] = await Promise.all([
          getHabits(),
          getCategories(),
        ]);

        setHabits(habitsData);

        setCategories([
          { id: "all", name: "All" },
          ...categoriesData.map((c: Category) => ({
            id: c.id,
            name: c.name,
          })),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Debounce фильтров ---------- */
  useEffect(() => {
    setIsFiltering(true);

    const handler = setTimeout(() => {
      setDebouncedSelected(selected);
      setIsFiltering(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [selected]);

  /* ---------- Guard: хотя бы один фильтр ---------- */
  useEffect(() => {
    if (selected.length === 0) {
      setSelected(["all"]);
    }
  }, [selected]);

  /* ---------- Local filtering ---------- */
  const filteredHabits = useMemo(() => {
    if (debouncedSelected.includes("all") || debouncedSelected.length === 0) {
      return habits;
    }

    return habits.filter((habit) =>
      debouncedSelected.includes(habit.categoryId),
    );
  }, [habits, debouncedSelected]);

  /* ---------- Toggle filter ---------- */
  const toggleCategory = (id: string, checked: boolean) => {
    setSelected((prev) => {
      if (id === "all") {
        return checked ? ["all"] : [];
      }

      const withoutAll = prev.filter((x) => x !== "all");

      return checked ? [...withoutAll, id] : withoutAll.filter((x) => x !== id);
    });
  };

  /* ---------- Get selected category names ---------- */
  const getSelectedCategoryNames = () => {
    if (selected.includes("all") || selected.length === 0) {
      return ["All Habits"];
    }

    return selected
      .map((id) => {
        const category = categories.find((c) => c.id === id);
        return category ? category.name : null;
      })
      .filter(Boolean) as string[];
  };

  /* ---------- Get title based on selection ---------- */
  const getTitle = () => {
    const selectedNames = getSelectedCategoryNames();

    if (selectedNames.length === 1) {
      return selectedNames[0] === "All Habits"
        ? "All Habits"
        : `${selectedNames[0]} Habits`;
    }

    if (selectedNames.length === 2) {
      return `${selectedNames[0]} & ${selectedNames[1]} Habits`;
    }

    if (selectedNames.length > 2) {
      return `${selectedNames[0]}, ${selectedNames[1]} & more`;
    }

    return "All Habits";
  };

  /* ---------- Get subtitle based on selection ---------- */
  const getSubtitle = () => {
    const selectedNames = getSelectedCategoryNames();

    if (selectedNames.length === 1 && selectedNames[0] === "All Habits") {
      return `Viewing all ${filteredHabits.length} habits • Track your daily progress`;
    }

    if (selectedNames.length === 1) {
      const categoryName = selectedNames[0]
        .replace(" Habits", "")
        .toLowerCase();
      return `${filteredHabits.length} ${categoryName} habits • Stay consistent with your ${categoryName} goals`;
    }

    if (selectedNames.length === 2) {
      const cat1 = selectedNames[0].replace(" Habits", "");
      const cat2 = selectedNames[1].replace(" Habits", "");
      return `${filteredHabits.length} habits from ${cat1} and ${cat2} categories`;
    }

    if (selectedNames.length > 2) {
      return `${filteredHabits.length} habits from ${selectedNames.length} categories`;
    }

    return `Viewing ${filteredHabits.length} habits`;
  };

  /* ---------- Get panel subtitle ---------- */
  const getPanelSubtitle = () => {
    const selectedNames = getSelectedCategoryNames();

    if (selectedNames.length === 1 && selectedNames[0] === "All Habits") {
      return "Overview of all your tracked habits";
    }

    if (selectedNames.length === 1) {
      const categoryName = selectedNames[0]
        .replace(" Habits", "")
        .toLowerCase();
      return `Focus on your ${categoryName} routines`;
    }

    return "Custom filtered view of your habits";
  };

  return (
    <PageContainer>
      <div className="min-h-full">
        {/* Главный заголовок страницы */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {getTitle()}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {getSubtitle()}
          </p>
        </div>

        {/* Поиск - только на мобильных (на десктопе он в Header) */}
        <div className="lg:hidden mb-4">
          <HabitSearch />
        </div>

        {/* Панель с фильтрами */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Habit Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getPanelSubtitle()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FilterIcon className="h-4 w-4" />
                  {selected.includes("all")
                    ? "All Categories"
                    : `${selected.length} selected`}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="max-h-64 overflow-y-auto p-1">
                  {categories.map((cat) => (
                    <DropdownMenuCheckboxItem
                      key={cat.id}
                      checked={selected.includes(cat.id)}
                      onCheckedChange={(checked) =>
                        toggleCategory(cat.id, !!checked)
                      }
                      onSelect={(e) => e.preventDefault()}
                    >
                      {cat.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Сетка карточек */}
        <div
          className={
            isLoading || isFiltering
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : filteredHabits.length === 0
                ? "flex justify-center items-center min-h-[400px]"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          }
        >
          {isLoading || isFiltering ? (
            <>
              <HabitCardSkeleton />
              <HabitCardSkeleton />
              <HabitCardSkeleton />
              <HabitCardSkeleton />
              <HabitCardSkeleton />
              <HabitCardSkeleton />
            </>
          ) : filteredHabits.length === 0 ? (
            <div className="col-span-full">
              <EmptyHabitsState />
            </div>
          ) : (
            filteredHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
}
