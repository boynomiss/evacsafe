import React from 'react';
import MapContainer from './components/Map/MapContainer';

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Simple header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">EvacSafe</h1>
        </div>
      </header>

      {/* Map container taking remaining height */}
      <main className="flex-1 overflow-hidden">
        <MapContainer />
      </main>
    </div>
  );
}

export default App;
