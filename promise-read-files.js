const glob = require('glob-promise');
const pReadFile = require('./promise-read-file');
const log = require('./log');

/**
 * Get the content of files using the patterns the shell uses, like stars and stuff.
 * @param  {string}  pattern Regex pattern.
 * @return {promise}         Glob promise to get the content.
 */
function promiseReadFiles(pattern) {
  return glob(pattern)
    .then(foundFiles => {
      const promisesToReadFiles = foundFiles.map(fileName => pReadFile(fileName));

      return Promise.all(promisesToReadFiles);
    })
    .catch(log.error);
}

module.exports = promiseReadFiles;
