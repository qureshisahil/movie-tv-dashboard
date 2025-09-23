import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-white text-2xl font-bold mb-4">Error Loading Data</h2>
        <p className="text-purple-200 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;