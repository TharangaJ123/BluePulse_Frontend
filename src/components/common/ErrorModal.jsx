import React from 'react';

const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-white/30 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-50 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-700">{errorMessage}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 