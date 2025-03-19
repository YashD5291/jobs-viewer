"use client";

import { ReactNode, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, queryKeys } from "@/lib/api";

// Define the structure of stats data
export interface StatsData {
  totalJobs: number;
  todayJobs: number;
  linkedinJobs: number;
  indeedJobs: number;
  googleJobs: number;
  glassdoorJobs: number;
  zipRecruiterJobs: number;
}

// Default empty stats
const defaultStats: StatsData = {
  totalJobs: 0,
  todayJobs: 0,
  linkedinJobs: 0,
  indeedJobs: 0,
  googleJobs: 0,
  glassdoorJobs: 0,
  zipRecruiterJobs: 0,
};

// Create the context with default values
interface StatsContextType {
  stats: StatsData;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StatsContext = createContext<StatsContextType>({
  stats: defaultStats,
  isLoading: false,
  error: null,
  refetch: async () => { },
});

// Hook to use the stats context
export const useStats = () => useContext(StatsContext);

// The provider component
export function StatsProvider({ children }: { children: ReactNode }) {
  // Fetch stats with React Query
  const {
    data,
    isLoading,
    error,
    refetch
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

  // Use fetched data or fallback to defaults
  const stats = data || defaultStats;

  return (
    <StatsContext.Provider value={{
      stats,
      isLoading,
      error: error as Error | null,
      refetch
    }}>
      {children}
    </StatsContext.Provider>
  );
} 