import { useState, useEffect } from 'react';

// Metro Manila center as default location
const DEFAULT_LOCATION = [14.5995, 120.9842];

const useUserLocation = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const getCurrentLocation = () => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mounted) {
            const newLocation = [
              position.coords.latitude,
              position.coords.longitude
            ];
            setLocation(newLocation);
            setError(null);
            setLoading(false);
          }
        },
        (error) => {
          if (mounted) {
            let errorMessage = 'Unable to retrieve your location.';
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out.';
                break;
              default:
                errorMessage = 'An unknown error occurred.';
                break;
            }
            
            setError(errorMessage);
            setLocation(DEFAULT_LOCATION); // Fallback to Metro Manila center
            setLoading(false);
          }
        },
        options
      );
    };

    // Get location on mount
    getCurrentLocation();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  return {
    location,
    loading,
    error
  };
};

export default useUserLocation;
