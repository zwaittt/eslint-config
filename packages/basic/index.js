module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'plugin:import/recommended',
    'eslint:recommended'
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs'] },
    },
  },
  plugins: [
    'unused-imports'
  ],
  rules: {
    // basic
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],

    // import
    'import/order': 'error',
    'import/first': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',
    'import/newline-after-import': ['error', { count: 1, considerComments: true }],

    // unused imports
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{ 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
		]
  }
}