var assert = require('yeoman-assert'),
    chaiAssert = require('chai').assert,
    helpers = require('yeoman-test'),
    JsonValidator = require('is-my-json-valid'),
    path = require('path'),
    fs = require('fs'),
    tempDir,
    mainGeneratorPathLocation = path.join(__dirname + '/generators/app');

describe('mkroosevelt:mainGenerator', function () {

  it('Should name the project from the prompt and use regex to format properly to create proper package.json name', function () {
    return helpers.run(mainGeneratorPathLocation)
      .withPrompts({ appName: 'New Project',
        standardInstall: true })
      .then(function (dir) {
        tempDir = dir;
        assert.jsonFileContent(path.join(dir + '/package.json'), {name: 'New Project'.replace(/^\.|_/, '').replace(/\s+/g, '-').replace(/(.{1,213})(.*)/, '$1').toLowerCase()} );;
      });
  });

  it('Should name the project from the prompt and display it in the homepage', function () {
    return helpers.run(mainGeneratorPathLocation)
      .withPrompts({ appName: 'New Project',
        standardInstall: true })
      .then(function (dir) {
        tempDir = dir;
        assert.fileContent(path.join(dir + '/mvc/models/global.js'), /appTitle: 'New Project'/);
      });
  });

  it.skip('Should install node modules', function () {
    this.timeout(300000); // Timeout in 5 minutes. If the npm install can't install the dpendecies in five minutes it's safe to assume something is wrong
    return helpers.run(mainGeneratorPathLocation)
      .withPrompts({
        standardInstall: true,
        skipInstall: false
      })
      .then(function (dir) {

      });
  });

  afterEach(function() {
    packageJson = JSON.parse(fs.readFileSync(tempDir + '/package.json', 'utf8'));
    // runs after each test in this block
    var validatePackageJson = JsonValidator({
      required: true,
      type: 'object',
      properties: {
        name: {
          required: true,
          type:'string'
        },
        description: {
          required: true,
          type:'string'
        },
        author: {
          required: true,
          type:'string'
        },
        version: {
          required: true,
          type:'string'
        },
        homepage: {
          required: true,
          type:'string'
        },
        license: {
          required: true,
          type:'string'
        },
        main: {
          required: true,
          type:'string'
        },
        readmeFilename: {
          required: true,
          type:'string'
        },
        engines: {
          required: true,
          type:'object',
          properties: {
            node: {
              required: true,
              type: 'string'
            }
          }
        },
        engineStrict: {
          required: true,
          type:'boolean'
        },
        dependencies: {
          required: true,
          type:'object',
          properties: {
            roosevelt: {
              required: true,
              type: 'string'
            },
            teddy: {
              required: true,
              type: 'string'
            },
            'roosevelt-less': {
              required: true,
              type: 'string'
            },
            roosevelt: {
              required: true,
              type: 'string'
            },
            'roosevelt-closure': {
              required: true,
              type: 'string'
            }
          }
        },
        devDependencies: {
          required: true,
          type:'object',
          properties: {
            jshint: {
              required: true,
              type: 'string'
            },
            supervisor: {
              required: true,
              type: 'string'
            }
          }
        },
        rooseveltConfig: {
          required: true,
          type:'object',
          properties: {
            port: {
              required: true,
              type: 'number'
            },
            localhostOnly: {
              required: true,
              type: 'boolean'
            },
            httpsPort: {
              required: true,
              type: 'number'
            },
            https: {
              required: true,
              type: 'boolean'
            },
            httpsOnly: {
              required: true,
              type: 'boolean'
            },
            pfx: {
              required: true,
              type: 'boolean'
            },
            keyPath: {
              required: true,
              type: ['null', 'string']
            },
            passphrase: {
              required: true,
              type: ['null', 'string']
            },
            ca: {
              required: true,
              type: ['null', 'string']
            },
            requestCert: {
              required: true,
              type: 'boolean'
            },
            rejectUnauthorized: {
              required: true,
              type: 'boolean'
            },
            disableLogger: {
              required: true,
              type: 'boolean'
            },
            noMinify: {
              required: true,
              type: 'boolean'
            },
            multipart: {
              required: true,
              type: 'object',
              properties: {
                multiples: {
                  required: true,
                  type: 'boolean'
                },
              }
            },
            maxLagPerRequest: {
              required: true,
              type: 'number'
            },
            shutdownTimeout: {
              required: true,
              type: 'number'
            },
            modelsPath: {
              required: true,
              type: 'string'
            },
            modelsNodeModulesSymlink: {
              required: true,
              type: 'string'
            },
            viewsPath: {
              required: true,
              type: 'string'
            },
            viewEngine: {
              required: true,
              type: 'string'
            },
            controllersPath: {
              required: true,
              type: 'string'
            },
            error404: {
              required: true,
              type: 'string'
            },
            error5xx: {
              required: true,
              type: 'string'
            },
            error503: {
              required: true,
              type: 'string'
            },
            staticsRoot: {
              required: true,
              type: 'string'
            },
            cssPath: {
              required: true,
              type: 'string'
            },
            cssCompiler: {
              required: true,
              type: 'object',
              properties: {
                nodeModule: {
                  required: true,
                  type: 'string'
                },
                params: {
                  required: true,
                  type: 'object',
                  properties: {
                    compress: {
                      required: true,
                      type: 'boolean'
                    },
                  }
                },
              }
            },
            cssCompilerWhitelist: {
              required: true,
              type: ['null', 'array']
            },
            cssCompiledOutput: {
              required: true,
              type: 'string'
            },
            jsPath: {
              required: true,
              type: 'string'
            },
            jsCompiler: {
              required: true,
              type: 'object',
              properties: {
                nodeModule: {
                  required: true,
                  type: 'string'
                },
                params: {
                  required: true,
                  type: 'object',
                  properties: {
                    'compilation_level': {
                      required: true,
                      type: 'string'
                    },
                  }
                },
              }
            },
            jsCompilerWhitelist: {
              required: true,
              type: ['null', 'array']
            },
            jsCompiledOutput: {
              required: true,
              type: 'string'
            },
            publicFolder: {
              required: true,
              type: 'string'
            },
            favicon: {
              required: true,
              type: 'string'
            },
            symlinksToStatics: {
              required: true,
              type: 'array'
            },
            versionedStatics: {
              required: true,
              type: 'boolean'
            },
            versionedCssFile: {
              required: true,
              type: ['null', 'object'],
              properties: {
                fileName: {
                  required: true,
                  type: 'string'
                },
                varName: {
                  required: true,
                  type: 'string'
                }
              }
            },
            alwaysHostPublic: {
              required: true,
              type: 'boolean'
            }
          }
        },
        jshintConfig: {
          required: true,
          type:'object',
          properties: {
            camelcase: {
              required: true,
              type: 'boolean'
            },
            curly: {
              required: true,
              type: 'boolean'
            },
            devel: {
              required: true,
              type: 'boolean'
            },
            indent: {
              required: true,
              type: 'number'
            },
            node: {
              required: true,
              type: 'boolean'
            }
          }
        },
        private: {
          required: true,
          type:'boolean'
        },
        repository: {
          required: true,
          type:'object',
          properties: {
            'private-repo': {
              required: true,
              type: 'string'
            }
          }
        },
        scripts: {
          required: true,
          type:'object',
          properties: {
            start: {
              required: true,
              type: 'string'
            },
            prod: {
              required: true,
              type: 'string'
            },
            dev: {
              required: true,
              type: 'string'
            },
            test: {
              required: true,
              type: 'string'
            }
          }
        }
      },
      verbose: true
    });

    chaiAssert.equal(validatePackageJson(packageJson), true, JSON.stringify(validatePackageJson.errors));
  });

  it('Template folder should contain all sample app files', function () {
    assert.file(path.join(__dirname + '/generators/app/templates' + '/.gitignore'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/controllers/404.js'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/controllers/homepage.js'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/controllers/robots.txt.js'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/models/global.js'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/views/layouts/main.html'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/views/404.html'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/views/homepage.html'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/mvc/views/robots.txt'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/statics/css/more.less'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/statics/css/styles.less'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/statics/images/teddy.jpg'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/statics/images/favicon.ico'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/statics/js/main.js'));
    assert.file(path.join(__dirname + '/generators/app/templates' + '/package.json'));
  });

  it('Should copy all files on the install', function () {
    return helpers.run(mainGeneratorPathLocation)
      .withPrompts({ standardInstall: true })
      .then(function (dir) {
        tempDir = dir;
        assert.file(path.join(dir + '/.gitignore'));
        assert.file(path.join(dir + '/mvc/controllers/404.js'));
        assert.file(path.join(dir + '/mvc/controllers/homepage.js'));
        assert.file(path.join(dir + '/mvc/controllers/robots.txt.js'));
        assert.file(path.join(dir + '/mvc/models/global.js'));
        assert.file(path.join(dir + '/mvc/views/layouts/main.html'));
        assert.file(path.join(dir + '/mvc/views/404.html'));
        assert.file(path.join(dir + '/mvc/views/homepage.html'));
        assert.file(path.join(dir + '/mvc/views/robots.txt'));
        assert.file(path.join(dir + '/statics/css/more.less'));
        assert.file(path.join(dir + '/statics/css/styles.less'));
        assert.file(path.join(dir + '/statics/images/teddy.jpg'));
        assert.file(path.join(dir + '/statics/images/favicon.ico'));
        assert.file(path.join(dir + '/statics/js/main.js'));
        assert.file(path.join(dir + '/package.json'));
      });
  });

  describe('Normal Install package.json Configuring', function () {
    it('Should configure package.json with default values', function () {
      return helpers.run(mainGeneratorPathLocation)
        .withPrompts({ standardInstall: true }) // Mock the prompt answers
        .then(function (dir) {
          tempDir = dir;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { port: 43711} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { localhostOnly: true} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsPort: 43733} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { https: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsOnly: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { pfx: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { keyPath: null} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { passphrase: null} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { ca: null} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { requestCert: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { rejectUnauthorized: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { disableLogger: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { noMinify: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { multipart: { 'multiples': true } } });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { maxLagPerRequest: 2000} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { shutdownTimeout: 30000} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsPath: 'mvc/models'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsNodeModulesSymlink: 'models'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewsPath: 'mvc/views'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewEngine: 'html: teddy'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { controllersPath: 'mvc/controllers'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error404: '404.js'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error5xx: '5xx.js'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error503: '503.js'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { staticsRoot: 'statics'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssPath: 'css'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiler: { 'nodeModule': 'roosevelt-less', 'params': { 'compress': true } } } });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompilerWhitelist: null} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiledOutput: '.build/css'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsPath: 'js'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiler: { 'nodeModule': 'roosevelt-closure', 'params': { 'compilation_level': 'ADVANCED_OPTIMIZATIONS' } } } });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompilerWhitelist: null} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiledOutput: '.build/js'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { publicFolder: 'public'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { favicon: 'images/favicon.ico'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { symlinksToStatics: ['css: .build/css', 'images', 'js: .build/js'] } });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedStatics: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedCssFile: null} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { alwaysHostPublic: false} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserOptions: { extended: true } } });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserJsonOptions: {} } });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPath: 'lib'} });;
          assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPathNodeModulesSymlink: 'lib'} });;
        });
    });
  });

  describe('Advanced Install package.json Configuring', function () {
    // App behavior parameters
    describe('App behavior parameters', function () {
      it.skip('configures the port by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ port: 4321,
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { port: 4321} });
          });
      });

      it('configures the port by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ port: '4321' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { port: 4321} });
          });
      });

      it.skip('configures localhostOnly by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ localhostOnly: 'false',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { localhostOnly: false} });
          });
      });

      it('configures localhostOnly by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ localhostOnly: 'false' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { localhostOnly: false} });
          });
      });

      it.skip('configures disableLogger by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ disableLogger: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { disableLogger: true} });
          });
      });

      it('configures disableLogger by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ disableLogger: 'true' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { disableLogger: true} });
          });
      });

      it.skip('configures noMinify by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ noMinify: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { noMinify: true} });
          });
      });

      it('configures noMinify by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ noMinify: 'true' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { noMinify: true} });
          });
      });

      it.skip('configures multipart by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ multipart: '{"multiples": false}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { multipart: {'multiples': false}} });
          });
      });

      it('configures multipart by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ multipart: '{"multiples": false}' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { multipart: {'multiples': false}} });
          });
      });

      it.skip('configures shutdownTimeout by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ shutdownTimeout: '10',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { shutdownTimeout: 10} });
          });
      });

      it('configures shutdownTimeout by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ shutdownTimeout: '10' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { shutdownTimeout: 10} });
          });
      });
    });

    // HTTPS
    describe('HTTPS Parameters', function () {
      it.skip('configures HTTPS by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ https: 'false',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { https: false} });
          });
      });

      it('configures HTTPS by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ https: 'false' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { https: false} });
          });
      });

      it.skip('configures HTTPS only by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ httpsOnly: 'false',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsOnly: false} });
          });
      });

      it('configures HTTPS only by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ httpsOnly: 'false' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsOnly: false} });
          });
      });

      it.skip('configures HTTPS port by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ httpsPort: '1234',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsPort: 1234} });
          });
      });

      it('configures HTTPS port by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ httpsPort: '1234' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { httpsPort: 1234} });
          });
      });

      it.skip('configures pfx by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)

          .withPrompts({ pfx: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { pfx: true} });
          });
      });

      it('configures pfx by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ pfx: 'true' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { pfx: true} });
          });
      });

      it.skip('configures keyPath by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ keyPath: 'cert',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { keyPath: 'cert'} });
          });
      });

      it('configures keyPath by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ keyPath: 'cert' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { keyPath: 'cert'} });
          });
      });

      it.skip('configures passphrase by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ passphrase: '1234Test!',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { passphrase: '1234Test!'} });
          });
      });

      it('configures passphrase by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ passphrase: '1234Test!' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { passphrase: '1234Test!'} });
          });
      });

      it.skip('configures ca by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ ca: '/test/directory',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { ca: '/test/directory'} });
          });
      });

      it('configures ca by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ ca: '/test/directory' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { ca: '/test/directory'} });
          });
      });

      it.skip('configures requestCert by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ requestCert: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { requestCert: true} });
          });
      });

      it('configures requestCert by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ requestCert: 'true' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { requestCert: true} });
          });
      });

      it.skip('configures rejectUnauthorized by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ rejectUnauthorized: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { rejectUnauthorized: true} });
          });
      });

      it('configures rejectUnauthorized by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ rejectUnauthorized: 'true' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { rejectUnauthorized: true} });
          });
      });

      it.skip('configures bodyParserOptions by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ bodyParserOptions: '{"extended": false}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserOptions: { 'extended': false } } });
          });
      });

      it('configures bodyParserOptions by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ bodyParserOptions: '{"extended": false}' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserOptions: { 'extended': false } } });
          });
      });

      it.skip('configures bodyParserJsonOptions by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ bodyParserJsonOptions: '{"inflate": true}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserJsonOptions: { 'inflate': true } } });
          });
      });

      it('configures bodyParserJsonOptions by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ bodyParserJsonOptions: '{"inflate": true}' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { bodyParserJsonOptions: { 'inflate': true } } });
          });
      });
    });

    // MVC Parameters
    describe('MVC parameters', function () {
      it.skip('configures modelsPath by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ modelsPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsPath: '/test/path' } });
          });
      });

      it('configures modelsPath by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ modelsPath: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsPath: '/test/path' } });
          });
      });

      it.skip('configures modelsNodeModulesSymlink by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ modelsNodeModulesSymlink: 'testFolder',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsNodeModulesSymlink: 'testFolder' } });
          });
      });

      it('configures modelsNodeModulesSymlink by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ modelsNodeModulesSymlink: 'testFolder' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { modelsNodeModulesSymlink: 'testFolder' } });
          });
      });

      it.skip('configures viewsPath by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ viewsPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewsPath: '/test/path' } });
          });
      });

      it('configures viewsPath by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ viewsPath: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewsPath: '/test/path' } });
          });
      });

      it.skip('configures viewEngine by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ viewEngine: 'css: teddyAlternate',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewEngine: 'css: teddyAlternate' } });
          });
      });

      it('configures viewEngine by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ viewEngine: 'css: teddyAlternate' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { viewEngine: 'css: teddyAlternate' } });
          });
      });

      it.skip('configures controllersPath by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ controllersPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { controllersPath: '/test/path' } });
          });
      });

      it('configures controllersPath by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ controllersPath: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { controllersPath: '/test/path' } });
          });
      });
    });

    // Utility library parameters
    describe('Utility library parameters', function () {
      it.skip('configures libPath by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ libPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPath: '/test/path' } });
          });
      });

      it('configures libPath by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ libPath: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPath: '/test/path' } });
          });
      });

      it.skip('configures libPathNodeModulesSymlink by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ libPathNodeModulesSymlink: 'folderToSymlinkTo',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPathNodeModulesSymlink: 'folderToSymlinkTo' } });
          });
      });

      it('configures libPathNodeModulesSymlink by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ libPathNodeModulesSymlink: 'folderToSymlinkTo' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { libPathNodeModulesSymlink: 'folderToSymlinkTo' } });
          });
      });
    });

    // Error page parameter
    describe('Error page parameter', function () {
      it.skip('configures error404 by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ error404: 'newErrorPage.html',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error404: 'newErrorPage.html' } });
          });
      });

      it('configures error404 by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ error404: 'newErrorPage.html' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error404: 'newErrorPage.html' } });
          });
      });

      it.skip('configures error5xx by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ error5xx: 'newErrorPage.html',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error5xx: 'newErrorPage.html' } });
          });
      });

      it('configures error5xx by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ error5xx: 'newErrorPage.html' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error5xx: 'newErrorPage.html' } });
          });
      });

      it.skip('configures error503 by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ error503: 'newErrorPage.html',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error503: 'newErrorPage.html' } });
          });
      });

      it('configures error503 by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ error503: 'newErrorPage.html' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { error503: 'newErrorPage.html' } });
          });
      });
    });

    // Statics parameters
    describe('Statics parameters', function () {
      it.skip('configures staticsRoot by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ staticsRoot: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { staticsRoot: '/test/path' } });
          });
      });

      it('configures staticsRoot by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ staticsRoot: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { staticsRoot: '/test/path' } });
          });
      });

      it.skip('configures cssPath by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ cssPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssPath: '/test/path' } });
          });
      });

      it('configures cssPath by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ cssPath: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssPath: '/test/path' } });
          });
      });

      it.skip('configures cssCompiler by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ cssCompiler: '{"nodeModule": "roosevelt-more", "params": { "compress": false } }',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiler: {'nodeModule': 'roosevelt-more', 'params': { 'compress': false } } } });
          });
      });

      it('configures cssCompiler by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ cssCompiler: '{"nodeModule": "roosevelt-more", "params": { "compress": false } }' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiler: {'nodeModule': 'roosevelt-more', 'params': { 'compress': false } } } });
          });
      });

      it.skip('configures cssCompilerWhitelist by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ cssCompilerWhitelist: '["file1", "file2"]',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompilerWhitelist: ['file1', 'file2'] } });
          });
      });

      it('configures cssCompilerWhitelist by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ cssCompilerWhitelist: '["file1", "file2"]' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompilerWhitelist: ['file1', 'file2'] } });
          });
      });

      it.skip('configures cssCompiledOutput by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ cssCompiledOutput: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiledOutput: '/test/path'} });
          });
      });

      it('configures cssCompiledOutput by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ cssCompiledOutput: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { cssCompiledOutput:  '/test/path'} });
          });
      });

      it.skip('configures jsPath by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ jsPath: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsPath: '/test/path'} });
          });
      });

      it('configures jsPath by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ jsPath: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsPath:  '/test/path'} });
          });
      });

      it.skip('configures jsCompiler by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ jsCompiler: '{"nodeModule": "roosevelt-closure-more", "params": { "compilation_level": "simple_OPTIMIZATIONS" } }',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiler: {'nodeModule': 'roosevelt-closure-more', 'params': { 'compilation_level': 'simple_OPTIMIZATIONS' } } } });
          });
      });

      it('configures jsCompiler by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ jsCompiler: '{"nodeModule": "roosevelt-closure-more", "params": { "compilation_level": "simple_OPTIMIZATIONS" } }' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiler: {'nodeModule': 'roosevelt-closure-more', 'params': { 'compilation_level': 'simple_OPTIMIZATIONS' } } } });
          });
      });

      it.skip('configures jsCompilerWhitelist by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ jsCompilerWhitelist: '["file1Input:file1Output", "file2Input:file2Output"]',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompilerWhitelist: ['file1Input:file1Output', 'file2Input:file2Output'] } });
          });
      });

      it('configures jsCompilerWhitelist by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ jsCompilerWhitelist: '["file1Input:file1Output", "file2Input:file2Output"]' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompilerWhitelist: ['file1Input:file1Output', 'file2Input:file2Output'] } });
          });
      });

      it.skip('configures jsCompiledOutput by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ jsCompiledOutput: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiledOutput: '/test/path' } });
          });
      });

      it('configures jsCompiledOutput by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ jsCompiledOutput: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { jsCompiledOutput: '/test/path' } });
          });
      });
    });

    // Public folder parameters
    describe('Public folder parameters', function () {
      it.skip('configures publicFolder by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ publicFolder: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { publicFolder: '/test/path' } });
          });
      });

      it('configures publicFolder by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ publicFolder: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { publicFolder: '/test/path' } });
          });
      });

      it.skip('configures favicon by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ favicon: '/test/path',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { favicon: '/test/path' } });
          });
      });

      it('configures favicon by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ favicon: '/test/path' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { favicon: '/test/path' } });
          });
      });

      it.skip('configures symlinksToStatics by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ symlinksToStatics: '["css: .build1/css", "images1", "js: .build1/js"]',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { symlinksToStatics: ['css: .build1/css', 'images1', 'js: .build1/js'] } });
          });
      });

      it('configures symlinksToStatics by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ symlinksToStatics: '["css: .build1/css", "images1", "js: .build1/js"]' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { symlinksToStatics: ['css: .build1/css', 'images1', 'js: .build1/js'] } });
          });
      });

      it.skip('configures versionedStatics by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ versionedStatics: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedStatics: true } });
          });
      });

      it('configures versionedStatics by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ versionedStatics: 'true' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedStatics: true } });
          });
      });

      it.skip('configures versionedCssFile by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ versionedCssFile: '{"fileName": "test", "varName": "_new"}',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedCssFile: {fileName: 'test', varName: '_new'} } });
          });
      });

      it('configures versionedCssFile by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ versionedCssFile: '{"fileName": "test", "varName": "_new"}' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { versionedCssFile: {fileName: 'test', varName: '_new'} } });
          });
      });

      it.skip('configures alwaysHostPublic by prompt', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withPrompts({ alwaysHostPublic: 'true',
            standardInstall: false,
            sectionsToInstall : [ 'App behavior parameters', 'HTTPS parameters', 'MVC parameters', 'Utility library parameters', 'Error page parameters', 'Statics parameters', 'Public folder parameters'] }) // Mock the prompt answers
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { alwaysHostPublic: true } });;
          });
      });

      it('configures alwaysHostPublic by option flag', function () {
        return helpers.run(mainGeneratorPathLocation)
          .withOptions({ alwaysHostPublic: 'true' })
          .then(function (dir) {
            tempDir = dir;
            assert.jsonFileContent(path.join(dir + '/package.json'), {rooseveltConfig: { alwaysHostPublic: true } });
          });
      });
    });
  });
});