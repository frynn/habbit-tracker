import { Outlet } from "react-router-dom";

export default function SettingsLayout() {
  return (
    <div className="pl-2 pr-2 flex flex-col gap-2">
      <h3 className="text-xl/6 font-medium">Settings</h3>
      <Outlet />
    </div>
  );
}
