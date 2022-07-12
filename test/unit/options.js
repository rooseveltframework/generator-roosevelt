/* eslint-env mocha */

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const defaults = require('../../generators/app/templates/defaults.json')
const defaultFiles = [
  '.gitignore',
  '.stylelintrc.json',
  'app.js',
  'package.json',
  'rooseveltConfig.json',
  'mvc/controllers/404.js',
  'mvc/controllers/homepage.js',
  'mvc/controllers/robots.txt.js',
  'mvc/models/global.js',
  'mvc/views/404.html',
  'mvc/views/homepage.html',
  'mvc/views/robots.txt',
  'mvc/views/layouts/main.html',
  'statics/css/more.less',
  'statics/css/styles.less',
  'statics/images/favicon.ico',
  'statics/images/teddy.jpg',
  'statics/js/main.js'
]

describe('generator options', function () {
  let runner

  describe('Should automatically do a standard install with -s', function () {
    before(async function () {
      runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withOptions({
          'standard-install': true
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += `/${defaults.appName.toLowerCase().replace(/ /g, '-')}`
    })

    after(() => {
      if (runner) {
        runner.restore()
      }
    })

    it('created and navigated to default app folder', function () {
      assert.strictEqual(path.basename(runner.cwd), defaults.appName.toLowerCase().replace(/ /g, '-'))
    })

    it('generated default app files', function () {
      runner.assertFile(defaultFiles)
    })

    it('filled package.json with correct contents', function () {
      runner.assertJsonFileContent('package.json', {
        name: defaults.appName.toLowerCase().replace(/ /g, '-'),
        dependencies: {
          roosevelt: defaults.dependencies.roosevelt,
          less: defaults.Less.dependencies.less,
          teddy: defaults.teddy.teddy
        }
      })
    })

    it('generated correct controller file(s)', function () {
      runner.assertFileContent('mvc/controllers/homepage.js', /model\.content\.pageTitle = 'Homepage'/)
      runner.assertFileContent('mvc/controllers/404.js', /model\.server\.appVersion/)
    })

    it('generated correct model file(s)', function () {
      runner.assertFileContent('mvc/models/global.js', /{content\.appTitle}/)
    })

    it('generated correct view file(s)', function () {
      runner.assertFileContent('mvc/views/homepage.html', /{content\.hello}/)
      runner.assertFileContent('mvc/views/404.html', /{server.appVersion}/)
    })

    it('Should automatically run the config auditor', async function () {
      let auditPassing = false
      const logData = []

      // grab the config auditor
      const auditor = require('../../node_modules/roosevelt/lib/scripts/configAuditor')

      // store a reference to the console
      const oldConsole = console

      // overload the console to prevent log spamming and to also store an array of logs that happen
      // standard hates this
      console = { // eslint-disable-line
        log: log => {
          logData.push(log)
        }
      }

      // run the auditor
      auditor.audit(runner.cwd)

      // restore the console
      // standard hates this
      console = oldConsole // eslint-disable-line

      // examine the log data and skim for an indication that the audit passed
      for (const log of logData) {
        if (log.includes('no errors found')) {
          auditPassing = true
        }
      }

      assert.strictEqual(auditPassing, true, 'rooseveltConfig audit completed with no errors found')
    })
  })
})
