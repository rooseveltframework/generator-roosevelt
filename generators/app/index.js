var generators = require('yeoman-generator'),
    fse = require('fs-extra'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    rooseveltDefaults = fse.readJsonSync(path.join(__dirname + '/../../rooseveltDefaults.json')),
    currentDirectory = path.parse(process.cwd()).name;

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('appName', {desc: 'The name of the application.' });
    this.option('port', {desc: 'The port your app will run on' });
    this.option('localhostOnly', {desc: 'Listen only to requests coming from localhost in production mode. This is useful in environments where it is expected that HTTP requests to your app will be proxied through a more traditional web server like Apache or nginx. This setting is ignored in development mode.' });
    this.option('disableLogger', {desc: 'When this option is set to true, Roosevelt will not log HTTP requests to the console.' });
    this.option('noMinify', {desc: 'Disables HTML minification as well as the minification step in (supporting) CSS and JS compilers. Automatically enabled during dev mode.' });
    this.option('enableValidator', {desc: 'Enables or disables the built-in HTML validator in dev mode.' });
    this.option('htmlValidator', {desc: 'Params to send to html-validator.' });
    this.option('validatorExceptions', {desc: ' Use this to customize the name of the request header or model value that is used to disable the HTML validators' });
    this.option('shutdownTimeout', {desc: 'Maximum amount of time in miliseconds given to Roosevelt to gracefully shut itself down when sent the kill signal.' });
    this.option('https', {desc: 'Run an HTTPS server using Roosevelt.' });
    this.option('httpsOnly', {desc: 'If running an HTTPS server, determines whether or not the default HTTP server will be disabled' });
    this.option('httpsPort', {desc: 'The port your app will run an HTTPS server on, if enabled.' });
    this.option('pfx', {desc: 'Specify whether or not your app will use pfx or standard certification.' });
    this.option('keyPath', {desc: 'Stores the file paths of specific key/certificate to be used by the server.' });
    this.option('passphrase', {desc: 'Supply the HTTPS server with the password for the certificate being used, if necessary.' });
    this.option('ca', {desc: 'Certificate authority to match client certificates against, as a file path or array of file paths.' });
    this.option('requestCert', {desc: 'Request a certificate from a client and attempt to verify it.' });
    this.option('rejectUnauthorized', {desc: 'Upon failing to authorize a user with supplied CA(s), reject their connection entirely.' });
    this.option('bodyParserUrlencodedParams', {desc: 'Controls the options for body-parser using a object.' });
    this.option('bodyParserJsonParams', {desc: 'Controls the options for the json function of the body-parser using a object.' });
    this.option('modelsPath', {desc: 'Relative path on filesystem to where your model files are located.' });
    this.option('modelsNodeModulesSymlink', {desc: 'Name of the symlink to make in node_modules pointing to your models directory. Set to false to disable making this symlink.' });
    this.option('viewsPath', {desc: 'Relative path on filesystem to where your view files are located.' });
    this.option('viewEngine', {desc: 'What templating engine to use, formatted as \'fileExtension: nodeModule\'.' });
    this.option('controllersPath', {desc: 'Relative path on filesystem to where your controller files are located.' });
    this.option('libPath', {desc: 'Relative path on filesystem to where your optional utility library files are located' });
    this.option('libPathNodeModulesSymlink', {desc: 'Name of the symlink to make in node_modules pointing to your lib directory. Set to false to disable making this symlink' });
    this.option('error404', {desc: 'Relative path on filesystem to where your "404 Not Found" controller is located' });
    this.option('error5xx', {desc: 'Relative path on filesystem to where your "Internal Server Error" controller is located' });
    this.option('error503', {desc: 'Relative path on filesystem to where your "503 Service Unavailable" controller is located.' });
    this.option('staticsRoot', {desc: 'Relative path on filesystem to where your static assets are located' });
    this.option('htmlMinify', {desc: 'Configuration for html-minifier.' });
    this.option('cssPath', {desc: 'Subdirectory within staticsRoot where your CSS files are located. By default this folder will not be made public, but is instead meant to store unminified CSS source files which will be minified and stored elsewhere when the app is started.' });
    this.option('cssCompiler', {desc: 'Which CSS preprocessor, if any, to use' });
    this.option('cssCompilerWhitelist', {desc: 'Whitelist of CSS files to compile as an array' });
    this.option('cssCompiledOutput', {desc: 'Where to place compiled CSS files' });
    this.option('jsPath', {desc: 'Subdirectory within staticsRoot where your JS files are located.' });
    this.option('bundledJsPath', {desc: 'Subdirectory within jsPath where you would like browserify to deposit bundled JS files it produces (if you use browserify)' });
    this.option('exposeBundles', {desc: 'Whether or not to copy the bundledJsPath directory to your build directory' });
    this.option('browserifyBundles', {desc: ' Declare browserify bundles: one or more files in your jsPath for browserify to bundle via its bundle method.' });
    this.option('jsCompiler', {desc: 'Which JS minifier, if any, to use.' });
    this.option('jsCompilerWhitelist', {desc: 'Whitelist of JS files to compile as an array.' });
    this.option('jsCompiledOutput', {desc: 'Where to place compiled JS files.' });
    this.option('publicFolder', {desc: 'All files and folders specified in this path will be exposed as static files.' });
    this.option('favicon', {desc: 'Location of your favicon file.' });
    this.option('symlinksToStatics', {desc: 'Array of folders from staticsRoot to make symlinks to in your public folder, formatted as either \'linkName: linkTarget\' or simply \'linkName\' if the link target has the same name as the desired link name.' });
    this.option('versionedStatics', {desc: 'If set to true, Roosevelt will prepend your app\'s version number from package.json to your statics URLs.' });
    this.option('versionedCssFile', {desc: 'If enabled, Roosevelt will create a CSS file which declares a CSS variable exposing your app\'s version number from package.json. Enable this option by supplying an object with the member variables fileName and varName.' });
    this.option('alwaysHostPublic', {desc: 'By default in production mode Roosevelt will not expose the public folder.' });
    this.option('supressClosingMessage', {desc: 'Supresses closing message.'});
  },

  initializing: function() {
    this.engineList = [];
    this.ignoreList = '';
  },

  prompting: {
    setupPrompts: function() {
      var thing = this,
          whenAdvanced = function(answer) {
            if (answer.standardInstall === 'Customize') {
              return true;
            }
            else {
              return false;
            }
          },
          whenHTTPS = function(answer) {
            return answer.https;
          },
          whenHTTPSOnly = function(answer) {
            if (answer.httpsOnly === true) {
              return false;
            }
            else if (whenAdvanced(answer)) {
              return true;
            }
            else {
              return false;
            }
          },
          validateDir = function(answer) {
            var installDirectoryPath,
                createdDirectory = false;

            if (answer !== currentDirectory) {
              if (path.isAbsolute(answer) === false) {
                installDirectoryPath = path.join(process.cwd() + '/' + answer);
              }
              else {
                installDirectoryPath = path.normalize(answer);
              }

              try {
                fse.mkdirsSync(installDirectoryPath);
                createdDirectory = true;
              }
              catch (e) {
                createdDirectory = false;
              }

              thing.destinationRoot(installDirectoryPath);
            }
            else {
              createdDirectory = true;
            }

            return createdDirectory === true ? true : 'Directory did not exist and we could not create it';
          },
          validatePort = function(answer) {
            if (!/^(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/.test(answer)) {
              return 'Invalid port, input a port between 1 and 65535';
            }
            return true;
          };

      return this.prompt(
        [
          {
            type    : 'input',
            name    : 'installPath',
            message : 'Where would you like to generate a new Roosevelt app?',
            default : currentDirectory,
            validate: validateDir
          },
          {
            type    : 'input',
            name    : 'appName',
            message : 'Your app\'s name:',
            default : rooseveltDefaults.appName.default
          },
          {
            type    : 'list',
            name    : 'standardInstall',
            choices : ['Standard', 'Customize'],
            message : 'Generate a standard config or customize it now?'
          },
          { // HTTPS
            when    : whenAdvanced,
            type    : 'confirm',
            name    : 'https',
            message : 'Use HTTPS?',
            default :  rooseveltDefaults.https.default
          },
          {
            when    : whenHTTPS,
            type    : 'confirm',
            name    : 'httpsOnly',
            message : 'Use HTTPS only? (Disable HTTP?)',
            default :  rooseveltDefaults.httpsOnly.default
          },
          {
            when    : whenHTTPS,
            type    : 'input',
            name    : 'httpsPort',
            message : 'HTTPS port your app will run on:',
            default :  rooseveltDefaults.httpsPort.default,
            validate: validatePort
          },
          {
            when    : whenHTTPS,
            type    : 'confirm',
            name    : 'shouldGenerateSslCerts',
            message : 'Generate SSL certs now?',
            default :  false
          },
          {
            when    : whenHTTPS,
            type    : 'list',
            name    : 'pfx',
            choices : ['.pfx', '.cert'],
            message : 'Use .pfx or .cert for SSL connections?',
            default :  '.pfx'
          },
          {
            when    : whenHTTPS,
            type    : 'input',
            name    : 'keyPath',
            message : 'Key Path: Stores the file paths of specific key/certificate to be used by the server. Object values: pfx, key, cert -- use one of {pfx} or {key, cert}',
            default :  rooseveltDefaults.keyPath.default || 'null'
          },
          {
            when    : whenHTTPS,
            type    : 'password',
            name    : 'passphrase',
            message : 'Passphrase for HTTPS server to use with the SSL cert (optional):',
            default :  rooseveltDefaults.passphrase.default || 'null'
          },
          {
            when    : whenHTTPS,
            type    : 'input',
            name    : 'ca',
            message : 'Ca: Certificate authority to match client certificates against, as a file path or array of file paths.',
            default :  rooseveltDefaults.ca.default || 'null'
          },
          {
            when    : whenHTTPS,
            type    : 'input',
            name    : 'requestCert',
            message : 'Request Cert: Request a certificate from a client and attempt to verify it',
            default :  rooseveltDefaults.requestCert.default
          },
          {
            when    : whenHTTPS,
            type    : 'input',
            name    : 'rejectUnauthorized',
            message : 'Reject Unauthorized: Upon failing to authorize a user with supplied CA(s), reject their connection entirely',
            default :  rooseveltDefaults.rejectUnauthorized.default
          },
          {
            when    : whenHTTPSOnly,
            type    : 'input',
            name    : 'port',
            message : 'HTTP port your app will run on:',
            default :  rooseveltDefaults.port.default,
            validate: validatePort
          },
          {
            when    : whenAdvanced,
            type    : 'input',
            name    : 'modelsPath',
            message : 'Where should data model files be located in the app\'s directory structure?',
            default :  rooseveltDefaults.modelsPath.default
          },
          {
            when    : whenAdvanced,
            type    : 'input',
            name    : 'viewsPath',
            message : 'Where should view (HTML template) files be located in the app\'s directory structure?',
            default :  rooseveltDefaults.viewsPath.default
          },
          {
            when    : whenAdvanced,
            type    : 'input',
            name    : 'controllersPath',
            message : 'Where should controller (Express route) files be located in the app\'s directory structure?',
            default :  rooseveltDefaults.controllersPath.default
          },
          {
            when    : whenAdvanced,
            type    : 'confirm',
            name    : 'gitIgnore',
            message : 'Do you want to create a custom .gitignore?',
            default :  true
          },
          {
            when    : whenAdvanced,
            type    : 'confirm',
            name    : 'templatingEngine',
            message : 'Do you want to use a HTML templating engine?',
            default :  rooseveltDefaults.templatingEngine.default
          }
        ]).then(function(answers) {

        this.standardInstall = answers.standardInstall;
        this.gitIgnore = answers.gitIgnore;
        this.templatingEngine = answers.templatingEngine;
        this.port = answers.port ? answers.port : this.options.port || '43711';
        this.localhostOnly = answers.localhostOnly ? answers.localhostOnly :  this.options.localhostOnly || 'true';
        this.disableLogger = answers.disableLogger ? answers.disableLogger :  this.options.disableLogger || 'false';
        this.noMinify = answers.noMinify ? answers.noMinify :  this.options.noMinify || 'false';
        this.enableValidator = this.options.enableValidator || 'false';
        this.htmlValidator = this.options.enableValidator || '{"port": "8888", "format": "text", "suppressWarnings": false}';
        this.validatorExceptions = this.options.validatorExceptions || '{"requestHeader": "Partial", "modelValue": "_disableValidator"}';
        this.multipart = answers.multipart ? answers.multipart :  this.options.multipart || '{"multiples": true}';
        this.shutdownTimeout = answers.shutdownTimeout ? answers.shutdownTimeout :  this.options.shutdownTimeout || '30000';
        this.https = answers.https ? answers.https :  this.options.https || 'false';
        this.shouldGenerateSslCerts = answers.shouldGenerateSslCerts ? (answers.shouldGenerateSslCerts === 'true') || (answers.shouldGenerateSslCerts === 'True') || (answers.shouldGenerateSslCerts === 'TRUE') : false;
        this.httpsOnly = answers.httpsOnly ? answers.httpsOnly :  this.options.httpsOnly || 'false';
        this.httpsPort = answers.httpsPort ? answers.httpsPort :  this.options.httpsPort || '43733';
        if (answers.pfx === '.pfx' || this.options.pfx === '.pfx') {
          this.pfx = 'false';
        }
        else {
          this.pfx = 'true';
        }
        // this.keyPath = answers.keyPath ? '"' + answers.keyPath + '"' : this.options.keyPath !== undefined ? '"' + this.options.keyPath + '"' : null;
        if (answers.keyPath) {
          this.keyPath = '"' + answers.keyPath + '"';
        }
        else {
          if (this.options.keyPath !== undefined) {
            this.keyPath = '"' + this.options.keyPath + '"';
          }
          else {
            this.keyPath = 'null';
          }
        }
        // this.passphrase = answers.passphrase ? '"' + answers.passphrase + '"' : '"' + this.options.passphrase + '"' || 'null';
        if (answers.passphrase) {
          this.passphrase = '"' + answers.passphrase + '"';
        }
        else {
          if (this.options.passphrase !== undefined) {
            this.passphrase = '"' + this.options.passphrase + '"';
          }
          else {
            this.passphrase = 'null';
          }
        }
        // this.ca = answers.ca ? '"' + answers.ca + '"' : '"' + this.options.ca + '"' || 'null';
        if (answers.ca) {
          this.ca = '"' + answers.ca + '"';
        }
        else {
          if (this.options.ca !== undefined) {
            this.ca = '"' + this.options.ca + '"';
          }
          else {
            this.ca = 'null';
          }
        }
        this.appName = answers.appName ? answers.appName :  this.options.appName || 'my-roosevelt-sample-app';
        this.appNameForPackageJson = answers.appName ? answers.appName.replace(/^\.|_/, '').replace(/\s+/g, '-').replace(/(.{1,213})(.*)/, '$1').toLowerCase() : this.options.appName.replace(/^\.|_/, '').replace(/\s+/g, '-').replace(/(.{1,213})(.*)/, '$1').toLowerCase() || 'new-project'; // First remove dot or underscore from beginning, trim whitespace and replace with dash for readability, chop off any characters past 214 in length, and then put all letters to lowercase. These are all requirements of package name for npm see: https://docs.npmjs.com/files/package.json#name
        this.requestCert = answers.requestCert ?  answers.requestCert :  this.options.requestCert || 'false';
        this.rejectUnauthorized = answers.rejectUnauthorized ? answers.rejectUnauthorized :  this.options.rejectUnauthorized || 'false';
        this.bodyParserUrlencodedParams = answers.bodyParserUrlencodedParams ? answers.bodyParserUrlencodedParams :  this.options.bodyParserUrlencodedParams || '{"extended": true}';
        this.bodyParserJsonParams = answers.bodyParserJsonParams ? answers.bodyParserJsonParams :  this.options.bodyParserJsonParams || '{}';
        this.modelsPath = answers.modelsPath ? answers.modelsPath :  this.options.modelsPath || 'mvc/models';
        this.modelsNodeModulesSymlink = answers.modelsNodeModulesSymlink ? answers.modelsNodeModulesSymlink :  this.options.modelsNodeModulesSymlink || 'models';
        this.viewsPath = answers.viewsPath ? answers.viewsPath :  this.options.viewsPath || 'mvc/views';
        this.controllersPath = answers.controllersPath ? answers.controllersPath :  this.options.controllersPath || 'mvc/controllers';
        this.libPath = answers.libPath ? answers.libPath :  this.options.libPath || 'lib';
        this.libPathNodeModulesSymlink = answers.libPathNodeModulesSymlink ? answers.libPathNodeModulesSymlink :  this.options.libPathNodeModulesSymlink || 'lib';
        this.error404 = answers.error404 ? answers.error404 :  this.options.error404 || '404.js';
        this.error5xx = answers.error5xx ? answers.error5xx :  this.options.error5xx || '5xx.js';
        this.error503 = answers.error503 ? answers.error503 :  this.options.error503 || '503.js';
        this.staticsRoot = answers.staticsRoot ? answers.staticsRoot :  this.options.staticsRoot || 'statics';
        this.htmlMinify = this.options.htmlMinify || '{"override": true, "exception_url": false, "htmlMinifier": {"html5": true}}';
        this.cssPath = answers.cssPath ? answers.cssPath :  this.options.cssPath || 'css';
        this.cssCompiler = answers.cssCompiler ? answers.cssCompiler :  this.options.cssCompiler || '{"nodeModule": "roosevelt-less", "params": {"compress": true}}';
        this.cssCompilerWhitelist = answers.cssCompilerWhitelist ? answers.cssCompilerWhitelist :  this.options.cssCompilerWhitelist || 'null';
        this.cssCompiledOutput = answers.cssCompiledOutput ? answers.cssCompiledOutput :  this.options.cssCompiledOutput || '.build/css';
        this.jsPath = answers.jsPath ? answers.jsPath :  this.options.jsPath || 'js';
        this.bundledJsPath = answers.bundledJsPath ? answers.bundledJsPath :  this.options.bundledJsPath || '.bundled';
        this.exposeBundles = answers.exposeBundles ? answers.exposeBundles :  this.options.exposeBundles || 'true';
        this.browserifyBundles = answers.browserifyBundles ? answers.browserifyBundles :  this.options.browserifyBundles || [];
        this.jsCompiler = answers.jsCompiler ? answers.jsCompiler :  this.options.jsCompiler || '{"nodeModule": "roosevelt-closure", "params": {"compilationLevel": "ADVANCED"}}';
        this.jsCompilerWhitelist = answers.jsCompilerWhitelist ? answers.jsCompilerWhitelist :  this.options.jsCompilerWhitelist || 'null';
        this.jsCompiledOutput = answers.jsCompiledOutput ? answers.jsCompiledOutput :  this.options.jsCompiledOutput || '.build/js';
        this.publicFolder = answers.publicFolder ? answers.publicFolder :  this.options.publicFolder || 'public';
        this.favicon = answers.favicon ? answers.favicon :  this.options.favicon || 'images/favicon.ico';
        this.symlinksToStatics = answers.symlinksToStatics ? answers.symlinksToStatics :  this.options.symlinksToStatics || '["css: .build/css", "images", "js: .build/js"]';
        this.versionedStatics = answers.versionedStatics ? answers.versionedStatics :  this.options.versionedStatics || 'false';
        this.versionedCssFile = answers.versionedCssFile ? answers.versionedCssFile :  this.options.versionedCssFile || 'null';
        this.alwaysHostPublic = answers.alwaysHostPublic ? answers.alwaysHostPublic :  this.options.alwaysHostPublic || 'false';
        this.supressClosingMessage = this.options.supressClosingMessage ? this.options.supressClosingMessage : false;
      }.bind(this));
    },

    addTemplatingEngine: function(self, cb) {
      self = self || this;
      cb = cb || this.async();
      var whenTemplating = function(answer) {
            return self.templatingEngine;
          },
          fileExtensionMessage = function(answer) {
            return 'What file extension do you want ' + answer.templatingEngineName + ' to use?';
          };
      return self.prompt(
        [
          {
            when    : whenTemplating,
            type    : 'input',
            name    : 'templatingEngineName',
            message : 'What templating engine do you want to use? (Supply npm module name.)',
            default :  rooseveltDefaults.templatingEngineName.default
          },
          {
            when    : whenTemplating,
            type    : 'input',
            name    : 'templatingExtension',
            message : fileExtensionMessage,
            default :  rooseveltDefaults.templatingExtension.default
          },
          {
            when    : whenTemplating,
            type    : 'confirm',
            name    : 'additionalTemplatingEngines',
            message : 'Do you want to support an additional templating engine?',
            default :  rooseveltDefaults.additionalTemplatingEngines.default
          }
        ]
      ).then(function(answers) {
        if (self.standardInstall === 'Standard') {
          self.viewEngine = 'html: teddy';
          cb();
        }
        else if (!self.templatingEngine) {
          self.viewEngine = 'none';
          cb();
        }
        else {
          self.engineList.push(answers.templatingExtension + ': ' + answers.templatingEngineName);
          if (answers.additionalTemplatingEngines === true) {
            self.prompting.addTemplatingEngine(self, cb);
          }
          else {
            self.viewEngine = self.engineList;
            cb();
          }
        }
      }.bind(self));
    },

    addGitignore: function (self, cb) {
      self = self || this;
      cb = cb || this.async();
      var whenIgnoring = function () {
        return self.gitIgnore;
      };
      return self.prompt(
        [
          {
            when: whenIgnoring,
            type: 'input',
            name: 'gitIgnoreStream',
            message: 'What location would you like you add to .gitignore?',
          },
          {
            when: whenIgnoring,
            type: 'confirm',
            name: 'additionalGitIgnore',
            message: 'Do you want to ignore an additional location?',
            default: true
          }
        ]
      ).then(function (answers) {
        if (self.standardInstall === 'Standard') {
          self.ignoreList = 'public\r\n.build\r\n';
          cb();
        }
        else {
          self.ignoreList += answers.gitIgnoreStream + '\r\n';
          if (answers.additionalGitIgnore) {
            self.prompting.addGitignore(self, cb);
          }
          else {
            cb();
          }
        }
      }.bind(self));
    }
  },

  generateSslCerts: function() {
    var thing = this;

    if (thing.shouldGenerateSslCerts === true) {
      this.log('\nGenerating SSL Certs\n');
      return this.prompt(
        [
          {
            type    : 'input',
            name    : 'commonName',
            message : 'Enter the public domain name of your website (e.g. www.google.com)',
            validate: function(input) {
              return !input ? 'This is required' : true;
            }
          },
          {
            type    : 'input',
            name    : 'countryName',
            message : 'Enter the two-character denomination of your country (e.g. US, CA)',
            validate: function(input) {
              if (!input) {
                return 'This input is required';
              }

              if (!/^[A-Z]{2}$/.test(input)) {
                return 'Incorrect input please enter in this format (e.g. US, CA)';
              }
              else {
                return true;
              }
            }
          },
          {
            type    : 'input',
            name    : 'stateName',
            message : 'Enter the name of your state or province, if applicable',
            default : 'n/a'
          },
          {
            type    : 'input',
            name    : 'localityName',
            message : 'Enter the name of your city',
            default : 'n/a'
          },
          {
            type    : 'input',
            name    : 'organizationName',
            message : 'Enter the legal name of your organization, if applicable',
            default : 'n/a'
          },
          {
            type    : 'input',
            name    : 'organizationalUnit',
            message : 'Enter the organizational unit represented by the site, if applicable (e.g. Internet Sales)',
            default : 'n/a'
          },
          {
            type    : 'input',
            name    : 'altUri',
            message : 'Enter any alternative URI the certificate would be active for',
            default : 'http://localhost/'
          },
          {
            type    : 'input',
            name    : 'altIp',
            message : 'Enter the IP address the certificate would be active for',
            default : '127.0.0.1'
          }
        ]).then(function (answers) {
        var forge  = require('node-forge'),

            commonName = answers.commonName,
            countryName = answers.countryName,
            stateName = answers.stateName,
            localityName = answers.localityName,
            organizationName = answers.organizationName,
            organizationalUnit = answers.organizationalUnit,
            altUri = answers.altUri,
            altIp = answers.altIp,

            publicPem,
            certPem,
            privatePem,

            pki   = forge.pki,
            keys  = pki.rsa.generateKeyPair(2048),
            cert  = pki.createCertificate(),
            attrs = [
              {
                name: 'commonName',
                value: commonName
              }, {
                name: 'countryName',
                value: countryName
              }, {
                shortName: 'ST',
                value: stateName
              }, {
                name: 'localityName',
                value: localityName
              }, {
                name: 'organizationName',
                value: organizationName
              }, {
                shortName: 'OU',
                value: organizationalUnit
              }
            ];

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
            value: altUri
          }, {
            type: 7,
            ip: altIp
          }]
        }, {
          name: 'subjectKeyIdentifier'
        }]);

        cert.sign(keys.privateKey);

        publicPem  = pki.publicKeyToPem(keys.publicKey);
        certPem    = pki.certificateToPem(cert);
        privatePem = pki.privateKeyToPem(keys.privateKey);

        thing.fs.write(thing.destinationPath('public.pem'), publicPem);
        thing.fs.write(thing.destinationPath('certPem.pem'), certPem);
        thing.fs.write(thing.destinationPath('privatePem.pem'), privatePem);
      });
    }
  },

  paths: function () {
    this.sourceRoot();
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('templatedPackage.json'),
      this.destinationPath('package.json'),
      {
        appName: this.appNameForPackageJson,
        port: this.port,
        localhostOnly: this.localhostOnly,
        disableLogger: this.disableLogger,
        noMinify: this.noMinify,
        enableValidator: this.enableValidator,
        htmlValidator: this.htmlValidator,
        validatorExceptions: this.validatorExceptions,
        multipart: this.multipart,
        shutdownTimeout: this.shutdownTimeout,
        https: this.https,
        httpsOnly: this.httpsOnly,
        httpsPort: this.httpsPort,
        pfx: this.pfx,
        keyPath: this.keyPath,
        passphrase: this.passphrase,
        ca: this.ca,
        requestCert: this.requestCert,
        rejectUnauthorized: this.rejectUnauthorized,
        bodyParserUrlencodedParams: this.bodyParserUrlencodedParams,
        bodyParserJsonParams: this.bodyParserJsonParams,
        modelsPath: this.modelsPath,
        modelsNodeModulesSymlink: this.modelsNodeModulesSymlink,
        viewsPath: this.viewsPath,
        viewEngine: this.viewEngine,
        controllersPath: this.controllersPath,
        libPath: this.libPath,
        libPathNodeModulesSymlink: this.libPathNodeModulesSymlink,
        error404: this.error404,
        error5xx: this.error5xx,
        error503: this.error503,
        staticsRoot: this.staticsRoot,
        htmlMinify: this.htmlMinify,
        cssPath: this.cssPath,
        cssCompiler: this.cssCompiler,
        cssCompilerWhitelist: this.cssCompilerWhitelist,
        cssCompiledOutput: this.cssCompiledOutput,
        jsPath: this.jsPath,
        bundledJsPath: this.bundledJsPath,
        exposeBundles: this.exposeBundles,
        browserifyBundles: this.browserifyBundles,
        jsCompiler: this.jsCompiler,
        jsCompilerWhitelist: this.jsCompilerWhitelist,
        jsCompiledOutput: this.jsCompiledOutput,
        publicFolder: this.publicFolder,
        favicon: this.favicon,
        symlinksToStatics: this.symlinksToStatics,
        versionedStatics: this.versionedStatics,
        versionedCssFile: this.versionedCssFile,
        alwaysHostPublic: this.alwaysHostPublic
      }
    );

    // Regular copy only copies folders with files. Using the line below to create empty directory
    mkdirp.sync('.git/hooks');

    this.fs.copyTpl(
      this.templatePath('.stylelintrc_template.json'),
      this.destinationPath('.stylelintrc.json')
    );

    this.fs.copyTpl(
      this.templatePath('.htmlhintrc_template'),
      this.destinationPath('.htmlhintrc')
    );

    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath('app.js')
    );

    this.fs.copyTpl(
      this.templatePath('gitignore_template'),
      this.destinationPath('.gitignore'),
      {
        addedIgnore: this.ignoreList
      }
    );

    this.fs.copy(
      this.templatePath('mvc/controllers/404.js'),
      this.destinationPath('mvc/controllers/404.js')
    );

    this.fs.copy(
      this.templatePath('mvc/controllers/homepage.js'),
      this.destinationPath('mvc/controllers/homepage.js')
    );

    this.fs.copy(
      this.templatePath('mvc/controllers/robots.txt.js'),
      this.destinationPath('mvc/controllers/robots.txt.js')
    );

    this.fs.copyTpl(
      this.templatePath('mvc/models/global.js'),
      this.destinationPath('mvc/models/global.js'),
      {
        appName: this.appName
      }
    );

    this.fs.copy(
      this.templatePath('mvc/views/layouts/main.html'),
      this.destinationPath('mvc/views/layouts/main.html')
    );

    this.fs.copy(
      this.templatePath('mvc/views/404.html'),
      this.destinationPath('mvc/views/404.html')
    );

    this.fs.copy(
      this.templatePath('mvc/views/homepage.html'),
      this.destinationPath('mvc/views/homepage.html')
    );

    this.fs.copy(
      this.templatePath('mvc/views/robots.txt'),
      this.destinationPath('mvc/views/robots.txt')
    );

    this.fs.copy(
      this.templatePath('statics/css/more.less'),
      this.destinationPath('statics/css/more.less')
    );

    this.fs.copy(
      this.templatePath('statics/css/styles.less'),
      this.destinationPath('statics/css/styles.less')
    );

    this.fs.copy(
      this.templatePath('statics/images/teddy.jpg'),
      this.destinationPath('statics/images/teddy.jpg')
    );

    this.fs.copy(
      this.templatePath('statics/images/favicon.ico'),
      this.destinationPath('statics/images/favicon.ico')
    );

    this.fs.copy(
      this.templatePath('statics/js/main.js'),
      this.destinationPath('statics/js/main.js')
    );
  },

  end: function() {
    testEnvironmentCheck = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'notTest';

    if (this.supressClosingMessage === false && testEnvironmentCheck !== 'test') {
      var whichHttpToShow;

      if (this.https === 'true' && this.httpsOnly === 'false') {
        whichHttpToShow = 'http(s)';
      }
      else if (this.https === 'true' && this.httpsOnly === 'true') {
        whichHttpToShow = 'https';
      }
      else {
        whichHttpToShow = 'http';
      }

      this.log('\nYour app ' + this.appName + ' has been generated.\n');
      this.log('To run the app:');
      this.log('- Install dependencies: npm i');
      this.log('- To run in dev mode:   npm run dev');
      this.log('- To run in prod mode:  npm run prod');
      this.log('Once running, visit ' + whichHttpToShow + '://localhost:' + this.port + '/\n');
      this.log('To make further changes to the config, edit package.json. See https://github.com/kethinov/roosevelt#configure-your-app-with-parameters for information on the configuration options.');
    }
  }
});
