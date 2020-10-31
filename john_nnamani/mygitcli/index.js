#!/usr/bin/env node

const chalk = require('chalk');
const exec = require('child_process').exec;
var fs = require('fs');

const args = process.argv;
const options = ['--h', '--v', '--ig', '--cm', '--url', '--rm']


// usage represents the help guide
const usage = function() {
  const usageText = `
  mygitcli helps you initialize a git repo, create a remote repo on gihub,
  add an ignore file and commit message and perform a push. 

  usage:
    mygitcli [options]=<value> 

    options can be:

	--h: 		help
	--v:		version
    --ig:       used to add gitignore file
	--cm:		used to add commit message
	--url:		used to add url of remote repo
	--rm:		used to add readme file
	
  value:
	string property.
 
  example:
    mygitcli --ig="/node_modules .idea" --cm="initial commit" --n="mygitcli"
	--rm="mygitcli used to init git"
	
	will init a git, create gitignore file with /node_modules and .idea, create 
	a readme file with text mygitcli used to init git, make commit with message initial commit and push to mygitcli repo on github.
  `

  console.log(usageText)
}

// used to log errors to the console in red color
function errorLog(error) {
  const eLog = chalk.red(error);
  console.log(eLog);
}

//show app version
function version() {
	console.log('v1.0.0');
}

var opt = {}
//validate options
for(var i = 0; i < args.length-2; i++) {
	ar = args[i+2].split("=");
	if (options.indexOf(ar[0]) == -1) {
		errorLog('invalid option passed: ' + args[i+2]);
		usage();
		process.exit();
	}
	if (ar[0] == "--h") {
		usage(); 
		process.exit();
	}
	if (ar[0] == "--v") {
		version(); 
		process.exit();
	}
	opt[ar[0]] = ar[1];
}

var desc = "";
var ignorefiles = "";
var mes = "initial commit";
if (opt["--rm"]) {
	desc = opt["--rm"];
}
if (opt["--ig"]) {
	ignorefiles = opt["--ig"]
}
if (opt["--cm"]) {
	mes = opt["--cm"]
}



// initialize a git repo
exec('git init', function (err) {
	if (err) throw err;
	console.log("git initialized");
	fs.writeFile('README.md', desc, function (err) {
	  if (err) throw err;
	  console.log('README.md has been created!');
	  
	  fs.writeFile('.gitignore', ignorefiles, function (err) {
			if (err) throw err;
			console.log('.gitignore file has been created!');
			
			exec('git add .', function (err) {
				if (err) throw err;
				console.log('all files have been added!');
				exec('git commit -m "' + mes + '"', function (err) {
					if (err) throw err;
					console.log('commit successfull');
					if (opt["--url"]) {
						exec('git branch -M main', function (err) {
							if (err) throw err;
							console.log('pushing to remote repo ' + opt["--url"]);
							exec('git remote add origin ' + opt["--url"], function (err) {
								if (err) throw err;
								exec('git push -u origin main', function (err) {
									if (err) throw err;
									console.log("operation completed!");
								});
							});
						});
					}
				});
			});
		});
	});
});



