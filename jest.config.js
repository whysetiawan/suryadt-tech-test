/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>'],
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['__tests__/.*/__mocks__', '__e2e__/.*'],
  setupFilesAfterEnv: [
    '@testing-library/react-native/extend-expect',
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/mocks/server.ts',
  ],
  setupFiles: ['@shopify/flash-list/jestSetup'],
  transformIgnorePatterns: [
    'node_modules/(?!' +
      '((jest-)?react-native(-.*)?|' +
      '@react-native(-community)?)|' +
      'expo(nent)?|@expo(nent)?/.*|' +
      '@expo-google-fonts/.*|' +
      'react-navigation|@react-navigation/.*|' +
      '@unimodules/.*|unimodules|' +
      'react-compiler-runtime|' +
      'sentry-expo|react-native-svg)',
  ],

  collectCoverageFrom: ['./src/**/*.{js,jsx,ts,tsx}', '!**/__tests__/**', '!**/__mocks__/**'],
};
