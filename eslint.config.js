import urzx from './dist/index.js'

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...urzx({
    ts: true,
    react: true,
  }),
  {
    ignores: ['dist']    
  }
]
