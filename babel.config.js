module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          runtimeModule: 'react-compiler-runtime',
          target: '18',
        },
      ], // must run first!
      'react-native-reanimated/plugin',
    ],
  };
};
