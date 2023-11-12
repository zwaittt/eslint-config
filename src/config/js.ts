import { EslintConfig } from '@/types'
import jsOfficial from '@eslint/js'
import globals from 'globals'
import { react as reactFlat } from './react'

export interface JsOptions {
  /**
   * if react enabled
   */
  react?: boolean;
}

export const js = ({ react }: JsOptions = {}): EslintConfig[] => {
  return [
    jsOfficial.configs.recommended,
    {
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
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
      rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single'],
      },
    },
    ...react ? reactFlat() : [],
  ]
}