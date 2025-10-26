import React from 'react';

const MapLegend = () => {
  const legendItems = [
    {
      color: 'bg-green-500',
      label: 'Available'
    },
    {
      color: 'bg-yellow-500',
      label: 'Limited Capacity'
    },
    {
      color: 'bg-red-500',
      label: 'Full'
    }
  ];

  return (
    <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg shadow-lg p-3 z-20">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Evacuation Zones</h3>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`}></div>
            <p className="text-xs font-medium text-gray-700">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
