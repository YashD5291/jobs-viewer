"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';

interface JobTitleFilterProps {
  onSelect: (jobTitle: string) => void;
  selectedJobTitle?: string;
}

const JOB_TITLES = [
  "",
  "Software Engineer",
  "Senior Software Engineer",
  "Senior Full Stack Engineer",
  "Full Stack Engineer",
  "Python Developer",
  "Backend Developer",
  "Backend Engineer",
  "Node.js Developer",
  "Python Backend Developer",
  "Django Developer",
  "React Developer",
  "Frontend Developer",
  "Frontend Engineer",
  "Full Stack Developer",
  "Full Stack Engineer",
  "React Native Developer",
  "React Native Engineer",
  "AI Engineer",
  "Machine Learning Engineer"
];

export default function JobTitleFilter({ onSelect, selectedJobTitle = '' }: JobTitleFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown-container]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (jobTitle: string) => {
    onSelect(jobTitle);
    setIsOpen(false);
  };

  const displayTitle = selectedJobTitle || "All Job Titles";

  return (
    <div className="relative" data-dropdown-container>
      <button
        type="button"
        className={`inline-flex justify-between items-center w-full px-4 py-3 ${
          theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'
        } border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          theme === 'dark' ? 'dark:border-gray-600' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium truncate">
          {displayTitle}
        </span>
        <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } max-h-60 overflow-auto`}
        >
          <ul 
            className={`py-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`} 
            role="menu" 
            aria-orientation="vertical"
          >
            {JOB_TITLES.map((title, index) => (
              <li 
                key={index} 
                className={`cursor-pointer ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                } ${
                  selectedJobTitle === title
                    ? theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-100'
                    : ''
                }`}
                onClick={() => handleSelect(title)}
              >
                <span className="block px-4 py-2 text-sm">
                  {title || "All Job Titles"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 