#! /usr/bin/env node
var package = require('./package.json'),
    updateNotifier = require('update-notifier'),
    notifier = updateNotifier({packageName: package.name, packageVersion: package.version}),
    cmd = process.argv[2];

function showHelp() {
  console.log("");
  console.log("USAGE:");
  console.log("");
  console.log("create an app in the current directory:");
  console.log("mkroosevelt .");
  console.log("");
  console.log("create an app in this directory in a new folder:");
  console.log("mkroosevelt appName");
  console.log("");
  console.log("create an app somewhere else:");
  console.log("mkroosevelt /path/to/appName");
}

function createSampleApp(currentDirectory) {
  var fs = require('fs'),
      fse = require('fs-extra'),
      path = require('path'),
      wrench = require('wrench');

  if (currentDirectory === true) {
    cmd = path.normalize(process.cwd());
  }

  try {
    fse.copySync(path.normalize(__dirname + '/sampleApp/'), path.normalize(cmd));
  } catch (err) {
    console.error('There was an error in copying the sample app: ' + err.message);
  }
  
  if (fs.existsSync(path.normalize(cmd + '/.npmignore'))) {
    fs.renameSync(path.normalize(cmd + '/.npmignore'), path.normalize(cmd + '/.gitignore')); // fix to compensate for this "feature" https://github.com/npm/npm/issues/1862
  }
}

if (notifier.update) {
  notifier.notify();
}

if (cmd === 'create') {
  showHelp();
}
else if (cmd === '-v' || cmd === '--v' || cmd === '-version' || cmd === '--version') {
  console.log(package.version);
}
else if (cmd) {
  try {
    if (cmd === '.') {
      currentDirectory = true;
    }
    else {
      currentDirectory = false;
      createSampleApp(currentDirectory);
    }
  }
  catch (e) {
    console.error(e);
  }
}
else {
  showHelp();
}