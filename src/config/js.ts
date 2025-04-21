import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import * as importPlugin from 'eslint-plugin-import-x';
import jsOfficial from '@eslint/js';
import globals from 'globals';
import { EslintConfig } from '@/types';
import { renamePluginRules } from '@/utils';
import { react as reactFlat } from './react';

export interface JsOptions {
  /**
   * if react enabled
   */
  react?: boolean;
}

export const js = ({ react }: JsOptions = {}): EslintConfig[] => [
  jsOfficial.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.builtin,
        ...globals.browser,
        ...globals.worker,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: react,
        },
        sourceType: 'module',
      },
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      // reportUnusedInlineConfigs: 'error',
    },
    plugins: {
      'unused-imports': unusedImportsPlugin,
      i: importPlugin,
    },
    rules: {
      'arrow-body-style': ['warn', 'as-needed'],
      'no-param-reassign': 'off',
      'default-case': 'error',
      camelcase: ['error', {
        ignoreImports: true,
        ignoreGlobals: true,
        properties: 'never',
        ignoreDestructuring: true,
      }],
      'no-constant-condition': 'warn',
      'no-debugger': 'error',
      'no-console': 'warn',
      'no-cond-assign': ['error', 'always'],
      'no-restricted-syntax': [
        'error',
        'DebuggerStatement',
        'LabeledStatement',
        'WithStatement',
      ],
      'no-return-await': 'off',
      'no-restricted-globals': [
        'error',
        { name: 'global', message: 'Use `globalThis` instead.' },
        { name: 'self', message: 'Use `globalThis` instead.' },
      ],
      'no-restricted-properties': [
        'error',
        { property: '__proto__', message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.' },
        { property: '__defineGetter__', message: 'Use `Object.defineProperty` instead.' },
        { property: '__defineSetter__', message: 'Use `Object.defineProperty` instead.' },
        { property: '__lookupGetter__', message: 'Use `Object.getOwnPropertyDescriptor` instead.' },
        { property: '__lookupSetter__', message: 'Use `Object.getOwnPropertyDescriptor` instead.' },
      ],
      'no-var': 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: true,
        },
      ],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],
      'object-shorthand': [
        'error',
        'always',
        {
          ignoreConstructors: false,
          avoidQuotes: true,
        },
      ],
      'prefer-exponentiation-operator': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
      'generator-star-spacing': 'off',

      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'consistent-return': 'off',
      complexity: 'off',
      eqeqeq: ['error', 'smart'],
      'no-alert': 'error',
      'no-case-declarations': 'error',
      'no-multi-str': 'error',
      'no-with': 'error',
      'no-void': 'error',
      'no-useless-escape': 'off',
      'no-invalid-this': 'error',
      'vars-on-top': 'error',
      'require-await': 'off',
      'no-return-assign': 'off',
      // 'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],

      'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
      'no-useless-constructor': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      /// imports
      'i/no-webpack-loader-syntax': 'error',
      ...renamePluginRules(importPlugin.flatConfigs.recommended.rules ?? {}, 'import-x', 'i'),
      'i/no-unresolved': 'off',
      'i/newline-after-import': ['error', { count: 1 }],
      'i/order': [
        'error',
        {
          groups: [
            'builtin', // Built-in types are first
            'external',
            ['sibling', 'parent'], // Then sibling and parent types. They can be mingled together
            'index', // Then the index file
            'object',
            // Then the rest: internal type
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'ignore',
        },
      ],
      'i/first': 'error',
      'i/no-self-import': 'error',
      'i/no-mutable-exports': 'error',
      'i/no-duplicates': ['error', { considerQueryString: true }],
      'i/no-named-default': 'error',
    },
  },
  ...react ? reactFlat() : [],
  {
    files: [
      'scripts/*.?([cm])js',
      '__test__/*.?([cm])js',
      'test/*.?([cm])js',
    ],
    rules: {
      'no-console': 'off',
    },
  },
];
