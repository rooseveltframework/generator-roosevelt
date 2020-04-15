/* eslint-env mocha */

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const execSync = require('child_process').execSync
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
  describe('Should automatically do a standard install with -s', function () {
    beforeEach(function () {
      return helpers.run(path.join(__dirname, '../../generators/app')).withOptions({
        'standard-install': true
      })
    })

    it('created and navigated to default app folder', function () {
      assert.strictEqual(path.basename(process.cwd()), defaults.appName.toLowerCase().replace(/ /g, '-'))
    })

    it('generated default app files', function () {
      assert.file(defaultFiles)
    })

    it('filled package.json with correct contents', function () {
      assert.JSONFileContent('package.json', {
        name: defaults.appName.toLowerCase().replace(/ /g, '-'),
        dependencies: {
          roosevelt: defaults.dependencies.roosevelt,
          less: defaults.Less.dependencies.less,
          teddy: defaults.teddy.teddy
        }
      })
    })

    it('filled rooseveltConfig.json with correct contents', function () {
      assert.JSONFileContent('rooseveltConfig.json', {
        port: defaults.httpPort,
        https: defaults.https,
        modelsPath: defaults.modelsPath,
        viewsPath: defaults.viewsPath,
        viewEngine: defaults.viewEngine,
        controllersPath: defaults.controllersPath,
        css: {
          compiler: defaults.Less.config
        },
        js: {
          webpack: {
            bundles: defaults.webpackBundle
          }
        },
        symlinks: [
          {
            source: '${staticsRoot}/images', // eslint-disable-line
            dest: '${publicFolder}/images' // eslint-disable-line
          }
        ]
      })
    })

    it('generated correct controller file(s)', function () {
      assert.fileContent('mvc/controllers/homepage.js', /{content\.appTitle}/)
      assert.fileContent('mvc/controllers/404.js', /{content\.appTitle}/)
    })

    it('generated correct model file(s)', function () {
      assert.fileContent('mvc/models/global.js', /{content\.appTitle}/)
    })

    it('generated correct view file(s)', function () {
      assert.fileContent('mvc/views/homepage.html', /{content\.hello}/)
      assert.fileContent('mvc/views/404.html', /{appVersion}/)
    })
  })

  describe('Install Dependencies', function () {
    it('Should automatically install dependencies with -i', function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withOptions({
          'standard-install': true,
          'install-deps': true
        })
        .then(function () {
          assert.strictEqual(path.basename(process.cwd()) + '/node_modules', defaults.appName.toLowerCase().replace(/ /g, '-') + '/node_modules')
        })
    })
  })
})

describe('Run config Auditor', function () {
  it('Should automatically run the config auditor', function () {
    let ConfigAuditPassing = false

    return helpers.run(path.join(__dirname, '../../generators/app'))
      .withOptions({
        'standard-install': true
      })
      .then(function () {
        const data = execSync(`node ${__dirname}/../../node_modules/roosevelt/lib/scripts/configAuditor.js`)

        if (data.includes('rooseveltConfig audit completed with no errors found')) {
          ConfigAuditPassing = true
        }

        assert.strictEqual(ConfigAuditPassing, true, 'rooseveltConfig audit completed with no errors found')
      })
  })
})
