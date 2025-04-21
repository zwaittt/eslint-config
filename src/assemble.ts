import {
  JsOptions,
  NextOptions,
  NodeOptions,
  StylisticOptions,
  TsOptions,
  js as jsConfig,
  next as nextConfig,
  node as nodeConfig,
  stylistic,
  ts as tsConfig,
} from '@/config';
import { EslintConfig } from '@/types';

export interface LintOptions extends JsOptions {
  /**
   * if react enabled
   */
  react?: boolean;
  /**
   * if typescript enabled
   */
  ts?: boolean | TsOptions;
  /**
   * if nodejs enabled
   */
  node?: boolean | NodeOptions;
  /**
   * if nextjs enabled, this also enables `react`
   */
  next?: boolean | NextOptions;
  /**
   * whether to format code with eslint
   */
  format?: boolean;
  /**
   * paths to ignore
   */
  ignores?: string[];
}

export function abvc(opts: LintOptions = {}): EslintConfig[] {
  const {
    ts = false,
    node = false,
    next = false,
    ignores = [],
    format = true,
  } = opts;

  const globIgnores = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.next/**',
    '**/.out/**',
    '**/.cache/**',
    '**/.vscode/**',
    '**/.idea/**',
    '**/.gitignore',
    '**/.git/**/*',
    '**/eslint.config.js',
    '**/eslint.config.cjs',
  ].concat(ignores);

  const jsOpts: JsOptions = {
    react: !!opts.react || !!opts.next,
  };

  return [
    jsConfig(jsOpts),
    ts ? tsConfig(typeof ts === 'boolean' ? {} : ts) : [],
    node ? nodeConfig(typeof node === 'boolean' ? {} : node) : [],
    next ? nextConfig(typeof next === 'boolean' ? {} : next) : [],
    format ? stylistic({ react: jsOpts.react } as StylisticOptions) : [],
    {
      ignores: globIgnores,
    },
  ].flat();
}
