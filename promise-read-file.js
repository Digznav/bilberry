const fs = require('fs');

/**
 * Get the content of a single file.
 * @param  {string}  path     Path to file.
 * @param  {string}  encoding Encoding.
 * @return {promise}          Promise to get the content.
 */
function promiseReadFile(path, encoding = 'utf-8') {
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

module.exports = promiseReadFile;
