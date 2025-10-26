import React from 'react';

const LocateMeButton = ({ onClick, loading = false }) => {
  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-20">
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={loading ? "Getting location..." : "Locate me on map"}
      >
        {loading ? (
          // Spinner
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          // Location crosshair icon (SVG)
          <svg 
            className="w-6 h-6 text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="2"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default LocateMeButton;
