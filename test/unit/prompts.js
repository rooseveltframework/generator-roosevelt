const { describe, it } = require('node:test')

process.env.SILENT_MODE = 'true'
const yeomanTest = require('yeoman-test')
const helpers = new yeomanTest.YeomanTest()
const path = require('path')
const assert = require('assert')
const fs = require('fs')
const { ref } = require('roosevelt/config')

// the roosevelt config is a javascript module as of roosevelt 0.32.0, so it is evaluated rather than read as json
// it is run here rather than required, because it asks for roosevelt itself and nothing is installed in the throwaway directory the generator wrote it to, so the copy this repo has is handed to it instead
function readRooseveltConfig (runner) {
  const source = fs.readFileSync(path.join(runner.cwd, 'roosevelt.config.js'), 'utf8')
  const generated = { exports: {} }
  const run = new Function('module', 'exports', 'require', source) // eslint-disable-line no-new-func
  run(generated, generated.exports, specifier => require(specifier))
  return generated.exports
}

// asserts the generated config contains at least the given values, the way assertJsonFileContent did
// objects and arrays alike are compared key by key, so a test can name only the settings it cares about
function assertRooseveltConfig (runner, expected) {
  const walk = (expectedNode, actualNode, at) => {
    if (Array.isArray(expectedNode)) {
      assert.strictEqual(actualNode?.length, expectedNode.length, `roosevelt.config.js ${at} had a different number of entries`)
    }
    for (const key of Object.keys(expectedNode)) {
      const where = at ? `${at}.${key}` : key
      const value = expectedNode[key]
      if (value !== null && typeof value === 'object') walk(value, actualNode?.[key] ?? (Array.isArray(value) ? [] : {}), where)
      else assert.deepStrictEqual(actualNode?.[key], value, `roosevelt.config.js ${where} did not match`)
    }
  }
  walk(expected, readRooseveltConfig(runner), '')
}

