import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
} from "@/components/ui/item";
import { Footprints, Book, Dumbbell, Brush } from "lucide-react";
import { Heatmap } from "@/components/Heatmap/Heatmap";
import type { HabitDto, HabitFrequency, GoalUnit } from "@/types/habit";
import React from "react";

/* ---------------- Types ---------------- */

type HabitCardProps = {
  habit: HabitDto;
};

/* ---------------- Helpers ---------------- */

// Иконки категорий (временно по имени)
const categoryIcons: Record<string, React.ElementType> = {
  Health: Footprints,
  Education: Book,
  Fitness: Dumbbell,
};

// Frequency → UI label
const frequencyLabel: Record<HabitFrequency, string> = {
  Daily: "Daily",
  Weekly: "Weekly",
  Monthly: "Monthly",
};

// Goal unit → UI label
const goalUnitLabel: Record<GoalUnit, string> = {
  Times: "times",
  Steps: "steps",
  Minutes: "minutes",
  Kcal: "kcal",
};

/* ---------------- Component ---------------- */

export function HabitCard({ habit }: HabitCardProps) {
  const Icon = categoryIcons[habit.categoryName ?? ""] ?? Brush;

  /*
    Временно.
    Позже придёт с бэка:
      - streakDays
      - completionPercent
      - progressValue
  */
  const streakDays = 0;
  const completionPercent = 0;
  const progressValue = habit.goal;

  return (
    <Item variant="outline">
      <ItemContent>
        {/* Header */}
        <div className="flex gap-2 items-center">
          <ItemMedia variant="icon" className="size-9">
            <Icon className="size-5" />
          </ItemMedia>

          <div>
            <ItemTitle>{habit.title}</ItemTitle>
            <ItemDescription>
              {frequencyLabel[habit.frequency]} · Goal: {habit.goal}{" "}
              {goalUnitLabel[habit.goalUnit]}
            </ItemDescription>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1 justify-center pt-1 pb-1">
          <Item variant="muted" className="flex-col gap-0.5 grow">
            <ItemTitle className="text-center">{streakDays}</ItemTitle>
            <ItemDescription className="text-center">Streak</ItemDescription>
          </Item>

          <Item variant="muted" className="flex-col gap-0.5 grow">
            <ItemTitle className="text-center">{completionPercent}%</ItemTitle>
            <ItemDescription className="text-center">Completed</ItemDescription>
          </Item>

          <Item variant="muted" className="flex-col gap-0.5 grow">
            <ItemTitle className="text-center">{progressValue}</ItemTitle>
            <ItemDescription className="text-center">
              {goalUnitLabel[habit.goalUnit]}
            </ItemDescription>
          </Item>
        </div>

        {/* Heatmap */}
        <ItemTitle>Calendar</ItemTitle>
        <Item>
          <Heatmap
            habitId={habit.id}
            startDate={habit.startDate}
            frequency={habit.frequency}
            progress={habit.progress}
          />
        </Item>
      </ItemContent>
    </Item>
  );
}
