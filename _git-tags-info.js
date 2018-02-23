const Semver = require('semver');
const git = require('git-promise');
const log = require('./_log');
const gitDateOf = require('./_git-tags-info');

/**
 * Information of existing tags.
 * @param  {string} newTag  Tag.
 * @return {array}          Full info of tags and the first commit.
 */
function gitTagsInfo(newTag) {
  var date = new Date().toISOString();

  return Promise.all([
    git('git tag -l', stdout => {
      var allTags = stdout
        .toString()
        .trim()
        .split('\n')
        .sort((a, b) => {
          if (Semver.lt(a, b)) return -1;
          if (Semver.gt(a, b)) return 1;
          return 0;
        });

      return allTags;
    })
      .then(infoOfTags => {
        var tagsHolder = {};
        var currentMajor = 1;
        var nextMajor = 2;
        var groups = [];

        infoOfTags.push(newTag);

        infoOfTags.forEach((tag, idx) => {
          groups.push({
            tag,
            date: tag === newTag ? date.substring(0, date.indexOf('T')) : gitDateOf(tag)
          });

          if (Semver.valid(infoOfTags[idx + 1])) {
            if (Semver.major(infoOfTags[idx + 1]) === nextMajor) {
              tagsHolder[`v${currentMajor}`] = groups;

              currentMajor += 1;
              nextMajor += 1;
              groups = [];
            }
          } else {
            tagsHolder[`v${currentMajor}`] = groups;
          }
        });

        return tagsHolder;
      })
      .catch(log.error),

    git('rev-list HEAD | tail -n 1')
  ]);
}

module.exports = gitTagsInfo;
