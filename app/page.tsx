"use client";

import { fetchJobs, queryKeys } from "@/lib/api";
import StatsOverview from "@/components/dashboard/StatsOverview";
import PageTitle from "@/components/dashboard/PageTitle";
import JobsTable from "@/components/JobsTable";
import { useQuery } from "@tanstack/react-query";
import { useStats } from "@/lib/context/StatsContext";
import { useTheme } from "@/lib/context/ThemeContext";

export default function DashboardPage() {
    // Use the global stats context instead of directly fetching
    const { stats: statsData, isLoading: isStatsLoading } = useStats();
    const { theme } = useTheme();

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
    const error = jobsError ? "Failed to load dashboard data" : null;
    const recentJobs = jobsData || [];

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            <PageTitle
                title="Dashboard"
                description="Overview of job statistics and recent listings"
            />

            {/* Stats Overview */}
            <section className="mb-8">
                <StatsOverview
                    totalJobs={statsData.totalJobs}
                    todayJobs={statsData.todayJobs}
                    linkedinJobs={statsData.linkedinJobs}
                    indeedJobs={statsData.indeedJobs}
                    googleJobs={statsData.googleJobs}
                    glassdoorJobs={statsData.glassdoorJobs}
                />
            </section>

            {/* Recent Jobs */}
            <section>
                <div className={`bg-white shadow-md rounded-lg overflow-hidden ${theme === 'dark' ? 'dark:shadow-gray-800 dark:bg-gray-900' : ''}`}>
                    <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Recent Job Listings</h2>
                    </div>
                    <JobsTable
                        jobs={recentJobs}
                        isLoading={isLoading}
                    />
                    {error && (
                        <div className={`p-4 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} bg-red-50 dark:bg-red-900/20`}>
                            {error}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
} 