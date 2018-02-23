const promiseWriteFile = require('./promise-write-file');

/**
 * Create Changelog files.
 * @param  {object} tagsList    Tags info.
 * @param  {string} prevTag     Previous tag to compare with.
 * @param  {string} repoUrl     URL of the repository.
 * @param  {string} repoName    Name of the repository.
 * @return {promise}            A promise to do it.
 */
function changelog(tagsList, prevTag, repoUrl, repoName) {
  const writeLogFiles = [];
  let logIndex;
  let logDetailed;
  let logContent;
  let link;
  let prevTagHolder = prevTag;

  Object.keys(tagsList).forEach(majorVersion => {
    logIndex = [];
    logDetailed = [];
    logContent = [
      `\n# ${repoName} ${majorVersion} ChangeLog\n`,
      `All changes commited to this repository will be documented in this file. It adheres to [Semantic Versioning](http://semver.org/).\n`,
      '<details>',
      `<summary>List of tags released on the ${majorVersion} range</summary>\n`
    ];

    tagsList[majorVersion].forEach(info => {
      link = `${info.tag}-${info.date}`;
      logIndex.push(`- [${info.tag}](#${link.replace(/\./g, '')})`);

      logDetailed.push(
        `\n## [${info.tag}](${repoUrl}/tree/${info.tag}), ${info.date}\n` +
          `- [Release notes](${repoUrl}/releases/tag/${info.tag})\n` +
          `- [Full changelog](${repoUrl}/compare/${prevTagHolder}...${info.tag})\n`
      );

      prevTagHolder = info.tag;
    });

    logContent.push(logIndex.reverse().join('\n'), '\n</details>\n\n', logDetailed.reverse().join('\n'));

    writeLogFiles.push(promiseWriteFile(`changelog/CHANGELOG-${majorVersion.toUpperCase()}.md`, logContent.join('\n')));
  });

  return Promise.all(writeLogFiles);
}

module.exports = changelog;
