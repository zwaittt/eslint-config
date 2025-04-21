import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import * as tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { renamePluginRules } from '@/utils';
import { EslintConfig, Rules } from '@/types';

export interface TsOptions {
  tsConfig?: string;
  rules?: Rules;
  strict?: boolean;
  typeIgnores?: string[] | false;
}
export const ts = (options: TsOptions = {}): EslintConfig[] => {
  const {
    tsConfig = 'tsconfig.json',
    rules = {},
    strict,
    typeIgnores,
  } = options;

  const tsConfigExists = fs.existsSync(path.resolve(process.cwd(), tsConfig));
  const disableTypedLint = !tsConfigExists || (typeIgnores === false);

  const typeIgnoredRules = {
    ...renamePluginRules(tsPlugin.configs['eslint-recommended'].overrides![0].rules!, '@typescript-eslint', 'ts'),
    ...renamePluginRules(tsPlugin.configs.recommended.rules!, '@typescript-eslint', 'ts'),
    'ts/no-unused-vars': 'off',
    'ts/no-require-imports': 'off',
    'ts/no-var-requires': 'off',
    'ts/no-explicit-any': 'off',
    'ts/no-useless-constructor': 'error',

    'no-undef': 'off',
    'no-dupe-class-members': 'off',
    'no-invalid-this': 'off',
    'no-loss-of-precision': 'off',
    'no-redeclare': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',

    // https://github.com/un-ts/eslint-plugin-import-x/blob/877bbbb4d7795e2adc9d32e99073f516d02fe815/src/config/typescript.ts#L36
    'i/named': 'off',
  };

  const sharedConfig = {
    plugins: {
      ts: tsPlugin,
    },
    settings: {
      // ...importPlugin.flatConfigs.typescript.settings,
      'import-x/extensions': ['.ts', '.tsx', '.cts', '.mts', '.js', '.jsx', '.cjs', '.mjs'],
      'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
      },
    },
  };

  return [
    {
      files: ['**/*.{js,jsx,ts,tsx,cjs,cts,mjs,mts}'],
      ...sharedConfig,
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
          ecmaFeatures: {
            jsx: true,
          },
          ...!disableTypedLint
            ? {
                projectService: {
                  defaultProject: tsConfig,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {
                projectService: false,
              },
          tsconfigRootDir: process.cwd(),
        },
      },
      ignores: Array.isArray(typeIgnores) ? typeIgnores : [],
      rules: {
        ...typeIgnoredRules,
        ...!disableTypedLint
          ? {
              'no-implied-eval': 'off',
              'no-throw-literal': 'off',
              'dot-notation': 'off',
              'ts/await-thenable': 'error',
              'ts/dot-notation': ['error', { allowKeywords: true }],
              'ts/no-for-in-array': 'error',
              'ts/no-implied-eval': 'error',
              'ts/no-misused-promises': ['error', {
                checksVoidReturn: {
                  attributes: false,
                },
              }],
              'ts/only-throw-error': 'error',
              'ts/no-unnecessary-type-assertion': 'error',
              'ts/restrict-plus-operands': 'error',
              'ts/restrict-template-expressions': 'error',
              'ts/unbound-method': 'error',
              ...strict
                ? {
                    'ts/no-floating-promises': 'error',
                    'ts/no-unsafe-argument': 'error',
                    'ts/no-unsafe-assignment': 'error',
                    'ts/no-unsafe-call': 'warn',
                    'ts/no-unsafe-member-access': 'warn',
                    'ts/no-unsafe-return': 'warn',
                  }
                : {},
            }
          : {},
        ...rules,
      },
    },
    Array.isArray(typeIgnores) && typeIgnores?.length
      ? {
          files: typeIgnores,
          ...sharedConfig,
          languageOptions: {
            parser: tsParser,
            parserOptions: {
              sourceType: 'module',
              ecmaVersion: 'latest',
              ecmaFeatures: {
                jsx: true,
              },
              projectService: false,
            },
          },
          rules: {
            ...rules,
            ...typeIgnoredRules,
            ...renamePluginRules(tsPlugin.configs['disable-type-checked'].rules!, '@typescript-eslint', 'ts'),
          },
        }
      : undefined,
    {
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'i/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ].filter(Boolean) as EslintConfig[];
};
