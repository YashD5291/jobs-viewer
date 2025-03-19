"use client";

import { useState } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const { theme } = useTheme();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex">
        <div className="relative flex-grow">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'dark:text-gray-400' : ''}`}>
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            className={`block w-full pl-10 pr-3 py-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border border-gray-300 rounded-l-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${theme === 'dark' ? 'dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:border-gray-600' : ''}`}
            type="text"
            placeholder="Search for job titles, skills, or companies..."
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className={`absolute inset-y-0 right-0 flex items-center pr-3 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-500' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`bg-indigo-600 border border-indigo-600 text-white px-6 rounded-r-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${theme === 'dark' ? 'dark:bg-indigo-500 dark:border-indigo-500 dark:hover:bg-indigo-600' : ''}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}