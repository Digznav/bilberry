/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const git = require('git-promise');
const figures = require('figures');
const inquirer = require('inquirer');
const opn = require('opn');

const $ = require('./library');

const cwd = process.cwd();
const packageJson = require(path.join(cwd, 'package.json'));
const packageLock = fs.existsSync(path.join(cwd, 'package-lock.json'))
  ? require(path.join(cwd, 'package-lock.json'))
  : null;

if (!packageLock) {
  $.log.error(
    `${chalk.bold('Missing package-lock.json file!')}`,
    'Please create this file by reinstalling all NPM modules and commit it.',
    'Make sure you are using NPM v5 and Node v7. If not, install it globally',
    'with the following command:\n',
    'npm install -g npm\n'
  );
}

// ---------------------------------------------------------------------------------------------------------------------

const versionList = $.gitVersionInfo(packageJson.version);
const targetBranch = 'master';
const repoURL = packageJson.repository.url.replace(/(?:git\+|\.git)/g, '');

$.gitPorcelainStatus()
  .then(status => {
    if (status.currentBranch !== targetBranch) {
      $.log.error(
        `${chalk.bold('Working on the wrong branch!')}`,
        `All tags must be created on ${chalk.bold(targetBranch)} branch. Please push your work and`,
        `create a Pull Request to ${chalk.bold(targetBranch)}. Then you can continue this process.`
      );
    }

    if (!status.clean) {
      $.log.error(`${chalk.bold('Working dirty!')}`, 'Please commit before trying again!');
    }

    $.log.info(`Current version in package.json is ${chalk.bold(versionList.current)}\n`);

    return inquirer.prompt([
      {
        type: 'list',
        name: 'newVersion',
        message: 'How would you like to bump it?',
        choices: versionList.prompt
      }
    ]);
  })
  .then(answers => {
    packageJson.version = answers.newVersion;
    packageLock.version = answers.newVersion;

    // Update Package files
    return Promise.all([
      $.promiseWriteFile(path.join(cwd, 'package.json'), packageJson, 2),
      $.promiseWriteFile(path.join(cwd, 'package-lock.json'), packageLock, 2)
    ]);
  })
  .then(([rewritePKG, rewritePKGLOCK]) => {
    $.log.success(
      `Version bumped in the following file:`,
      `${figures.arrowRight} ${rewritePKG.fileName}`,
      `${figures.arrowRight} ${rewritePKGLOCK.fileName}`
    );

    return $.gitTagsInfo(`v${packageJson.version}`);
  })
  .then(([tagsList, firstCommit]) =>
    $.changelog(
      // Object with all the tags info.
      tagsList,
      // First commit.
      firstCommit.trim(),
      // URL of the repository.
      repoURL,
      // Name of the repository.
      $.capitalize(packageJson.name.replace(/-/g, ' '))
    )
  )
  .then(result => {
    var filesToAdd = ['changelog/', 'package.json', 'package-lock.json'];
    var resultLog = result.reduce((prev, { fileName }) => prev.concat(`${figures.arrowRight} ${fileName}`), []);

    $.log.success(`Changelog:`, ...resultLog);

    $.log.info(`Pushing new tag to ${chalk.bold('origin')}...`);

    return git(`add ${filesToAdd.join(' ')}`);
  })
  .then(() => {
    var commitMessage = `Bump version to ${packageJson.version}`;

    return git(`commit -m "${commitMessage}"`, $.gitParseOutput);
  })
  .then(status => {
    $.log(...status);

    return git(`push origin ${targetBranch}`, $.gitParseOutput);
  })
  .then(status => {
    $.log(...status);

    return git(`tag -a -m "Tag version ${packageJson.version}." "v${packageJson.version}"`);
  })
  .then(() => git('git push origin --tags', $.gitParseOutput))
  .then(status => {
    var publicURL = `${repoURL}/releases/tag/v${packageJson.version}`;

    $.log(...status);

    $.log.success(`Release v${packageJson.version} was generated!`);

    $.log(`Please go to: ${chalk.underline(publicURL)}`, 'to describe the new changes/features added in this release.');

    return opn(publicURL, { app: 'google chrome' });
  })
  .catch($.log.error);
