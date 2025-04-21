import { EslintConfig, Rules } from '@/types';
import { renamePluginRules } from '@/utils';

const nextPlugin = require('@next/eslint-plugin-next');

export interface NextOptions {
  /**
   * enable core-web-vitals
   * @link https://nextjs.org/docs/pages/building-your-application/configuring/eslint#core-web-vitals
   */
  strict?: boolean;
  rules?: Rules;
}

export const next = function (options: NextOptions = {}): EslintConfig[] {
  const {
    strict = false,
    rules = {},
  } = options;
  return [
    {
      plugins: {
        next: nextPlugin,
      },
      rules: {
        ...renamePluginRules(nextPlugin.configs.recommended.rules, '@next/next', 'next'),
        ...strict ? renamePluginRules(nextPlugin.configs['core-web-vitals'].rules, '@next/next', 'next') : {},
        ...rules,
      },
    },
  ];
};
