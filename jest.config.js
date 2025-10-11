module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-.*|@react-native-async-storage|react-native-vector-icons|react-native-svg|react-native-chart-kit|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^react-native-sqlite-storage$': '<rootDir>/__mocks__/react-native-sqlite-storage.js',
  },
};
