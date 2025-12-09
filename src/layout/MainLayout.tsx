import { Navbar } from "@/components/Navbar";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900">
      {/* Ограниченный по ширине мобильный контейнер */}
      <div className="w-full max-w-[398px] max-h-screen h-full flex flex-col bg-white dark:bg-gray-800">
        <Header />
        <main className="overflow-y-auto h-[93vh]">
          <Outlet />
        </main>
        <Navbar />
      </div>
    </div>
  );
}
