"use client";

import { useState } from "react";
import { fetchJobs, queryKeys } from "@/lib/api";
import PageTitle from "@/components/dashboard/PageTitle";
import JobsTable from "@/components/JobsTable";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import FilterBar, { FilterOptions } from "@/components/FilterBar";
import { Job, PaginationData } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function LinkedInJobsPage() {
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    isRemote: false,
    site: "linkedin", // Pre-set to LinkedIn
  });

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
      filters.isRemote || false, 
      "linkedin"
    ),
    queryFn: async () => {
      const response = await fetchJobs(
        pagination.page,
        pagination.limit,
        search,
        filters.isRemote || false,
        "linkedin"
      );
      
      if (response.success) {
        // Update pagination state with the latest data
        setPagination(response.data.pagination);
        return response.data.jobs;
      }
      
      throw new Error("Failed to load LinkedIn jobs");
    },
  });

  const jobs = data || [];
  const error = queryError ? "Failed to load LinkedIn jobs" : null;

  // Handlers
  const handleSearch = (term: string) => {
    setSearch(term);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="LinkedIn Jobs"
        description="Browse job listings from LinkedIn"
      />

      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <SearchBar onSearch={handleSearch} initialValue={search} />
            <FilterBar 
              onFilterChange={handleFilterChange} 
              initialFilters={filters} 
              disableSiteFilter={true} /* Disable site filter since we're on LinkedIn page */
            />
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">LinkedIn Jobs</h2>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50">{error}</div>
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