import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import { HabitSearch } from "@/components/HabitSearch";

export function Header() {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Левая часть: дата - только на мобильных */}
        <div className="lg:hidden">
          <h3 className="font-medium">
            Today, <b className="text-gray-400 font-normal">{formatted}</b>
          </h3>
        </div>

        {/* Центр: поиск - только на десктопе */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
          <HabitSearch />
        </div>

        {/* Правая часть: кнопки */}
        <div className="flex items-center gap-2">
          {/* Настройки */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Link to="settings">
              <SettingsIcon />
            </Link>
          </Button>

          {/* Кнопка уведомлений или профиля для десктопа */}
          <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link to="profile">Profile</Link>
          </Button>

          <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link to="settings">Settings</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
