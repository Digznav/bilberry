/**
 * Convert the status message of the git command to an array.
 * @param  {string} stdout  Message.
 * @return {array}          Array.
 */
function gitParseOutput(stdout) {
  return stdout
    .trim()
    .split('\n')
    .map(line => line.trim());
}

module.exports = gitParseOutput;
