import React from "react";
import { useTheme } from "@/lib/context/ThemeContext";
interface PageTitleProps {
  title: string;
  description?: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
  const { theme } = useTheme();
  return (
    <div className="mb-6">
      <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h1>
      {description && (
        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      )}
    </div>
  );
} 