import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { HabitDto } from "@/types/habit";
import { HabitCard } from "@/components/HabitCard";
import { HabitCardSkeleton } from "@/components/CardSkeleton";
import { EmptyHabitsState } from "@/components/EmptyHabitsState";

const habits: HabitDto[] = [
  {
    id: "a1f1e2c0-1111-4c9b-9c1a-aaa111aaa111",
    title: "Walk",
    frequency: "monthly",
    startDate: "2025-01-10T00:00:00Z",
    categoryId: "cat-health",
    categoryName: "Health",
  },
  {
    id: "b2f2e2c0-2222-4c9b-9c1a-bbb222bbb222",
    title: "Read",
    frequency: "daily",
    startDate: "2025-02-03T00:00:00Z",
    categoryId: "cat-education",
    categoryName: "Education",
  },
  {
    id: "c3f3e2c0-3333-4c9b-9c1a-ccc333ccc333",
    title: "Meditate",
    frequency: "daily",
    startDate: "2025-03-01T00:00:00Z",
    categoryId: "cat-mind",
    categoryName: "Mindfulness",
  },
];

export default function Home() {
  const defaultCategories = [
    "All",
    "Health",
    "Productivity",
    "Education",
    "Fitness",
    "Finance",
    "Mindfulness",
    "Work",
    "Hobby",
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [debouncedSelected, setDebouncedSelected] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);

    const handler = setTimeout(() => {
      setDebouncedSelected(selected);
      setIsFiltering(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [selected]);

  const filteredHabits = useMemo(() => {
    if (debouncedSelected.length === 0 || debouncedSelected.includes("All")) {
      return habits;
    }

    return habits.filter((habit) =>
      debouncedSelected.includes(habit.categoryName ?? "")
    );
  }, [debouncedSelected]);

  const toggleCategory = (cat: string, checked: boolean) => {
    setSelected((prev) => {
      if (cat === "All") {
        return checked ? ["All"] : [];
      }

      const withoutAll = prev.filter((x) => x !== "All");

      return checked
        ? [...withoutAll, cat]
        : withoutAll.filter((x) => x !== cat);
    });
  };

  return (
    <div>
      <h3 className="text-xl/6 font-medium pl-2">Home</h3>
      <ButtonGroup className="w-full p-1">
        <Input placeholder="Search..." />
        <Button variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>
      </ButtonGroup>
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
                {defaultCategories.map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat}
                    checked={selected.includes(cat)}
                    onCheckedChange={(checked) =>
                      toggleCategory(cat, !!checked)
                    }
                    onSelect={(event) => event.preventDefault()} // ⬅️ ключевая строка
                  >
                    {cat}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
      <div className="p-1 flex flex-col gap-1">
        {isFiltering ? (
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
