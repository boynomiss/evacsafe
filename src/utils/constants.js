// Application constants

// Metro Manila specific constants
export const METRO_MANILA_CENTER = [14.5995, 120.9842];
export const DEFAULT_ZOOM = 12;

// Status colors for facilities
export const STATUS_COLORS = {
  available: { border: '#10b981', fill: '#10b981', opacity: 0.2 },
  limited: { border: '#f59e0b', fill: '#f59e0b', opacity: 0.3 },
  full: { border: '#ef4444', fill: '#ef4444', opacity: 0.3 }
};

// Facility icons mapping
export const FACILITY_ICONS = {
  hospital: '🏥',
  clinic: '🏥',
  medical_center: '🏥',
  pharmacy: '💊',
  fire_station: '🚒',
  police_station: '👮',
  evacuation_center: '🏢',
  school: '🏫',
  church: '⛪',
  gymnasium: '🏟️',
  community_center: '🏛️',
  barangay_hall: '🏛️',
  mall: '🏬',
  hotel: '🏨',
  restaurant: '🍽️',
  gas_station: '⛽',
  atm: '🏧',
  bank: '🏦',
  post_office: '📮',
  library: '📚',
  park: '🌳',
  playground: '🎪',
  market: '🛒',
  supermarket: '🛒',
  default: '📍'
};

// Default map settings
export const MAP_DEFAULTS = {
  DEFAULT_CENTER: [37.7749, -122.4194], // San Francisco coordinates
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 8,
  MAX_ZOOM: 18,
  ZOOM_LEVELS: {
    CITY: 10,
    NEIGHBORHOOD: 13,
    STREET: 16,
    BUILDING: 18
  }
};

// Evacuation zone types
export const ZONE_TYPES = {
  HIGH_RISK: 'high_risk',
  MEDIUM_RISK: 'medium_risk',
  LOW_RISK: 'low_risk',
  SAFE: 'safe'
};

// Zone status types
export const ZONE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  WARNING: 'warning',
  EMERGENCY: 'emergency'
};

// Zone type configurations
export const ZONE_CONFIG = {
  [ZONE_TYPES.HIGH_RISK]: {
    label: 'High Risk Zone',
    description: 'Immediate evacuation required',
    color: '#ef4444',
    bgColor: 'bg-red-500',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
    priority: 1,
    icon: '🚨'
  },
  [ZONE_TYPES.MEDIUM_RISK]: {
    label: 'Medium Risk Zone',
    description: 'Prepare for evacuation',
    color: '#f97316',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-500',
    priority: 2,
    icon: '⚠️'
  },
  [ZONE_TYPES.LOW_RISK]: {
    label: 'Low Risk Zone',
    description: 'Monitor situation',
    color: '#22c55e',
    bgColor: 'bg-green-500',
    textColor: 'text-green-800',
    borderColor: 'border-green-500',
    priority: 3,
    icon: '✅'
  },
  [ZONE_TYPES.SAFE]: {
    label: 'Safe Zone',
    description: 'No immediate threat',
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-500',
    priority: 4,
    icon: '🛡️'
  }
};

// Emergency contact types
export const CONTACT_TYPES = {
  POLICE: 'police',
  FIRE: 'fire',
  MEDICAL: 'medical',
  EMERGENCY: 'emergency',
  CITY: 'city',
  WEATHER: 'weather'
};

// Default emergency contacts
export const DEFAULT_CONTACTS = {
  [CONTACT_TYPES.EMERGENCY]: {
    name: 'Emergency Services',
    number: '911',
    description: 'Police, Fire, Medical Emergency'
  },
  [CONTACT_TYPES.CITY]: {
    name: 'City Emergency Management',
    number: '(555) 123-4567',
    description: 'City emergency management office'
  },
  [CONTACT_TYPES.WEATHER]: {
    name: 'National Weather Service',
    number: '(555) 987-6543',
    description: 'Weather alerts and updates'
  }
};

// Map tile providers
export const MAP_TILES = {
  OPENSTREET: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  CARTODB: {
    name: 'CartoDB',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

// Geolocation options
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000 // 5 minutes
};

// Application messages
export const MESSAGES = {
  LOCATION_DENIED: 'Location access denied. Please enable location services for better experience.',
  LOCATION_UNAVAILABLE: 'Location information is unavailable. Please check your device settings.',
  LOCATION_TIMEOUT: 'Location request timed out. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  ZONE_LOAD_ERROR: 'Failed to load evacuation zones. Using offline data.',
  USER_IN_HIGH_RISK: '⚠️ You are in a HIGH RISK evacuation zone! Please evacuate immediately!',
  USER_IN_MEDIUM_RISK: '⚠️ You are in a MEDIUM RISK zone. Prepare for potential evacuation.',
  USER_IN_LOW_RISK: '✅ You are in a LOW RISK zone. Monitor the situation.',
  USER_SAFE: '🛡️ You are in a safe area. Stay informed about the situation.'
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'evacsafe_user_preferences',
  LAST_LOCATION: 'evacsafe_last_location',
  ZONE_CACHE: 'evacsafe_zone_cache',
  THEME: 'evacsafe_theme'
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  ZONES: '/api/zones',
  ALERTS: '/api/alerts',
  CONTACTS: '/api/contacts',
  LOCATION: '/api/location'
};

// Notification settings
export const NOTIFICATION_SETTINGS = {
  TYPES: {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success'
  },
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000
  }
};

// Theme settings
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};
