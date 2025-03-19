import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationData } from "@/types";

/**
 * Custom hook to manage pagination state with React Query cache integration
 * @param initialPagination Initial pagination state
 * @param jobSite The job site identifier (e.g., "indeed", "linkedin")
 * @param initialSearch Initial search term
 * @returns Pagination state, methods, and search state
 */
export function usePaginationWithCache(
  initialPagination: PaginationData,
  jobSite: string,
  initialSearch: string = ""
) {
  // State
  const [pagination, setPagination] =
    useState<PaginationData>(initialPagination);
  const [search, setSearch] = useState(initialSearch);
  const queryClient = useQueryClient();

  // Restore pagination state from cache when component mounts
  useEffect(() => {
    // Find all query cache entries
    const queriesData = queryClient.getQueriesData({
      predicate: (query) => {
        // Filter queries related to the specific job site
        const queryKey = query.queryKey;
        return (
          Array.isArray(queryKey) &&
          queryKey[0] === "jobs" &&
          queryKey[5] === jobSite
        );
      },
    });

    if (queriesData.length > 0) {
      // Get the most recent query data
      const [queryKey, queryData] = queriesData[0];

      if (Array.isArray(queryKey) && queryKey.length >= 6) {
        // Extract search from query key
        const cachedSearch = queryKey[3];
        if (typeof cachedSearch === "string") {
          setSearch(cachedSearch);
        }

        // Try to get the query from cache directly
        const queryCache = queryClient.getQueryCache();
        const query = queryCache.find({ queryKey });
        if (query) {
          // If we have data in the query state, try to find the pagination info
          if (query.state.data) {
            const data = query.state.data as any;

            // Check for pagination data in common patterns
            if (data.pagination) {
              setPagination(data.pagination);
              return;
            }
          }
        }

        // Fallback to using just the page/limit from query key
        const cachedPage = queryKey[1];
        const cachedLimit = queryKey[2];

        if (typeof cachedPage === "number" && typeof cachedLimit === "number") {
          setPagination((prev) => ({
            ...prev,
            page: cachedPage,
            limit: cachedLimit,
          }));
        }
      }
    }
  }, [queryClient, jobSite]);

  // Handler for changing page
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handler for changing rows per page
  const handleRowsPerPageChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Handler for search
  const handleSearch = (term: string) => {
    setSearch(term);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on new search
  };

  return {
    pagination,
    setPagination,
    search,
    setSearch,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
  };
}
