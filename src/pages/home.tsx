import { SearchIcon, PlusIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import type { HabitDto } from "@/types/habit";
import { HabitCard } from "@/components/HabitCard";

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
    "Work", // 6 — уже будет скролл
    "Hobby",
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [selected, setSelected] = useState<string[]>([]);

  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const toggleCategory = (cat: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, cat] : prev.filter((x) => x !== cat)
    );
  };

  const handleAdd = () => {
    if (!newCategory.trim()) return;

    const name = newCategory.trim();
    if (!categories.includes(name)) {
      setCategories((prev) => [...prev, name]);
    }

    setNewCategory("");
    setAdding(false);
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
        <h4 className="font-medium pl-1">Your habits ({habits.length})</h4>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            Filters
          </Button>
          {/* TODO: Чтобы не закрывалась после выбора одного из фильтров */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="pl-2">
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {/* Скролл-область */}
              <div className="max-h-52 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat}
                    checked={selected.includes(cat)}
                    onCheckedChange={(checked) =>
                      toggleCategory(cat, !!checked)
                    }
                  >
                    {cat}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>

              <DropdownMenuSeparator />

              {/* Добавить новую категорию */}
              {!adding ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setAdding(true);
                  }}
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md"
                >
                  <PlusIcon className="size-4" />
                  Add category
                </button>
              ) : (
                <div className="p-2 flex items-center gap-2">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category"
                    className="border rounded px-2 py-1 text-sm w-full"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAdd}
                    className="px-2"
                  >
                    <CheckIcon />
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
      <div className="p-1 flex flex-col gap-1">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
}
