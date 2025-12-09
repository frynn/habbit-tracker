import { Button } from "@/components/ui/button";
import { HouseIcon, PlusIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="sticky bottom-0 left-0 right-0 h-[7vh] flex flex-initial justify-evenly items-center mt-auto border-t border-t-gray-300">
      <Button variant="ghost" size="icon">
        <Link to="/">
          <HouseIcon />
        </Link>
      </Button>
      <Button variant="ghost" size="icon">
        <Link to="add">
          <PlusIcon />
        </Link>
      </Button>
      <Button variant="ghost" size="icon">
        <Link to="profile">
          <UserIcon />
        </Link>
      </Button>
    </div>
  );
}
