'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Caching configuration
            staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
            gcTime: 1000 * 60 * 30, // Cache data for 30 minutes
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            retry: 1, // Only retry failed requests once
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
} 