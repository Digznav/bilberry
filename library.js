const capitalize = require('./capitalize');
const changelog = require('./changelog');
const gitCurrentBranch = require('./git-current-branch');
const gitDateOf = require('./git-date-of');
const gitParseOutput = require('./git-parse-output');
const gitPorcelainStatus = require('./git-porcelain-status');
const gitTagsInfo = require('./git-tags-info');
const gitVersionInfo = require('./git-version-info');
const log = require('./log');
const promiseReadFile = require('./promise-read-file');
const promiseReadFiles = require('./promise-read-files');
const promiseWriteFile = require('./promise-write-file');

module.exports = {
  capitalize,
  changelog,
  gitCurrentBranch,
  gitDateOf,
  gitParseOutput,
  gitPorcelainStatus,
  gitTagsInfo,
  gitVersionInfo,
  log,
  promiseReadFile,
  promiseReadFiles,
  promiseWriteFile
};
