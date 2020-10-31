// function(exports, module, require, __filename, __dirname){
const execa = require("execa");
const errorHandler = require("./core.handlers");
const {log} = console;
module.exports = (function() {

  async function Execute() {
    const execution = await execa("git", [...arguments]);
    this.log(execution.stdout);
  }

  const utils = {

    message: "",

    Execute,

    log() {
      console.log.apply(null, arguments);
      return this;
    },

    initialize(fn) {
      fn.call(this);
    },

    createMessage(code, message) {
      process.exitCode = typeof code === "number" && code > 0 ? code : 0;
      if (!message && typeof code === "string") {
        message = code;
      }
      if (code !== 0) {
        this.message = `Error: ${this.message}`;
      }
      return this;
    },

    terminate(code, msg) {
      this.createMessage(code, msg).log(msg);
      const enqueue = setTimeout(_ => process.exit(), 10);
    },

    init() {
      return ["init"];
    },
    commit(flag, message) {
      return ["commit", flag, message];
    },
    push(localRef, remoteRef) {
      const refs = [];
      if (localRef) {
        refs.push(localRef);
      if (remoteRef) {
        refs.push(remoteRef)
      }
      }
      return ["push", ...refs];
    },
    add(pathspec) {
      pathspec = typeof pathspec === "string" ? pathspec.trim().split(" ") : "";
      return ["add", ...pathspec];
    },
    "--version": function() {
      return ["--version"];
    },
    status() {
      return ["status"];
    },
    createCommand(commands) {
      const command = commands ? commands[0] : null;
      const [, ...rest] = commands;
      if (this.verifyCommand(command)) {
        return this[command].apply(this, rest);
      }
      return null;
    },

    verifyCommand(command) {

      if (!command) {
        this.terminate(9, "Please provide a command")
      }
      if (!(command in this)) {
        this.terminate(9, `The command '${command}' is not supported`);
      }
      return true;
    }
  };

  return utils;
}());


// return module.exports
// }