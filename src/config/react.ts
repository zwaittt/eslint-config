import { EslintConfig } from '@/types'

const reactRecommended = require('eslint-plugin-react/configs/recommended')
const reactPlugin = require('eslint-plugin-react')

export const react = (): EslintConfig[] => {
  return [
    {
      plugins: {
        react: reactPlugin,
      },
      settings: {
        react: {
          version: 'detect'
        }
      },
      files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
      ...reactRecommended,
      languageOptions: {
        ...reactRecommended.languageOptions,
      },
    },
  ]
}