describe('Generator Prompts', async function () {
  describe('Templating Engine', function () {
    it('should use multiple view engines and templating extensions', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
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

      assertRooseveltConfig(runner, {
        viewEngine: ['html1: test1', 'html2: test2', 'html3: test3']
      })
    })
  })

  describe('HTTPS Ports', function () {
    it('should set the HTTPS Port to a custom port', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          enableHTTPS: true,
          httpsPortNumber: 'Custom',
          customHttpsPort: 1234
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        https: {
          port: 1234
        }
      })
    })

    it('should set the HTTPS Port to a random port', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          enableHTTPS: true,
          httpsPortNumber: 'Random'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assert.strictEqual(typeof readRooseveltConfig(runner).https.port, 'number')
    })
  })

  it('should set the CSS preprocessor to SASS', async function () {
    const runner = await helpers
      .create(path.join(__dirname, '../../generators/app'))
      .withAnswers({
        configMode: 'Custom app',
        customAppVariant: 'MPA — multi-page app (recommended for most apps)',
        cssCompiler: 'Sass'
      })
      .run()

    // this fun line ensures that the runner context is looking at the folder the app got generated in
    runner.cwd += '/my-roosevelt-sample-app'

    assertRooseveltConfig(runner, {
      css: {
        compiler: {
          module: 'sass'
        }
      }
    })

    runner.assertFile('statics/css/styles.scss')
  })

  describe('Statics', function () {
    it('should set the CSS preprocessor to SASS', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          cssCompiler: 'Sass'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        css: {
          compiler: {
            module: 'sass'
          }
        }
      })

      runner.assertFile('statics/css/styles.scss')
    })

    it('should set the CSS preprocessor to LESS', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          cssCompiler: 'Less'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        css: {
          compiler: {
            module: 'less'
          }
        }
      })

      runner.assertFile('statics/css/styles.less')
    })

    it('should set the CSS preprocessor to Stylus', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          cssCompiler: 'Stylus'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        css: {
          compiler: {
            module: 'stylus'
          }
        }
      })

      runner.assertFile('statics/css/styles.styl')
    })

    it('should set the CSS preprocessor to none', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          cssCompiler: 'none'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        css: {
          compiler: {
            enable: false,
            module: 'none'
          }
        }
      })

      runner.assertFile('statics/css/styles.css')
    })

    it('should default to esbuild and write a config in its own vocabulary', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        js: {
          bundler: {
            enable: true,
            module: 'esbuild'
          }
        }
      })

      // esbuild names these differently from webpack, and finds node_modules on its own rather than being told about it
      const bundle = readRooseveltConfig(runner).js.bundles[0].config
      const params = { js: { sourcePath: 'statics/js' }, publicFolder: 'public', buildFolder: '.build', appDir: '/somewhere/app' }
      const resolve = value => ref.isRef(value) ? ref.resolve(value, params) : value

      assert.deepStrictEqual(bundle.entryPoints.map(resolve), ['statics/js/main.js'])
      assert.strictEqual(bundle.bundle, true)
      assert.strictEqual(resolve(bundle.outfile), 'public/js/main.js')
      assert.deepStrictEqual(bundle.nodePaths.map(resolve), ['statics/js', '.build/js', '/somewhere/app'])
    })

    it('should setup a default webpack config when webpack is chosen', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          jsBundler: 'webpack'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        js: {
          bundler: {
            enable: true,
            module: 'webpack'
          }
        }
      })

      // the paths in the bundle are refs rather than plain strings, since roosevelt no longer substitutes ${param} placeholders itself, so they are resolved against a stand-in set of params to check what they produce
      const bundles = readRooseveltConfig(runner).js.bundles
      assert.strictEqual(bundles.length, 1)
      const bundle = bundles[0].config
      const params = { js: { sourcePath: 'statics/js' }, publicFolder: 'public', buildFolder: '.build', appDir: '/somewhere/app' }
      const resolve = value => ref.isRef(value) ? ref.resolve(value, params) : value

      assert.strictEqual(resolve(bundle.entry), 'statics/js/main.js')
      assert.strictEqual(resolve(bundle.output.path), 'public/js')
      assert.strictEqual(bundle.output.filename, 'main.js')
      assert.deepStrictEqual(bundle.resolve.modules.map(resolve), ['statics/js', '.build/js', '/somewhere/app', 'node_modules'])
    })

    it('should wrap rollup plugins in a ref so they are built after the params are known', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          jsBundler: 'rollup'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      // asserted against the text rather than by loading it, because loading it would mean installing rollup's plugins here
      const source = fs.readFileSync(path.join(runner.cwd, 'roosevelt.config.js'), 'utf8')

      assert.ok(source.includes("require('@rollup/plugin-node-resolve')"), 'expected the node resolve plugin to be required')
      assert.ok(source.includes("require('@rollup/plugin-commonjs')"), 'expected the commonjs plugin to be required')

      // a plugin reads its options the moment it is called, so a ref handed to one would still be a ref by then the whole array has to be inside the ref instead, which is what this guards
      assert.match(source, /"plugins": rooseveltConfig\.ref\(params => \[nodeResolve\(/)
      assert.ok(!/modulePaths: \[rooseveltConfig\.ref/.test(source), 'the module paths must be plain params inside the ref, not refs of their own')
    })

    it('should disable bundling when the bundler is set to none', async function () {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: 'MPA — multi-page app (recommended for most apps)',
          jsBundler: 'none'
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'

      assertRooseveltConfig(runner, {
        js: {
          bundler: {
            enable: false
          },
          bundles: []
        }
      })

      // with nothing bundling, the js folder is served straight from statics instead
      const symlinks = readRooseveltConfig(runner).symlinks
      const params = { staticsRoot: '/app/statics', publicFolder: '/app/public' }
      const resolved = symlinks.map(link => ({ source: ref.resolve(link.source, params), dest: ref.resolve(link.dest, params) }))
      assert.ok(resolved.some(link => link.source === '/app/statics/js' && link.dest === '/app/public/js'), `expected a js symlink, got ${JSON.stringify(resolved)}`)
    })
  })

  describe('How a generated app is started', function () {
    async function generate (variant) {
      const runner = await helpers
        .create(path.join(__dirname, '../../generators/app'))
        .withAnswers({
          configMode: 'Custom app',
          customAppVariant: variant
        })
        .run()

      // this fun line ensures that the runner context is looking at the folder the app got generated in
      runner.cwd += '/my-roosevelt-sample-app'
      return runner
    }

    function manifest (runner) {
      return JSON.parse(fs.readFileSync(path.join(runner.cwd, 'package.json'), 'utf8'))
    }

    it('should start an app with node rather than with nodemon', async function () {
      const pkg = manifest(await generate('MPA — multi-page app (recommended for most apps)'))

      // node's own --watch only watches the files the app loads, so editing a template or a stylesheet no longer restarts the app and races roosevelt's own statics rebuild
      assert.strictEqual(pkg.scripts.d, 'node --watch app.js --development-mode')
      assert.strictEqual(pkg.scripts.p, 'node app.js --production-mode')
      assert.strictEqual(pkg.devDependencies.nodemon, undefined, 'nodemon should not be a dependency')
      assert.strictEqual(pkg.nodemonConfig, undefined, 'there should be no nodemon config left behind')
      assert.strictEqual(pkg.main, 'app.js')
    })

    it('should not run a production app under a file watcher', async function () {
      const pkg = manifest(await generate('MPA — multi-page app (recommended for most apps)'))

      for (const script of ['p', 'prod', 'production', 'start']) {
        assert.ok(!pkg.scripts[script].includes('--watch'), `${script} should not watch for file changes`)
      }
    })

    it('should serve a static site with roosevelt rather than with http-server', async function () {
      const runner = await generate('Static site generator (easiest to use, but fewer features available)')
      const pkg = manifest(runner)

      // roosevelt serves the site it builds as of 0.33.0, so the one file that builds the site serves and watches it too
      runner.assertFile('test-server.js')
      runner.assertNoFile('build.js')
      runner.assertNoFile('app.js')
      assert.strictEqual(pkg.main, 'test-server.js')
      assert.strictEqual(pkg.devDependencies['http-server'], undefined, 'http-server should not be a dependency')
      assert.strictEqual(pkg.scripts.d, 'node --watch test-server.js --development-mode')
      assert.strictEqual(pkg.scripts.start, 'node test-server.js --production-mode')
      assert.strictEqual(pkg.scripts.build, 'node test-server.js --build --production-mode')
      assert.strictEqual(pkg.scripts['build-dev'], 'node test-server.js --build --development-mode')
    })

    it('should write its config to roosevelt.config.js', async function () {
      const runner = await generate('MPA — multi-page app (recommended for most apps)')

      runner.assertFile('roosevelt.config.js')
      runner.assertNoFile('rooseveltConfig.js')
    })
  })
})
