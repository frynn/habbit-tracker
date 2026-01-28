import { Button } from "@/components/ui/button";
import {
  HouseIcon,
  PlusIcon,
  UserIcon,
  SettingsIcon,
  Target,
} from "lucide-react";
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
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Лого или заголовок - фиксированный сверху */}
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Habit Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Build better habits daily
            </p>
          </div>
        </div>
      </div>

      {/* Навигация - занимает оставшееся пространство */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 py-3",
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

      {/* Optional: User info or footer - фиксированный снизу */}
      <div className="p-4 border-t shrink-0">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Made with ❤️ for better habits
        </div>
      </div>
    </aside>
  );
}
