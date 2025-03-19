"use client";

import { Job } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from "@/lib/context/ThemeContext";
interface JobsTableProps {
  jobs: Job[];
  isLoading?: boolean;
}

export default function JobsTable({ jobs, isLoading = false }: JobsTableProps) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="min-w-full p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Loading job listings...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No job listings found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  // Function to format date in a more granular way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Show minutes if less than 60 minutes ago
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;

    // Show hours if less than 24 hours ago
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;

    // Show days for recent dates
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

    // Use standard date format for older dates
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to check if a job was added recently (within the last 24 hours)
  const isRecentlyAdded = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    return diffHours < 24; // Within the last 24 hours
  };

  // Function to check if a job was added very recently (within the last hour)
  const isVeryRecentlyAdded = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    return diffHours < 1; // Within the last hour
  };

  // Function to toggle job expansion
  const toggleJobExpansion = (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} divide-y divide-gray-100 dark:divide-gray-800`}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {jobs.map((job) => {
          const isExpanded = expandedJobId === job._id;
          const isAddedRecently = job?.added_on ? isRecentlyAdded(job?.added_on) : false;
          const isAddedVeryRecently = job?.added_on ? isVeryRecentlyAdded(job?.added_on) : false;

          return (
            <li
              key={job._id}
              className={`transition-all duration-300 ${isAddedRecently
                ? `bg-blue-50 ${theme === 'dark' ? 'dark:bg-blue-900/20' : ''} hover:bg-blue-100 ${theme === 'dark' ? 'dark:hover:bg-blue-900/40' : ''} border-l-4 border-blue-500`
                : `hover:bg-gray-50 ${theme === 'dark' ? 'dark:hover:bg-gray-800/80' : ''}`
                }`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Job Information */}
                  <div className="flex-1">
                    <div className="flex items-start">
                      {/* Company Logo Placeholder */}
                      <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-bold">
                        {job?.company?.charAt(0)}
                      </div>

                      <div className="sm:ml-4">
                        <div className="flex items-center">
                          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} group-hover:text-indigo-600 ${theme === 'dark' ? 'dark:group-hover:text-indigo-400' : ''}`}>
                            {job.title}
                          </h3>
                          {isAddedVeryRecently && (
                            <span className={`ml-2 inline-flex items-center rounded-full ${theme === 'dark' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-blue-100'} px-2.5 py-0.5 text-xs font-medium ${theme === 'dark' ? 'text-blue-800 dark:text-blue-300' : 'text-blue-800'} animate-pulse`}>
                              New
                            </span>
                          )}
                          {isAddedRecently && !isAddedVeryRecently && (
                            <span className={`ml-2 inline-flex items-center rounded-full ${theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-blue-50'} px-2.5 py-0.5 text-xs font-medium ${theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600'}`}>
                              Today
                            </span>
                          )}
                        </div>
                        <div className={`mt-1 flex items-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="truncate">{job.company}</span>
                          {job.location && (
                            <>
                              <span className={`mx-1 ${theme === 'dark' ? 'text-gray-300 dark:text-gray-600' : ''}`}>&middot;</span>
                              <span className="truncate">{job.location}</span>
                            </>
                          )}
                          <span className={`mx-1 ${theme === 'dark' ? 'text-gray-300 dark:text-gray-600' : ''}`}>&middot;</span>
                          {job?.added_on && (
                            <span className={`text-xs ${isAddedRecently ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                              Added {formatDate(job?.added_on)}
                            </span>
                          )}
                          &nbsp;|&nbsp;
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Posted {formatDate(job.date_posted)}
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.is_remote && (
                            <span className={`inline-flex items-center rounded-full ${theme === 'dark' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-green-100'} px-2.5 py-0.5 text-xs font-medium ${theme === 'dark' ? 'text-green-800 dark:text-green-300' : 'text-green-800'}`}>
                              Remote
                            </span>
                          )}
                          {job.job_level && (
                            <span className={`inline-flex items-center rounded-full ${theme === 'dark' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-blue-100'} px-2.5 py-0.5 text-xs font-medium ${theme === 'dark' ? 'text-blue-800 dark:text-blue-300' : 'text-blue-800'}`}>
                              {job.job_level}
                            </span>
                          )}
                          <span className={`inline-flex items-center rounded-full ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-100'} px-2.5 py-0.5 text-xs font-medium ${theme === 'dark' ? 'text-gray-800 dark:text-gray-300' : 'text-gray-800'} capitalize`}>
                            {job.site}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details section */}
                    {isExpanded && (
                      <div className={`mt-4 sm:ml-16 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} animate-fadeIn`}>
                        <div className="space-y-4">
                          {job.description ? (
                            <div>
                              <h4 className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Job Description</h4>
                              <div className={`prose prose-sm ${theme === 'dark' ? 'dark:prose-invert' : ''} max-w-none`}>
                                {job.description.split('\n').map((paragraph, index) => (
                                  paragraph.trim() ? (
                                    <p key={index} className="mb-2">
                                      {paragraph}
                                    </p>
                                  ) : null
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className={`italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No job description available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:items-end gap-2">
                    {job.job_url ? (
                      <Link
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isAddedVeryRecently
                          ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                          : isAddedRecently
                            ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                            : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : ''} transition-colors duration-200`}
                      >
                        Apply Now
                      </Link>
                    ) : (
                      <button
                        disabled
                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-400 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} cursor-not-allowed`}
                      >
                        No Link Available
                      </button>
                    )}

                    <button
                      onClick={() => toggleJobExpansion(job._id)}
                      className={`inline-flex items-center text-sm ${isAddedVeryRecently
                        ? "text-blue-600 ${theme === 'dark' ? 'dark:text-blue-400' : ''} hover:text-blue-800 ${theme === 'dark' ? 'dark:hover:text-blue-300' : ''}"
                        : isAddedRecently
                          ? "text-indigo-600 ${theme === 'dark' ? 'dark:text-indigo-400' : ''} hover:text-indigo-800 ${theme === 'dark' ? 'dark:hover:text-indigo-300' : ''}"
                          : "text-gray-600 ${theme === 'dark' ? 'dark:text-gray-400' : ''} hover:text-gray-800 ${theme === 'dark' ? 'dark:hover:text-gray-300' : ''}"
                        } transition-colors duration-200`}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}