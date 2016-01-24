#! /usr/bin/env node
var package = require('./package.json'),
    updateNotifier = require('update-notifier'),
    stdio = require('stdio'),
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
      path = require('path'),
      wrench = require('wrench');

  if (currentDirectory === true) {
    cmd = path.normalize(process.cwd());
  }
  wrench.copyDirSyncRecursive(path.normalize(__dirname + '/sampleApp/'), path.normalize(cmd), {
    forceDelete: currentDirectory, // Whether to overwrite existing directory or not. Use currentDirectory as variable because this needs to be set to true if the user wants to create an app in the current directory.
    excludeHiddenUnix: false, // Whether to copy hidden Unix files or not (preceding .)
    preserveFiles: true, // If we're overwriting something and the file already exists, keep the existing
    preserveTimestamps: false, // Preserve the mtime and atime when copying files
    inflateSymlinks: false // Whether to follow symlinks or not when copying files
  });
  
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
      stdio.question('Installing in the current directory will DELETE EVERYTHING in the current directory. Are you sure you want to continue (y/n)', function (err, decision) {
        if (decision.toString() === 'y') {
          console.log("All set");
          createSampleApp(currentDirectory);
        }
      });
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