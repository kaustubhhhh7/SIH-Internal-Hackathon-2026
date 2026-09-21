import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8 border-b border-gray-200 pb-5">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gov-blue sm:text-3xl sm:truncate">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {children}
        </div>
      )}
    </div>
  );
};
