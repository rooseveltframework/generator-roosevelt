#! /usr/bin/env node
var package = require('./package.json'),
    updateNotifier = require('update-notifier'),
    genssl = require('./lib/genssl')(),
    notifier = updateNotifier({packageName: package.name, packageVersion: package.version}),
    cmd = process.argv[2],
    appName = process.argv[2],
    argumentsToPassToYeoman = process.argv.slice(3), // Grab the arguments (exclusing the first two and third (appName)) so we they can be forwarded to the yeoman generator
    childProcess = require('child_process'),
    spawn = childProcess.spawn;

argumentsToPassToYeoman.push('--appName=' + appName); // Take the app name and format it for Yeoman. Then push it onto the array of arguments for Yeoman so it can be passed later when called.

function showHelp() {
  console.log('');
  console.log('USAGE:');
  console.log('');
  console.log('create an app in the current directory:');
  console.log('mkroosevelt .');
  console.log('');
  console.log('output usage');
  console.log('mkroosevelt -u, -usage, --u, --usage');
  console.log('');
  console.log('output current version:');
  console.log('mkroosevelt -v, -version, --v, --version');
  console.log('');
  console.log('generate ssl certificate and key for https server');
  console.log('mkroosevelt -genssl, --genssl');
  console.log('');
}

function createSampleApp() {
  try {
    yo = spawn('yo mkroosevelt', argumentsToPassToYeoman, {
      shell: true,
      stdio: [
        'inherit',
        'inherit',
        'inherit'
      ]
    });
  }
  catch (e) {
    console.error(e);
  }
}

function yeomanUsage() {
  try {
    yo = spawn('yo mkroosevelt', ['--help'], {
      shell: true,
      stdio: [
        'inherit',
        'inherit',
        'inherit'
      ]
    });
  }
  catch (e) {
    console.error(e);
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
else if (cmd === '-u' || cmd === '--u' || cmd === '-usage' || cmd === '--usage') {
  yeomanUsage();
}
else if (cmd === '-genssl' || cmd === '--genssl') {
  genssl();
}
else if (cmd) {
  createSampleApp();
}
else {
  showHelp();
}