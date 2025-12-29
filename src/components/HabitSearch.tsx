import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Portal } from "@/components/Portal";
import type { HabitDto } from "@/types/habit";
import { useNavigate } from "react-router-dom";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
} from "@/components/ui/item";
import { Footprints, Book, Brush } from "lucide-react";

const categoryIcons: Record<string, any> = {
  Health: Footprints,
  Education: Book,
};

const habitsMock: HabitDto[] = [
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
]; // позже API

export function HabitSearch() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HabitDto[]>([]);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // debounce
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const t = setTimeout(() => {
      const q = query.toLowerCase();
      setResults(habitsMock.filter((h) => h.title.toLowerCase().includes(q)));
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  // измеряем input
  useEffect(() => {
    if (!inputRef.current) return;
    setRect(inputRef.current.getBoundingClientRect());
  }, [results.length]);

  return (
    <>
      <Input
        ref={inputRef}
        placeholder="Search habits..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {rect && results.length > 0 && (
        <Portal>
          <div
            className="fixed bg-background border rounded-md shadow-lg"
            style={{
              top: rect.bottom + 6,
              left: rect.left,
              width: rect.width,
              zIndex: 1000,
            }}
          >
            {results.map((habit) => {
              const Icon = categoryIcons[habit.categoryName ?? ""] || Brush;

              return (
                <div
                  key={habit.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/habits/${habit.id}`)}
                >
                  <Item>
                    <ItemContent>
                      <div className="flex gap-2">
                        <ItemMedia variant="icon">
                          <Icon className="size-4" />
                        </ItemMedia>
                        <div>
                          <ItemTitle>{habit.title}</ItemTitle>
                          <ItemDescription>
                            Goal | {habit.frequency}
                          </ItemDescription>
                        </div>
                      </div>
                    </ItemContent>
                  </Item>
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}
