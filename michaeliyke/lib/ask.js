const {writeFileSync} = require("fs");
const inquirer = require("inquirer");
const chalkPipe = require("chalk-pipe");
const {log} = console;

const questions = [{
  name: "response",
  type: "input",
  message: `
    Generating .gitignore File:
    (1) Specify space separated ext/file/folder names to ignore
    (2) Not More than 5 at a time
    (3) To end, hit enter twice
    `
}];


const bag = [];
function ask() {
  console.clear();
  inquirer.prompt(questions).then((data) => {
    if (data.response == "") {
      if (bag.length > 0) {
        log("Processing your data . . ");
        const generated = bag.join("\n");
        log(generated);
        writeFileSync(".gitignore", generated, "utf-8");
      }
    } else if (data.response.split(" ").length > 5) {
      log("Maximum size of 5 names exceeded . . \n Please try again . .");
    } else {
      bag.push(...data.response.split(" "));
      return ask();
    }
  }).catch(error => console.log(error));
}

module.exports = ask;