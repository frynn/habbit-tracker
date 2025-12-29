import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SettingsLayout() {
  const navigate = useNavigate();
  return (
    <div className="pl-2 pr-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h3 className="text-xl font-medium">Settings</h3>
      </div>
      <Outlet />
    </div>
  );
}
