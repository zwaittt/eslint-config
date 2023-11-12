import { EslintConfig } from '@/types'
import nodePlugin from 'eslint-plugin-n'
import { Rules } from 'eslint-define-config'
import { mergeRules } from '@/utils'

/**
 * strict mode options
 */
type StrictMode = {
  strict?: true;
  
  /**
   * project target
   */
  target: 'script' | 'service' | 'lib';
}

/**
 * loose mode options
 */
type LooseMode = {
  strict?: false;
}

export type NodeOptions = StrictMode | LooseMode

export const node = (opts: NodeOptions): EslintConfig[] => {

  const rules: Rules[] = []
  
  // normal
  rules.push({
    'n/no-sync': ['error', {
      allowAtRootLevel: true,
    }],
  })

  // for web server project
  if (!opts.strict || opts.target === 'service') {
    rules.push({
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
    })
  }

  // explicitly loose mode
  if ('strict' in opts && !opts.strict) {
    rules.push({
      'n/no-sync': 'off',
    })
  }
  
  return [
    ...nodePlugin.configs['flat/mixed-esm-and-cjs'].map((config: EslintConfig) => ({
      ...config,
      rules: {
        ...config.rules,
        ...mergeRules(rules) ,
      },
    })),
  ]
}