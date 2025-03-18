"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SelectDropdown from './SelectDropdown';
import { FilterOptions } from './FilterBar';

interface FilterBarClientProps {
  initialFilters?: FilterOptions;
}

export default function FilterBarClient({ initialFilters = { isRemote: false } }: FilterBarClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isRemote, setIsRemote] = useState(initialFilters.isRemote);
  const [site, setSite] = useState(initialFilters.site || '');

  // Common companies - you could fetch this from the API dynamically in a real app
  const commonCompanies = ['Google', 'Microsoft', 'Amazon', 'Principal Financial Group'];

  // Check if any filters are active
  const hasActiveFilters = isRemote || site !== '';

  // Apply filters function
  const applyFilters = () => {
    // Create new URLSearchParams object based on current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove isRemote parameter
    if (isRemote) {
      params.set('isRemote', 'true');
    } else {
      params.delete('isRemote');
    }
    
    // Update or remove company parameter
    if (site) {
      params.set('site', site);
    } else {
      params.delete('site');
    }
    
    // Reset to page 1 when filtering
    params.set('page', '1');
    
    // Navigate to the new URL with updated search parameters
    router.push(`/?${params.toString()}`);
  };

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [isRemote, site]);

  // Clear all filters
  const clearFilters = () => {
    setIsRemote(false);
    setSite('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm transition-all duration-300">
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-2 md:mb-0">Refine Results</h3>

          {/* Clear Filters Button - Always visible but disabled when no filters */}
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center text-sm ${hasActiveFilters
              ? 'text-gray-400 hover:text-gray-600'
              : 'text-gray-300 cursor-not-allowed'
              } transition-colors duration-200`}
            aria-label="Clear all filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Remote Filter */}
          <div className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-all duration-200">
            <div className="flex items-center">
              <input
                id="is-remote-checkbox"
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
              />
              <div className="ml-3">
                <label htmlFor="is-remote-checkbox" className="font-medium text-gray-800 cursor-pointer">
                  Remote Only
                </label>
                <p className="text-gray-500 text-xs mt-0.5">Only show remote positions</p>
              </div>
            </div>
          </div>

          {/* Company Filter using reusable component */}
          <SelectDropdown
            id="site-filter"
            label="Site"
            value={site}
            onChange={setSite}
            options={[
              { value: '', label: 'All Sites' },
              ...commonCompanies.map(site => ({ value: site, label: site }))
            ]}
          />

        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500">Active filters:</span>
            {isRemote && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-800">
                Remote Only
                <button
                  type="button"
                  onClick={() => setIsRemote(false)}
                  className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-200 hover:text-indigo-800 focus:bg-indigo-500 focus:text-white focus:outline-none"
                >
                  <span className="sr-only">Remove remote filter</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
            {site && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-800">
                Site: {site}
                <button
                  type="button"
                  onClick={() => setSite('')}
                  className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-200 hover:text-indigo-800 focus:bg-indigo-500 focus:text-white focus:outline-none"
                >
                  <span className="sr-only">Remove site filter</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
