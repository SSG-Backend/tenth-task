const nopt = require('nopt');
const parsed = nopt({}, {}, process.argv, 2);
const cmd = parsed.argv.remain.shift();
const {log} = console;

console.log("Thanks for using the tool!");

function Commando(commands) {
  // log(runner);
  log(parsed)
}

module.exports = function Wrapper(commands) {
  log(parsed)
}

