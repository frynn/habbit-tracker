import { Navbar } from "@/components/Navbar";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Sidebar для десктопа */}
      <Sidebar />

      {/* Основной контент */}
      <div className="flex-1 flex flex-col w-full">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {/* Убрали container и padding здесь */}
          <Outlet />
        </main>

        {/* Navbar только для мобильных */}
        <div className="lg:hidden">
          <Navbar />
        </div>
      </div>
    </div>
  );
}
