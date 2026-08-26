const fs = require('fs')
const GeneratorModule = require('yeoman-generator')
const Generator = GeneratorModule.default
const helper = require('./promptingHelpers')
const defaults = require('./templates/defaults.json')
const cache = {}

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    // if this is executed like `yo roosevelt --standard-install custom-app-name`, cache that name so it can override appName later
    if (opts.standardInstall && typeof opts.standardInstall === 'string') {
      cache.standardInstall = opts.standardInstall
      cache.standardMpaInstall = opts.standardInstall
    }
    if (opts.standardMpaInstall && typeof opts.standardMpaInstall === 'string') {
      cache.standardInstall = opts.standardMpaInstall
      cache.standardMpaInstall = opts.standardMpaInstall
    }
    if (opts.standardStaticInstall && typeof opts.standardStaticInstall === 'string') cache.standardStaticInstall = opts.standardStaticInstall
    if (opts.standardSpaInstall && typeof opts.standardSpaInstall === 'string') cache.standardSpaInstall = opts.standardSpaInstall

    if (args[0] === '--standard-install' || args[0] === '--standard-mpa-install') {
      cache.standardInstall = args[1] // if mkroosevelt is being used, type of installation in args[0] and the project name will be in args[1]
      cache.standardMpaInstall = args[1] // if mkroosevelt is being used, type of installation in args[0] and the project name will be in args[1]
    }
    if (args[0] === '--standard-static-install') cache.standardStaticInstall = args[1] // if mkroosevelt is being used, type of installation in args[0] and the project name will be in args[1]
    if (args[0] === '--standard-spa-install') cache.standardSpaInstall = args[1] // if mkroosevelt is being used, type of installation in args[0] and the project name will be in args[1]

    this.option('standard-install', {
      alias: 's',
      type: String,
      required: false,
      desc: 'Skips all prompts and creates a Roosevelt app with all defaults.'
    })

    this.option('standard-mpa-install', {
      type: String,
      required: false,
      desc: 'Skips all prompts and creates a Roosevelt multi-page app with all defaults.'
    })

    this.option('standard-static-install', {
      type: String,
      required: false,
      desc: 'Skips all prompts and creates a Roosevelt static site generator with all defaults.'
    })

    this.option('standard-spa-install', {
      type: String,
      required: false,
      desc: 'Skips all prompts and creates a Roosevelt single page app with all defaults.'
    })

    this.option('skip-closing-message', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Skips the closing message when app generation is complete.'
    })
  }

  start () {
    if (this.options['standard-install'] || this.options['standard-mpa-install'] || this.options['standard-static-install'] || this.options['standard-spa-install']) {
      this.appName = defaults.appName
      if (cache.standardMpaInstall) this.appName = cache.standardMpaInstall
      else if (cache.standardStaticInstall) this.appName = cache.standardStaticInstall
      else if (cache.standardSpaInstall) this.appName = cache.standardSpaInstall
      this.packageName = helper.sanitizePackageName(this.appName)
      return true
    }

    if (!process.env.SILENT_MODE) console.log(`  🧸 Roosevelt app generator (version ${require('../../package').version}${fs.existsSync(require('path').resolve(__dirname, '../../.gitignore')) ? ' [development mode]' : ''})\n`)

    return this.prompt(
      [
        {
          type: 'input',
          name: 'appName',
          message: 'What would you like to name your Roosevelt app?',
          default: defaults.appName
        },
        {
          type: 'confirm',
          name: 'createDir',
          message: 'Would you like to create a new directory for your app?',
          default: defaults.createDir
        }
      ]
    )
      .then((response) => {
        this.appName = response.appName
        this.packageName = helper.sanitizePackageName(this.appName)
        this.createDir = response.createDir
      })
  }

  chooseDirName () {
    if (!this.createDir) return true

    return this.prompt(
      [
        {
          type: 'input',
          name: 'dirname',
          message: 'Enter directory name',
          default: this.packageName
        }
      ]
    )
      .then((response) => {
        this.dirname = response.dirname
      })
  }

  chooseAppVariant () {
    if (this.options['standard-install'] || this.options['standard-mpa-install'] || this.options['standard-static-install'] || this.options['standard-spa-install']) return true

    return this.prompt(
      [
        {
          type: 'select',
          name: 'configMode',
          choices: [
            'MPA — multi-page app (recommended for most apps)',
            'Static site generator (easiest to use, but fewer features available)',
            'SPA — single page app (advanced users only)',
            'Custom app'
          ],
          message: 'Which type of app do you want?'
        }
      ]
    )
      .then((response) => {
        this.configMode = response.configMode
      })
  }

  setStaticSiteModeIfSelected () {
    if (this.options['standard-static-install']) {
      this.staticSiteMode = true
      return true
    }
    if (this.configMode !== 'Static site generator (easiest to use, but fewer features available)') return true
    this.staticSiteMode = true
  }

  setSpaModeIfSelected () {
    if (this.options['standard-spa-install']) {
      this.spaMode = true
      return true
    }
    if (this.configMode !== 'SPA — single page app (advanced users only)') return true
    this.spaMode = true
  }

  chooseAppVariantToCustomize () {
    if (this.configMode !== 'Custom app') return true

    return this.prompt(
      [
        {
          type: 'select',
          name: 'customAppVariant',
          choices: [
            'MPA — multi-page app (recommended for most apps)',
            'Static site generator (easiest to use, but fewer features available)',
            'SPA — single page app (advanced users only)'
          ],
          message: 'Customize which type of app?'
        }
      ]
    )
      .then((response) => {
        if (response.customAppVariant === 'SPA — single page app (advanced users only)') this.spaMode = true
        if (response.customAppVariant === 'Static site generator (easiest to use, but fewer features available)') this.staticSiteMode = true
      })
  }

  customizeAppStart () {
    if (this.configMode !== 'Custom app') return true
    if (this.staticSiteMode) return true

    return this.prompt(
      [
        {
          type: 'select',
          name: 'httpsPortNumber',
          choices: [
            'Random',
            'Custom'
          ],
          message: 'Which HTTPS port would you like to use?',
          default: 'Random'
        },
        {
          when: (answers) => answers.httpsPortNumber === 'Custom',
          type: 'input',
          name: 'customHttpsPort',
          message: 'Custom HTTPS port your app will run on:',
          default: defaults.https.httpsPort,
          validate: helper.validatePortNumber
        },
        {
          type: 'input',
          name: 'secretsPath',
          message: 'Name of the directory secrets will be stored in:',
          default: defaults.secretsPath
        }
      ]
    )
      .then((response) => {
        if (response.httpsPortNumber === 'Random') this.httpsPort = helper.randomPort(this.httpsPort)
        else if (response.httpsPortNumber === 'Custom') this.httpsPort = response.customHttpsPort
        else this.httpsPort = response.httpsPortNumber
        this.rejectUnauthorized = response.rejectUnauthorized
        this.secretsPath = response.secretsPath
      })
  }

  customizeAppChooseStaticsPreprocessors () {
    if (this.configMode !== 'Custom app') return true

    return this.prompt(
      [
        {
          type: 'select',
          name: 'cssCompiler',
          choices: [
            'Sass',
            'Less',
            'Stylus',
            'none'
          ],
          message: 'Which CSS preprocessor would you like to use?',
          default: 'Sass'
        },
        {
          type: 'select',
          name: 'jsBundler',
          // a single page app has to bundle, since its templates and controllers are only reachable through the bundle
          choices: () => this.spaMode ? Object.keys(defaults.jsBundlers) : [...Object.keys(defaults.jsBundlers), 'none'],
          message: 'Which JS bundler would you like to use?',
          default: defaults.defaultJSBundler
        }
      ]
    )
      .then((response) => {
        this.cssCompiler = response.cssCompiler
        this.jsBundler = response.jsBundler
      })
  }

  customizeAppChooseMVC () {
    if (this.configMode !== 'Custom app') return true
    if (this.staticSiteMode) return true

    // these 3 questions will always be asked
    const questions = [
      {
        type: 'input',
        name: 'modelsPath',
        message: 'Where should data model files be located in the app\'s directory structure?',
        default: defaults.modelsPath
      },
      {
        type: 'input',
        name: 'viewsPath',
        message: 'Where should view (HTML template) files be located in the app\'s directory structure?',
        default: defaults.viewsPath
      },
      {
        type: 'input',
        name: 'controllersPath',
        message: 'Where should controller (Express route) files be located in the app\'s directory structure?',
        default: defaults.controllersPath
      }
    ]

    questions.push(
      {
        when: () => !this.spaMode,
        type: 'confirm',
        name: 'templatingEngine',
        message: 'Do you want to use a HTML templating engine?',
        default: defaults.templatingEngine
      }
    )

    return this.prompt(questions)
      .then((response) => {
        this.modelsPath = response.modelsPath
        this.viewsPath = response.viewsPath
        this.controllersPath = response.controllersPath
        this.templatingEngine = response.templatingEngine
      })
  }

  customizeAppChooseViewEngine (num) {
    if (!this.templatingEngine) return true

    if (!num) num = 1
    this.viewEngineList = this.viewEngineList || []

    return this.prompt(
      [
        {
          type: 'input',
          name: `templatingEngineName${num}`,
          message: 'What templating engine do you want to use? (Supply npm module name.)',
          default: defaults.templatingEngineName
        },
        {
          type: 'input',
          name: `templatingExtension${num}`,
          message: (answers) => `What file extension do you want ${answers['templatingEngineName' + num]} to use?`,
          default: defaults.templatingExtension
        },
        {
          type: 'confirm',
          name: `additionalTemplatingEngines${num}`,
          message: 'Do you want to support an additional templating engine?',
          default: defaults.additionalTemplatingEngines
        }
      ]
    )
      .then((answers) => {
        this.viewEngineList.push(`${answers['templatingExtension' + num]}: ${answers['templatingEngineName' + num]}`)
        if (answers['additionalTemplatingEngines' + num]) {
          num++
          return this.customizeAppChooseViewEngine(num)
        }
      })
  }

  async makeApp () {
    const standardInstall = this.options['standard-install'] || this.options['standard-mpa-install'] || this.options['standard-static-install'] || this.options['standard-spa-install']
    let destination
    if (standardInstall === 'true') destination = this.packageName
    else if (standardInstall || this.createDir) destination = standardInstall || this.dirname
    this.destinationRoot(destination)

    this.dependencies = defaults.dependencies

    this.httpsPort = this.httpsPort || defaults.httpsPort
    if (this.httpsPort === 'Random') this.httpsPort = helper.randomPort()
    this.httpParams = {
      enable: false
    }
    this.httpsParams = {
      enable: true,
      port: this.httpsPort,
      options: {
        cert: 'cert.pem',
        key: 'key.pem'
      }
    }

    this.secretsPath = this.secretsPath || defaults.secretsPath

    this.modelsPath = this.modelsPath || defaults.modelsPath
    this.viewsPath = this.viewsPath || defaults.viewsPath
    this.controllersPath = this.controllersPath || defaults.controllersPath

    this.symlinks = [
      {
        source: '${staticsRoot}/images', // eslint-disable-line
        dest: '${publicFolder}/images' // eslint-disable-line
      }
    ]

    if (this.staticSiteMode) {
      this.symlinks.push(
        {
          source: '${staticsRoot}/images/favicon.ico', // eslint-disable-line
          dest: '${publicFolder}/favicon.ico' // eslint-disable-line
        }
      )
    }

    this.cssCompiler = this.cssCompiler || 'default'
    if (this.cssCompiler !== 'none') {
      if (this.cssCompiler === 'default') {
        this.dependencies = Object.assign(this.dependencies, defaults[defaults.defaultCSSCompiler].dependencies)
        this.cssCompilerOptions = defaults[defaults.defaultCSSCompiler].config
        this.cssExt = defaults[defaults.defaultCSSCompiler].scripts.cssExt
        this.stylelintConfigModule = defaults[defaults.defaultCSSCompiler].scripts.stylelintConfigModule
        this.stylelintConfigName = defaults[defaults.defaultCSSCompiler].scripts.stylelintConfigName
        this.stylelintPostCssModule = defaults[defaults.defaultCSSCompiler].scripts.stylelintPostCssModule
        this.stylelintSyntax = defaults[defaults.defaultCSSCompiler].scripts.stylelintSyntax
      } else if (this.cssCompiler === 'Sass') {
        this.dependencies = Object.assign(this.dependencies, defaults.Sass.dependencies)
        this.cssCompilerOptions = defaults.Sass.config
        this.cssExt = defaults.Sass.scripts.cssExt
        this.stylelintConfigModule = defaults.Sass.scripts.stylelintConfigModule
        this.stylelintConfigName = defaults.Sass.scripts.stylelintConfigName
        this.stylelintPostCssModule = defaults.Sass.scripts.stylelintPostCssModule
      } else if (this.cssCompiler === 'Less') {
        this.dependencies = Object.assign(this.dependencies, defaults.Less.dependencies)
        this.cssCompilerOptions = defaults.Less.config
        this.cssExt = defaults.Less.scripts.cssExt
        this.stylelintConfigModule = defaults.Less.scripts.stylelintConfigModule
        this.stylelintConfigName = defaults.Less.scripts.stylelintConfigName
        this.stylelintPostCssModule = defaults.Less.scripts.stylelintPostCssModule
        this.stylelintSyntax = defaults.Less.scripts.stylelintSyntax
      } else if (this.cssCompiler === 'Stylus') {
        this.dependencies = Object.assign(this.dependencies, defaults.Stylus.dependencies)
        this.cssCompilerOptions = defaults.Stylus.config
        this.cssExt = defaults.Stylus.scripts.cssExt
        this.stylelintConfigModule = defaults.Stylus.scripts.stylelintConfigModule
        this.stylelintConfigName = defaults.Stylus.scripts.stylelintConfigName
        this.stylelintPostCssModule = defaults.Stylus.scripts.stylelintPostCssModule
      }
    } else {
      this.symlinks.push(
        {
          source: '${staticsRoot}/css', // eslint-disable-line
          dest: '${publicFolder}/css' // eslint-disable-line
        }
      )
      this.cssCompilerOptions = {
        enable: false,
        module: 'none',
        options: {}
      }
      this.cssExt = 'css'
      this.stylelintConfigModule = defaults.Less.scripts.stylelintConfigModule
      this.stylelintConfigName = defaults.Less.scripts.stylelintConfigName
    }

    this.jsBundler = this.jsBundler || defaults.defaultJSBundler
    this.bundlerRequires = []
    if (this.jsBundler !== 'none') {
      this.jsBundlerEnable = true
      this.dependencies = Object.assign(this.dependencies, defaults.jsBundlers[this.jsBundler].dependencies)
      this.jsBundles = [{ config: bundleConfigFor(this.jsBundler, !!this.spaMode, this.bundlerRequires) }]
      if (this.spaMode) {
        this.clientControllers = defaults.clientControllers
        this.clientViews = defaults.clientViews
      }
    } else {
      this.jsBundlerEnable = false
      this.jsBundles = []
      this.symlinks.push(
        {
          source: '${staticsRoot}/js', // eslint-disable-line
          dest: '${publicFolder}/js' // eslint-disable-line
        }
      )
    }

    if (this.spaMode) {
      this.dependencies = Object.assign(this.dependencies, defaults['semantic-forms'])
      this.dependencies = Object.assign(this.dependencies, defaults['single-page-express'])
    }
    this.viewEngine = this.templatingEngine !== false ? this.viewEngineList || defaults.viewEngine : 'none'
    if (this.viewEngine !== 'none') {
      this.viewEngine.forEach((engine) => {
        if (engine.includes('teddy')) this.usesTeddy = true
      })
    }
    if (this.usesTeddy) this.dependencies = Object.assign(this.dependencies, defaults.teddy)

    const appVariant = this.spaMode ? '.spa' : ''

    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('package.json'),
      {
        spaMode: !!this.spaMode,
        staticSiteMode: !!this.staticSiteMode,
        appName: this.packageName,
        dependencies: this.dependencies,
        stylelintPostCssModule: this.stylelintPostCssModule,
        stylelintConfigModule: this.stylelintConfigModule,
        cssExt: this.cssExt
      }
    )

    const refs = []
    const toPlaceholder = code => {
      refs.push(code)
      return `@@rooseveltConfigRef${refs.length - 1}@@`
    }
    const convertRefs = node => {
      if (typeof node === 'string') return node.includes('${') ? toPlaceholder(refExpression(node)) : node
      if (Array.isArray(node)) return node.map(convertRefs)
      if (node !== null && typeof node === 'object') {
        // a bundler plugin is a call rather than a value, so it arrives already written out as code
        if (typeof node.emitAsCode === 'string') return toPlaceholder(node.emitAsCode)
        const converted = {}
        for (const key of Object.keys(node)) converted[key] = convertRefs(node[key])
        return converted
      }
      return node
    }

    const rooseveltConfig = {
      makeBuildArtifacts: this.staticSiteMode ? 'staticsOnly' : true
    }
    if (!this.staticSiteMode) {
      rooseveltConfig.http = this.httpParams
      rooseveltConfig.https = this.httpsParams
      rooseveltConfig.secretsPath = this.secretsPath
      rooseveltConfig.favicon = 'images/favicon.ico'
      rooseveltConfig.modelsPath = this.modelsPath
      rooseveltConfig.viewsPath = this.viewsPath
      rooseveltConfig.controllersPath = this.controllersPath
    }
    rooseveltConfig.viewEngine = this.viewEngine
    rooseveltConfig.css = {
      sourcePath: 'css',
      compiler: this.cssCompilerOptions,
      output: 'css',
      versionFile: null
    }
    rooseveltConfig.js = {
      sourcePath: 'js',
      bundler: {
        enable: this.jsBundlerEnable,
        module: this.jsBundler === 'none' ? defaults.defaultJSBundler : this.jsBundler
      },
      bundles: this.jsBundles
    }
    if (this.spaMode) {
      rooseveltConfig.clientControllers = this.clientControllers
      rooseveltConfig.clientViews = this.clientViews
    }
    rooseveltConfig.symlinks = this.symlinks

    const serializedConfig = JSON.stringify(convertRefs(rooseveltConfig), null, 2)
      .replace(/"@@rooseveltConfigRef(\d+)@@"/g, (match, index) => refs[index])

    this.fs.copyTpl(
      this.templatePath('roosevelt.config.js.ejs'),
      this.destinationPath('roosevelt.config.js'),
      {
        usesRefs: refs.length > 0,
        bundlerRequires: this.bundlerRequires,
        rooseveltConfig: serializedConfig
      }
    )

    this.fs.copyTpl(
      this.templatePath('.stylelintrc.json.ejs'),
      this.destinationPath('.stylelintrc.json'),
      {
        stylelintSyntax: this.stylelintSyntax,
        stylelintConfigName: this.stylelintConfigName
      }
    )

    // both kinds of app are started the same way, by running one file with node
    // a static site's copy also builds the site, since roosevelt serves what it builds, and is named for the development server it runs
    this.fs.copyTpl(
      this.templatePath(this.staticSiteMode ? 'test-server.js' : 'app.js'),
      this.destinationPath(this.staticSiteMode ? 'test-server.js' : 'app.js')
    )

    this.fs.copyTpl(
      this.templatePath('_.gitignore.ejs'),
      this.destinationPath('.gitignore'),
      {
        secretsPath: this.secretsPath
      }
    )

    this.fs.copyTpl(
      this.templatePath('README.md.ejs'),
      this.destinationPath('README.md'),
      {
        appName: this.appName
      }
    )

    if (!this.staticSiteMode) {
      // models
      if (this.usesTeddy) {
        this.fs.copyTpl(
          this.templatePath('mvc/models/teddy/global.js'),
          this.destinationPath(this.modelsPath + '/global.js'),
          {
            appName: this.appName
          }
        )
        this.fs.copyTpl(
          this.templatePath('mvc/models/teddy/server.js'),
          this.destinationPath(this.modelsPath + '/server.js')
        )
        this.fs.copyTpl(
          this.templatePath('mvc/models/teddy/homepage.js'),
          this.destinationPath(this.modelsPath + '/homepage.js')
        )
        if (this.spaMode) {
          this.fs.copyTpl(
            this.templatePath('mvc/models/teddy/getRandomNumber.js'),
            this.destinationPath(this.modelsPath + '/getRandomNumber.js')
          )
        }
      }

      // views
      this.fs.copy(
        this.templatePath('mvc/views/robots.txt'),
        this.destinationPath(this.viewsPath + '/robots.txt')
      )
      if (this.usesTeddy) {
        this.fs.copyTpl(
          this.templatePath(`mvc/views/teddy/layouts/main${appVariant}.html`),
          this.destinationPath(this.viewsPath + '/layouts/main.html')
        )
        this.fs.copy(
          this.templatePath(`mvc/views/teddy/404${appVariant}.html`),
          this.destinationPath(this.viewsPath + '/404.html')
        )
        this.fs.copy(
          this.templatePath('mvc/views/teddy/homepage.html'),
          this.destinationPath(this.viewsPath + '/homepage.html')
        )
        if (this.spaMode) {
          this.fs.copy(
            this.templatePath('mvc/views/teddy/pageWithDataRetrieval.html'),
            this.destinationPath(this.viewsPath + '/pageWithDataRetrieval.html')
          )
          this.fs.copy(
            this.templatePath('mvc/views/teddy/pageWithForm.html'),
            this.destinationPath(this.viewsPath + '/pageWithForm.html')
          )
          this.fs.copy(
            this.templatePath('mvc/views/teddy/secondPage.html'),
            this.destinationPath(this.viewsPath + '/secondPage.html')
          )
        }
      } else {
        // no view engine
        this.fs.copyTpl(
          this.templatePath('mvc/views/vanilla/homepage.html'),
          this.destinationPath(this.viewsPath + '/homepage.html'),
          {
            appName: this.appName
          }
        )
      }

      // controllers
      const serverFolder = this.spaMode ? '/server' : ''
      this.fs.copy(
        this.templatePath('mvc/controllers/robots.txt.js'),
        this.destinationPath(`${this.controllersPath}${serverFolder}/robots.txt.js`)
      )
      if (this.usesTeddy) {
        this.fs.copyTpl(
          this.templatePath('mvc/controllers/teddy/404.js'),
          this.destinationPath(`${this.controllersPath}${serverFolder}/404.js`)
        )
        this.fs.copy(
          this.templatePath('mvc/controllers/teddy/homepage.js'),
          this.destinationPath(this.controllersPath + '/homepage.js')
        )
        if (this.spaMode) {
          this.fs.copy(
            this.templatePath('mvc/controllers/teddy/api.js'),
            this.destinationPath(this.controllersPath + '/server/api.js')
          )
          this.fs.copy(
            this.templatePath('mvc/controllers/teddy/pageWithDataRetrieval.js'),
            this.destinationPath(this.controllersPath + '/pageWithDataRetrieval.js')
          )
          this.fs.copy(
            this.templatePath('mvc/controllers/teddy/pageWithForm.js'),
            this.destinationPath(this.controllersPath + '/pageWithForm.js')
          )
          this.fs.copy(
            this.templatePath('mvc/controllers/teddy/secondPage.js'),
            this.destinationPath(this.controllersPath + '/secondPage.js')
          )
        }
      } else {
        // no view engine
        this.fs.copy(
          this.templatePath('mvc/controllers/vanilla/homepage.js'),
          this.destinationPath(this.controllersPath + '/homepage.js')
        )
      }
    }

    if (this.cssExt === 'scss') {
      this.fs.copy(
        this.templatePath(`statics/css/sass/styles${appVariant}.scss`),
        this.destinationPath('statics/css/styles.scss')
      )
      this.fs.copy(
        this.templatePath('statics/css/sass/helpers.scss'),
        this.destinationPath('statics/css/helpers.scss')
      )
    } else if (this.cssExt === 'less') {
      this.fs.copy(
        this.templatePath(`statics/css/less/styles${appVariant}.less`),
        this.destinationPath('statics/css/styles.less')
      )
      this.fs.copy(
        this.templatePath('statics/css/less/helpers.less'),
        this.destinationPath('statics/css/helpers.less')
      )
    } else if (this.cssExt === 'styl') {
      this.fs.copy(
        this.templatePath(`statics/css/stylus/styles${appVariant}.styl`),
        this.destinationPath('statics/css/styles.styl')
      )
      this.fs.copy(
        this.templatePath('statics/css/stylus/helpers.styl'),
        this.destinationPath('statics/css/helpers.styl')
      )
    } else if (this.cssExt === 'css') {
      this.fs.copy(
        this.templatePath(`statics/css/vanilla/styles${appVariant}.css`),
        this.destinationPath('statics/css/styles.css')
      )
      this.fs.copy(
        this.templatePath('statics/css/vanilla/helpers.css'),
        this.destinationPath('statics/css/helpers.css')
      )
    }

    this.fs.copy(
      this.templatePath('statics/images/teddy.jpg'),
      this.destinationPath('statics/images/teddy.jpg')
    )

    this.fs.copy(
      this.templatePath('statics/images/favicon.ico'),
      this.destinationPath('statics/images/favicon.ico')
    )
    this.fs.copy(
      this.templatePath('statics/images/favicon-16x16.png'),
      this.destinationPath('statics/images/favicon-16x16.png')
    )
    this.fs.copy(
      this.templatePath('statics/images/favicon-32x32.png'),
      this.destinationPath('statics/images/favicon-32x32.png')
    )
    this.fs.copy(
      this.templatePath('statics/images/favicon-48x48.png'),
      this.destinationPath('statics/images/favicon-48x48.png')
    )
    this.fs.copy(
      this.templatePath('statics/images/favicon-64x64.png'),
      this.destinationPath('statics/images/favicon-64x64.png')
    )
    this.fs.copy(
      this.templatePath('statics/images/favicon-128x128.png'),
      this.destinationPath('statics/images/favicon-128x128.png')
    )

    this.fs.copy(
      this.templatePath(`statics/js/main${appVariant}.js`),
      this.destinationPath('statics/js/main.js')
    )
    if (this.spaMode) {
      this.fs.copy(
        this.templatePath('statics/js/models/getRandomNumber.js'),
        this.destinationPath('statics/js/models/getRandomNumber.js')
      )
      this.fs.copy(
        this.templatePath('statics/js/models/global.js'),
        this.destinationPath('statics/js/models/global.js')
      )
      this.fs.copy(
        this.templatePath('statics/js/models/homepage.js'),
        this.destinationPath('statics/js/models/homepage.js')
      )
    }

    if (this.staticSiteMode) {
      this.fs.copyTpl(
        this.templatePath('statics/pages/models/global.js'),
        this.destinationPath('statics/pages/models/global.js'),
        {
          appName: this.appName
        }
      )
      this.fs.copyTpl(
        this.templatePath('statics/pages/layouts/main.html'),
        this.destinationPath('statics/pages/layouts/main.html')
      )
      this.fs.copyTpl(
        this.templatePath('statics/pages/index.html'),
        this.destinationPath('statics/pages/index.html')
      )
      this.fs.copyTpl(
        this.templatePath('statics/pages/index.js'),
        this.destinationPath('statics/pages/index.js')
      )
    }
  }

  end () {
    // beautify the json files
    function sortObjectKeys (obj) {
      const sortedKeys = Object.keys(obj).sort()
      const sortedObj = {}
      sortedKeys.forEach(key => {
        sortedObj[key] = obj[key]
      })
      return sortedObj
    }
    const pkg = JSON.parse(fs.readFileSync(this.destinationPath('package.json'), 'utf8'))
    pkg.dependencies = sortObjectKeys(pkg.dependencies)
    pkg.devDependencies = sortObjectKeys(pkg.devDependencies)
    fs.writeFileSync(this.destinationPath('package.json'), JSON.stringify(pkg, {}, 2))
    fs.writeFileSync(this.destinationPath('.stylelintrc.json'), JSON.stringify(JSON.parse(fs.readFileSync(this.destinationPath('.stylelintrc.json'), 'utf8')), {}, 2))

    // print closing message
    ;(async () => {
      if (!this.options['skip-closing-message']) {
        this.log(`\nYour app ${this.appName} has been generated.\n`)
        this.log('To run the app:')
        this.log('- Change to your app directory:  `cd ' + (this.dirname || this.appName) + '`')
        this.log('- Install dependencies:          `npm i`')
        this.log('- To run in development mode:    `npm run d`')
        this.log('- To run in production mode:     `npm run p` or `npm start`')
        if (this.staticSiteMode) {
          this.log('- To do a development build:     `npm run build-dev`')
          this.log('- To do a production build:      `npm run build`')
        }
      }
    })()
  }
}

