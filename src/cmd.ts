import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'child_process';
import { promisify } from 'node:util';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { name, version } from '../package.json';

const template = require('lodash.template');

const fsp = fs.promises;
const execAsync = promisify(exec);

export const run = async function () {
  const cwd = process.cwd();
  const flatConfigPath = path.resolve(cwd, 'eslint.config.js');
  const pkgJsonPath = path.resolve(cwd, 'package.json');
  const pkgJsonContent = JSON.parse(await fsp.readFile(pkgJsonPath, { encoding: 'utf-8' }));

  const ui = new inquirer.ui.BottomBar();
  const notice = (str: string) => ui.log.write(chalk.bold.greenBright(`${chalk.bgCyan(`[${name}]`)}`, '✨', str));
  const err = (str: string) => console.log(os.EOL, chalk.bold.red(str));
  
  if (fs.existsSync(flatConfigPath)) {
    notice('eslint.config.js already exists.');
    return process.exit(0);
  }

  inquirer
    .prompt([{
      type: 'confirm',
      name: 'legacy',
      message: 'migrate legacy configs to flat config?',
      'default': false,
    }, {
      type: 'confirm',
      name: 'vscs',
      message: 'using vscode? update vscode settings to get started with flat configs?',
      'default': true,
    }])
    .then(async (answers) => {
      // check if current deps contains us
      const current = pkgJsonContent.devDependencies?.[name];
      const deps = [];

      if (!current || current < version) {
        deps.push(`${name}@^${version}`);
      }

      // @eslint/eslintrc required to migrate legacy config
      if (answers.legacy) {
        deps.push('@eslint/eslintrc');
      }

      if (deps.length) {
        const pkm = getPkgManager();
        const spinner = ora('installing dependencies...').start();
        await execAsync(`${pkm} add -D ${deps.join(' ')}`);
        spinner.succeed(`${chalk.bold.greenBright(`${deps.join(' ')}`)} installed!`);
      }
      
      // write flat config content
      await initConfig(answers.legacy);

      // update vscode settings to make flat available for vscode extension
      if (answers.vscs) {
        await updateVSCSettings();
      }
      console.log(''.padEnd(3, os.EOL));
      notice('Flat config done!');
    })
    .catch((error) => {
      if (error.isTtyError) {
        notice('Prompt couldn\'t be rendered in the current environment');
      }
      err(error.stdout);
    })
    .finally(() => {
      process.exit(0);
    });
  
  async function initConfig(useLegacy: boolean) {
    const legacyConfig = useLegacy ? await getLegacyConfigContent() : undefined;
    const legacyIgnores = useLegacy ? await getLegacyIgnores() : [];
    const renderConfig = {
      name,
      ...{ legacyConfig },
      ...legacyIgnores.length ? { ignores: JSON.stringify(legacyIgnores).replaceAll('"', '\'') } : {},
    };
    const flatConfigContent = pkgJsonContent.type === 'module' ? templateEsm(renderConfig) : templateCjs(renderConfig);
    await fsp.writeFile(flatConfigPath, flatConfigContent.trim() + os.EOL, 'utf-8');
  }

  async function updateVSCSettings() {
    const vscodePath = path.resolve(cwd, '.vscode');
    if (!fs.existsSync(vscodePath)) {
      fs.mkdirSync(vscodePath, { recursive: true });
    }
    const settingsPath = path.resolve(vscodePath, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
      fs.writeFileSync(settingsPath, '{}');
    }
    const settings = JSON.parse(await fsp.readFile(settingsPath, { encoding: 'utf-8' }));
    settings['editor.formatOnSave'] = false;
    settings['editor.codeActionsOnSave'] = {
      ...settings['editor.codeActionsOnSave'],
      'source.fixAll.eslint': 'explicit',
    };
    settings['eslint.useFlatConfig'] = true;
    await fsp.writeFile(settingsPath, JSON.stringify(settings, null, 2));
  }

  function getPkgManager() {
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
      if (userAgent.startsWith('yarn')) {
        return 'yarn';
      } else if (userAgent.startsWith('pnpm')) {
        return 'pnpm';
      }
      return 'npm';
    }
    if (fs.existsSync(path.resolve(cwd, 'node_modules/.pnpm'))) {
      return 'pnpm';
    } else if (fs.existsSync(path.resolve(cwd, '.yarn'))) {
      return 'yarn';
    }
    return 'npm';
  }

  async function getLegacyConfigContent() {
    const configFiles = [
      '.eslintrc.js',
      '.eslintrc.cjs',
      '.eslintrc.json',
    ].map(item => path.resolve(cwd, item));
    
    const legacyFile = configFiles.find(file => fs.existsSync(file));

    if (!legacyFile) {
      return;
    }
    const relativePath = path.relative(cwd, legacyFile);

    if (path.extname(legacyFile) !== '.json') {
      if (pkgJsonContent.type === 'module') {
        return `import * as legacyConfig from './${relativePath}'`;
      }
      return `const legacyConfig = require('./${relativePath}')`;
    } else {
      const content = fs.readFileSync(legacyFile, 'utf-8');
      fs.rmSync(legacyFile);
      return `const legacyConfig = ${content}`;
    }
  }

  async function getLegacyIgnores() {
    const ignoreFilePath = path.resolve(cwd, '.eslintignore');
    if (fs.existsSync(ignoreFilePath)) {
      const content = fs.readFileSync(ignoreFilePath, 'utf-8');
      const ignores = content.split(os.EOL).filter(item => item.trim().length > 0);
      fs.rmSync(ignoreFilePath);
      return ignores;
    }
    return [];
  }
};

const templateEsm = template(`
/// Generated by ${name}
import abvc from '<%= name %>';
<% if (typeof legacyConfig !== 'undefined') { %>
import { FlatCompat } from "@eslint/eslintrc";
<%= legacyConfig %>
const compat = new FlatCompat();
<%} %>
<% if (typeof legacyConfig !== 'undefined') { %>
export default [
  ...compat.config(legacyConfig),
  ...abvc({
    <% if (typeof ignores !== 'undefined') { %>
    ignores: <%= ignores %>,
    <% } %>
  })
]
<% } else { %>
export default abvc();
<% } %>
`);

const templateCjs = template(`
const abvc = require('${name}').default;
<% if (typeof legacyConfig !== 'undefined') { %>
const { FlatCompat } = require("@eslint/eslintrc");
<%= legacyConfig %>
const compat = new FlatCompat();
<%} %>
<% if (typeof legacyConfig !== 'undefined') { %>
module.exports = [
  ...compat.config(legacyConfig),
  ...abvc({
    <% if (typeof ignores !== 'undefined') { %>
    ignores: <%= ignores %>,
    <% } %>
  })
]
<% } else { %>
module.exports = abvc();
<% } %>
`);

run();
