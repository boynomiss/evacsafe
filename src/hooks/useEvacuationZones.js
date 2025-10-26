import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const useEvacuationZones = (userLocation = null) => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data, fetchError;

      if (userLocation && userLocation.length === 2) {
        try {
          // Try to fetch nearby zones using RPC function
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('nearby_zones', {
              user_lat: userLocation[0],
              user_lng: userLocation[1],
              radius_km: 50 // 50km radius
            });

          if (rpcError && rpcError.message.includes('function') && rpcError.message.includes('not found')) {
            // Fallback to fetching all zones if RPC function doesn't exist
            console.warn('nearby_zones function not found, falling back to all zones');
            const result = await supabase
              .from('evacuation_zones')
              .select('*')
              .eq('active', true)
              .order('priority', { ascending: true });
            
            data = result.data;
            fetchError = result.error;
          } else {
            data = rpcData;
            fetchError = rpcError;
          }
        } catch (rpcError) {
          // Fallback to fetching all zones if RPC fails
          console.warn('RPC function failed, falling back to all zones:', rpcError);
          const result = await supabase
            .from('evacuation_zones')
            .select('*')
            .eq('active', true)
            .order('priority', { ascending: true });
          
          data = result.data;
          fetchError = result.error;
        }
      } else {
        // Fetch all zones from table
        const result = await supabase
          .from('evacuation_zones')
          .select('*')
          .eq('active', true)
          .order('priority', { ascending: true });

        data = result.data;
        fetchError = result.error;
      }

      if (fetchError) {
        throw fetchError;
      }

      setZones(data || []);
    } catch (err) {
      console.error('Error fetching evacuation zones:', err);
      setError(err.message || 'Failed to fetch evacuation zones');
      
      // Fallback to empty array on error
      setZones([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  const refetch = useCallback(() => {
    fetchZones();
  }, [fetchZones]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return {
    zones,
    loading,
    error,
    refetch
  };
};

export default useEvacuationZones;
