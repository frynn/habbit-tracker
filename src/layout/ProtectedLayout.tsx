import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/services/auth";

export default function ProtectedLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
