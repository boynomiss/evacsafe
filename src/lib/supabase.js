import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Error handling for missing environment variables
if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please add VITE_SUPABASE_URL to your .env.local file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
    'Please add VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(
    'Invalid VITE_SUPABASE_URL format. ' +
    'Please ensure it includes the full URL (e.g., https://your-project.supabase.co)'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database helper functions
export const dbHelpers = {
  // Fetch evacuation zones
  async getEvacuationZones() {
    const { data, error } = await supabase
      .from('evacuation_zones')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Update zone status
  async updateZoneStatus(zoneId, status) {
    const { data, error } = await supabase
      .from('evacuation_zones')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', zoneId)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Create new evacuation zone
  async createEvacuationZone(zoneData) {
    const { data, error } = await supabase
      .from('evacuation_zones')
      .insert([zoneData])
      .select();
    
    if (error) throw error;
    return data;
  },

  // Log user location for analytics
  async logUserLocation(locationData) {
    const { data, error } = await supabase
      .from('user_locations')
      .insert([{
        latitude: locationData.lat,
        longitude: locationData.lng,
        accuracy: locationData.accuracy,
        timestamp: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return data;
  },

  // Get emergency contacts
  async getEmergencyContacts() {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Subscribe to real-time updates
  subscribeToZones(callback) {
    return supabase
      .channel('evacuation_zones')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'evacuation_zones' }, 
        callback
      )
      .subscribe();
  }
};

// Authentication helpers
export const authHelpers = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default supabase;
