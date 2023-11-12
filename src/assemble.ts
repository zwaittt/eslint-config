import {
  js as jsConfig,
  ts as tsConfig,
  node as nodeConfig,
  JsOptions,
  NodeOptions
} from '@/config'
import { EslintConfig } from '@/types'
export interface LintOptions extends JsOptions {
  /**
   * if typescript enabled
   */
  ts?: boolean;
  /**
   * code style format, prefer stylistic or prettier
   */
  style?: 'stylistic' | 'prettier';
  /**
   * if nodejs enabled
   */
  node?: boolean | NodeOptions;
}

export function abb(opts: LintOptions = {}): EslintConfig[] {
  
  const {
    ts = false,
    node = false,
  } = opts

  const jsOpts: JsOptions = {
    react: !!opts.react,
  }
  
  return [
    jsConfig(jsOpts),
    ts ? tsConfig(): [],
    node ? nodeConfig(typeof node === 'boolean' ? {} : node): [],
  ].flat()

}