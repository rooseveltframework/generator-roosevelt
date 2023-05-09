/* eslint-env mocha */

/**
 * Unit tests for prompts
 * @module test/unit/prompts
 */

const path = require('path')
const assert = require('assert')
const fs = require('fs')

describe('Generator Prompts', async function () {
  const yeomanTest = await import('yeoman-test')
  const helpers = new yeomanTest.YeomanTest()

  describe('Templating Engine', function () {
    it('Should use multiple view engines and templating extensions', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({ 
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
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      runner.assertJsonFileContent('rooseveltConfig.json', {
        viewEngine: ['html1: test1', 'html2: test2', 'html3: test3']
      })
    })
  })

  describe('HTTPS Ports', function () {
    it('Should set the HTTPS Port to a custom port', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Customize',
          enableHTTPS: true,
          httpsPortNumber: 'Custom',
          customHttpsPort: 1234
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      runner.assertJsonFileContent('rooseveltConfig.json', {
        https: {
          port: 1234
        }
      })
    })

    it('Should set the HTTPS Port to a random port', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Customize',
          enableHTTPS: true,
          httpsPortNumber: 'Random'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      const data = fs.readFileSync(path.join(runner.cwd, 'rooseveltConfig.json'))
      const jsonData = JSON.parse(data)
      assert.strictEqual(typeof jsonData.https.port, 'number')
    })
  })

  describe('Statics', function () {
    it('Should set the CSS preprocessor to LESS', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Customize',
          cssCompiler: 'Less'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      runner.assertJsonFileContent('rooseveltConfig.json', {
        css: {
          compiler: {
            module: 'less'
          }
        }
      })

      runner.assertFile('statics/css/styles.less')
    })

    it('Should set the CSS preprocessor to SASS', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Customize',
          cssCompiler: 'Sass'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      runner.assertJsonFileContent('rooseveltConfig.json', {
        css: {
          compiler: {
            module: 'sass'
          }
        }
      })

      runner.assertFile('statics/css/styles.scss')
    })

    it('Should set the CSS preprocessor to none', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Customize',
          cssCompiler: 'none'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      runner.assertJsonFileContent('rooseveltConfig.json', {
        css: {
          compiler: {
            enable: false,
            module: 'none'
          }
        }
      })

      runner.assertFile('statics/css/styles.css')
    })

    it('Should setup a default webpack config', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Customize',
          webpack: true
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      runner.assertJsonFileContent('rooseveltConfig.json', {
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
                        '${publicFolder}/js', // eslint-disable-line
                        '${appDir}', // eslint-disable-line
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

    it('Should disable webpack when set to off', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Customize',
          webpack: false
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      runner.assertJsonFileContent('rooseveltConfig.json', {
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
