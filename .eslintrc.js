// https://docs.expo.dev/guides/using-eslint/
/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['eslint-plugin-react-compiler', 'prettier'],

  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/order': [
      'warn',
      {
        alphabetize: {
          caseInsensitive: false,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'parent', 'internal', 'index'],
        'newlines-between': 'always',
      },
    ],
    'no-unused-vars': 'error',
    'react/prop-types': 'off',
    'no-console': 'warn',
    'react-compiler/react-compiler': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useAnimatedStyle)',
      },
    ],
  },
};
