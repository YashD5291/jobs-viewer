/**
 * Fetches job listings from the API
 */
export async function fetchJobs(page = 1, limit = 10, search = '', isRemote = false, site = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }
  
  if (isRemote) {
    params.append('isRemote', 'true');
  }
  
  if (site) {
    params.append('site', site);
  }
  
  const response = await fetch(`/api/jobs?${params.toString()}`, {
    next: {
      // Cache data for a reasonable amount of time to improve performance
      revalidate: 300, // Revalidate cache every 5 minutes (300 seconds)
      // This enables Next.js Response Cache for this request
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
}

/**
 * Fetches dashboard statistics
 */
export async function fetchDashboardStats() {
  const response = await fetch('/api/stats', {
    next: {
      // Cache data for 5 minutes, as stats don't change that frequently
      revalidate: 300, // 5 minutes
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }
  
  return response.json();
}

// React Query keys for consistent cache management
export const queryKeys = {
  jobs: (page: number, limit: number, search: string, isRemote: boolean, site: string) => 
    ['jobs', page, limit, search, isRemote, site],
  stats: () => ['stats'],
}
