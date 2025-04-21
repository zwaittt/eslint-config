import { Rules } from '@/types';

// flat and merge rules
export const mergeRules = (arr: Rules[]): Rules => Object.assign({}, ...arr);

export const renamePluginRules = (rules: Rules, pluginName: string, aliasName: string): Rules => {
  const newRules = {} as Rules;
  for (const [key, value] of Object.entries(rules))
    newRules[key.replace(`${pluginName}/`, `${aliasName}/`)] = value;
  
  
  return newRules;
};
