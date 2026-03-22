import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import configPrettier from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, 'check-file': checkFile },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{js,jsx,ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/': 'KEBAB_CASE',
        },
      ],
      'prefer-const': ['error'],
      'no-unused-vars': 'off', // base rule must be disabled as it can report incorrect errors
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'error',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'all'],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['shared/*', '!shared/index'],
              message: "Import only from 'shared' or 'shared/index'.",
            },
          ],
        },
      ],
      ...configPrettier.rules,
    },
  },
  {
    files: ['**/migrations/**/*.{js,ts}'],
    rules: {
      'check-file/filename-naming-convention': 'off',
      'check-file/folder-naming-convention': 'off',
    },
  },
]);
