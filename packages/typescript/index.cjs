/* eslint-env node */
const fs = require('node:fs')
const { join } = require('node:path')

const tsconfig = process.env.ESLINT_TSCONFIG || 'tsconfig.eslint.json'
/**@type {import("eslint").ESLint.ConfigData} */
module.exports = {
  extends: [
    '@urzx/basic',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.d.ts'] },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off'
  },
  overrides: !fs.existsSync(join(process.cwd(), tsconfig)) ? [] : [
    {
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: [tsconfig],
      }
    }
  ]
}