"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchJobs } from "@/lib/api";
import PageTitle from "@/components/dashboard/PageTitle";
import JobsTable from "@/components/JobsTable";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import FilterBar, { FilterOptions } from "@/components/FilterBar";
import { Job, PaginationData } from "@/types";

export default function IndeedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    isRemote: false,
    site: "indeed", // Pre-set to Indeed
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load jobs function
  const loadJobs = useCallback(
    async (page: number, limit: number, searchTerm: string, isRemote: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchJobs(
          page,
          limit,
          searchTerm,
          isRemote,
          "indeed" // Always filter by Indeed
        );
        if (response.success) {
          setJobs(response.data.jobs);
          setPagination(response.data.pagination);
        } else {
          setError("Failed to load Indeed jobs");
        }
      } catch (err) {
        setError("An error occurred while fetching Indeed jobs");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial data load
  useEffect(() => {
    loadJobs(pagination.page, pagination.limit, search, filters.isRemote || false);
  }, [loadJobs, pagination.page, pagination.limit, search, filters.isRemote]);

  // Handler functions
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRowsPerPageChange = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit }));
    loadJobs(1, limit, search, filters.isRemote || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadJobs, search, filters.isRemote]);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
    loadJobs(1, pagination.limit, searchTerm, filters.isRemote || false);
  }, [loadJobs, pagination.limit, filters.isRemote]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    // Ensure site is always indeed
    const updatedFilters = { ...newFilters, site: "indeed" };
    setFilters(updatedFilters);
    loadJobs(1, pagination.limit, search, updatedFilters.isRemote || false);
  }, [loadJobs, pagination.limit, search]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="Indeed Jobs"
        description="Browse job listings from Indeed"
      />

      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <SearchBar onSearch={handleSearch} initialValue={search} />
            <FilterBar 
              onFilterChange={handleFilterChange} 
              initialFilters={filters} 
              disableSiteFilter={true} /* Disable site filter since we're on Indeed page */
            />
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Indeed Jobs</h2>
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