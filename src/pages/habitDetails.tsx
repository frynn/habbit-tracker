import { useParams, Navigate, useNavigate } from "react-router-dom";
import type { HabitDto } from "@/types/habit";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
} from "@/components/ui/item";

import { Heatmap } from "@/components/Heatmap";
import { Footprints, Book, Dumbbell, Brush, ArrowLeft } from "lucide-react";
import React from "react";

// временно — потом заменится API
//TODO: получаем id по клику, делаем запрос и выводим привычку с таким id
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

const categoryIcons: Record<string, React.ElementType> = {
  Health: Footprints,
  Education: Book,
  Fitness: Dumbbell,
};

export function HabitDetails() {
  const { habitId } = useParams<{ habitId: string }>();
  const navigate = useNavigate();

  const habit = habits.find((h) => h.id === habitId);

  if (!habit) {
    return <Navigate to="/" replace />;
  }

  const Icon = categoryIcons[habit.categoryName ?? ""] ?? Brush;

  return (
    <div className="max-w-3xl space-y-4 pl-2 pr-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h3 className="text-xl font-medium">Habit details</h3>
      </div>

      {/* Main card */}
      <Item variant="outline">
        <ItemContent className="space-y-4">
          {/* Title block */}
          <div className="flex gap-2 items-center">
            <ItemMedia variant="icon" className="size-10">
              <Icon className="size-5" />
            </ItemMedia>

            <div>
              <ItemTitle>{habit.title}</ItemTitle>
              <ItemDescription>
                Goal: 3000 steps | {habit.frequency}
              </ItemDescription>
            </div>
          </div>

          {/* Stats preview */}
          <div className="flex gap-1">
            <Item variant="muted" className="flex-col grow gap-0.5">
              <ItemTitle className="text-center">4 days</ItemTitle>
              <ItemDescription className="text-center">
                Finished
              </ItemDescription>
            </Item>

            <Item variant="muted" className="flex-col grow gap-0.5">
              <ItemTitle className="text-center">15%</ItemTitle>
              <ItemDescription className="text-center">
                Completed
              </ItemDescription>
            </Item>

            <Item variant="muted" className="flex-col grow gap-0.5">
              <ItemTitle className="text-center">400 / 3000</ItemTitle>
              <ItemDescription className="text-center">Steps</ItemDescription>
            </Item>
          </div>

          {/* Calendar */}
          <div className="space-y-2">
            <ItemTitle>Calendar</ItemTitle>
            <Item>
              <Heatmap startDate={habit.startDate} />
            </Item>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </ItemContent>
      </Item>

      {/* Future stats section */}
      <Item variant="outline">
        <ItemContent className="space-y-2">
          <ItemTitle>Statistics</ItemTitle>
          <ItemDescription>
            Here will be charts, streaks, best periods, etc.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
