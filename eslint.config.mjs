import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const typedFiles = [
  'packages/*/src/**/*.ts',
  'packages/*/src/**/*.mts',
  'packages/*/src/**/*.cts',
];
const scriptFiles = ['scripts/**/*.ts'];
const testFiles = ['packages/*/src/**/*.test.ts', 'vitest.config.mts'];

const restrictedImportPatterns = [
  {
    group: ['@vannadii/devplat-*/src/*'],
    message: 'Deep imports across package boundaries are forbidden.',
  },
  {
    group: ['packages/*'],
    message: 'Cross-package filesystem imports are forbidden.',
  },
  {
    group: [
      '../../*/src/*',
      '../../../*/src/*',
      '../../../../*/src/*',
      '../../packages/*',
      '../../../packages/*',
    ],
    message: 'Cross-package relative imports are forbidden.',
  },
];

const typedConfigs = tseslint.configs.strictTypeChecked.map((config) => ({
  ...config,
  files: typedFiles,
  ignores: testFiles,
  languageOptions: {
    ...config.languageOptions,
    globals: {
      ...globals.node,
      ...(config.languageOptions?.globals ?? {}),
    },
    parserOptions: {
      ...config.languageOptions?.parserOptions,
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
}));

const testConfigs = tseslint.configs.recommended.map((config) => ({
  ...config,
  files: testFiles,
  languageOptions: {
    ...config.languageOptions,
    globals: {
      ...globals.node,
      ...(config.languageOptions?.globals ?? {}),
    },
  },
}));

const scriptConfigs = tseslint.configs.strictTypeChecked.map((config) => ({
  ...config,
  files: scriptFiles,
  languageOptions: {
    ...config.languageOptions,
    globals: {
      ...globals.node,
      ...(config.languageOptions?.globals ?? {}),
    },
    parserOptions: {
      ...config.languageOptions?.parserOptions,
      project: ['./tsconfig.schemas.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
}));

export default [
  {
    ignores: [
      'coverage/**',
      'node_modules/**',
      'packages/*/dist/**',
      'site/guide-docs/.vitepress/dist/**',
      'site/guide-docs/.vitepress/.temp/**',
      '.turbo/**',
      'openclaw-*.tgz',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  js.configs.recommended,
  sonarjs.configs.recommended,
  ...typedConfigs,
  ...testConfigs,
  ...scriptConfigs,
  {
    files: typedFiles,
    ignores: testFiles,
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: false,
        },
      ],
      'no-console': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: restrictedImportPatterns,
        },
      ],
    },
  },
  {
    files: scriptFiles,
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: false,
        },
      ],
      'no-console': 'error',
    },
  },
  {
    files: testFiles,
    rules: {
      'no-console': 'off',
    },
  },
  eslintConfigPrettier,
];
