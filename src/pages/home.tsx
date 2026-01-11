import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import type { HabitDto, Category } from "@/types/habit";
import { HabitCard } from "@/components/HabitCard";
import { HabitCardSkeleton } from "@/components/CardSkeleton";
import { EmptyHabitsState } from "@/components/EmptyHabitsState";
import { HabitSearch } from "@/components/HabitSearch";

import { getHabits } from "@/types/habit";
import { getCategories } from "@/types/habit";

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

        // категории для фильтра: All + реальные
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

  /* ---------- Local filtering (временно) ---------- */
  const filteredHabits = useMemo(() => {
    if (debouncedSelected.includes("all") || debouncedSelected.length === 0) {
      return habits;
    }

    return habits.filter((habit) =>
      debouncedSelected.includes(habit.categoryId)
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

  /*
    TODO (backend):
    заменить локальную фильтрацию на серверную:

    GET /habit?categories=id1,id2
  */

  /* ---------- Render ---------- */
  return (
    <div className="relative px-2">
      <h3 className="text-xl/6 font-medium pl-2">Home</h3>

      <div className="w-full p-1 overflow-visible">
        <HabitSearch />
      </div>

      <div className="flex justify-between p-1 mb-1 items-center">
        <h4 className="font-medium pl-1">
          Your habits ({filteredHabits.length})
        </h4>

        <ButtonGroup>
          <Button variant="outline" size="sm">
            Filters
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="pl-2">
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <div className="max-h-52 overflow-y-auto pr-1">
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
        </ButtonGroup>
      </div>

      <div className="p-1 flex flex-col gap-1">
        {isLoading || isFiltering ? (
          <>
            <HabitCardSkeleton />
            <HabitCardSkeleton />
            <HabitCardSkeleton />
          </>
        ) : filteredHabits.length === 0 ? (
          <EmptyHabitsState />
        ) : (
          filteredHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        )}
      </div>
    </div>
  );
}
