import { RadioGroup } from "@/components/ui/radio-group";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/themeProvider";

const themes = [
  {
    value: "light",
    title: "Light",
    description: "Always use light appearance",
    icon: Sun,
  },
  {
    value: "dark",
    title: "Dark",
    description: "Always use dark appearance",
    icon: Moon,
  },
  {
    value: "system",
    title: "System",
    description: "Follow system preferences",
    icon: Laptop,
  },
] as const;

export function SettingsUI() {
  const { theme, setTheme } = useTheme();

  return (
    <RadioGroup
      value={theme}
      onValueChange={(v) => setTheme(v as any)}
      className="grid gap-2"
    >
      {themes.map((t) => {
        const Icon = t.icon;
        const active = theme === t.value;

        return (
          <label key={t.value} className="cursor-pointer">
            <Item
              variant="outline"
              className={cn(
                "transition border",
                active ? "ring-2 ring-primary bg-muted/50" : "hover:bg-muted"
              )}
            >
              <ItemContent className="flex flex-row items-center gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md border",
                    active ? "bg-primary/10" : "bg-background"
                  )}
                >
                  <Icon className="size-5 text-muted-foreground" />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <ItemTitle>{t.title}</ItemTitle>
                  <ItemDescription>{t.description}</ItemDescription>
                </div>

                {/* Native radio (visually hidden) */}
                <input
                  type="radio"
                  value={t.value}
                  checked={active}
                  onChange={() => setTheme(t.value)}
                  className="sr-only"
                />
              </ItemContent>
            </Item>
          </label>
        );
      })}
    </RadioGroup>
  );
}
