module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-documents|@react-navigation|react-redux|@reduxjs|immer|react-native-gesture-handler|react-native-screens)/)',
  ],
};
