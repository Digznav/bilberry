// eslint-disable-next-line import/no-extraneous-dependencies
const npsUtils = require('nps-utils');

const serialize = npsUtils.series;
const quoteScript = (script, escaped) => {
  const quote = escaped ? '\\"' : '"';
  const shouldQuote = script.indexOf(' ') !== -1;
  return shouldQuote ? `${quote}${script}${quote}` : script;
};
const npsSeries = (...scriptNames) =>
  serialize(
    ...scriptNames
      .filter(Boolean)
      .map(scriptName => scriptName.trim())
      .filter(Boolean)
      .map(scriptName => `nps -c .npmscripts.js ${quoteScript(scriptName)}`)
  );

const bins = {
  prettier: './node_modules/.bin/prettier --write',
  eslint: './node_modules/.bin/eslint "**/*.js" .bin/*.js ".*.js" --no-ignore',
  spj: './node_modules/.bin/sort-package-json',
  nodemon: './node_modules/.bin/nodemon'
};

const prettierFlags = ['--single-quote', '--print-width=120', '--parser=flow'];

module.exports = {
  scripts: {
    default: `${bins.nodemon} index.js`,
    // test: `${bins.karma} start test/karma.config.js`,
    js: {
      format: `${bins.prettier} ${prettierFlags.join(' ')} "**/*.js"`,
      lint: {
        default: `${bins.eslint} || true`,
        fix: `${bins.eslint} --fix`,
        strict: bins.eslint
      }
    },
    json: {
      format: serialize(bins.spj, `${bins.prettier} --parser=json "*.json"`)
    },
    bump: {
      default: serialize(npsSeries('js.lint.strict'), 'node scripts/bump.js', 'npm publish'),
      link: serialize(npsSeries('js.lint.strict'), 'npm link')
    }
  }
};
