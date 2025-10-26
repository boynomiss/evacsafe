import React from 'react';
import { Marker, Circle, Popup } from 'react-leaflet';

const UserLocationMarker = ({ position }) => {
  // Return null if position is not provided
  if (!position || !Array.isArray(position) || position.length !== 2) {
    return null;
  }

  const [lat, lng] = position;

  return (
    <>
      {/* Blue circle with pulsing effect */}
      <Circle
        center={[lat, lng]}
        radius={50}
        pathOptions={{
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.3
        }}
      />
      
      {/* Marker with popup */}
      <Marker position={[lat, lng]}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold text-blue-600">Your Location</h3>
          </div>
        </Popup>
      </Marker>
    </>
  );
};

export default UserLocationMarker;
