import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div 
      className={`animate-spin border-2 border-blue-500 border-t-transparent rounded-full ${sizes[size]} ${className}`}
    />
  );
};

export default LoadingSpinner;