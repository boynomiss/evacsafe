import React from 'react';
import { calculateDistance, formatDistance, formatCapacity } from '../../utils/mapHelpers';
import { FACILITY_ICONS } from '../../utils/constants';

const ZoneInfoCard = ({ zone, onClose, userLocation }) => {
  if (!zone) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const calculateDistanceToZone = () => {
    if (!userLocation || !zone.latitude || !zone.longitude) return null;
    
    const distance = calculateDistance(
      userLocation[0], userLocation[1],
      zone.latitude, zone.longitude
    );
    
    return formatDistance(distance * 1000); // Convert km to meters
  };

  const handleGetDirections = () => {
    console.log('Get directions to:', zone.name);
    // Phase 2: Implement actual directions functionality
  };

  const distance = calculateDistanceToZone();

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-auto md:top-4 md:right-4 md:left-auto md:max-w-sm bg-white shadow-lg rounded-lg p-4 z-10 transform transition-transform duration-300 ease-in-out">
      {/* Header with close button */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 pr-2">{zone.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {/* Type badge */}
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(zone.status)}`}>
            {getStatusLabel(zone.status)}
          </span>
        </div>

        {/* Address */}
        {zone.address && (
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-600">{zone.address}</p>
          </div>
        )}

        {/* Distance from user */}
        {distance && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm text-gray-600">{distance} away</p>
          </div>
        )}

        {/* Capacity */}
        {zone.capacity && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="text-sm text-gray-600">Capacity: {formatCapacity(zone.capacity)}</p>
          </div>
        )}

        {/* Facilities */}
        {zone.facilities && zone.facilities.length > 0 && (
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div className="flex flex-wrap gap-1">
              {zone.facilities.map((facility, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  <span className="mr-1">{FACILITY_ICONS[facility] || FACILITY_ICONS.default}</span>
                  {facility.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact number */}
        {zone.contact_number && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-sm text-gray-600">{zone.contact_number}</p>
          </div>
        )}

        {/* Get Directions button */}
        <button
          onClick={handleGetDirections}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default ZoneInfoCard;
