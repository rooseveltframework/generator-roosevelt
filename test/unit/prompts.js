/* eslint-env mocha */

const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const defaults = require('../../generators/app/templates/defaults.json')

describe('Generator Prompts', function () {
  it('Sets app name to default app name', function () {
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
      .withOptions({appName: defaults.appName})
      .then(function () {
        assert.JSONFileContent('package.json', {
          name: defaults.appName.toLowerCase().replace(/ /g, '-')
        })
      })
  })

  it('Sets app name to users choice', function () {
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
      .withPrompts({appName: 'my app without spaces'})
      .then(function () {
        assert.JSONFileContent('package.json', {
          name: 'my-app-without-spaces'
        })
      })
  })

  it('Creates a new directory for the app with default settings', function () {
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
      .withOptions({createDir: true})
      .then(function () {
        assert.equal(path.basename(process.cwd()), defaults.appName.toLowerCase().replace(/ /g, '-'))
      })
  })

  it('Creates a new directory with a custom name', function () {
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
      .withOptions({createDir: true})
      .withPrompts({dirname: 'custom directory'})
      .then(function () {
        assert.equal(path.basename(process.cwd()), 'custom directory')
      })
  })

  it('Disables HTTPS from user prompt', function () {
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
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
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
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
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
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
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
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

  it('Should set the MVC files and path to defualt path', function () {
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
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
    return helpers.run(path.join(__dirname, '../../generators/app/index'))
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
