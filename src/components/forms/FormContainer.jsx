import React from 'react';

const FormContainer = ({ title, children, onCancel, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Cancelar"
          >
            ✕
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default FormContainer;