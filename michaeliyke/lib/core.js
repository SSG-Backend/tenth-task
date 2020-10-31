// function(exports, module, require, __filename, __dirname){

const nopt = require('nopt');
const {log} = console;
const utils = require("./core.utils");

async function Commando(commands) {

  const command = utils.createCommand(commands);
  utils.initialize(function() {
    // this.log(this.Execute)
    this.Execute(...command);
  });

}

module.exports = function Wrapper(commandline_args) {
  const parsed = nopt({}, {}, commandline_args, 2);
  Commando(parsed.argv.original);

}


// return module.exports
// }