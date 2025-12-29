import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";

import Login from "@/pages/login";
import Register from "@/pages/register";
import AddHabit from "./pages/add";
import Preview from "./pages/preview";
import Home from "./pages/home";
import Profile from "@/pages/profile";
import SettingsLayout from "@/layout/SettingsLayout";
import { SettingsPrivate } from "./pages/settingsPages/settingsPrivate";
import { SettingsSystem } from "./pages/settingsPages/settingsSystem";
import { SettingsUI } from "./pages/settingsPages/settingsUI";
import { SettingsMain } from "./pages/settingsPages/settingsMain";
import { HabitDetails } from "./pages/habitDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/preview" element={<Preview />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddHabit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/habits/:habitId" element={<HabitDetails />} />

          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<SettingsMain />} />
            <Route path="ui" element={<SettingsUI />} />
            <Route path="system" element={<SettingsSystem />} />
            <Route path="private" element={<SettingsPrivate />} />
          </Route>
        </Route>

        {/* Redirect все несуществующие */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
