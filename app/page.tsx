"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import JobsTable from "@/components/JobsTable";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import FilterBar, { FilterOptions } from "@/components/FilterBar";
import { fetchJobs } from "@/lib/api";
import { Job, PaginationData } from "@/types";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 50,
    pages: 0,
  });
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [filters, setFilters] = useState<FilterOptions>({
    isRemote: searchParams.get('remote') === 'true',
    site: searchParams.get('site') || "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update URL with current state
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    if (pagination.page !== 1) params.set('page', pagination.page.toString());
    if (pagination.limit !== 50) params.set('limit', pagination.limit.toString());
    if (search) params.set('search', search);
    if (filters.isRemote) params.set('remote', 'true');
    if (filters.site) params.set('site', filters.site);
    
    const url = params.toString() ? `?${params.toString()}` : '';
    router.push(url);
  }, [pagination.page, pagination.limit, search, filters.isRemote, filters.site, router]);

  // Memoize the loadJobs function to prevent it from changing on every render
  const loadJobs = useCallback(async (
    page: number, 
    limit: number, 
    searchTerm: string, 
    isRemote: boolean = false, 
    site: string = ""
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchJobs(page, limit, searchTerm, isRemote, site);
      if (response.success) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to load job listings");
      }
    } catch (err) {
      setError("An error occurred while fetching job listings");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update URL when state changes
  useEffect(() => {
    updateUrl();
  }, [pagination.page, pagination.limit, search, filters.isRemote, filters.site, updateUrl]);

  // Initial data load
  useEffect(() => {
    loadJobs(pagination.page, pagination.limit, search, filters.isRemote, filters.site);
  }, [loadJobs, pagination.page, pagination.limit, search, filters.isRemote, filters.site]);

  // Memoize handler functions to maintain stable references
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    // Scroll back to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleRowsPerPageChange = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit }));
    loadJobs(1, limit, search, filters.isRemote, filters.site);
    // Scroll back to top when changing page size
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadJobs, search, filters.isRemote, filters.site]);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
    loadJobs(1, pagination.limit, searchTerm, filters.isRemote, filters.site);
  }, [loadJobs, pagination.limit, filters.isRemote, filters.site]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    loadJobs(1, pagination.limit, search, newFilters.isRemote, newFilters.site);
  }, [loadJobs, pagination.limit, search]);

  // Check if any filters are active
  const hasActiveFilters = filters.isRemote || filters.site !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Job Hunt Dashboard</h1>
          <p className="mt-2 text-indigo-100">Find your dream job from thousands of listings</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-6">
          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Find Your Next Opportunity</h2>
              
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{pagination.total}</span>
                <span className="ml-1">{pagination.total === 1 ? 'job' : 'jobs'} found</span>
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    Filtered
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <SearchBar onSearch={handleSearch} initialValue={search} />
              
              <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Job Listings */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">Available Positions</h2>
            </div>
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
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Job Hunt Dashboard © {new Date().getFullYear()} - Find your dream job today
          </p>
        </div>
      </footer>
    </div>
  );
}