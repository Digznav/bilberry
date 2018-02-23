const fs = require('fs');

/**
 * Promise-base `writeFile` function.
 * @param  {string}  targetPath File path.
 * @param  {string}  content    File content.
 * @param  {number}  tabs       Number of tabs.
 * @return {promise}            Promise to write the given file.
 */
function promiseWriteFile(targetPath, content, tabs = 2) {
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

module.exports = promiseWriteFile;