function refExpression (value) {
  return 'rooseveltConfig.ref(params => `' + value.replace(/\$\{/g, '${params.') + '`)'
}

// the same placeholder written as a plain expression, for use inside a ref that has already been handed the params
function paramExpression (value) {
  if (!value.includes('${')) return JSON.stringify(value)
  const withParams = value.replace(/\$\{/g, '${params.')
  const whole = withParams.match(/^\$\{([^}]+)\}$/)
  return whole ? whole[1] : '`' + withParams + '`' // a placeholder on its own is just the param, with no string to build around it
}

// the directories a bare require in the app's own front end code should be searched for
// the built templates and controllers land in the build folder, which is why it is on the list at all
function moduleSearchPaths (spaMode) {
  const paths = [
    '${js.sourcePath}', // eslint-disable-line
    '${buildFolder}/js', // eslint-disable-line
    '${appDir}' // eslint-disable-line
  ]
  if (spaMode) paths.push('mvc/controllers')
  return paths
}

// each bundler roosevelt supports takes its own shape of config, so the default bundle is written per bundler
// anything the bundler needs required at the top of the config file is pushed onto requires
function bundleConfigFor (bundler, spaMode, requires) {
  const searchPaths = moduleSearchPaths(spaMode)

  // webpack and rspack take the same config as each other
  if (bundler === 'webpack' || bundler === 'rspack') {
    return {
      entry: '${js.sourcePath}/main.js', // eslint-disable-line
      output: {
        path: '${publicFolder}/js', // eslint-disable-line
        filename: 'main.js'
      },
      resolve: {
        alias: {
          fs: false,
          path: false
        },
        // these two resolve node_modules themselves, but it has to be named explicitly once anything else is on the list
        modules: [...searchPaths.slice(0, 3), 'node_modules', ...searchPaths.slice(3)]
      }
    }
  }

  if (bundler === 'esbuild') {
    return {
      entryPoints: ['${js.sourcePath}/main.js'], // eslint-disable-line
      bundle: true,
      outfile: '${publicFolder}/js/main.js', // eslint-disable-line
      nodePaths: searchPaths // esbuild's equivalent of NODE_PATH; it finds node_modules on its own
    }
  }

  if (bundler === 'rollup') {
    // rollup reads es modules only and resolves nothing but relative paths on its own, so the app's front end code needs these two plugins to be bundled at all; they are calls rather than values, which is why they are written as code
    requires.push("const commonjs = require('@rollup/plugin-commonjs')")
    requires.push("const { nodeResolve } = require('@rollup/plugin-node-resolve')")
    // the whole array is one ref rather than a ref per path, because a plugin is built the moment it is called and a ref handed to it would still be a ref when it read its options, having been sealed inside the plugin where roosevelt cannot reach it
    const modulePaths = searchPaths.map(paramExpression).join(', ')
    return {
      input: '${js.sourcePath}/main.js', // eslint-disable-line
      plugins: { emitAsCode: `rooseveltConfig.ref(params => [nodeResolve({ browser: true, modulePaths: [${modulePaths}] }), commonjs()])` },
      output: {
        file: '${publicFolder}/js/main.js', // eslint-disable-line
        format: 'iife',
        name: 'app' // rollup warns about an iife bundle with no name, and the app does not export anything anyway
      }
    }
  }
}
