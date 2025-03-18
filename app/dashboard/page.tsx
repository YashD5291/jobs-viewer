"use client";

import { useState } from "react";
import { fetchDashboardStats, fetchJobs, queryKeys } from "@/lib/api";
import StatsOverview from "@/components/dashboard/StatsOverview";
import PageTitle from "@/components/dashboard/PageTitle";
import JobsTable from "@/components/JobsTable";
import { Job } from "@/types";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    todayJobs: 0,
    linkedinJobs: 0,
    indeedJobs: 0,
    googleJobs: 0,
    glassdoorJobs: 0,
  });

  // Fetch stats with React Query for automatic caching
  const { 
    data: statsData, 
    isLoading: isStatsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: queryKeys.stats(),
    queryFn: async () => {
      const response = await fetchDashboardStats();
      if (response.success) {
        return response.data;
      }
      throw new Error("Failed to fetch stats");
    },
  });

  // Fetch recent jobs with React Query for automatic caching
  const { 
    data: jobsData, 
    isLoading: isJobsLoading, 
    error: jobsError 
  } = useQuery({
    queryKey: queryKeys.jobs(1, 10, '', false, ''),
    queryFn: async () => {
      const response = await fetchJobs(1, 10);
      if (response.success) {
        return response.data.jobs;
      }
      throw new Error("Failed to fetch jobs");
    },
  });

  const isLoading = isStatsLoading || isJobsLoading;
  const error = statsError || jobsError ? "Failed to load dashboard data" : null;
  const recentJobs = jobsData || [];
  const statsDisplay = statsData || stats;

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <PageTitle
          title="Dashboard"
          description="Overview of job statistics and recent listings"
        />

        {/* Stats Overview */}
        <section className="mb-8">
          <StatsOverview
            totalJobs={statsDisplay.totalJobs}
            todayJobs={statsDisplay.todayJobs}
            linkedinJobs={statsDisplay.linkedinJobs}
            indeedJobs={statsDisplay.indeedJobs}
            googleJobs={statsDisplay.googleJobs}
            glassdoorJobs={statsDisplay.glassdoorJobs}
          />
        </section>

        {/* Recent Jobs */}
        <section>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Job Listings</h2>
            </div>
            <JobsTable
              jobs={recentJobs}
              isLoading={isLoading}
            />
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50">
                {error}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
} 