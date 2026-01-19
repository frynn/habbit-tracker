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
import { searchHabits } from "@/services/habitService";

const categoryIcons: Record<string, React.ElementType> = {
  Health: Footprints,
  Education: Book,
};

export function HabitSearch() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HabitDto[]>([]);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- Search (debounce + API) ---------------- */

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      abortRef.current?.abort();
      return;
    }

    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);
        const data = await searchHabits(query);
        setResults(data);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  /* ---------------- Measure input ---------------- */

  useEffect(() => {
    if (!inputRef.current) return;
    setRect(inputRef.current.getBoundingClientRect());
  }, [results.length]);

  /* ---------------- Render ---------------- */

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
              const Icon = categoryIcons[habit.categoryName ?? ""] ?? Brush;

              return (
                <div
                  key={habit.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    navigate(`/habits/${habit.id}`);
                  }}
                >
                  <Item>
                    <ItemContent>
                      <div className="flex gap-2 items-center">
                        <ItemMedia variant="icon">
                          <Icon className="size-4" />
                        </ItemMedia>
                        <div>
                          <ItemTitle>{habit.title}</ItemTitle>
                          <ItemDescription>
                            Goal · {habit.frequency}
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
