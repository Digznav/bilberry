const chalk = require('chalk');
const figures = require('figures');

/**
 * It adds an icon and tabulates the log massage.
 * @param  {string} fig     Icon.
 * @param  {string} st      First line of the log message.
 * @param  {array}  lns     Rest of the message.
 * @return {array}          Parsed message.
 */
function logMessage(fig, st, lns) {
  return lns.reduce((a, b) => a.concat(`  ${b}`), [`\n${fig} ${st}`]);
}

/**
 * Console log custom wrapper.
 * @param  {string} first   First line.
 * @param  {args}   lines   Rest of the lines.
 * @return {log}            Log message.
 */
function log(first, ...lines) {
  console.log(logMessage(figures.bullet, first, lines).join('\n'));
}

log.error = function logError(first, ...lines) {
  console.error(`${chalk.red(logMessage(figures.cross, first, lines).join('\n'))}\n`);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

log.info = function logInfo(first, ...lines) {
  console.log(chalk.cyan(logMessage(figures.info, first, lines).join('\n')));
};

log.success = function logSuccess(first, ...lines) {
  console.log(chalk.green(logMessage(figures.tick, first, lines).join('\n')));
};

module.exports = log;
