"use client";

import { MenuIcon, BellIcon, UserCircle } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="text-gray-500 lg:hidden -m-2.5 p-2.5"
        onClick={onMobileMenuToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-end lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notification button */}
          <button
            type="button"
            className="relative text-gray-400 hover:text-gray-500 -m-2.5 p-2.5"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                {notifications}
              </span>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              className="flex items-center text-sm text-gray-700"
            >
              <span className="sr-only">Open user menu</span>
              <UserCircle className="h-8 w-8 text-gray-400" aria-hidden="true" />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-medium" aria-hidden="true">
                  User
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 