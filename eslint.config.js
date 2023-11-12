import abb from './dist/index.js'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...abb({
    ts: true,
    react: true,
  }),
  {
    ignores: ['dist']    
  }
]
