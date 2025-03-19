"use client";

import { fetchJobs, queryKeys } from "@/lib/api";
import PageTitle from "@/components/dashboard/PageTitle";
import JobsTable from "@/components/JobsTable";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { PaginationData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useStats } from "@/lib/context/StatsContext";
import { usePaginationWithCache } from "@/lib/hooks/usePaginationWithCache";
import { useTheme } from "@/lib/context/ThemeContext";

export default function GoogleJobsPage() {
  const { theme } = useTheme();
  // Initial pagination state
  const initialPagination: PaginationData = {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  };

  // Use our custom hook to manage pagination with caching
  const {
    pagination,
    setPagination,
    search,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch
  } = usePaginationWithCache(initialPagination, "google");

  // Use the global stats context
  const { stats } = useStats();

  // Use React Query for jobs fetching with automatic caching
  const {
    data,
    isLoading,
    error: queryError
  } = useQuery({
    queryKey: queryKeys.jobs(
      pagination.page,
      pagination.limit,
      search,
      false,
      "google"
    ),
    queryFn: async () => {
      const response = await fetchJobs(
        pagination.page,
        pagination.limit,
        search,
        false,
        "google"
      );

      if (response.success) {
        // Update pagination state with the latest data
        setPagination(response.data.pagination);
        return response.data;
      }

      throw new Error("Failed to load Google jobs");
    },
  });

  const jobs = data?.jobs || [];
  const error = queryError ? "Failed to load Google jobs" : null;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="Google Jobs"
        description="Browse job listings from Google"
      />

      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className={`bg-white shadow-md rounded-lg overflow-hidden p-6 ${theme === 'dark' ? 'dark:bg-gray-900 dark:shadow-gray-800 dark:bg-gray-900' : ''}`}>
          <div className={`space-y-4 ${theme === 'dark' ? 'dark:bg-gray-900' : ''}`}>
            <SearchBar onSearch={handleSearch} initialValue={search} />
          </div>
        </div>

        {/* Jobs Table */}
        <div className={`bg-white shadow-md rounded-lg overflow-hidden ${theme === 'dark' ? 'dark:bg-gray-900 dark:shadow-gray-800 dark:bg-gray-900' : ''}`}>
          <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Total {stats.googleJobs.toLocaleString()} Google Jobs
            </h2>
          </div>

          {error && (
            <div className={`p-4 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} bg-red-50 dark:bg-red-900/20`}>{error}</div>
          )}

          <JobsTable jobs={jobs} isLoading={isLoading} />

          {!isLoading && jobs.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
} 