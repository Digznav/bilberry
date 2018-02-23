const git = require('git-promise');
const gitUtil = require('git-promise/util');

/**
 * Get the current branch.
 * @return {promise}    A promise get the current branch,
 */
function gitCurrentBranch() {
  return git('status --porcelain -b', stdout => {
    var status = gitUtil.extractStatus(stdout);
    return status.branch.split('...')[0];
  });
}

module.exports = gitCurrentBranch;
