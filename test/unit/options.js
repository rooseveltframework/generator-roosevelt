/* eslint-env mocha */
const yeomanTest = require('yeoman-test')
const helpers = new yeomanTest.YeomanTest()
const path = require('path')
const assert = require('assert')
const defaults = require('../../generators/app/templates/defaults.json')
const defaultFiles = [
  '.gitignore',
  '.stylelintrc.json',
  'README.md',
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
  'statics/css/styles.scss',
  'statics/images/favicon.ico',
  'statics/images/teddy.jpg',
  'statics/js/main.js'
]

describe('generator options', async function () {
  let runner

  describe('should automatically do a standard install with -s', function () {
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
          sass: defaults.Sass.dependencies.sass,
          teddy: defaults.teddy.teddy
        }
      })
    })

    it('generated correct controller file(s)', function () {
      runner.assertFileContent('mvc/controllers/homepage.js', /model\.content\.pageTitle = 'Homepage'/)
      runner.assertFileContent('mvc/controllers/404.js', /res\.render\('404', model\)/)
    })

    it('generated correct model file(s)', function () {
      runner.assertFileContent('mvc/models/global.js', /{content\.appTitle}/)
    })

    it('generated correct view file(s)', function () {
      runner.assertFileContent('mvc/views/homepage.html', /{content\.hello}/)
      runner.assertFileContent('mvc/views/404.html', /{server.appVersion}/)
    })
  })
})
