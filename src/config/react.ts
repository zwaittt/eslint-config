import reactPlugin from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import { renamePluginRules } from '@/utils';
import { EslintConfig } from '@/types';

export const react = (): EslintConfig[] => [
  {
    plugins: {
      react: reactPlugin.configs.all.plugins['@eslint-react'],
      'react-dom': reactPlugin.configs.all.plugins['@eslint-react/dom'],
      hooks: reactHooks,
      'hooks-extra': reactPlugin.configs.all.plugins['@eslint-react/hooks-extra'],
      'react-web-api': reactPlugin.configs.all.plugins['@eslint-react/web-api'],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    rules: {
      ...renamePluginRules(reactPlugin.configs.core.rules, '@eslint-react', 'react'),
      ...renamePluginRules(reactPlugin.configs.dom.rules, '@eslint-react/dom', 'react-dom'),
      'hooks-extra/no-direct-set-state-in-use-effect': 'warn',
      'hooks-extra/no-useless-custom-hooks': 'warn',
      'hooks-extra/prefer-use-state-lazy-initialization': 'warn',
      'react-web-api/no-leaked-event-listener': 'warn',
      'react-web-api/no-leaked-interval': 'warn',
      'react-web-api/no-leaked-resize-observer': 'warn',
      'react-web-api/no-leaked-timeout': 'warn',
      'react-dom/no-unknown-property': ['error', {
        ignore: ['class'],
      }],
      'hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
  },
];
