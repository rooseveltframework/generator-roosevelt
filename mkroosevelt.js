#! /usr/bin/env node
var package = require('./package.json'),
    updateNotifier = require('update-notifier'),
    notifier = updateNotifier({packageName: package.name, packageVersion: package.version}),
    cmd = process.argv[2],
    childProcess = require('child_process'),
    spawn = childProcess.spawn;

function showHelp() {
  console.log('');
  console.log('USAGE:');
  console.log('');
  console.log('create an app in the current directory:');
  console.log('mkroosevelt .');
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
    yo = spawn('yo mkroosevelt', [], {
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
else if (cmd === '-genssl' || cmd === '--genssl') {
  var genssl = require('./lib/genssl')();

  genssl();
}
else if (cmd) {
  createSampleApp();
}
else {
  showHelp();
}