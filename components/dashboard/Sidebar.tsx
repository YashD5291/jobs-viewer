"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Search,
  Linkedin,
  BarChart3,
  Rabbit
} from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "LinkedIn", href: "/linkedin", icon: Linkedin },
  { name: "Indeed", href: "/indeed", icon: BriefcaseBusiness },
  { name: "Google", href: "/google", icon: Search },
  { name: "Glassdoor", href: "/glassdoor", icon: BarChart3 },
  { name: "Zip Recruiter", href: "/zip_recruiter", icon: Rabbit },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col h-full px-3 py-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-6 pl-2">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          The Aggregator
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-2 py-2 text-sm font-medium rounded-md group
                ${isActive
                  ? `bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`
                  : `text-gray-700 hover:bg-gray-200 ${theme === 'dark' ? 'dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-100' : 'hover:text-gray-900'}`}
              `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-indigo-600 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                  }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className={`pt-4 mt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-center px-2 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="mr-1">©</span>
          {new Date().getFullYear()} The Merovingian
        </div>
      </div>
    </div>
  );
} 