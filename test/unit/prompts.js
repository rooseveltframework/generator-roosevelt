/* eslint-env mocha */

/**
 * Unit tests for prompts
 * @module test/unit/prompts
 */

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const fs = require('fs')

describe('Generator Prompts', function () {
  describe('Templating Engine', function () {
    it('Should use multiple view engines and templating extensions', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          templatingEngine: true,
          templatingEngineName1: 'test1',
          templatingExtension1: 'html1',
          additionalTemplatingEngines1: true,
          templatingEngineName2: 'test2',
          templatingExtension2: 'html2',
          additionalTemplatingEngines2: true,
          templatingEngineName3: 'test3',
          templatingExtension3: 'html3',
          additionalTemplatingEngines3: false
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              viewEngine: [`html1: test1`, 'html2: test2', 'html3: test3']
            }
          })
        })
    })
  })

  describe('HTTP Ports', function () {
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
    it.only('Should set the HTTPS Port to a custom port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          httpsPortNumber: 'Custom',
          customHttpsPort: 1234
        })
        .then(function () {
          assert.JSONFileContent('package.json', {
            rooseveltConfig: {
              https: {
                port: 1234
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
