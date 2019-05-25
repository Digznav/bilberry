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

const eslint = 'eslint "**/*.js" .bin/*.js ".*.js" --no-ignore';
const prettier = 'prettier --write';
const prettierFlags = ['--single-quote', '--print-width=120', '--parser=flow'];

module.exports = {
  scripts: {
    test: 'NODE_ENV=test mocha --reporter spec',
    js: {
      format: `${prettier} ${prettierFlags.join(' ')} "**/*.js"`,
      lint: {
        default: `${eslint} || true`,
        fix: `${eslint} --fix`,
        strict: eslint
      }
    },
    json: {
      format: serialize('sort-package-json', `${prettier} --parser=json "*.json"`)
    },
    bump: {
      default: serialize(npsSeries('js.lint.strict'), 'node scripts/bump.js', 'npm publish'),
      link: serialize(npsSeries('js.lint.strict'), 'npm link')
    }
  }
};
