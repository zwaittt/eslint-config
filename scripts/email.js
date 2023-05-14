const fs = require('node:fs')
const { description } = require('../package.json')

fs.writeFileSync(process.cwd() + '/mail.txt', description)