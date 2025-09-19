module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-country-picker-modal|react-native-vector-icons|react-native-svg|react-native-gesture-handler|react-native-reanimated|react-native-screens)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
