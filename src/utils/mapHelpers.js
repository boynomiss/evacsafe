// Map utility functions

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees to convert
 * @returns {number} Radians
 */
export const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a point is inside a polygon using ray casting algorithm
 * @param {Array} point - [latitude, longitude]
 * @param {Array} polygon - Array of [latitude, longitude] points
 * @returns {boolean} True if point is inside polygon
 */
export const isPointInPolygon = (point, polygon) => {
  const x = point[1]; // longitude
  const y = point[0]; // latitude
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1];
    const yi = polygon[i][0];
    const xj = polygon[j][1];
    const yj = polygon[j][0];

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
};

/**
 * Find the closest evacuation zone to a given location
 * @param {Object} location - {lat, lng}
 * @param {Array} zones - Array of evacuation zones
 * @returns {Object|null} Closest zone or null
 */
export const findClosestZone = (location, zones) => {
  if (!location || !zones || zones.length === 0) return null;

  let closestZone = null;
  let minDistance = Infinity;

  zones.forEach(zone => {
    if (zone.coordinates && zone.coordinates.length > 0) {
      // Calculate centroid of the zone
      const centroid = calculatePolygonCentroid(zone.coordinates);
      const distance = calculateDistance(
        location.lat, 
        location.lng, 
        centroid.lat, 
        centroid.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestZone = { ...zone, distance };
      }
    }
  });

  return closestZone;
};

/**
 * Calculate the centroid of a polygon
 * @param {Array} polygon - Array of [latitude, longitude] points
 * @returns {Object} {lat, lng} centroid coordinates
 */
export const calculatePolygonCentroid = (polygon) => {
  let x = 0, y = 0;
  
  polygon.forEach(point => {
    x += point[1]; // longitude
    y += point[0]; // latitude
  });
  
  return {
    lat: y / polygon.length,
    lng: x / polygon.length
  };
};


/**
 * Get zone type color for UI
 * @param {string} zoneType - Type of zone (high_risk, medium_risk, low_risk)
 * @returns {string} CSS color class
 */
export const getZoneTypeColor = (zoneType) => {
  switch (zoneType) {
    case 'high_risk':
      return 'bg-red-500';
    case 'medium_risk':
      return 'bg-yellow-500';
    case 'low_risk':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Get zone type label for display
 * @param {string} zoneType - Type of zone
 * @returns {string} Human-readable label
 */
export const getZoneTypeLabel = (zoneType) => {
  switch (zoneType) {
    case 'high_risk':
      return 'High Risk';
    case 'medium_risk':
      return 'Medium Risk';
    case 'low_risk':
      return 'Low Risk';
    default:
      return 'Unknown';
  }
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

/**
 * Get map bounds for a set of zones
 * @param {Array} zones - Array of evacuation zones
 * @returns {Object|null} Bounds object or null
 */
export const getMapBounds = (zones) => {
  if (!zones || zones.length === 0) return null;

  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  zones.forEach(zone => {
    if (zone.coordinates) {
      zone.coordinates.forEach(coord => {
        minLat = Math.min(minLat, coord[0]);
        maxLat = Math.max(maxLat, coord[0]);
        minLng = Math.min(minLng, coord[1]);
        maxLng = Math.max(maxLng, coord[1]);
      });
    }
  });

  if (minLat === Infinity) return null;

  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng,
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    }
  };
};

/**
 * Calculate center point of a polygon from array of coordinates
 * @param {Array} coordinates - Array of [lat, lng] coordinate pairs
 * @returns {Object} Center point {lat, lng}
 */
export const getCenterOfPolygon = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return { lat: 0, lng: 0 };
  }

  let totalLat = 0;
  let totalLng = 0;

  coordinates.forEach(coord => {
    totalLat += coord[0]; // latitude
    totalLng += coord[1]; // longitude
  });

  return {
    lat: totalLat / coordinates.length,
    lng: totalLng / coordinates.length
  };
};

/**
 * Format distance in meters to human-readable string
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance string (e.g., "2.3 km" or "450 m")
 */
export const formatDistance = (meters) => {
  if (typeof meters !== 'number' || isNaN(meters)) {
    return '0 m';
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    const kilometers = meters / 1000;
    if (kilometers < 10) {
      return `${kilometers.toFixed(1)} km`;
    } else {
      return `${Math.round(kilometers)} km`;
    }
  }
};

/**
 * Get status color object from STATUS_COLORS constant
 * @param {string} status - Status string (available, limited, full)
 * @returns {Object} Color object with border, fill, and opacity
 */
export const getStatusColor = (status) => {
  // Import STATUS_COLORS dynamically to avoid circular dependencies
  const STATUS_COLORS = {
    available: { border: '#10b981', fill: '#10b981', opacity: 0.2 },
    limited: { border: '#f59e0b', fill: '#f59e0b', opacity: 0.3 },
    full: { border: '#ef4444', fill: '#ef4444', opacity: 0.3 }
  };

  return STATUS_COLORS[status] || STATUS_COLORS.available;
};

/**
 * Format number with commas for better readability
 * @param {number} number - Number to format
 * @returns {string} Formatted number with commas (e.g., "5,000")
 */
export const formatCapacity = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }

  return number.toLocaleString();
};
