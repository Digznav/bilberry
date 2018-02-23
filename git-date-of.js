const exec = require('child_process').execSync;

/**
 * Date of a git value
 * @param  {string} val     Value.
 * @return {string}         Date.
 */
function gitDateOf(val) {
  let date = null;

  try {
    date = exec(`git log -1 --format=%cI ${val}`).toString();
  } catch (err) {
    return new Error(err);
  }

  return date.substring(0, date.indexOf('T'));
}

module.exports = gitDateOf;
