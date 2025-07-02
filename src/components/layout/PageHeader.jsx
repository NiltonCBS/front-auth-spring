import React from 'react';

const PageHeader = ({ title, subtitle, icon, rightContent, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="bg-blue-500 p-3 rounded-full text-white">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        </div>
        {rightContent && (
          <div className="flex items-center">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;