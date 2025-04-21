import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cmd.ts',
  ],
  ignoreWatch: [
    'node_modules',
    'dist',
    'test',
  ],
  tsconfig: 'tsconfig.json',
  target: 'node18',
  clean: true,
  format: ['cjs', 'esm'],
  splitting: false,
  banner({ format }) {
    if (format === 'esm') {
      // esm with cjs: https://github.com/egoist/tsup/discussions/505
      return {
        js: 'import {createRequire as __createRequire} from "node:module";var require=__createRequire(import.meta.url);',
      };
    }
  },
});
