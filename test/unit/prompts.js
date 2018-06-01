/* eslint-env mocha */

/**
 * Unit tests for prompts
 * @module test/unit/prompts
 */

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const defaults = require('../../generators/app/templates/defaults.json')
const fs = require('fs')

describe('Generator Prompts', function () {
  describe('App Name', function () {
    it('Sets app name to default app name', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withOptions({appName: defaults.appName})
        .then(function () {
          assert.JSONFileContent('package.json', {
            name: defaults.appName.toLowerCase().replace(/ /g, '-')
          })
        })
    })

    it('Sets app name to users choice', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({appName: 'my app without spaces'})
        .then(function () {
          assert.JSONFileContent('package.json', {
            name: 'my-app-without-spaces'
          })
        })
    })
  })

  describe('Directory Name', function () {
    it('Creates a new directory for the app with default settings', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withOptions({createDir: true})
        .then(function () {
          assert.equal(path.basename(process.cwd()), defaults.appName.toLowerCase().replace(/ /g, '-'))
        })
    })

    it('Creates a new directory with a custom name', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withOptions({createDir: true})
        .withPrompts({dirname: 'custom directory'})
        .then(function () {
          assert.equal(path.basename(process.cwd()), 'custom directory')
        })
    })
  })

  describe('HTTPS', function () {
    it('Disables HTTPS from user prompt', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({configMode: 'Customize'})
        .withPrompts({enableHTTPS: false})
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                enable: false
              }
            }
          })
        })
    })

    it('Enables HTTPS from user prompt', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({configMode: 'Customize'})
        .withPrompts({enableHTTPS: true})
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                enable: true
              }
            }
          })
        })
    })

    it('Uses HTTPS only from user prompt', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({configMode: 'Customize'})
        .withPrompts({enableHTTPS: true})
        .withPrompts({httpsOnly: true})
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                httpsOnly: true
              }
            }
          })
        })
    })

    it('Does not only use HTTPS from user prompt', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({configMode: 'Customize'})
        .withPrompts({enableHTTPS: true})
        .withPrompts({httpsOnly: false})
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                httpsOnly: false
              }
            }
          })
        })
    })
  })

  describe('MVC files and paths', function () {
    it('Should set the MVC files and path to default path', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          modelsPath: defaults.modelsPath,
          viewsPath: defaults.viewsPath,
          controllersPath: defaults.controllersrPath
        })
        .then(function () {
          assert.file(defaults.modelsPath + '/global.js')
          assert.file([
            defaults.viewsPath + '/404.html',
            defaults.viewsPath + '/homepage.html',
            defaults.viewsPath + '/robots.txt',
            defaults.viewsPath + '/layouts/main.html'
          ])
          assert.file([
            defaults.controllersPath + '/404.js',
            defaults.controllersPath + '/homepage.js',
            defaults.controllersPath + '/robots.txt.js'
          ])
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              modelsPath: defaults.modelsPath,
              viewsPath: defaults.viewsPath,
              controllersPath: defaults.controllersPath
            }
          })
        })
    })

    it('Should set the MVC files and path to user specific location', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          modelsPath: 'test/models',
          viewsPath: 'test/views',
          controllersPath: 'test/controllers'
        })
        .then(function () {
          assert.file('test/models/global.js')
          assert.file([
            'test/views/404.html',
            'test/views/homepage.html',
            'test/views/robots.txt',
            'test/views/layouts/main.html'
          ])
          assert.file([
            'test/controllers/404.js',
            'test/controllers/homepage.js',
            'test/controllers/robots.txt.js'
          ])
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              modelsPath: 'test/models',
              viewsPath: 'test/views',
              controllersPath: 'test/controllers'
            }
          })
        })
    })
  })

  describe('Templating Engine', function () {
    it('Should use the default view engine and templating extension', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          templatingEngine: true,
          templatingEngineName: defaults.templatingEngineName,
          templatingExtension: defaults.templatingExtension
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              viewEngine: [`${defaults.templatingExtension}: ${defaults.templatingEngineName}`]
            }
          })
        })
    })

    it('Should use a custom view engine and templating extension', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          templatingEngine: true,
          templatingEngineName: 'test',
          templatingExtension: 'html'
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              viewEngine: [`html: test`]
            }
          })
        })
    })

    it('Should use additional templating engines', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          templatingEngine: true,
          templatingEngineName: 'test',
          templatingExtension: 'html',
          additionalTemplatingEngines: true
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              viewEngine: [`html: test`]
            }
          })
        })
    })
  })

  describe('HTTP Ports', function () {
    it('Should set the HTTP Port to the default port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          portNumber: defaults.httpPort
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              port: 43711
            }
          })
        })
    })

    it('Should set the HTTP Port to a custom port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          portNumber: 'Custom',
          customHttpPort: 1234
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              port: 1234
            }
          })
        })
    })

    it('Should set the HTTP Port to a random port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          portNumber: 'Random'
        })
        .then(function () {
          var data = fs.readFileSync('package.json')
          var jsonData = JSON.parse(data)
          assert.strictEqual(typeof jsonData.rooseveltConfig.https.httpsPort, 'number')
        })
    })
  })

  describe('HTTPS Ports', function () {
    it('Should set the HTTPS Port to the default port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          httpsOnly: true,
          httpsPortNumber: defaults.https.httpsPort
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                httpsPort: 43733
              }
            }
          })
        })
    })

    it('Should set the HTTPS Port to a custom port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          httpsOnly: true,
          httpsPortNumber: 'Custom',
          customHttpsPort: 1234
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                httpsPort: 1234
              }
            }
          })
        })
    })

    it('Should set the HTTPS Port to a random port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          httpsOnly: true,
          httpsPortNumber: 'Random'
        })
        .then(function () {
          var data = fs.readFileSync('package.json')
          var jsonData = JSON.parse(data)
          assert.notEqual(jsonData.rooseveltConfig.https.httpsPort, jsonData.rooseveltConfig.port)
          assert.strictEqual(typeof jsonData.rooseveltConfig.https.httpsPort, 'number')
        })
    })
  })

  describe('SSL', function () {
    it('Should not create SSL certs if generate ssl is false', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          generateSSL: false
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                pfx: false
              }
            }
          })
          assert.noFile('certPem.pem')
          assert.noFile('privatePem.pem')
          assert.noFile('public.pem')
        })
    })

    it('Should create SSL certs if generate ssl is true', function () {
      this.timeout(10000)
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          generateSSL: true,
          commonName: 'www.google.com',
          countryName: 'US',
          pfx: '.pfx'
        })
        .then(function (done) {
          assert.file('certPem.pem')
          assert.file('privatePem.pem')
          assert.file('public.pem')
        })
    })
  })

  describe('Statics', function () {
    it('Should set the CSS preprocessor to LESS', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          cssCompiler: 'LESS'
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              css: {
                compiler: {
                  nodeModule: 'roosevelt-less'
                }
              }
            }
          })
          assert.file('statics/css/more.less')
          assert.file('statics/css/styles.less')
        })
    })

    it('Should set the CSS preprocessor to SASS', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          cssCompiler: 'SASS'
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              css: {
                compiler: {
                  nodeModule: 'roosevelt-sass'
                }
              }
            }
          })
          assert.file('statics/css/more.scss')
          assert.file('statics/css/styles.scss')
        })
    })

    it('Should set the CSS preprocessor to none', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          cssCompiler: 'none'
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              css: {
                compiler: 'none'
              }
            }
          })
          assert.file('statics/css/styles.css')
        })
    })

    it('Should set the JS compiler to UglifyJS', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          jsCompiler: 'UglifyJS'
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              js: {
                compiler: {
                  nodeModule: 'roosevelt-uglify',
                  params: {}
                }
              }
            }
          })
        })
    })

    it('Should set the JS compiler to Closure', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          jsCompiler: 'Closure Compiler'
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              js: {
                compiler: {
                  nodeModule: 'roosevelt-closure',
                  params: {
                    compilationLevel: 'ADVANCED'
                  }
                }
              }
            }
          })
        })
    })

    it('Should set the JS compiler to none', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          jsCompiler: 'none'
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              js: {
                compiler: 'none'
              }
            }
          })
        })
    })
  })
})
