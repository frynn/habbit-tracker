import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
} from "@/components/ui/item";
import { Footprints, Book, Dumbbell, Brush } from "lucide-react";
import { Heatmap } from "@/components/Heatmap";
import type { HabitDto } from "@/types/habit";
import React from "react";

type HabitCardProps = {
  habit: HabitDto;
};

const categoryIcons: Record<string, React.ElementType> = {
  Health: Footprints,
  Education: Book,
  Fitness: Dumbbell,
  // остальные категории
};

export function HabitCard({ habit }: HabitCardProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <div className="flex gap-2 content-center">
          <ItemMedia variant="icon" className="size-9">
            {React.createElement(
              categoryIcons[habit.categoryName ?? ""] || Brush,
              { className: "size-5" }
            )}
          </ItemMedia>
          <div>
            <ItemTitle>{habit.title}</ItemTitle>
            <ItemDescription>
              Goal: 3000 steps | {habit.frequency}
            </ItemDescription>
          </div>
        </div>
        <div className="flex items-center gap-1 justify-center pt-0.5 pb-0.5">
          <Item variant="muted" className="flex-col gap-0.5 grow">
            <ItemTitle className="text-center">4 days</ItemTitle>
            <ItemDescription className="text-center">Finished</ItemDescription>
          </Item>
          <Item variant="muted" className="flex-col gap-0.5 grow">
            <ItemTitle className="text-center">15 %</ItemTitle>
            <ItemDescription className="text-center">Completed</ItemDescription>
          </Item>
          <Item variant="muted" className="flex-col gap-0.5 grow">
            <ItemTitle className="text-center">400/3000</ItemTitle>
            <ItemDescription className="text-center">Steps</ItemDescription>
          </Item>
        </div>
        <ItemTitle>Calendar</ItemTitle>
        <Item>
          <Heatmap startDate={habit.startDate} />
        </Item>
      </ItemContent>
    </Item>
  );
}
