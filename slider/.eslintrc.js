module.exports = {
  env: {
    'react-native/react-native': true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'prettier'],
  overrides: [
    {
      files: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '__tests__/**',
        'e2e/**',
        '**/*.driver.tsx',
        'src/__tests__/jestSetupFile.ts',
      ],
      rules: {'import/no-extraneous-dependencies': 'off'},
      env: {jest: true},
    },
    {
      files: ['src/data/**/*.ts'],
      rules: {'no-param-reassign': 'off'},
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  globals: {
    window: true,
    React: true,
    const: true,
    fetch: true,
    fetchMock: true,
    document: true,
  },
  plugins: [
    'react-hooks',
    '@typescript-eslint',
    'react-native',
    'prettier',
    'simple-import-sort',
    'react-native',
  ],
  rules: {
    'react/no-unescaped-entities': ['off'],
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': ['error', {extensions: ['.js', '.tsx']}],
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/no-raw-text': 2,
    'import/prefer-default-export': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'no-unused-vars': ['off'], // works badly with typescript
    'import/extensions': ['off'], // works badly with typescript
    'react/require-default-props': ['off'],
    'newline-before-return': ['error'],
    'no-shadow': 'off',
    'arrow-body-style': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-plusplus': ['off'],
    'react-native/no-raw-text': ['off'],
    'no-param-reassign': ['off'],
    'no-continue': ['off'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          [
            '^react', // Ensure that import from "react" is at the top
            '^next',
            '^(?!(api|components|hooks|screens|services|styles|types|[.]+)(/|$))',
          ],
          ['^(@modules)(/|$)'],
          ['^(~)(/|$)'],
          // Everything else
          ['^(api|hooks|services|types|utils)(/|$)'],
          // UI modules
          ['^(screens|components|styles)(/|$)'],
          // Relative imports
          ['^[.]'],
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
