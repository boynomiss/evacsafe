import React, { useState } from 'react';
import { Circle, Polygon, Marker, Popup } from 'react-leaflet';
import { getStatusColor } from '../../utils/mapHelpers';

const EvacuationZone = ({ zone, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get status color from utility function
  const statusColor = getStatusColor(zone.status);
  
  // Enhanced pathOptions with hover effect
  const pathOptions = {
    color: statusColor.border,
    weight: 2,
    opacity: 0.8,
    fillColor: statusColor.fill,
    fillOpacity: isHovered ? statusColor.opacity + 0.2 : statusColor.opacity,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(zone);
    }
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  const eventHandlers = {
    click: handleClick,
    mouseover: handleMouseOver,
    mouseout: handleMouseOut,
  };

  // Parse area boundaries if it's a JSON string
  const parseBoundaries = (boundaries) => {
    if (typeof boundaries === 'string') {
      try {
        return JSON.parse(boundaries);
      } catch (error) {
        console.error('Error parsing zone boundaries:', error);
        return [];
      }
    }
    return boundaries || [];
  };

  // Get center point for marker
  const getCenterPoint = () => {
    if (zone.area_type === 'circle') {
      return [zone.latitude, zone.longitude];
    } else if (zone.area_type === 'polygon') {
      const boundaries = parseBoundaries(zone.area_boundaries);
      if (boundaries.length > 0) {
        // Calculate center from first point (or could calculate centroid)
        return boundaries[0];
      }
    }
    return [zone.latitude || 0, zone.longitude || 0];
  };

  const centerPoint = getCenterPoint();

  return (
    <>
      {/* Render zone shape based on area_type */}
      {zone.area_type === 'circle' ? (
        <Circle
          center={[zone.latitude, zone.longitude]}
          radius={zone.area_radius || 100}
          pathOptions={pathOptions}
          eventHandlers={eventHandlers}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{zone.name}</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold">Type:</span> Circle Zone
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    zone.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {zone.status}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Radius:</span> {zone.area_radius}m
                </p>
                {zone.description && (
                  <p className="text-sm text-gray-600 mt-2">{zone.description}</p>
                )}
              </div>
            </div>
          </Popup>
        </Circle>
      ) : (
        <Polygon
          positions={parseBoundaries(zone.area_boundaries)}
          pathOptions={pathOptions}
          eventHandlers={eventHandlers}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{zone.name}</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold">Type:</span> Polygon Zone
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    zone.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {zone.status}
                  </span>
                </p>
                {zone.description && (
                  <p className="text-sm text-gray-600 mt-2">{zone.description}</p>
                )}
              </div>
            </div>
          </Popup>
        </Polygon>
      )}

      {/* Center marker with zone name */}
      <Marker position={centerPoint}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800">{zone.name}</h3>
            <p className="text-sm text-gray-600">Zone Center</p>
          </div>
        </Popup>
      </Marker>
    </>
  );
};

export default EvacuationZone;
