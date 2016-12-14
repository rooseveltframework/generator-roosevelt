var assert = require('yeoman-assert'),
    helpers = require('yeoman-test'),
    fs = require('fs-extra'),
    path = require('path');

describe('mkroosevelt:mainGenerator', function () {

  it('Should name the project from the prompt', function () {
    return helpers.run(path.join(__dirname + '/generators/app'))
      .withPrompts({ appName: 'New Project',
        standardInstall: true })
      .then(function (dir) {
        assert.jsonFileContent(path.join(dir + '/package.json'), {name: 'New Project'} )
      });
  });

  describe('Normal Install', function () {
    it('Should configure package.json with default values', function () {
      return helpers.run(path.join(__dirname + '/generators/app'))
        .withPrompts({ standardInstall: true }) // Mock the prompt answers
        .then(function (dir) {
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { port: 43711} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { localhostOnly: true} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsPort: 43733} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { https: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsOnly: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { pfx: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { keyPath: null} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { passphrase: null} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { ca: null} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { requestCert: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { rejectUnauthorized: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { disableLogger: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { noMinify: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { multipart: { "multiples": true } } });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { maxLagPerRequest: 2000} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { shutdownTimeout: 30000} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsPath: "mvc/models"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsNodeModulesSymlink: "models"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewsPath: "mvc/views"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewEngine: "html: teddy"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { controllersPath: "mvc/controllers"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error404: "404.js"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error5xx: "5xx.js"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error503: "503.js"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { staticsRoot: "statics"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssPath: "css"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiler: { "nodeModule": "roosevelt-less", "params": { "compress": true } } } });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompilerWhitelist: null} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiledOutput: ".build/css"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsPath: "js"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiler: { "nodeModule": "roosevelt-closure", "params": { "compilation_level": "ADVANCED_OPTIMIZATIONS" } } } });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompilerWhitelist: null} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiledOutput: ".build/js"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { publicFolder: "public"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { favicon: "images/favicon.ico"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { symlinksToStatics: ["css: .build/css", "images", "js: .build/js"] } });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedStatics: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedCssFile: null} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { alwaysHostPublic: false} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserOptions: { extended: true } } });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserJsonOptions: {} } });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPath: "lib"} });
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPathNodeModulesSymlink: "lib"} });
        });
    });
  });

  describe('Advanced Install', function () {
    // App behavior parameters
    describe('App behavior parameters', function () {
      it('configures the port by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ port: 4321,
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { port: 4321} })
          });
      });

      it('configures the port by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ port: '4321' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { port: 4321} })
          });
      });

      it('configures localhostOnly by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ localhostOnly: "false",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { localhostOnly: false} })
          });
      });

      it('configures localhostOnly by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ localhostOnly: "false" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { localhostOnly: false} })
          });
      });

      it('configures disableLogger by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ disableLogger: "true",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { disableLogger: true} })
          });
      });

      it('configures disableLogger by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ disableLogger: "true" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { disableLogger: true} })
          });
      });

      it('configures noMinify by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ noMinify: "true",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { noMinify: true} })
          });
      });

      it('configures noMinify by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ noMinify: "true" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { noMinify: true} })
          });
      });

      it('configures multipart by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ multipart: '{"multiples": false}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { multipart: {"multiples": false}} })
          });
      });

      it('configures multipart by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ multipart: '{"multiples": false}' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { multipart: {"multiples": false}} })
          });
      });

      it('configures shutdownTimeout by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ shutdownTimeout: '10',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { shutdownTimeout: 10} })
          });
      });

      it('configures shutdownTimeout by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ shutdownTimeout: '10' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { shutdownTimeout: 10} })
          });
      });
    })

    // HTTPS
    describe('HTTPS Parameters', function () {
      it('configures HTTPS by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ https: "false",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { https: false} })
          });
      });

      it('configures HTTPS by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ https: "false" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { https: false} })
          });
      });

      it('configures HTTPS only by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ httpsOnly: "false",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsOnly: false} })
          });
      });

      it('configures HTTPS only by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ httpsOnly: "false" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsOnly: false} })
          });
      });

      it('configures HTTPS port by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ httpsPort: "1234",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsPort: 1234} })
          });
      });

      it('configures HTTPS port by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ httpsPort: "1234" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsPort: 1234} })
          });
      });

      it('configures pfx by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))

          .withPrompts({ pfx: "true",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { pfx: true} })
          });
      });

      it('configures pfx by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ pfx: "true" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { pfx: true} })
          });
      });

      it('configures keyPath by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ keyPath: "cert",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { keyPath: "cert"} })
          });
      });

      it('configures keyPath by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ keyPath: "cert" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { keyPath: "cert"} })
          });
      });

      it('configures passphrase by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ passphrase: "1234Test!",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { passphrase: "1234Test!"} })
          });
      });

      it('configures passphrase by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ passphrase: "1234Test!" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { passphrase: "1234Test!"} })
          });
      });

      it('configures ca by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ ca: "/test/directory",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { ca: "/test/directory"} })
          });
      });

      it('configures ca by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ ca: "/test/directory" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { ca: "/test/directory"} })
          });
      });

      it('configures requestCert by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ requestCert: "true",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { requestCert: true} })
          });
      });

      it('configures requestCert by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ requestCert: "true" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { requestCert: true} })
          });
      });

      it('configures rejectUnauthorized by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ rejectUnauthorized: "true",
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { rejectUnauthorized: true} })
          });
      });

      it('configures rejectUnauthorized by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ rejectUnauthorized: "true" })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { rejectUnauthorized: true} })
          });
      });

      it('configures bodyParserOptions by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ bodyParserOptions: '{"extended": false}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserOptions: { "extended": false } } })
          });
      });

      it('configures bodyParserOptions by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ bodyParserOptions: '{"extended": false}' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserOptions: { "extended": false } } })
          });
      });

      it('configures bodyParserJsonOptions by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ bodyParserJsonOptions: '{"inflate": true}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserJsonOptions: { "inflate": true } } })
          });
      });

      it('configures bodyParserJsonOptions by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ bodyParserJsonOptions: '{"inflate": true}' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserJsonOptions: { "inflate": true } } })
          });
      });
    })

    // MVC Parameters
    describe('MVC parameters', function () {
      it('configures modelsPath by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ modelsPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsPath: "/test/path" } })
          });
      });

      it('configures modelsPath by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ modelsPath: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsPath: "/test/path" } })
          });
      });

      it('configures modelsNodeModulesSymlink by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ modelsNodeModulesSymlink: 'testFolder',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsNodeModulesSymlink: "testFolder" } })
          });
      });

      it('configures modelsNodeModulesSymlink by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ modelsNodeModulesSymlink: 'testFolder' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsNodeModulesSymlink: "testFolder" } })
          });
      });

      it('configures viewsPath by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ viewsPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewsPath: "/test/path" } })
          });
      });

      it('configures viewsPath by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ viewsPath: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewsPath: "/test/path" } })
          });
      });

      it('configures viewEngine by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ viewEngine: 'css: teddyAlternate',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewEngine: "css: teddyAlternate" } })
          });
      });

      it('configures viewEngine by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ viewEngine: 'css: teddyAlternate' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewEngine: "css: teddyAlternate" } })
          });
      });

      it('configures controllersPath by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ controllersPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { controllersPath: "/test/path" } })
          });
      });

      it('configures controllersPath by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ controllersPath: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { controllersPath: "/test/path" } })
          });
      });
    })

    // Utility library parameters
    describe('Utility library parameters', function () {
      it('configures libPath by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ libPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPath: "/test/path" } })
          });
      });

      it('configures libPath by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ libPath: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPath: "/test/path" } })
          });
      });

      it('configures libPathNodeModulesSymlink by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ libPathNodeModulesSymlink: 'folderToSymlinkTo',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPathNodeModulesSymlink: "folderToSymlinkTo" } })
          });
      });

      it('configures libPathNodeModulesSymlink by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ libPathNodeModulesSymlink: 'folderToSymlinkTo' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPathNodeModulesSymlink: "folderToSymlinkTo" } })
          });
      });
    })

    // Error page parameter
    describe('Error page parameter', function () {
      it('configures error404 by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ error404: 'newErrorPage.html',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error404: "newErrorPage.html" } })
          });
      });

      it('configures error404 by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ error404: 'newErrorPage.html' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error404: "newErrorPage.html" } })
          });
      });

      it('configures error5xx by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ error5xx: 'newErrorPage.html',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error5xx: "newErrorPage.html" } })
          });
      });

      it('configures error5xx by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ error5xx: 'newErrorPage.html' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error5xx: "newErrorPage.html" } })
          });
      });

      it('configures error503 by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ error503: 'newErrorPage.html',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error503: "newErrorPage.html" } })
          });
      });

      it('configures error503 by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ error503: 'newErrorPage.html' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error503: "newErrorPage.html" } })
          });
      });
    })

    // Statics parameters
    describe('Statics parameters', function () {
      it('configures staticsRoot by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ staticsRoot: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { staticsRoot: "/test/path" } })
          });
      });

      it('configures staticsRoot by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ staticsRoot: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { staticsRoot: "/test/path" } })
          });
      });

      it('configures cssPath by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ cssPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssPath: "/test/path" } })
          });
      });

      it('configures cssPath by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ cssPath: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssPath: "/test/path" } })
          });
      });

      it('configures cssCompiler by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ cssCompiler: '{"nodeModule": "roosevelt-more", "params": { "compress": false } }',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiler: {"nodeModule": "roosevelt-more", "params": { "compress": false } } } })
          });
      });

      it('configures cssCompiler by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ cssCompiler: '{"nodeModule": "roosevelt-more", "params": { "compress": false } }' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiler: {"nodeModule": "roosevelt-more", "params": { "compress": false } } } })
          });
      });

      it('configures cssCompilerWhitelist by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ cssCompilerWhitelist: '["file1", "file2"]',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompilerWhitelist: ["file1", "file2"] } })
          });
      });

      it('configures cssCompilerWhitelist by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ cssCompilerWhitelist: '["file1", "file2"]' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompilerWhitelist: ["file1", "file2"] } })
          });
      });

      it('configures cssCompiledOutput by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ cssCompiledOutput: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiledOutput: '/test/path'} })
          });
      });

      it('configures cssCompiledOutput by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ cssCompiledOutput: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiledOutput:  '/test/path'} })
          });
      });

      it('configures jsPath by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ jsPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsPath: '/test/path'} })
          });
      });

      it('configures jsPath by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ jsPath: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsPath:  '/test/path'} })
          });
      });

      it('configures jsCompiler by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ jsCompiler: '{"nodeModule": "roosevelt-closure-more", "params": { "compilation_level": "simple_OPTIMIZATIONS" } }',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiler: {"nodeModule": "roosevelt-closure-more", "params": { "compilation_level": "simple_OPTIMIZATIONS" } } } })
          });
      });

      it('configures jsCompiler by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ jsCompiler: '{"nodeModule": "roosevelt-closure-more", "params": { "compilation_level": "simple_OPTIMIZATIONS" } }' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiler:  {"nodeModule": "roosevelt-closure-more", "params": { "compilation_level": "simple_OPTIMIZATIONS" } } } })
          });
      });

      it('configures jsCompilerWhitelist by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ jsCompilerWhitelist: '["file1Input:file1Output", "file2Input:file2Output"]',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompilerWhitelist: ["file1Input:file1Output", "file2Input:file2Output"] } })
          });
      });

      it('configures jsCompilerWhitelist by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ jsCompilerWhitelist: '["file1Input:file1Output", "file2Input:file2Output"]' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompilerWhitelist: ["file1Input:file1Output", "file2Input:file2Output"] } })
          });
      });

      it('configures jsCompiledOutput by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ jsCompiledOutput: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiledOutput: '/test/path' } })
          });
      });

      it('configures jsCompiledOutput by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ jsCompiledOutput: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiledOutput: '/test/path' } })
          });
      });
    })

    // Public folder parameters
    describe('Public folder parameters', function () {
      it('configures publicFolder by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ publicFolder: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { publicFolder: '/test/path' } })
          });
      });

      it('configures publicFolder by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ publicFolder: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { publicFolder: '/test/path' } })
          });
      });

      it('configures favicon by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ favicon: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { favicon: '/test/path' } })
          });
      });

      it('configures favicon by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ favicon: '/test/path' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { favicon: '/test/path' } })
          });
      });

      it('configures symlinksToStatics by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ symlinksToStatics: '["css: .build1/css", "images1", "js: .build1/js"]',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { symlinksToStatics: ["css: .build1/css", "images1", "js: .build1/js"] } })
          });
      });

      it('configures symlinksToStatics by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ symlinksToStatics: '["css: .build1/css", "images1", "js: .build1/js"]' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { symlinksToStatics: ["css: .build1/css", "images1", "js: .build1/js"] } })
          });
      });

      it('configures versionedStatics by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ versionedStatics: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedStatics: true } })
          });
      });

      it('configures versionedStatics by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ versionedStatics: 'true' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedStatics: true } })
          });
      });

      it('configures versionedCssFile by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ versionedCssFile: '{"fileName": "test", "varName": "_new"}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedCssFile: {fileName: "test", varName: "_new"} } })
          });
      });

      it('configures versionedCssFile by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ versionedCssFile: '{"fileName": "test", "varName": "_new"}' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedCssFile: {fileName: "test", varName: "_new"} } })
          });
      });

      it('configures alwaysHostPublic by prompt', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withPrompts({ alwaysHostPublic: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { alwaysHostPublic: true } })
          });
      });

      it('configures alwaysHostPublic by option flag', function () {
        return helpers.run(path.join(__dirname + '/generators/app'))
          .withOptions({ alwaysHostPublic: 'true' })
          .then(function (dir) {
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { alwaysHostPublic: true } })
          });
      });
    })
  })
});