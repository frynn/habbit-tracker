import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Flame,
  Footprints,
  Book,
  Dumbbell,
  Brush,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import React from "react";

const categoryIcons: Record<string, React.ElementType> = {
  Health: Footprints,
  Education: Book,
  Fitness: Dumbbell,
  // остальные категории
};

/* ---- моковые данные ---- */
const profile = {
  username: "tester",
  email: "test@mail.com",

  totalHabits: 5,
  totalCompletions: 132,
  averageCompletionPercentage: 76.4,

  byCategory: [
    {
      categoryId: "1",
      categoryName: "Health",
      totalHabits: 2,
      totalCompletions: 70,
      completionPercentage: 82,
    },
    {
      categoryId: "2",
      categoryName: "Education",
      totalHabits: 3,
      totalCompletions: 62,
      completionPercentage: 71,
    },
  ],

  byHabit: [
    {
      habitId: "h1",
      title: "Walk",
      totalCompletions: 40,
      expectedOccurrences: 50,
      categoryName: "Health",
      completionPercentage: 80,
      currentStreak: 6,
      bestStreak: 12,
    },
    {
      habitId: "h2",
      title: "Read",
      totalCompletions: 30,
      expectedOccurrences: 40,
      categoryName: "Education",
      completionPercentage: 75,
      currentStreak: 4,
      bestStreak: 9,
    },
  ],
};

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 pr-2 pl-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h3 className="text-xl font-medium">Profile</h3>
      </div>

      {/* User info */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{profile.username}</ItemTitle>
          <ItemDescription>{profile.email}</ItemDescription>
        </ItemContent>
      </Item>

      {/* Overall stats */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Overall statistics</ItemTitle>

          <div className="flex justify-center gap-1 pt-1">
            <Item variant="muted" className="flex-col grow">
              <ItemTitle className="text-center">
                {profile.totalHabits}
              </ItemTitle>
              <ItemDescription className="text-center">Habits</ItemDescription>
            </Item>

            <Item variant="muted" className="flex-col grow">
              <ItemTitle className="text-center">
                {profile.totalCompletions}
              </ItemTitle>
              <ItemDescription className="text-center">
                Completions
              </ItemDescription>
            </Item>

            <Item variant="muted" className="flex-col grow">
              <ItemTitle className="text-center">
                {profile.averageCompletionPercentage}%
              </ItemTitle>
              <ItemDescription className="text-center">
                Avg completion
              </ItemDescription>
            </Item>
          </div>
        </ItemContent>
      </Item>

      {/* By category */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>By category</ItemTitle>

          <div className="flex flex-col gap-1 pt-1">
            {profile.byCategory.map((cat) => (
              <Item key={cat.categoryId} variant="muted">
                <ItemContent className="flex flex-row justify-between">
                  <div>
                    <ItemTitle>{cat.categoryName}</ItemTitle>
                    <ItemDescription>{cat.totalHabits} habits</ItemDescription>
                  </div>

                  <div className="text-right flex flex-col items-center">
                    <ItemTitle>{cat.completionPercentage}%</ItemTitle>
                    <ItemDescription>Completed</ItemDescription>
                  </div>
                </ItemContent>
              </Item>
            ))}
          </div>
        </ItemContent>
      </Item>

      {/* Highlights */}
      <Item variant="outline">
        <ItemContent className="flex gap-3">
          <ItemTitle>Highlights</ItemTitle>
          {profile.byHabit.map((h) => {
            const Icon = categoryIcons[h.categoryName ?? ""] || Brush;

            return (
              <Item key={h.habitId} variant="muted">
                <ItemContent className="flex flex-row gap-3 items-stretch w-fit">
                  <div className="w-10 flex justify-center items-stretch">
                    <div className="flex-1 flex items-center justify-center">
                      <Icon className="size-8 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1 gap-1 py-1">
                    <ItemTitle>{h.title}</ItemTitle>

                    <ItemDescription>
                      {h.totalCompletions}/{h.expectedOccurrences} •{" "}
                      {h.completionPercentage}%
                    </ItemDescription>

                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="size-4" />
                        {h.currentStreak}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="size-4" />
                        {h.bestStreak}
                      </span>
                    </div>
                  </div>
                </ItemContent>
              </Item>
            );
          })}
        </ItemContent>
      </Item>
    </div>
  );
}
