import { Button } from "@/components/ui/button";
import { HouseIcon, PlusIcon, UserIcon, SettingsIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: HouseIcon, label: "Home", path: "/" },
    { icon: PlusIcon, label: "Add Habit", path: "/add" },
    { icon: UserIcon, label: "Profile", path: "/profile" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Лого или заголовок */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Habit Tracker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Build better habits daily
        </p>
      </div>

      {/* Навигация */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-gray-100 dark:bg-gray-700",
                  )}
                  asChild
                >
                  <Link to={item.path}>
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info или статистика (опционально) */}
      <div className="p-4 border-t">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            Your Progress
          </div>
          <div className="mt-1">7-day streak 🔥</div>
        </div>
      </div>
    </aside>
  );
}
