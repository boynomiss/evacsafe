import React, { useState, useRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import all map components
import UserLocationMarker from './UserLocationMarker';
import EvacuationZone from './EvacuationZone';
import MapLegend from './MapLegend';
import LocateMeButton from './LocateMeButton';
import ZoneInfoCard from './ZoneInfoCard';

// Import hooks
import useUserLocation from '../../hooks/useUserLocation';
import useEvacuationZones from '../../hooks/useEvacuationZones';

// Import constants
import { METRO_MANILA_CENTER, DEFAULT_ZOOM } from '../../utils/constants';

const MapContainer = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const mapRef = useRef(null);

  // Get user location
  const { location: userLocation, loading: locationLoading, error: locationError, requestLocation } = useUserLocation();

  // Get evacuation zones (pass userLocation to fetch nearby zones)
  const { zones, loading: zonesLoading, error: zonesError, refetch } = useEvacuationZones(userLocation);

  // Handle zone click
  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
  };

  // Handle close zone info
  const handleCloseZoneInfo = () => {
    setSelectedZone(null);
  };

  // Handle locate me button click
  const handleLocateMe = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    } else {
      // Request location if not available
      requestLocation();
    }
  };

  // Loading state
  const isLoading = locationLoading || zonesLoading;

  // Error state
  const hasError = locationError || zonesError;

  return (
    <div className="relative h-screen w-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-red-50/90 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="text-center p-4">
            <div className="w-8 h-8 text-red-500 mx-auto mb-2">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">Error loading map</p>
            <p className="text-red-500 text-sm mb-4">
              {locationError || zonesError}
            </p>
            <button
              onClick={() => {
                if (locationError) requestLocation();
                if (zonesError) refetch();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Map container */}
      <LeafletMapContainer
        center={METRO_MANILA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        ref={mapRef}
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <UserLocationMarker position={userLocation} />

        {/* Evacuation zones */}
        {zones.map((zone) => (
          <EvacuationZone
            key={zone.id}
            zone={zone}
            onClick={handleZoneClick}
          />
        ))}

        {/* Map legend */}
        <MapLegend />

        {/* Locate me button */}
        <LocateMeButton 
          onClick={handleLocateMe}
          loading={locationLoading}
        />
      </LeafletMapContainer>

      {/* Zone info card */}
      <ZoneInfoCard
        zone={selectedZone}
        onClose={handleCloseZoneInfo}
        userLocation={userLocation}
      />
    </div>
  );
};

export default MapContainer;
