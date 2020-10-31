// function(exports, module, require, __filename, __dirname){

const nopt = require('nopt');
const execa = require("execa");
const {log} = console;
const utils = require("./core.utils");

function Commando(commands) {
  log()
  utils.command(commands, function(command) {
    // this.log(command);
  });
  process.exit(9);
}

module.exports = async function Wrapper(commandline_args) {
  const parsed = nopt({}, {}, commandline_args, 2);
  const cmd = parsed.argv.remain.shift();
  log(parsed)
  log(cmd)
// const commands = Commando(parsed);
// const output = await execa("git", ["status"]);
// log(output.stdout);
}


// return module.exports
// }