// function(exports, module, require, __filename, __dirname){

module.exports = (function() {

  const utils = {

    message: "",

    log() {
      console.log.apply(null, arguments);
      return this;
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

    command(commands, fn) {
      if (Array.isArray(commands)) {

        if (commands.length < 1) {
          this.terminate(9, "Please provide a command")
        }

        for (command of commands) {
          if (!(command in this)) {
            this.terminate(9, `Command ${command} does not exist`);
          }
          if (!fn.call(this, command)) {
            process.exit();
          }
        }
      } else {
        this.terminate(2, "Internal Error");
      }
    },

    commands(command) {
      if (command in this) {
        // this.message = "command is available! ";
        return true;
      }
      this.exitCode = 9;
      // this.message = "Command not supported.";

    }
  };

  // process.on("exit", function(error, message) {
  //   if (process.exitCode != 0) {
  //     utils.message = "Whoops! :" + utils.message;
  //   }
  //   console.log(error, utils.message);
  // });
  return utils;
}());


// return module.exports
// }