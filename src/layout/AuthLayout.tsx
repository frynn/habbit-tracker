import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="max-h-full flex items-center justify-center bg-linear-to-br from-background via-muted/50 to-background">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
