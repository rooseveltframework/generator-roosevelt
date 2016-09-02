#! /usr/bin/env node
var package = require('./package.json'),
    updateNotifier = require('update-notifier'),
    notifier = updateNotifier({packageName: package.name, packageVersion: package.version}),
    cmd = process.argv[2],
    fse = require('fs-extra'),
    path = require('path'),
    fs = require('fs'),
    stdio = require('stdio'),
    sampleAppFiles = [],
    directoryFiles = [],
    conflictedFiles = [];

function showHelp() {
  console.log('');
  console.log('USAGE:');
  console.log('');
  console.log('create an app in the current directory:');
  console.log('mkroosevelt .');
  console.log('');
  console.log('create an app in this directory in a new folder:');
  console.log('mkroosevelt appName');
  console.log('');
  console.log('create an app somewhere else:');
  console.log('mkroosevelt /path/to/appName');
  console.log('');
  console.log('output current version:');
  console.log('mkroosevelt -v,-version,--v,--version');
  console.log('');
  console.log('generate ssl certificate and key for https server');
  console.log('mkroosevelt -genssl,--genssl');
  console.log('');
}

// Function to check the sampleApps files and then compare them against the current directories files to see if there is a match. If there is a match we handle it and ask the user if they want to continue and overwrite their files.
function checkCurrentDirectoryForExistingFiles() {
  // Set cmd to the current directory, so that we can create the app in the current directory
  cmd = path.normalize(process.cwd());

  // Walk the sampleApp files, so that we can match later against the walk of the current directory
  fse.walk(path.normalize(__dirname + '/sampleApp/'))
  .on('data', function (item) {

    // Split on sampleApp so that we only get the file names and folders in the sampleApp not the absoulte path
    item = item.path.toString().split('sampleApp');
    sampleAppFiles.push(item[1]);
  })
  // On end of the sampleApp's walk we start walking the current directory
  .on('end', function () {

    // Walk the current directories files, so that we can match against the walk we did of the sampleApp's directory and see if there is a match
    fse.walk(path.normalize(cmd))
    .on('data', function (item) {

      // Split on the current directory so that we only get the file names and folders in the current directory not the absoulte path
      item = item.path.toString().split(path.normalize(cmd));
      directoryFiles.push(item[1]);
    })
    .on('end', function () {

      // Delete the first element from each array as it is blank and will give a false positive on a conflict
      directoryFiles.shift();
      sampleAppFiles.shift();

      // Loop through both the directory files and the sampleApp Files to see if there is a conflict
      directoryFiles.forEach(function(element) {
        sampleAppFiles.forEach(function(element1) {
          if (element === element1) {
            conflictedFiles.push(element);
          }
        });
      });

      // If there any conflicting file(s) we log the file, so the user can see the file causing the conflict and ask them if they want to overwrite the file
      if (conflictedFiles.length > 0) {
        console.log('This would overwrite the following existing files:');
        conflictedFiles.forEach(function(file) {
          console.log(file);
        });
        console.log('');
        stdio.question('Proceed with overwriting the above files? (y/N)', function (err, decision) {
          if (decision.toString() === 'y') {
            // If they answer yes we continue on to create the sample app in the current directory
            createSampleApp();
          }
        });
      }
      // Else there are no conflicts and we create the app
      else {
        createSampleApp();
      }
    });
  });
}

function createSampleApp() {
  try {
    fse.copySync(path.normalize(__dirname + '/sampleApp/'), path.normalize(cmd));
  }
  catch (err) {
    console.error('There was an error in copying the sample app: ' + err.message);
  }

  try {
    fs.accessSync(path.normalize(cmd + '/.npmignore'));
    fs.renameSync(path.normalize(cmd + '/.npmignore'), path.normalize(cmd + '/.gitignore')); // Fix to compensate for this "feature" https://github.com/npm/npm/issues/1862
  }
  catch (err) {
    // Fix to compensate for this "feature" https://github.com/npm/npm/issues/1862 so if .npmignore file isn't found we don't have to worry about renaming the .npmignore file
  }
}

function createSsl() {
  var forge = require('node-forge'),
      pki   = forge.pki,
      keys  = pki.rsa.generateKeyPair(2048),
      cert  = pki.createCertificate(),
      attrs = [{
                name: 'commonName',
                value: "Test"
              }, {
                name: 'countryName',
                value: "US"
              }, {
                shortName: 'ST',
                value: "Nullbraska"
              }, {
                name: 'localityName',
                value: "Test"
              }, {
                name: 'organizationName',
                value: "Test"
              }, {
                shortName: 'OU',
                value: "Test"
              }];
  
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 6,
      value: 'http://localhost/'
    }, {
      type: 7,
      ip: '127.0.0.1'
    }]
  }, {
    name: 'subjectKeyIdentifier'
  }]);

  cert.sign(keys.privateKey);

  var publicPem  = pki.publicKeyToPem(keys.publicKey),
      certPem    = pki.certificateToPem(cert),
      privatePem = pki.privateKeyToPem(keys.privateKey),
      fsCallback = function(err) { if (err) throw err; };

  fs.writeFileSync('server.pem', privatePem, 'utf8', fsCallback);
  fs.writeFileSync('cert.pem', certPem, 'utf8', fsCallback);
  fs.writeFileSync('public.pem', publicPem, 'utf8', fsCallback);

  console.log('');
  console.log('Complete!');
  console.log('');  
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
  createSsl();
}
else if (cmd) {
  try {
    if (cmd === '.') {
      checkCurrentDirectoryForExistingFiles();
    }
    else {
      createSampleApp();
    }
  }
  catch (e) {
    console.error(e);
  }
}
else {
  showHelp();
}
