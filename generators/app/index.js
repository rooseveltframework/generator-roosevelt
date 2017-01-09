var generators = require('yeoman-generator'),
    fse = require('fs-extra'),
    path = require('path'),
    appDefaults = {},
    rooseveltDefaults = fse.readJsonSync(path.join(__dirname + '/../../rooseveltDefaults.json'));

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('appName', {desc: "The name of the application." })
    this.option('port', {desc: "The port your app will run on" })
    this.option('localhostOnly', {desc: "Listen only to requests coming from localhost in production mode. This is useful in environments where it is expected that HTTP requests to your app will be proxied through a more traditional web server like Apache or nginx. This setting is ignored in development mode." })
    this.option('disableLogger', {desc: "When this option is set to true, Roosevelt will not log HTTP requests to the console." })
    this.option('noMinify', {desc: "Disables the minification step in (supporting) CSS and JS compilers. Useful during dev mode." })
    this.option('multipart', {desc: "Settings to pass along to formidable using formidable's API for multipart form processing." })
    this.option('shutdownTimeout', {desc: "Maximum amount of time in miliseconds given to Roosevelt to gracefully shut itself down when sent the kill signal." })
    this.option('https', {desc: "Run an HTTPS server using Roosevelt." })
    this.option('httpsOnly', {desc: "If running an HTTPS server, determines whether or not the default HTTP server will be disabled" })
    this.option('httpsPort', {desc: "The port your app will run an HTTPS server on, if enabled." })
    this.option('pfx', {desc: "Specify whether or not your app will use pfx or standard certification." })
    this.option('keyPath', {desc: "Stores the file paths of specific key/certificate to be used by the server." })
    this.option('passphrase', {desc: "Supply the HTTPS server with the password for the certificate being used, if necessary." })
    this.option('ca', {desc: "Certificate authority to match client certificates against, as a file path or array of file paths." })
    this.option('requestCert', {desc: "Request a certificate from a client and attempt to verify it." })
    this.option('rejectUnauthorized', {desc: "Upon failing to authorize a user with supplied CA(s), reject their connection entirely." })
    this.option('bodyParserOptions', {desc: "Controls the options for body-parser using a object." })
    this.option('bodyParserJsonOptions', {desc: "Controls the options for the json function of the body-parser using a object." })
    this.option('modelsPath', {desc: "Relative path on filesystem to where your model files are located." })
    this.option('modelsNodeModulesSymlink', {desc: "Name of the symlink to make in node_modules pointing to your models directory. Set to false to disable making this symlink." })
    this.option('viewsPath', {desc: "Relative path on filesystem to where your view files are located." })
    this.option('viewEngine', {desc: "What templating engine to use, formatted as 'fileExtension: nodeModule'." })
    this.option('controllersPath', {desc: "Relative path on filesystem to where your controller files are located." })
    this.option('libPath', {desc: "Relative path on filesystem to where your optional utility library files are located" })
    this.option('libPathNodeModulesSymlink', {desc: "Name of the symlink to make in node_modules pointing to your lib directory. Set to false to disable making this symlink" })
    this.option('error404', {desc: "Relative path on filesystem to where your \"404 Not Found\" controller is located" })
    this.option('error5xx', {desc: "Relative path on filesystem to where your \"Internal Server Error\" controller is located" })
    this.option('error503', {desc: "Relative path on filesystem to where your \"503 Service Unavailable\" controller is located." })
    this.option('staticsRoot', {desc: "Relative path on filesystem to where your static assets are located" })
    this.option('cssPath', {desc: "Subdirectory within staticsRoot where your CSS files are located. By default this folder will not be made public, but is instead meant to store unminified CSS source files which will be minified and stored elsewhere when the app is started." })
    this.option('cssCompiler', {desc: "Which CSS preprocessor, if any, to use" })
    this.option('cssCompilerWhitelist', {desc: "Whitelist of CSS files to compile as an array" })
    this.option('cssCompiledOutput', {desc: "Where to place compiled CSS files" })
    this.option('jsPath', {desc: "Subdirectory within staticsRoot where your JS files are located." })
    this.option('jsCompiler', {desc: "Which JS minifier, if any, to use." })
    this.option('jsCompilerWhitelist', {desc: "Whitelist of JS files to compile as an array." })
    this.option('jsCompiledOutput', {desc: "Where to place compiled JS files." })
    this.option('publicFolder', {desc: "All files and folders specified in this path will be exposed as static files." })
    this.option('favicon', {desc: "Location of your favicon file." })
    this.option('symlinksToStatics', {desc: "Array of folders from staticsRoot to make symlinks to in your public folder, formatted as either 'linkName: linkTarget' or simply 'linkName' if the link target has the same name as the desired link name." })
    this.option('versionedStatics', {desc: "If set to true, Roosevelt will prepend your app's version number from package.json to your statics URLs." })
    this.option('versionedCssFile', {desc: "If enabled, Roosevelt will create a CSS file which declares a CSS variable exposing your app's version number from package.json. Enable this option by supplying an object with the member variables fileName and varName." })
    this.option('alwaysHostPublic', {desc: "By default in production mode Roosevelt will not expose the public folder." })
    this.option('supressClosingMessage', {desc: "Supresses closing message."})
  },

  prompting: function () {
    var thing = this;
    return this.prompt([{
      when    : function(response) {
        return !thing.options.appName
      },
      type    : 'input',
      name    : 'appName',
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
      default :  rooseveltDefaults.port.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'localhostOnly',
      message : 'Local Host Only: Listen only to requests coming from localhost in production mode. This is useful in environments where it is expected that HTTP requests to your app will be proxied through a more traditional web server like Apache or nginx. This setting is ignored in development mode.',
      default :  rooseveltDefaults.localhostOnly.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'disableLogger',
      message : 'Disable Logger: When this option is set to true, Roosevelt will not log HTTP requests to the console',
      default :  rooseveltDefaults.disableLogger.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'noMinify',
      message : 'No Minify: Disables the minification step in (supporting) CSS and JS compilers. Useful during dev mode. Can also be passed as the command line argument -no-minify',
      default :  rooseveltDefaults.noMinify.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'multipart',
      message : 'Multipart: Settings to pass along to formidable using formidable\'s API for multipart form processing. Access files uploaded in your controllers by examining the req.files object. Roosevelt will remove any files uploaded to the uploadDir when the request ends automatically. To keep any, be sure to move them before the request ends. To disable multipart forms entirely, set this option to false',
      default :  JSON.stringify(rooseveltDefaults.multipart.default)
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('App behavior parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'shutdownTimeout',
      message : 'Shutdown Timeout: Maximum amount of time in miliseconds given to Roosevelt to gracefully shut itself down when sent the kill signal.',
      default :  rooseveltDefaults.shutdownTimeout.default
    },
    { // HTTPS
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'https',
      message : 'HTTPS: Run an HTTPS server using Roosevelt.',
      default :  rooseveltDefaults.https.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'httpsOnly',
      message : 'HTTPS Only: If running an HTTPS server, determines whether or not the default HTTP server will be disabled',
      default :  rooseveltDefaults.httpsOnly.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'httpsPort',
      message : 'HTTPS Port: The port your app will run an HTTPS server on, if enabled.',
      default :  rooseveltDefaults.httpsPort.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'pfx',
      message : 'Pfx: Specify whether or not your app will use pfx or standard certification',
      default :  rooseveltDefaults.pfx.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'keyPath',
      message : 'Key Path: Stores the file paths of specific key/certificate to be used by the server. Object values: pfx, key, cert -- use one of {pfx} or {key, cert}',
      default :  rooseveltDefaults.keyPath.default || 'null'
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'passphrase',
      message : 'Passphrase: Supply the HTTPS server with the password for the certificate being used, if necessary.',
      default :  rooseveltDefaults.passphrase.default || 'null'
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'ca',
      message : 'Ca: Certificate authority to match client certificates against, as a file path or array of file paths.',
      default :  rooseveltDefaults.ca.default || 'null'
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'requestCert',
      message : 'Request Cert: Request a certificate from a client and attempt to verify it',
      default :  rooseveltDefaults.requestCert.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'rejectUnauthorized',
      message : 'Reject Unauthorized: Upon failing to authorize a user with supplied CA(s), reject their connection entirely',
      default :  rooseveltDefaults.rejectUnauthorized.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'bodyParserOptions',
      message : 'Body Parser Options: Controls the options for body-parser using a object.',
      default :  JSON.stringify(rooseveltDefaults.bodyParserOptions.default)
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('HTTPS parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'bodyParserJsonOptions',
      message : 'Body Parse JSON Options: Controls the options for the json function of the body-parser using a object.',
      default :  JSON.stringify(rooseveltDefaults.bodyParserJsonOptions.default)
    },
    {
      when: function (response) { // MVC Parameters
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'modelsPath',
      message : 'Models Path: Relative path on filesystem to where your model files are located.',
      default :  rooseveltDefaults.modelsPath.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'modelsNodeModulesSymlink',
      message : 'Modles Node Modules Symlink: Name of the symlink to make in node_modules pointing to your models directory. Set to false to disable making this symlink.',
      default :  rooseveltDefaults.modelsNodeModulesSymlink.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'viewsPath',
      message : 'Views Path: Relative path on filesystem to where your view files are located.',
      default :  rooseveltDefaults.viewsPath.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'viewEngine',
      message : 'View Engine: What templating engine to use, formatted as \'fileExtension: nodeModule\'. Supply an array of engines to use in that format in order to make use of multiple templating engines. Each engine you use must also be marked as a dependency in your app\'s package.json. Whichever engine you supply first with this parameter will be considered the default. Set to none to use no templating engine. ** Also by default the module teddy is marked as a dependency in package.json **',
      default :  rooseveltDefaults.viewEngine.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('MVC parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'controllersPath',
      message : 'Controllers Path: Relative path on filesystem to where your controller files are located.',
      default :  rooseveltDefaults.controllersPath.default
    },
    {
      when: function (response) { // Utility Library Parameters
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Utility library parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'libPath',
      message : 'Lib Path: Relative path on filesystem to where your optional utility library files are located.',
      default :  rooseveltDefaults.libPath.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Utility library parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'libPathNodeModulesSymlink',
      message : 'Lib Path Node Modules Symlink: Name of the symlink to make in node_modules pointing to your lib directory. Set to false to disable making this symlink',
      default :  rooseveltDefaults.libPathNodeModulesSymlink.default
    },
    {
      when: function (response) { // Error Page Parameters
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Error page parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'error404',
      message : 'Error 404: Relative path on filesystem to where your "404 Not Found" controller is located. If you do not supply one, Roosevelt will use its default 404 controller instead',
      default :  rooseveltDefaults.error404.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Error page parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'error5xx',
      message : 'Error 5xx: Relative path on filesystem to where your "Internal Server Error" controller is located. If you do not supply one, Roosevelt will use its default controller instead.',
      default :  rooseveltDefaults.error5xx.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Error page parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'error503',
      message : 'Error 503: Relative path on filesystem to where your "503 Service Unavailable" controller is located. If you do not supply one, Roosevelt will use its default 503 controller instead.',
      default :  rooseveltDefaults.error503.default
    },
    {
      when: function (response) { // Statics
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'staticsRoot',
      message : 'Statics Root: Relative path on filesystem to where your static assets are located. By default this folder will not be made public, but is instead meant to store unprocessed or uncompressed source assets.',
      default :  rooseveltDefaults.staticsRoot.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssPath',
      message : 'CSS Path: Subdirectory within staticsRoot where your CSS files are located. By default this folder will not be made public, but is instead meant to store unminified CSS source files which will be minified and stored elsewhere when the app is started.',
      default :  rooseveltDefaults.cssPath.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssCompiler',
      message : 'CSS Compiler: Which CSS preprocessor, if any, to use. Must also be marked as a dependency in your app\'s package.json. Set to none to use no CSS preprocessor. ** Also by default the module roosevelt-less is marked as a dependency in package.json. **',
      default :  JSON.stringify(rooseveltDefaults.cssCompiler.default)
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssCompilerWhitelist',
      message : 'CSS Compiler Whitelist: Whitelist of CSS files to compile as an array. Leave undefined to compile all files',
      default :  rooseveltDefaults.cssCompilerWhitelist.default || 'null'
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'cssCompiledOutput',
      message : 'CSS Compiled Output: Where to place compiled CSS files. This folder will be made public by default.',
      default :  rooseveltDefaults.cssCompiledOutput.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsPath',
      message : 'JS Path: Subdirectory within staticsRoot where your JS files are located. By default this folder will not be made public, but is instead meant to store unminified JS source files which will be minified and stored elsewhere when the app is started.',
      default :  rooseveltDefaults.jsPath.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsCompiler',
      message : 'JS Compiler: Which JS minifier, if any, to use. Must also be marked as a dependency in your app\'s package.json. Set to none to use no JS minifier.',
      default :  JSON.stringify(rooseveltDefaults.jsCompiler.default)
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsCompilerWhitelist',
      message : 'JS Compiler Whitelist: Whitelist of JS files to compile as an array. Leave undefined to compile all files. Supply a : character after each file name to delimit an alternate file path and/or file name for the minified file',
      default :  rooseveltDefaults.jsCompilerWhitelist.default || 'null'
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Statics parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'jsCompiledOutput',
      message : 'JS Compiled Output: Where to place compiled JS files. This folder will be made public by default.',
      default :  rooseveltDefaults.jsCompiledOutput.default
    },
    {
      when: function (response) { // Public Folder
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'publicFolder',
      message : 'Public Folder: All files and folders specified in this path will be exposed as static files.',
      default :  rooseveltDefaults.publicFolder.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'favicon',
      message : 'Favicon: Location of your favicon file',
      default :  rooseveltDefaults.favicon.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'symlinksToStatics',
      message : 'Symlink To Statics: Array of folders from staticsRoot to make symlinks to in your public folder, formatted as either \'linkName: linkTarget\' or simply \'linkName\' if the link target has the same name as the desired link name.',
      default :  JSON.stringify(rooseveltDefaults.symlinksToStatics.default)
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'versionedStatics',
      message : 'Versioned Statics: If set to true, Roosevelt will prepend your app\'s version number from package.json to your statics URLs. Versioning your statics is useful for resetting your users\' browser cache when you release a new version.',
      default :  rooseveltDefaults.versionedStatics.default
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'versionedCssFile',
      message : 'Versioned CSS Files: If enabled, Roosevelt will create a CSS file which declares a CSS variable exposing your app\'s version number from package.json. Enable this option by supplying an object with the member variables fileName and varName.',
      default :  rooseveltDefaults.versionedCssFile.default || 'null'
    },
    {
      when: function (response) {
         return !thing.options.localhostOnly && response.standardInstall === false && response.sectionsToInstall.indexOf('Public folder parameters') > -1; // Run since they wanted the advanced install in this area
      },
      type    : 'input',
      name    : 'alwaysHostPublic',
      message : 'Always Host Public: By default in production mode Roosevelt will not expose the public folder. It\'s recommended instead that you host the public folder yourself directly through another web server, such as Apache or nginx. However, if you wish to override this behavior and have Roosevelt host your public folder even in production mode, then set this setting to true.',
      default :  rooseveltDefaults.alwaysHostPublic.default
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
      this.appName = answers.appName ? answers.appName :  this.options.appName || 'newProject';
      this.appNameForPackageJson = answers.appName ? answers.appName.replace(/^\.|_/, '').replace(/\s+/g, '-').replace(/(.{1,213})(.*)/, '$1').toLowerCase() : this.options.appName.replace(/^\.|_/, '').replace(/\s+/g, '-').replace(/(.{1,213})(.*)/, '$1').toLowerCase() || 'new-project'; // First remove dot or underscore from beginning, trim whitesapce and replace with dash for readability, chop off any characters past 214 in length, and then put all letters to lowercase. These are all requirements of package name for npm see: https://docs.npmjs.com/files/package.json#name
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
      this.supressClosingMessage = this.options.supressClosingMessage ? this.options.supressClosingMessage : false;
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
        appName: this.appNameForPackageJson,
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

  install: function() {
    this.npmInstall();
  },

  end: function() {
    testEnvironmentCheck = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'notTest';

    if (this.supressClosingMessage === false && testEnvironmentCheck !== 'test') {
      var whichHttpToShow;

      if (this.https == 'true' && this.httpsOnly === 'false') {
        whichHttpToShow = 'http(s)'
      }
      else if (this.https == 'true' && this.httpsOnly === 'true') {
        whichHttpToShow = 'https'
      }
      else {
        whichHttpToShow = 'http';
      }

      console.log();
      console.log('Thank you for installing Roosevelt!')
      console.log('To begin using your new Roosevelt app run `npm run dev` and navigate to ' + whichHttpToShow + '://localhost:' + this.port + '/')
    }
  }
});