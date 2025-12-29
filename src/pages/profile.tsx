import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </Button>
      <h3 className="text-xl font-medium">Profile</h3>
    </div>
  );
}
