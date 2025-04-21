import { Linter } from 'eslint';
import { ESLintRules } from 'eslint/rules';

export type Rules = Partial<ESLintRules>;

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins'> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see {@link https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration Using plugins in your configuration}
   */
  plugins?: Record<string, any>;
};

export type EslintConfig = TypedFlatConfigItem;
