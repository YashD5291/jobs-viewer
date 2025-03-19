import { PaginationData } from '@/types';
import { useTheme } from '@/lib/context/ThemeContext';

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export default function Pagination({ pagination, onPageChange, onRowsPerPageChange }: PaginationProps) {
  const { page, pages, total, limit } = pagination;
  const { theme } = useTheme();

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

  return (
    <div className={`border-t border-gray-200 px-4 py-4 sm:px-6 ${theme === 'dark' ? 'bg-gray-900 dark:border-gray-700' : 'bg-gray-50'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className={`flex flex-col sm:flex-row sm:items-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4 sm:mb-0 gap-4`}>
          <p>
            Showing <span className="font-medium">{Math.min(total, (page - 1) * pagination.limit + 1)}</span> to{' '}
            <span className="font-medium">{Math.min(page * pagination.limit, total)}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>

          {onRowsPerPageChange && (
            <div className="flex items-center">
              <label htmlFor="rows-per-page" className={`mr-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Rows per page:
              </label>
              <select
                id="rows-per-page"
                value={limit}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                className={`block w-20 rounded-md border-gray-300 bg-white ${theme === 'dark' ? 'bg-gray-900' : ''} py-1 pl-3 pr-3 text-gray-700 ${theme === 'dark' ? 'text-gray-300' : ''} focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm transition-colors duration-200 appearance-none`}
                style={{ backgroundImage: 'none' }}
              >
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
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${page <= 1
              ? "text-gray-300 bg-white cursor-not-allowed ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}"
              : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}"
              }`}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          <button
            onClick={() => page < pages && onPageChange(page + 1)}
            disabled={page >= pages}
            className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${page >= pages
              ? "text-gray-300 bg-white cursor-not-allowed ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}"
              : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}"
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
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm ${page <= 1
              ? `text-gray-300 bg-white cursor-not-allowed ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}`
              : `text-gray-500 bg-white hover:bg-gray-50 hover: text-indigo-600 border border-gray-300 transition-colors duration-200 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-indigo-400' : ''}`
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
              onClick={() => onPageChange(1)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}`}
            >
              1
            </button>
          )}

          {/* Left Ellipsis */}
          {showLeftEllipsis && (
            <span className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} bg-white border border-gray-300 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}`}>
              &hellip;
            </span>
          )}

          {/* Page Numbers */}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              aria-current={page === num ? 'page' : undefined}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${page === num
                ? `z-10 bg-indigo-600 text-white border border-indigo-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`
                : `text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}`
                }`}
            >
              {num}
            </button>
          ))}

          {/* Right Ellipsis */}
          {showRightEllipsis && (
            <span className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} bg-white border border-gray-300 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800' : ''}`}>
              &hellip;
            </span>
          )}

          {/* Last Page */}
          {showLastPage && (
            <button
              onClick={() => onPageChange(pages)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} bg-white border border-gray-300 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-indigo-400' : ''}`}
            >
              {pages}
            </button>
          )}

          <button
            onClick={() => page < pages && onPageChange(page + 1)}
            disabled={page >= pages}
            className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm ${page >= pages
              ? `text-gray-300 bg-white cursor-not-allowed ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-indigo-400' : ''}`
              : `text-gray-500 bg-white hover:bg-gray-50 hover:text-indigo-600 border border-gray-300 transition-colors duration-200 ${theme === 'dark' ? 'dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-indigo-400' : ''}`
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