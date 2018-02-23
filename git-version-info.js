const Semver = require('semver');

/**
 * List the possible new versions.
 * Borrowed form version-bump-prompt
 * https://github.com/BigstickCarpet/version-bump-prompt/blob/master/lib/index.js#L50
 * @param  {string} baseVer     Initial version.
 * @return {object}             Available versions.
 */
function gitVersionInfo(baseVer = '0.1.0') {
  const current = new Semver(baseVer);
  const identifier = current.prerelease[0] || 'beta';
  const prompt = [];
  const types = {
    major: 'major',
    minor: 'minor',
    patch: 'patch',
    premajor: 'pre-release major',
    preminor: 'pre-release minor',
    prepatch: 'pre-relase patch',
    prerelease: 'pre-release'
  };

  Object.keys(types).forEach(releaseType => {
    const newVer = Semver.inc(current.version, releaseType, releaseType.startsWith('pre') ? identifier : '');

    prompt.push({
      value: newVer,
      name: `${types[releaseType]} (${newVer})`
    });
  });

  return {
    current: current.version,
    prompt
  };
}

module.exports = gitVersionInfo;
