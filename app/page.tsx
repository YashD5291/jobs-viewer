import JobsTable from "@/components/JobsTable";
import SearchBarClient from "@/components/SearchBarClient";
import FilterBarClient from "@/components/FilterBarClient";
import PaginationClient from "@/components/PaginationClient";
import { FilterOptions } from "@/components/FilterBar";
import { Job, PaginationData } from "@/types";
import connectToDatabase from "@/lib/db";
import JobModel from "@/models/Job";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Job Hunt Dashboard',
  description: 'Find your dream job from thousands of listings',
};

// Make the component async to fetch data server-side
export default async function Home(props: any) {
  // Extract search params from props
  const searchParams = props.searchParams || {};
  
  // Parse search params with defaults
  const page = Number(searchParams?.page || "1");
  const limit = Number(searchParams?.limit || "10");
  const search = typeof searchParams?.search === "string" ? searchParams.search : "";
  const isRemote = searchParams?.isRemote === "true";
  const company = typeof searchParams?.company === "string" ? searchParams.company : "";

  // Server-side data fetching
  let jobs: Job[] = [];
  let pagination: PaginationData = {
    total: 0,
    page,
    limit,
    pages: 0,
  };
  let error: string | null = null;

  try {
    // Connect to database directly on the server
    await connectToDatabase();

    // Build query object
    const query: any = {};

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add remote filter if selected
    if (isRemote) {
      query.is_remote = true;
    }

    // Add company filter if selected
    if (company) {
      query.company = company;
    }

    // Count total documents matching the query
    const total = await JobModel.countDocuments(query);

    // Calculate pagination values
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Fetch jobs with pagination
    const fetchedJobs = await JobModel.find(query)
      .sort({ date_posted: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() to get plain JavaScript objects instead of Mongoose documents

    // Convert Mongoose documents to plain JavaScript objects
    // This ensures we're not passing Mongoose document instances to client components
    jobs = JSON.parse(JSON.stringify(fetchedJobs));
    
    pagination = {
      total,
      page,
      limit,
      pages,
    };
  } catch (err) {
    console.error("Error fetching jobs:", err);
    error = "An error occurred while fetching job listings";
  }

  // Convert filters to FilterOptions object for UI components
  const filters: FilterOptions = {
    isRemote,
    company,
  };

  // Check if any filters are active
  const hasActiveFilters = isRemote || company !== "";

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
              {/* Client components for interactive elements */}
              <SearchBarClient initialValue={search} />
              <FilterBarClient initialFilters={filters} />
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
            <JobsTable jobs={jobs} isLoading={false} />
            {jobs.length > 0 && (
              <PaginationClient pagination={pagination} />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Job Hunt Dashboard &copy; {new Date().getFullYear()} - Find your dream job today
          </p>
        </div>
      </footer>
    </div>
  );
}