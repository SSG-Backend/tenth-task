const CLI = require("clui");
const fs = require("fs");
const git = require("simple-git/promise")();
const Spinner = CLI.Spinner;
const touch = require("touch");
const _ = require("lodash");

const inquirer = require("./inquirer");
const gh = require("./github");

const createRemoteRepo = async () => {
  const github = gh.getInstance();
  const answers = await inquirer.getRepoDetails();

  const data = {
    name: answers.name,
    description: answers.description,
    private: answers.visibility === "private",
  };

  const status = new Spinner("Creating remote repository...");
  status.start();

  try {
    const response = await github.repos.createForAuthenticatedUser(data);
    // console.log(response);
    return response.data.html_url;
  } catch (err) {
    console.error(err);
  } finally {
    status.stop();
  }
};

const createGitIgnore = async () => {
  const filelist = _.without(fs.readdirSync("."), ".git", ".gitignore");

  if (filelist.length) {
    const answers = await inquirer.chooseFilesToIgnore(filelist);

    if (answers.ignore.length) {
      fs.writeFileSync(".gitignore", answers.ignore.join("\n"));
    } else {
      touch(".gitignore");
    }
  } else {
    touch(".gitignore");
  }
};

const setupRepo = async (url) => {
  const status = new Spinner(
    "Initializing local repository and pushing to remote..."
  );
  status.start();

  try {
    await git.init();
    await git.add(".gitignore");
    await git.commit("Initial commit");
    await git.addRemote("origin", url);
    await git.push("origin", "master");
  } catch (err) {
    console.error(err);
  } finally {
    status.stop();
  }
};

module.exports = { createRemoteRepo, createGitIgnore, setupRepo };
