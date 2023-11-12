import { Rules } from 'eslint-define-config'

// flat and merge rules
export const mergeRules = (arr: Rules[]) => Object.assign({}, ...arr)