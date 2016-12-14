var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('port')
    this.option('localhostOnly')
    this.option('disableLogger')
    this.option('noMinify')
    this.option('multipart')
    this.option('shutdownTimeout')
    this.option('https')
    this.option('httpsOnly')
    this.option('httpsPort')
    this.option('pfx')
    this.option('keyPath')
    this.option('passphrase')
    this.option('ca')
    this.option('requestCert')
    this.option('rejectUnauthorized')
    this.option('bodyParserOptions')
    this.option('bodyParserJsonOptions')
    this.option('modelsPath')
    this.option('modelsNodeModulesSymlink')
    this.option('viewsPath')
    this.option('viewEngine')
    this.option('controllersPath')
    this.option('libPath')
    this.option('libPathNodeModulesSymlink')
    this.option('error404')
    this.option('error5xx')
    this.option('error503')
    this.option('staticsRoot')
    this.option('cssPath')
    this.option('cssCompiler')
    this.option('cssCompilerWhitelist')
    this.option('cssCompiledOutput')
    this.option('jsPath')
    this.option('jsCompiler')
    this.option('jsCompilerWhitelist')
    this.option('jsCompiledOutput')
    this.option('publicFolder')
    this.option('favicon')
    this.option('symlinksToStatics')
    this.option('versionedStatics')
    this.option('versionedCssFile')
    this.option('alwaysHostPublic')
  },

  prompting: function () {
    var thing = this;
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }, {
      type    : 'confirm',
      name    : 'standardInstall',
      message : 'Standard Install? Select no will walk you through a very advanced install.'
    },
    {
      when: function (response) {
        return response.standardInstall === false; // Run since they wanted the advanced install
      },
      type    : 'checkbox',
      name    : 'sectionsToInstall',
      choices : [ "App behavior parameters", "HTTPS parameters", "MVC parameters", "Utility library parameters", "Error page parameters", "Statics parameters", "Public folder parameters"],
      message : 'Select which parts of the Roosevelt Applications you would like to advance install'
    },
    { // App behvaior parameters
      when: function (response) {
        return !thing.options.port && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'port',
      message : 'Port: The port your app will run on. Can also be defined using NODE_PORT environment variable',
      default : '43711'
    },
    {
      when: function (response) {
        return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'localhostOnly',
      message : 'Local Host Only: Listen only to requests coming from localhost in production mode. This is useful in environments where it is expected that HTTP requests to your app will be proxied through a more traditional web server like Apache or nginx. This setting is ignored in development mode.',
      default : 'true'
    },
    {
      when: function (response) {
        return !thing.options.disableLogger && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'disableLogger',
      message : 'Disable Logger: When this option is set to true, Roosevelt will not log HTTP requests to the console',
      default : 'false'
    },
    {
      when: function (response) {
        return !thing.options.noMinify && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'noMinify',
      message : 'No Minify: Disables the minification step in (supporting) CSS and JS compilers. Useful during dev mode. Can also be passed as the command line argument -no-minify',
      default : 'false'
    },
    {
      when: function (response) {
        return !thing.options.multipart && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'multipart',
      message : 'Multipart: Settings to pass along to formidable using formidable\'s API for multipart form processing. Access files uploaded in your controllers by examining the req.files object. Roosevelt will remove any files uploaded to the uploadDir when the request ends automatically. To keep any, be sure to move them before the request ends. To disable multipart forms entirely, set this option to false',
      default : '{"multiples": true}'
    },
    {
      when: function (response) {
        return !thing.options.shutdownTimeout && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'shutdownTimeout',
      message : 'Shutdown Timeout: Maximum amount of time in miliseconds given to Roosevelt to gracefully shut itself down when sent the kill signal.',
      default : '30000'
    },
    { // HTTPS
      when: function (response) {
        return !thing.options.https && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'https',
      message : 'HTTPS: Run an HTTPS server using Roosevelt.',
      default : 'false'
    },
    {
      when: function (response) {
        return !thing.options.httpsOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'httpsOnly',
      message : 'HTTPS Only: If running an HTTPS server, determines whether or not the default HTTP server will be disabled',
      default : 'false'
    },
    {
      when: function (response) {
        return !thing.options.httpsPort && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'httpsPort',
      message : 'HTTPS Port: The port your app will run an HTTPS server on, if enabled.',
      default : '43733'
    },
    {
      when: function (response) {
        return !thing.options.pfx && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'pfx',
      message : 'Pfx: Specify whether or not your app will use pfx or standard certification',
      default : 'false'
    },
    {
      when: function (response) {
        return !thing.options.keyPath && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'keyPath',
      message : 'Key Path: Stores the file paths of specific key/certificate to be used by the server. Object values: pfx, key, cert -- use one of {pfx} or {key, cert}',
      default : 'null'
    },
    {
      when: function (response) {
        return !thing.options.passphrase && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'passphrase',
      message : 'Passphrase: Supply the HTTPS server with the password for the certificate being used, if necessary.',
      default : 'null'
    },
    {
      when: function (response) {
        return !thing.options.ca && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'ca',
      message : 'Ca: Certificate authority to match client certificates against, as a file path or array of file paths.',
      default : 'null'
    },
    {
      when: function (response) {
        return !thing.options.requestCert && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'requestCert',
      message : 'Request Cert: Request a certificate from a client and attempt to verify it',
      default : 'null'
    },
    {
      when: function (response) {
        return !thing.options.rejectUnauthorized && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'rejectUnauthorized',
      message : 'Reject Unauthorized: Upon failing to authorize a user with supplied CA(s), reject their connection entirely',
      default : 'false'
    },
    {
      when: function (response) {
        return !thing.options.bodyParserOptions && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'bodyParserOptions',
      message : 'Boyd Parser Options: Controls the options for body-parser using a object.',
      default : '{"extended": true}'
    },
    {
      when: function (response) {
        return !thing.options.bodyParserJsonOptions && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'bodyParserJsonOptions',
      message : 'Body Parse JSON Options: Controls the options for the json function of the body-parser using a object.',
      default : '{}'
    },
    {
      when: function (response) { // MVC Parameters
        return !thing.options.modelsPath && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'modelsPath',
      message : 'Models Path: Relative path on filesystem to where your model files are located.',
      default : 'mvc/models'
    },
    {
      when: function (response) {
        return !thing.options.modelsNodeModulesSymlink && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'modelsNodeModulesSymlink',
      message : 'Modles Node Modules Symlink: Name of the symlink to make in node_modules pointing to your models directory. Set to false to disable making this symlink.',
      default : 'models'
    },
    {
      when: function (response) {
        return !thing.options.viewsPath && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'viewsPath',
      message : 'Views Path: Relative path on filesystem to where your view files are located.',
      default : 'mvc/views'
    },
    {
      when: function (response) {
        return !thing.options.viewEngine && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'viewEngine',
      message : 'View Engine: What templating engine to use, formatted as \'fileExtension: nodeModule\'. Supply an array of engines to use in that format in order to make use of multiple templating engines. Each engine you use must also be marked as a dependency in your app\'s package.json. Whichever engine you supply first with this parameter will be considered the default. Set to none to use no templating engine. ** Also by default the module teddy is marked as a dependency in package.json **',
      default : 'html: teddy'
    },
    {
      when: function (response) {
        return !thing.options.controllersPath && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'controllersPath',
      message : 'Controllers Path: Relative path on filesystem to where your controller files are located.',
      default : 'mvc/controllers'
    },
    {
      when: function (response) {
        return !thing.options.bodyParserJsonOptions && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'bodyParserJsonOptions',
      message : 'Body Parser JSON Options: Controls the options for the json function of the body-parser using a object.',
      default : '{}'
    },
    {
      when: function (response) { // Utility Library Parameters
        return !thing.options.libPath && response.standardInstall === false && response.sectionsToInstall.indexOf('Utility library parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'libPath',
      message : 'Lib Path: Relative path on filesystem to where your optional utility library files are located.',
      default : 'lib'
    },
    {
      when: function (response) {
        return !thing.options.libPathNodeModulesSymlink && response.standardInstall === false && response.sectionsToInstall.indexOf('Utility library parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'libPathNodeModulesSymlink',
      message : 'Lib Path Node Modules Symlink: Name of the symlink to make in node_modules pointing to your lib directory. Set to false to disable making this symlink',
      default : 'lib'
    },
    {
      when: function (response) { // Error Page Parameters
        return !thing.options.error404 && response.standardInstall === false && response.sectionsToInstall.indexOf('Error page parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'error404',
      message : 'Error 404: Relative path on filesystem to where your "404 Not Found" controller is located. If you do not supply one, Roosevelt will use its default 404 controller instead',
      default : '404.js'
    },
    {
      when: function (response) {
        return !thing.options.error5xx && response.standardInstall === false && response.sectionsToInstall.indexOf('Error page parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'error5xx',
      message : 'Error 5xx: Relative path on filesystem to where your "Internal Server Error" controller is located. If you do not supply one, Roosevelt will use its default controller instead.',
      default : '5xx.jx'
    },
    {
      when: function (response) {
        return !thing.options.error503 && response.standardInstall === false && response.sectionsToInstall.indexOf('Error page parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'error503',
      message : 'Error 503: Relative path on filesystem to where your "503 Service Unavailable" controller is located. If you do not supply one, Roosevelt will use its default 503 controller instead.',
      default : '503.js'
    },
    {
      when: function (response) { // Statics
        return !thing.options.staticsRoot && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'staticsRoot',
      message : 'Statics Root: Relative path on filesystem to where your static assets are located. By default this folder will not be made public, but is instead meant to store unprocessed or uncompressed source assets.',
      default : 'statics'
    },
    {
      when: function (response) {
        return !thing.options.cssPath && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssPath',
      message : 'CSS Path: Subdirectory within staticsRoot where your CSS files are located. By default this folder will not be made public, but is instead meant to store unminified CSS source files which will be minified and stored elsewhere when the app is started.',
      default : 'css'
    },
    {
      when: function (response) {
        return !thing.options.cssCompiler && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssCompiler',
      message : 'CSS Compiler: Which CSS preprocessor, if any, to use. Must also be marked as a dependency in your app\'s package.json. Set to none to use no CSS preprocessor. ** Also by default the module roosevelt-less is marked as a dependency in package.json. **',
      default : '{"nodeModule": "roosevelt-less", "params": { "compress": true } }'
    },
    {
      when: function (response) {
        return !thing.options.cssCompilerWhitelist && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssCompilerWhitelist',
      message : 'CSS Compiler Whitelist: Whitelist of CSS files to compile as an array. Leave undefined to compile all files',
      default : 'null'
    },
    {
      when: function (response) {
        return !thing.options.cssCompiledOutput && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssCompiledOutput',
      message : 'CSS Compiled Output: Where to place compiled CSS files. This folder will be made public by default.',
      default : '.build/css'
    },
    {
      when: function (response) {
        return !thing.options.jsPath && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsPath',
      message : 'JS Path: Subdirectory within staticsRoot where your JS files are located. By default this folder will not be made public, but is instead meant to store unminified JS source files which will be minified and stored elsewhere when the app is started.',
      default : 'js'
    },
    {
      when: function (response) {
        return !thing.options.jsCompiler && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsCompiler',
      message : 'JS Compiler: Which JS minifier, if any, to use. Must also be marked as a dependency in your app\'s package.json. Set to none to use no JS minifier.',
      default : '{"nodeModule": "roosevelt-closure", "params": { "compilation_level": "ADVANCED_OPTIMIZATIONS" } }'
    },
    {
      when: function (response) {
        return !thing.options.jsCompilerWhitelist && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsCompilerWhitelist',
      message : 'JS Compiler Whitelist: Whitelist of JS files to compile as an array. Leave undefined to compile all files. Supply a : character after each file name to delimit an alternate file path and/or file name for the minified file',
      default : 'null'
    },
    {
      when: function (response) {
        return !thing.options.jsCompiledOutput && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsCompiledOutput',
      message : 'JS Compiled Output: Where to place compiled JS files. This folder will be made public by default.',
      default : '.build/js'
    },
    {
      when: function (response) { // Public Folder
        return !thing.options.publicFolder && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'publicFolder',
      message : 'Public Folder: All files and folders specified in this path will be exposed as static files.',
      default : 'public'
    },
    {
      when: function (response) {
        return !thing.options.favicon && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'favicon',
      message : 'Favicon: Location of your favicon file',
      default : 'images/favicon.ico'
    },
    {
      when: function (response) {
        return !thing.options.symlinksToStatics && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'symlinksToStatics',
      message : 'Symlink To Statics: Array of folders from staticsRoot to make symlinks to in your public folder, formatted as either \'linkName: linkTarget\' or simply \'linkName\' if the link target has the same name as the desired link name.',
      default : '["css: .build/css", "images", "js: .build/js"]'
    },
    {
      when: function (response) {
        return !thing.options.versionedStatics && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'versionedStatics',
      message : 'Versioned Statics: If set to true, Roosevelt will prepend your app\'s version number from package.json to your statics URLs. Versioning your statics is useful for resetting your users\' browser cache when you release a new version.',
      default : 'false'
    },
    {
      when: function (response) {
        return !thing.options.versionedCssFile && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'versionedCssFile',
      message : 'Versioned CSS Files: If enabled, Roosevelt will create a CSS file which declares a CSS variable exposing your app\'s version number from package.json. Enable this option by supplying an object with the member variables fileName and varName.',
      default : 'null'
    },
    {
      when: function (response) {
        return !thing.options.alwaysHostPublic && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'alwaysHostPublic',
      message : 'Always Host Public: By default in production mode Roosevelt will not expose the public folder. It\'s recommended instead that you host the public folder yourself directly through another web server, such as Apache or nginx. However, if you wish to override this behavior and have Roosevelt host your public folder even in production mode, then set this setting to true.',
      default : 'false'
    }]).then(function (answers) {
      this.port = answers.port ? answers.port : this.options.port || '43711';
      this.localhostOnly = answers.localhostOnly ? answers.localhostOnly :  this.options.localhostOnly || 'true';
      this.disableLogger = answers.disableLogger ? answers.disableLogger :  this.options.disableLogger || 'false';
      this.noMinify = answers.noMinify ? answers.noMinify :  this.options.noMinify || 'false';
      this.multipart = answers.multipart ? answers.multipart :  this.options.multipart || '{"multiples": true}';
      this.shutdownTimeout = answers.shutdownTimeout ? answers.shutdownTimeout :  this.options.shutdownTimeout || '30000';
      this.https = answers.https ? answers.https :  this.options.https || 'false';
      this.httpsOnly = answers.httpsOnly ? answers.httpsOnly :  this.options.httpsOnly || 'false';
      this.httpsPort = answers.httpsPort ? answers.httpsPort :  this.options.httpsPort || '43733';
      this.pfx = answers.pfx ? answers.pfx :  this.options.pfx || 'false';
      // this.keyPath = answers.keyPath ? '"' + answers.keyPath + '"' : this.options.keyPath !== undefined ? '"' + this.options.keyPath + '"' : null;
      if (answers.keyPath) {
        this.keyPath = '"' + answers.keyPath + '"';
      }
      else {
        if (this.options.keyPath !== undefined) {
          this.keyPath = '"' + this.options.keyPath + '"'
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
          this.passphrase = '"' + this.options.passphrase + '"'
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
          this.ca = '"' + this.options.ca + '"'
        }
        else {
          this.ca = 'null';
        }
      }
      this.requestCert = answers.requestCert ?  answers.requestCert :  this.options.requestCert || 'false';
      this.rejectUnauthorized = answers.rejectUnauthorized ? answers.rejectUnauthorized :  this.options.rejectUnauthorized || 'false';
      this.bodyParserOptions = answers.bodyParserOptions ? answers.bodyParserOptions :  this.options.bodyParserOptions || '{"extended": true}';
      this.bodyParserJsonOptions = answers.bodyParserJsonOptions ? answers.bodyParserJsonOptions :  this.options.bodyParserJsonOptions || '{}';
      this.modelsPath = answers.modelsPath ? answers.modelsPath :  this.options.modelsPath || 'mvc/models';
      this.modelsNodeModulesSymlink = answers.modelsNodeModulesSymlink ? answers.modelsNodeModulesSymlink :  this.options.modelsNodeModulesSymlink || 'models';
      this.viewsPath = answers.viewsPath ? answers.viewsPath :  this.options.viewsPath || 'mvc/views';
      this.viewEngine = answers.viewEngine ? answers.viewEngine :  this.options.viewEngine || 'html: teddy';
      this.controllersPath = answers.controllersPath ? answers.controllersPath :  this.options.controllersPath || 'mvc/controllers';
      this.libPath = answers.libPath ? answers.libPath :  this.options.libPath || 'lib';
      this.libPathNodeModulesSymlink = answers.libPathNodeModulesSymlink ? answers.libPathNodeModulesSymlink :  this.options.libPathNodeModulesSymlink || 'lib';
      this.error404 = answers.error404 ? answers.error404 :  this.options.error404 || '404.js';
      this.error5xx = answers.error5xx ? answers.error5xx :  this.options.error5xx || '5xx.js';
      this.error503 = answers.error503 ? answers.error503 :  this.options.error503 || '503.js';
      this.staticsRoot = answers.staticsRoot ? answers.staticsRoot :  this.options.staticsRoot || 'statics';
      this.cssPath = answers.cssPath ? answers.cssPath :  this.options.cssPath || 'css';
      this.cssCompiler = answers.cssCompiler ? answers.cssCompiler :  this.options.cssCompiler || '{"nodeModule": "roosevelt-less", "params": {"compress": true}}';
      this.cssCompilerWhitelist = answers.cssCompilerWhitelist ? answers.cssCompilerWhitelist :  this.options.cssCompilerWhitelist || "null";
      this.cssCompiledOutput = answers.cssCompiledOutput ? answers.cssCompiledOutput :  this.options.cssCompiledOutput || '.build/css';
      this.jsPath = answers.jsPath ? answers.jsPath :  this.options.jsPath || 'js';
      this.jsCompiler = answers.jsCompiler ? answers.jsCompiler :  this.options.jsCompiler || '{"nodeModule": "roosevelt-closure", "params": {"compilation_level": "ADVANCED_OPTIMIZATIONS"}}';
      this.jsCompilerWhitelist = answers.jsCompilerWhitelist ? answers.jsCompilerWhitelist :  this.options.jsCompilerWhitelist || "null";
      this.jsCompiledOutput = answers.jsCompiledOutput ? answers.jsCompiledOutput :  this.options.jsCompiledOutput || '.build/js';
      this.publicFolder = answers.publicFolder ? answers.publicFolder :  this.options.publicFolder || 'public';
      this.favicon = answers.favicon ? answers.favicon :  this.options.favicon || 'images/favicon.ico';
      this.symlinksToStatics = answers.symlinksToStatics ? answers.symlinksToStatics :  this.options.symlinksToStatics || '["css: .build/css", "images", "js: .build/js"]';
      this.versionedStatics = answers.versionedStatics ? answers.versionedStatics :  this.options.versionedStatics || 'false';
      this.versionedCssFile = answers.versionedCssFile ? answers.versionedCssFile :  this.options.versionedCssFile || "null";
      this.alwaysHostPublic = answers.alwaysHostPublic ? answers.alwaysHostPublic :  this.options.alwaysHostPublic || 'false';
    }.bind(this));
  },

  paths: function () {
    this.sourceRoot();
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        port: this.port,
        localhostOnly: this.localhostOnly,
        disableLogger: this.disableLogger,
        noMinify: this.noMinify,
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
        bodyParserOptions: this.bodyParserOptions,
        bodyParserJsonOptions: this.bodyParserJsonOptions,
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
        cssPath: this.cssPath,
        cssCompiler: this.cssCompiler,
        cssCompilerWhitelist: this.cssCompilerWhitelist,
        cssCompiledOutput: this.cssCompiledOutput,
        jsPath: this.jsPath,
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

    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath('app.js')
    );

    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('bin/mac.command'),
      this.destinationPath('bin/mac.command')
    );

    this.fs.copy(
      this.templatePath('bin/unix.sh'),
      this.destinationPath('bin/unix.sh')
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

    this.fs.copy(
      this.templatePath('mvc/models/global.js'),
      this.destinationPath('mvc/models/global.js')
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

  install: function() {
    this.npmInstall();
  }
});