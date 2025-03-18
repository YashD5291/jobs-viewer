"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BriefcaseBusiness, 
  Search, 
  Linkedin, 
  BarChart3 
} from "lucide-react";

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
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full px-3 py-4 bg-white border-r">
      <div className="flex items-center mb-6 pl-2">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Jobs Viewer
        </span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = 
            (item.href === "/" && pathname === "/") || 
            (item.href !== "/" && pathname.startsWith(item.href));
            
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-2 py-2 text-sm font-medium rounded-md group
                ${isActive 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
              `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="pt-4 mt-6 border-t border-gray-200">
        <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-600">
          <span className="mr-1">©</span>
          {new Date().getFullYear()} Jobs Viewer
        </div>
      </div>
    </div>
  );
} 