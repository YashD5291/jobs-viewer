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
  
  const response = await fetch(`/api/jobs?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
}
