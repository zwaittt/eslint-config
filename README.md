# ESLint Config

A comprehensive ESLint configuration preset designed for modern web development, providing first-class support for TypeScript, React, Next.js, and Node.js. This config aims to enforce consistent code style and best practices across your projects with zero configuration.

> [!IMPORTANT]  
> This config follows the new [ESLint Flat Config](https://eslint.org/blog/2023/10/flat-config-rollout-plans/#flat-config-by-default-in-eslint-v9.0.0) format. Learn more about [Flat Config](https://eslint.org/blog/2022/08/new-config-system-part-2/) and its benefits.

## ✨ Features

- 🔥 Zero-config setup with CLI wizard
- 📦 First-class TypeScript support
- ⚛️ React & Next.js ready
- 🔋 Node.js optimized rules
- 🎨 Built-in code formatting with ESLint only
- 🚀 Modern ESM and CommonJS support
- 🧩 Carefully curated plugin integrations
- ⚡️ Performance optimized configurations

## ⚡️ Quick Integration

Get started in seconds with CLI setup wizard that automatically installs dependencies and creates your Flat Config file. Just run one of these commands:

````bash
pnpm dlx @urzx/eslint-config
````

````bash
npx @urzx/eslint-config
````

````bash
yarn dlx @urzx/eslint-config
````

## Manual

1. Install the package:
````bash
pnpm install -D @urzx/eslint-config
````

2. Create `eslint.config.js` in your project root:

**esm**

````js
import abvc from '@urzx/eslint-config';

export default abvc({
  // options here
  react: true, // enables jsx
  ts: true, // enables typescript
  node: true, // enables node
  next: true, // enables nextjs, also enables jsx
  format: true, // defaults to stylistic formatter, turn off if you want to use prettier
});
````

**cjs**

````js
const abvc = require('@urzx/eslint-config').default;

module.exports = abvc({
  /// same options above
})
````

3. vscode settings

````json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": explicit
  },
}
````

## Guidelines

This config is designed as an all-in-one ESLint configuration for modern web development, carefully integrating popular plugins and best practices.

### Plugins

| Plugin | Usage | Renaming |
| --- | --- | --- |
| [`@eslint/js`](https://github.com/eslint/eslint/tree/main/packages/js) | Core JavaScript rules by eslint official | N/A |
| [`@typescript-eslint/eslint-plugin`](https://typescript-eslint.io/) | TypeScript-specific linting | ts |
| [`@eslint-react/eslint-plugin`](https://eslint-react.xyz/) | React best practices | react/react-dom |
| [`eslint-plugin-react-hooks`](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks) | React Hooks guidelines | hooks |
| [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n) | Node.js specific rules | n |
| [`eslint-plugin-unused-imports`](https://github.com/sweepline/eslint-plugin-unused-imports) | Dead vars/imports elimination  | unused-imports |
| [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x) | Import/export conventions  | i |
| [`@stylistic/eslint-plugin`](https://eslint.style/packages/default) | Code style consistency | stylistic |

ESLint plugin is required to provide a descriptive `name` property to scope the configuration objects, we choose to rename the plugin to make it brief and easy to write. This affects the rules customization, refer to [Customization](#override-rules) for more details.

### Rules Compose

Some rules from integrated plugins compose the base rules of eslint, so we turn off the base rules to avoid conflicts, e.g. `no-unused-vars` from `eslint-plugin-unused-imports`

````js
// src/config/js.ts
'no-unused-vars': 'off',
'unused-imports/no-unused-vars': [
  'error',
  { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
],
````
which give it more power to take effect with unused imports in addition to unused vars.

When it comes to TypeScript codebases, rules like `no-undef`、`no-dupe-class-members` and `no-redeclare` are unnecessary as TypeScript's compiler enforces these checks, so we turn them off in TypeScript config.

````js
// src/config/ts.ts
'no-undef': 'off',
'no-dupe-class-members': 'off',
'no-invalid-this': 'off',
...
````

### Formatter

Prettier adaptor config has been removed from `v1.0.0`, [stylistic](https://eslint.style/) rules are used as default formatter. You can still use prettier with this config but remember to add `eslint-config-prettier` to your flat configs. The issues between prettier and eslint and why we don't use prettier can be learned with [Why I don't use Prettier](https://antfu.me/posts/why-not-prettier).


````js
import abvc from "@urzx/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  ...abvc({
    format: false,
  }),
  eslintConfigPrettier,
];
````

### Eco Support

TypeScript、React、Nextjs and Nodejs are supported out-of-box, you can enable them by passing the options to the config. As for other Web stacks, it's recommended to introduce plugins by yourself as barely involved in my projects.

### Customization

#### Ignores

The config self involved a [global ignore](https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores) which contains some common non-sourcecode patterns, you can add more with the `ignores` option. As for any other ignores for specific rules in this config, you can add flag config object with `files` and `rules` properties and off the rules.

> [!NOTE]
> As ESLint docs mentioned, global ignores support directories match(dir/) in addition to files match(dir/**) which non-global ignores supports only.

global ignores are applied to all rules
````js
import abvc from "@urzx/eslint-config";

export default abvc({
  ignores: [
    // folder or file patterns
  ]
});
````

while non-global ignores are applied to specific rules

````js
import abvc from "@urzx/eslint-config";

export default [
  ...abvc(),
  {
    files: [
      // file patterns
    ],
    ignores: [
      // file patterns, following rules  will not be applied to matched files
    ],
    rules: {
      
    },
  }
];
````

rule `n/no-deprecated-api` from this config won't be applied for `script.js`
````js
import abvc from "@urzx/eslint-config";

export default [
  ...abvc({
    node: true,
  }),
  {
    files: [
      'script.js'
    ],
    rules: {
      'n/no-deprecated-api': 'off',
    },
  }
];
````

#### Override Rules

For rules not covered by the config or you want to customize their options, you can override them with the custom flat config objects. But remember to configure overrides according renaming convention for rules this config involved.

````js
import abvc from "@urzx/eslint-config";

export default [
  ...abvc({
    react: true,
  }),
  {
    files: ['**/*.[jt]sx'],
    rules: {
      'react-web-api/no-leaked-event-listener': 'error',
    },
  },
  {
    // without `files` option, it will be applied to all files
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
];
````

#### TypeScript

[`typescript-eslint`](https://typescript-eslint.io/) use `@typescript-eslint/parser` to parse ts code into eslint-compatible nodes to make eslint work with ts codebases. It allows you provide your tsConfig as its parser options. We take `tsconfig.json` from process root as default path and you can provide a custom path with `tsConfig` option as you want linter to utilize.
````js
import abvc from "@urzx/eslint-config";

export default abvc({
  ts: {
    tsconfigPath: 'tsconfig.eslint.json', // sometimes you may want to use a different tsconfig for eslint, and another one for build compile
  },
});
````
[`typed linting`](https://typescript-eslint.io/getting-started/typed-linting) is supported out-of-box, you can disable it with glob patterns through `typeIgnores` or fully disable it with `typeIgnores: false`
````js
import abvc from "@urzx/eslint-config";

export default abvc({
  ts: {
    typeIgnores: ['test/browser/jsonly/*.js'],
  },
});
````