const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude react-native-maps from web builds
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add resolver for web platform
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Completely exclude react-native-maps from web builds
config.resolver.blockList = [
  /node_modules\/react-native-maps\/.*$/,
];

// Add alias to completely prevent react-native-maps on web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-maps': false,
};

module.exports = config; 