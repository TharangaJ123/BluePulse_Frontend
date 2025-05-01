import React from 'react';

const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-50 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${getTypeStyles()}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-700">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded hover:opacity-90 focus:outline-none ${
              type === 'success' ? 'bg-green-600' : 
              type === 'error' ? 'bg-red-600' : 
              type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 