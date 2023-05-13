const config = require('./index.cjs')

process.env.ESLINT_TSCONFIG = './tsconfig.json'

module.exports = {
  root: true,
  ...config
}