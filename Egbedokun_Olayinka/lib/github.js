const CLI = require("clui");
const Configstore = require("configstore");
const { Octokit } = require("@octokit/rest");
const Spinner = CLI.Spinner;
const { createBasicAuth } = require("@octokit/auth-basic");

const inquirer = require("./inquirer");
const pkg = require("../package.json");

const conf = new Configstore(pkg.name);

let octokit;

const getInstance = () => {
  return octokit;
};

const getStoredGithubToken = () => {
  return conf.get("github.token");
};

const getPersonalAccessToken = async () => {
  const credentials = await inquirer.getGithubCredentials();
  const status = new Spinner("Authenticating you, please wait...");
  status.start();

  const auth = createBasicAuth({
    username: credentials.username,
    password: credentials.password,
    async on2Fa() {
      status.stop();
      const res = await inquirer.getTwoFactorAuthenticationCode();
      status.start();
      return res.twoFactorAuthenticationCode;
    },
    token: {
      scopes: ["user", "public_repo", "repo", "repo:status"],
      note: "node-git-cli app",
    },
  });

  try {
    const res = await auth();

    if (res.token) {
      conf.set("github.token", res.token);
      return res.token;
    } else {
      throw new Error("No gitHub token was found in the response");
    }
  } catch (err) {
    console.error(err);
  } finally {
    status.stop();
  }
};

const githubAuth = (token) => {
  octokit = new Octokit({
    auth: token,
  });
};

module.exports = {
  getInstance,
  getPersonalAccessToken,
  getStoredGithubToken,
  githubAuth,
};
