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
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import { useState } from "react";

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
      <h3 className="text-xl/6 font-medium">Home</h3>
      <ButtonGroup className="w-full p-1">
        <Input placeholder="Search..." />
        <Button variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>
      </ButtonGroup>
      <div className="flex justify-between p-1 mb-1 items-center">
        <h4 className="font-medium">Your habits (2)</h4>
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
      <div className="p-1">
        {/* This is 1 card */}
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Walk</ItemTitle>
            <ItemDescription>Goal: 3000 steps | daily</ItemDescription>
            <div className="flex items-center gap-1 justify-center pt-0.5 pb-0.5">
              <Item variant="muted" className="flex-col gap-0.5 grow">
                <ItemTitle className="text-center">4 days</ItemTitle>
                <ItemDescription className="text-center">
                  Finished
                </ItemDescription>
              </Item>
              <Item variant="muted" className="flex-col gap-0.5 grow">
                <ItemTitle className="text-center">15 %</ItemTitle>
                <ItemDescription className="text-center">
                  Completed
                </ItemDescription>
              </Item>
              <Item variant="muted" className="flex-col gap-0.5 grow">
                <ItemTitle className="text-center">400/3000</ItemTitle>
                <ItemDescription className="text-center">Steps</ItemDescription>
              </Item>
            </div>
            <ItemTitle>Calendar</ItemTitle>
            <Item>{/* react calendar heatmap */}</Item>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
}
