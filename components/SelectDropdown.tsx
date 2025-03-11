"use client";

import React from 'react';

interface SelectDropdownProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  className = '',
}) => {
  return (
    <div className={`bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-all duration-200 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors duration-200 appearance-none"
          style={{ backgroundImage: 'none' }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectDropdown;
