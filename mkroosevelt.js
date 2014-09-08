#! /usr/bin/env node
var package = require('./package.json'),
    updateNotifier = require('update-notifier'),
    notifier = updateNotifier({packageName: package.name, packageVersion: package.version}),
    cmd = process.argv[2];
    

function showHelp() {
  console.log("");
  console.log("USAGE:");
  console.log("");
  console.log("create an app in this directory:");
  console.log("mkroosevelt appName");
  console.log("");
  console.log("create an app somewhere else:");
  console.log("mkroosevelt /path/to/appName");
}
function createSampleApp() {
  var fs = require('fs'),
      path = require('path'),
      wrench = require('wrench'),
      arg = process.argv[3];
  
  wrench.copyDirSyncRecursive(path.normalize(__dirname + '/sampleApp/'), path.normalize(arg), {
    forceDelete: false, // Whether to overwrite existing directory or not
    excludeHiddenUnix: false, // Whether to copy hidden Unix files or not (preceding .)
    preserveFiles: true, // If we're overwriting something and the file already exists, keep the existing
    preserveTimestamps: false, // Preserve the mtime and atime when copying files
    inflateSymlinks: false // Whether to follow symlinks or not when copying files
  });
  if (fs.existsSync(path.normalize(arg + '/.npmignore'))) {
    fs.renameSync(path.normalize(arg + '/.npmignore'), path.normalize(arg + '/.gitignore')); // fix to compensate for this "feature" https://github.com/npm/npm/issues/1862
  }
}

if (notifier.update) {
  notifier.notify();
}
if (cmd) {
  if (cmd === 'create') {
    showHelp();
  }
  else if (cmd) {
    if (!arg) {
      arg = cmd;
    }
    try {
      createSampleApp();
    }
    catch (e) {
      console.error(e);
    }
  }
}
else if (cmd && (cmd === '-v' || cmd === '--v' || cmd === '-version' || cmd === '--version')) {
  console.log(package.version);
}
else {
  showHelp();
}