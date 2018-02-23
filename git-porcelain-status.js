const git = require('git-promise');
const gitUtil = require('git-promise/util');

/**
 * Verify the status of the repository.
 * @return {object}     Current branch and the status of hte repository.
 */
function gitPorcelainStatus() {
  return git('status --porcelain -b', stdout => {
    const status = gitUtil.extractStatus(stdout);
    let parsedStatus = Object.values(status.index).concat(Object.values(status.workingTree));

    // Flattened
    parsedStatus = parsedStatus.reduce((a, b) => a.concat(b), []);

    return {
      status,
      currentBranch: status.branch.split('...')[0],
      clean: parsedStatus.length === 0
    };
  });
}

module.exports = gitPorcelainStatus;
