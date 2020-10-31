// 3rd party module
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

// File module
const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo');

// Clears the terminal screen
clear();

// Displays the banner
console.log(chalk.green(figlet.textSync('GIT INIT', { horizontalLayout: 'full' })));

// Check if file is a git repo
if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a git repo'));
    process.exit();
}

// Get github token
const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();
    if(token) {
      return token;
    }
  
    // No token found, use credentials to access GitHub account
    token = await github.getPersonalAccesToken();
  
    return token;
};

const run = async () => {
    try {
      // Retrieve & Set Authentication Token
      const token = await getGithubToken();
      github.githubAuth(token);
  
      // Create remote repository
      const url = await repo.createRemoteRepo();
  
      // Create .gitignore file
      await repo.createGitignore();
  
      // Set up local repository and push to remote
      await repo.setupRepo(url);
  
      console.log(chalk.green('All done!'));
    } catch(err) {
        if (err) {
          switch (err.status) {
            case 401:
              console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
              break;
            case 422:
              console.log(chalk.red('There is already a remote repository or token with the same name'));
              break;
            default:
              console.log(chalk.red(err));
          }
        }
    }
};
  
run();