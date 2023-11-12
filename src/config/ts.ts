import * as tsParser from '@typescript-eslint/parser'
import process from 'node:process'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import { EslintConfig } from '../types'

export const ts = (): EslintConfig[] => {
  return [
    {
      files: ['**/*.?([cm])[jt]s?(x)'],
      plugins: {
        // @ts-expect-error
        ts: tsPlugin
      },
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 'latest',
          tsconfigRootDir: process.cwd()
        },
      },
      rules: {
        'ts/semi': ['error', 'never'],
        'ts/quotes': ['error', 'single'],
      },
    }
  ]
}