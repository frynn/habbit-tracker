import { Button } from "@/components/ui/button";
import { HouseIcon, PlusIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { icon: HouseIcon, path: "/", label: "Home" },
    { icon: PlusIcon, path: "/add", label: "Add" },
    { icon: UserIcon, path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 h-16 flex items-center justify-around border-t border-gray-300 bg-white dark:bg-gray-800 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-40">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Button
            key={item.path}
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center h-auto p-2 gap-1",
              isActive && "text-primary",
            )}
            asChild
          >
            <Link to={item.path} className="flex flex-col items-center">
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span
                className={cn(
                  "text-xs",
                  isActive ? "text-primary font-medium" : "text-gray-500",
                )}
              >
                {item.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
