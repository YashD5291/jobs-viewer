"use client";

import { MenuIcon, BellIcon, UserCircle, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [notifications] = useState(3);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 ${theme === 'dark' ? 'bg-gray-900 dark:bg-gray-900 dark:border-gray-700' : 'bg-white'} px-4 sm:gap-x-6 sm:px-6 lg:px-8`}>
      {/* Mobile menu button */}
      <button
        type="button"
        className={`text-gray-500 lg:hidden -m-2.5 p-2.5 ${theme === 'dark' ? 'text-gray-400 dark:text-gray-400 dark:hover:text-gray-300' : 'text-gray-500'}`}
        onClick={onMobileMenuToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className={`h-6 w-px ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'} lg:hidden`} aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-end lg:gap-x-6">
        <div className={`flex items-center gap-x-4 lg:gap-x-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {/* Theme toggle button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full p-2 transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700 hover:text-yellow-200' 
                : 'bg-gray-100 text-indigo-600 hover:bg-gray-200 hover:text-indigo-700'
            }`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

        </div>
      </div>
    </header>
  );
} 