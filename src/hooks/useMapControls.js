import { useState, useCallback, useRef } from 'react';

const useMapControls = () => {
  const [mapRef, setMapRef] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default to San Francisco
  const [mapZoom, setMapZoom] = useState(13);
  const [isMapReady, setIsMapReady] = useState(false);

  const mapInstanceRef = useRef(null);

  const handleMapReady = useCallback((mapInstance) => {
    mapInstanceRef.current = mapInstance;
    setMapRef(mapInstance);
    setIsMapReady(true);
  }, []);

  const centerMapOnLocation = useCallback((location, zoom = 15) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.lat, location.lng], zoom);
      setMapCenter([location.lat, location.lng]);
      setMapZoom(zoom);
    }
  }, []);

  const fitMapToZones = useCallback((zones) => {
    if (mapInstanceRef.current && zones.length > 0) {
      const group = L.featureGroup();
      
      zones.forEach(zone => {
        if (zone.coordinates && zone.coordinates.length > 0) {
          const polygon = L.polygon(zone.coordinates);
          group.addLayer(polygon);
        }
      });

      if (group.getLayers().length > 0) {
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }
  }, []);

  const handleZoneClick = useCallback((zone) => {
    setSelectedZone(zone);
    
    // Center map on the clicked zone
    if (zone.coordinates && zone.coordinates.length > 0) {
      const bounds = L.polygon(zone.coordinates).getBounds();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, []);

  const closeZoneInfo = useCallback(() => {
    setSelectedZone(null);
  }, []);

  const resetMapView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom]);

  const toggleFullscreen = useCallback(() => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      if (!document.fullscreenElement) {
        mapContainer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  }, []);

  const exportMapImage = useCallback(() => {
    if (mapInstanceRef.current) {
      // This would require additional implementation for map export
      console.log('Export map image functionality would be implemented here');
    }
  }, []);

  const setMapStyle = useCallback((style) => {
    if (mapInstanceRef.current) {
      // This would handle changing map tile layers
      console.log('Set map style:', style);
    }
  }, []);

  return {
    mapRef,
    selectedZone,
    mapCenter,
    mapZoom,
    isMapReady,
    handleMapReady,
    centerMapOnLocation,
    fitMapToZones,
    handleZoneClick,
    closeZoneInfo,
    resetMapView,
    toggleFullscreen,
    exportMapImage,
    setMapStyle,
  };
};

export default useMapControls;
