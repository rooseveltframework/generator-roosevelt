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
          assert.JSONFileContent('rooseveltConfig.json', {
            viewEngine: ['html1: test1', 'html2: test2', 'html3: test3']
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
          assert.JSONFileContent('rooseveltConfig.json', {
            port: 1234
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
          const data = fs.readFileSync('rooseveltConfig.json')
          const jsonData = JSON.parse(data)
          assert.strictEqual(typeof jsonData.port, 'number')
        })
    })
  })

  describe('HTTPS Ports', function () {
    it('Should set the HTTPS Port to a custom port', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          httpsPortNumber: 'Custom',
          customHttpsPort: 1234
        })
        .then(function () {
          assert.JSONFileContent('rooseveltConfig.json', {
            https: {
              port: 1234
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
          const data = fs.readFileSync('rooseveltConfig.json')
          const jsonData = JSON.parse(data)
          assert.notEqual(jsonData.https.port, jsonData.port)
          assert.strictEqual(typeof jsonData.https.port, 'number')
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
          pfx: 'pfx'
        })
        .then(function (done) {
          assert.file('certPem.pem')
          assert.file('privatePem.pem')
          assert.file('public.pem')
        })
    })

    it('Should create p12 pfx certs', function () {
      this.timeout(10000)
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          generateSSL: true,
          commonName: 'www.google.com',
          countryName: 'US',
          pfx: 'pfx',
          pfxPath: './cert.p12'
        })
        .then(function (done) {
          const data = fs.readFileSync('rooseveltConfig.json')
          const jsonData = JSON.parse(data)
          assert.strictEqual(typeof jsonData.https.authInfoPath, 'object')
          assert.JSONFileContent('rooseveltConfig.json', {
            https: {
              authInfoPath: {
                p12: {
                  p12Path: './cert.p12'
                }
              }
            }
          })
        })
    })

    it('Should create .cert cert files', function () {
      this.timeout(10000)
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          enableHTTPS: true,
          generateSSL: true,
          commonName: 'www.google.com',
          countryName: 'US',
          pfx: 'cert',
          certPath: './cert.pem',
          keyPath: './key.pem'
        })
        .then(function (done) {
          assert.JSONFileContent('rooseveltConfig.json', {
            https: {
              authInfoPath: {
                authCertAndKey: {
                  cert: './cert.pem',
                  key: './key.pem'
                }
              }
            }
          })
        })
    })
  })

  describe('Statics', function () {
    it('Should set the CSS preprocessor to LESS', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          cssCompiler: 'Less'
        })
        .then(function () {
          assert.JSONFileContent('rooseveltConfig.json', {
            css: {
              compiler: {
                module: 'less'
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
          cssCompiler: 'Sass'
        })
        .then(function () {
          assert.JSONFileContent('rooseveltConfig.json', {
            css: {
              compiler: {
                module: 'node-sass'
              }
            }
          })
          assert.file('statics/css/more.scss')
          assert.file('statics/css/styles.scss')
        })
    })

    it('Should set the CSS preprocessor to Stylus', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          cssCompiler: 'Stylus'
        })
        .then(function () {
          assert.JSONFileContent('rooseveltConfig.json', {
            css: {
              compiler: {
                module: 'stylus'
              }
            }
          })
          assert.file('statics/css/more.styl')
          assert.file('statics/css/styles.styl')
        })
    })

    it('Should set the CSS preprocessor to none', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          cssCompiler: 'none'
        })
        .then(function () {
          assert.JSONFileContent('rooseveltConfig.json', {
            css: {
              compiler: {
                enable: false,
                module: 'none'
              }
            }
          })
          assert.file('statics/css/styles.css')
        })
    })

    it('Should setup a default webpack config', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          webpack: true
        })
        .then(function () {
          assert.JSONFileContent('rooseveltConfig.json', {
            js: {
              webpack: {
                enable: true,
                bundles: [
                  {
                    config: {
                      entry: '${js.sourcePath}/main.js', // eslint-disable-line
                      output: {
                        path: '${publicFolder}/js' // eslint-disable-line
                      },
                      resolve: {
                        modules: [
                          '${js.sourcePath}', // eslint-disable-line
                          'node_modules'
                        ]
                      }
                    }
                  }
                ]
              }
            }
          })
        })
    })

    it('Should disable webpack when set to off', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({
          configMode: 'Customize',
          webpack: false
        })
        .then(function () {
          assert.JSONFileContent('rooseveltConfig.json', {
            js: {
              webpack: {
                enable: false,
                bundles: []
              }
            }
          })
        })
    })
  })
})
