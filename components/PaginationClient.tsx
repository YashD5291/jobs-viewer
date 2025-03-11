"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { PaginationData } from '@/types';

interface PaginationClientProps {
  pagination: PaginationData;
}

export default function PaginationClient({ pagination }: PaginationClientProps) {
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
  
  // Generate page links
  const pageLinks = [];
  
  // Previous button
  pageLinks.push(
    <button
      key="prev"
      onClick={() => pagination.page > 1 && goToPage(pagination.page - 1)}
      disabled={pagination.page <= 1}
      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
        pagination.page <= 1
          ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      <span className="sr-only">Previous</span>
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </button>
  );

  // Calculate range of pages to show
  let startPage = Math.max(1, pagination.page - 2);
  let endPage = Math.min(pagination.pages, startPage + 4);
  
  // Adjust start if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  // First page
  if (startPage > 1) {
    pageLinks.push(
      <button
        key={1}
        onClick={() => goToPage(1)}
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        1
      </button>
    );
    
    // Ellipsis if needed
    if (startPage > 2) {
      pageLinks.push(
        <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>
      );
    }
  }
  
  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    pageLinks.push(
      <button
        key={i}
        onClick={() => goToPage(i)}
        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
          pagination.page === i
            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {i}
      </button>
    );
  }
  
  // Ellipsis if needed
  if (endPage < pagination.pages - 1) {
    pageLinks.push(
      <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
        ...
      </span>
    );
  }
  
  // Last page
  if (endPage < pagination.pages) {
    pageLinks.push(
      <button
        key={pagination.pages}
        onClick={() => goToPage(pagination.pages)}
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {pagination.pages}
      </button>
    );
  }
  
  // Next button
  pageLinks.push(
    <button
      key="next"
      onClick={() => pagination.page < pagination.pages && goToPage(pagination.page + 1)}
      disabled={pagination.page >= pagination.pages}
      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
        pagination.page >= pagination.pages
          ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      <span className="sr-only">Next</span>
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </button>
  );

  // Don't render if there's only one page
  if (pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => pagination.page > 1 && goToPage(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            pagination.page <= 1
              ? 'bg-white text-gray-300 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => pagination.page < pagination.pages && goToPage(pagination.page + 1)}
          disabled={pagination.page >= pagination.pages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            pagination.page >= pagination.pages
              ? 'bg-white text-gray-300 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {pageLinks}
          </nav>
        </div>
      </div>
    </div>
  );
}
