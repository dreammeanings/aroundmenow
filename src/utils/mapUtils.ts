import { Platform } from 'react-native';

// Only import MapView on mobile platforms
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

// Only try to import react-native-maps on mobile platforms
if (Platform.OS !== 'web') {
  try {
    // Use dynamic import to avoid bundling issues
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
    console.log('react-native-maps loaded successfully on mobile');
  } catch (error) {
    console.log('react-native-maps not available on this platform:', error);
    // Ensure null values on error
    MapView = null;
    Marker = null;
    PROVIDER_GOOGLE = null;
  }
} else {
  console.log('Web platform detected - using map placeholder');
  // Explicitly set to null to ensure no native module imports
  MapView = null;
  Marker = null;
  PROVIDER_GOOGLE = null;
}

export { MapView, Marker, PROVIDER_GOOGLE }; 