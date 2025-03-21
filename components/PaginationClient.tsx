"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { PaginationData } from '@/types';

interface PaginationClientProps {
  pagination: PaginationData;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export default function PaginationClient({ pagination, onRowsPerPageChange }: PaginationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Navigate to a specific page
  const goToPage = (page: number) => {
    // Create new URLSearchParams object based on current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update page parameter
    params.set('page', page.toString());
    
    // Navigate to the new URL with updated search parameters
    router.push(`/?${params.toString()}`);
    
    // Scroll back to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const { page, pages, total, limit } = pagination;
  
  // Generate page numbers array
  const pageNumbers = [];
  const maxPageButtons = 5;
  
  let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(pages, startPage + maxPageButtons - 1);
  
  // Adjust if we're at the end of the range
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  // Check if we should show "..." and first/last page buttons
  const showLeftEllipsis = startPage > 2;
  const showRightEllipsis = endPage < pages - 1;
  const showFirstPage = startPage > 1;
  const showLastPage = endPage < pages;
  
  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit: number) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newLimit);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', newLimit.toString());
      params.set('page', '1'); // Reset to page 1 when changing rows per page
      router.push(`/?${params.toString()}`);
    }
  };
  
  // Don't render if there's only one page
  if (pages <= 1) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-700 mb-4 sm:mb-0 gap-4">
          <p>
            Showing <span className="font-medium">{Math.min(total, (page - 1) * limit + 1)}</span> to{' '}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>
          
          {onRowsPerPageChange && (
            <div className="flex items-center">
              <label htmlFor="rows-per-page" className="mr-2 text-sm text-gray-600">
                Rows per page:
              </label>
              <select
                id="rows-per-page"
                value={limit}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                className="block w-20 rounded-md border-gray-300 bg-white py-1 pl-3 pr-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm transition-colors duration-200 appearance-none"
                style={{ backgroundImage: 'none' }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Mobile Pagination */}
        <div className="flex justify-between sm:hidden">
          <button
            onClick={() => page > 1 && goToPage(page - 1)}
            disabled={page <= 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              page <= 1 
                ? 'text-gray-300 bg-white cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          <button
            onClick={() => page < pages && goToPage(page + 1)}
            disabled={page >= pages}
            className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              page >= pages 
                ? 'text-gray-300 bg-white cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Next
            <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Desktop Pagination */}
        <nav className="hidden sm:inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
          <button
            onClick={() => page > 1 && goToPage(page - 1)}
            disabled={page <= 1}
            className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm ${
              page <= 1 
                ? 'text-gray-300 bg-white cursor-not-allowed' 
                : 'text-gray-500 bg-white hover:bg-gray-50 hover:text-indigo-600 border border-gray-300 transition-colors duration-200'
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* First Page */}
          {showFirstPage && (
            <button
              onClick={() => goToPage(1)}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
            >
              1
            </button>
          )}
          
          {/* Left Ellipsis */}
          {showLeftEllipsis && (
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
              &hellip;
            </span>
          )}
          
          {/* Page Numbers */}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              aria-current={page === num ? 'page' : undefined}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                page === num
                  ? 'z-10 bg-indigo-600 text-white border border-indigo-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200'
              }`}
            >
              {num}
            </button>
          ))}
          
          {/* Right Ellipsis */}
          {showRightEllipsis && (
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
              &hellip;
            </span>
          )}
          
          {/* Last Page */}
          {showLastPage && (
            <button
              onClick={() => goToPage(pages)}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
            >
              {pages}
            </button>
          )}
          
          <button
            onClick={() => page < pages && goToPage(page + 1)}
            disabled={page >= pages}
            className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm ${
              page >= pages 
                ? 'text-gray-300 bg-white cursor-not-allowed' 
                : 'text-gray-500 bg-white hover:bg-gray-50 hover:text-indigo-600 border border-gray-300 transition-colors duration-200'
            }`}
          >
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}
