"use client";

import { BarChart, BriefcaseBusiness, Calendar, Network, Linkedin, Search, BarChart3 } from "lucide-react";

type Stat = {
  name: string;
  value: number;
  change: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
};

interface StatsOverviewProps {
  totalJobs: number;
  todayJobs: number;
  linkedinJobs: number;
  indeedJobs: number;
  googleJobs: number;
  glassdoorJobs: number;
}

export default function StatsOverview({
  totalJobs,
  todayJobs,
  linkedinJobs,
  indeedJobs,
  googleJobs,
  glassdoorJobs,
}: StatsOverviewProps) {
  const stats: Stat[] = [
    {
      name: "Total Jobs",
      value: totalJobs,
      change: 12,
      icon: BarChart,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      name: "Today's Jobs",
      value: todayJobs,
      change: 5,
      icon: Calendar,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      name: "LinkedIn Jobs",
      value: linkedinJobs,
      change: 3,
      icon: Linkedin,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-100",
    },
    {
      name: "Indeed Jobs",
      value: indeedJobs,
      change: 8,
      icon: BriefcaseBusiness,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      name: "Google Jobs",
      value: googleJobs,
      change: 2,
      icon: Search,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      name: "Glassdoor Jobs",
      value: glassdoorJobs,
      change: 4,
      icon: BarChart3,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="overflow-hidden rounded-lg bg-white shadow transition-all duration-300 hover:shadow-md"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 rounded-md ${stat.iconBg} p-3`}
              >
                <stat.icon
                  className={`h-6 w-6 ${stat.iconColor}`}
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className={stat.change > 0 ? "text-green-600" : "text-red-600"}>
                {stat.change > 0 ? "+" : ""}{stat.change}%
              </span>{" "}
              <span className="text-gray-500">from last week</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 