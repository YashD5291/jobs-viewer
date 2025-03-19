"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "@/lib/context/ThemeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useTheme();

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform transition duration-300 ease-in-out lg:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header onMobileMenuToggle={() => setSidebarOpen(true)} />
        <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
} 