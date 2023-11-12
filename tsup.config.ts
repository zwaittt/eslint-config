import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  ignoreWatch: [
    'node_modules',
    'dist',
    'test'
  ],
  target: 'node16',
  clean: true,
  banner({ format }) {
    if (format === 'esm') {
      // esm with cjs: https://github.com/egoist/tsup/discussions/505
      return {
        js: 'import {createRequire as __createRequire} from "node:module";var require=__createRequire(import.meta.url);'
      }
    }
  }
})