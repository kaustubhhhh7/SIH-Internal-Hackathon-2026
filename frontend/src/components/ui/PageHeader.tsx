import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="md:flex md:items-center md:justify-between mb-6 sm:mb-8 border-b border-gray-200 pb-4 sm:pb-5">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight sm:leading-7 text-gov-blue break-words">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:ml-4 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};
