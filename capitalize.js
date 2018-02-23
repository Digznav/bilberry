/**
 * Capitalize each word.
 * Borrowed from https://github.com/grncdr/js-capitalize
 * @param  {string} string  String.
 * @return {string}         Capitalize string.
 */
function capitalize(string) {
  return string.replace(/(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g, m => m.toUpperCase());
}

module.exports = capitalize;
