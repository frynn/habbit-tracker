import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

export function Header() {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    //можно поменять на ru-RU
    day: "numeric",
    month: "short",
  });
  return (
    <div className="flex flex-initial items-center justify-between p-1.5">
      <h3 className="font-medium w-fit h-fit text-center p-0.5">
        Today, <b className="text-gray-400 font-normal">{formatted}</b>
      </h3>
      <Button variant="ghost" size="icon">
        <Link to="settings">
          <SettingsIcon />
        </Link>
      </Button>
    </div>
  );
}
