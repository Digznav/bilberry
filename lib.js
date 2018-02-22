const fs = require('fs');
const glob = require('glob-promise');

/**
 * Get the content of a single file.
 * @param  {string}  path     Path to file.
 * @param  {string}  encoding Encoding.
 * @return {promise}          Promise to get the content.
 */
function readFileP(path, encoding = 'utf-8') {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, content) => {
      if (err) reject(err);

      resolve({
        path,
        fileName: path.split('/').pop(),
        content
      });
    });
  });
}

/**
 * Get the content of files using the patterns the shell uses, like stars and stuff.
 * @param  {string}  pattern Regex pattern.
 * @return {promise}         Glob promise to get the content.
 */
function readFilesP(pattern) {
  return glob(pattern)
    .then(foundFiles => {
      const promisesToReadFiles = foundFiles.map(fileName => readFileP(fileName));

      return Promise.all(promisesToReadFiles);
    })
    .catch(globErr => console.error(globErr));
}

/**
 * Promise-base `writeFile` function.
 * @param  {string}  targetPath File path.
 * @param  {string}  content    File content.
 * @param  {number}  tabs       Number of tabs.
 * @return {promise}            Promise to write the given file.
 */
function writeFileP(targetPath, content, tabs = 2) {
  const fileName = targetPath.split('/').pop();
  let contentHolder = content;

  if (targetPath.endsWith('.json')) {
    contentHolder = JSON.stringify(contentHolder, null, tabs);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(targetPath, contentHolder, err => {
      if (err) reject(err);

      resolve({
        path: targetPath,
        fileName,
        content: contentHolder
      });
    });
  });
}

module.exports = {
  readFileP,
  readFilesP,
  writeFileP
};
