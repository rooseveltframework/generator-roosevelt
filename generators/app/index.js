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
    if (opts.standardInstall && typeof opts.standardInstall === 'string') cache.standardInstall = opts.standardInstall
    else if (args[0] === '--standard-install') cache.standardInstall = args[1] // if mkroosevelt is being used, type of installation in args[0] and the project name will be in args[1]

    this.option('standard-install', {
      alias: 's',
      type: String,
      required: false,
      desc: 'Skips all prompts and creates a Roosevelt app with all defaults.'
    })

    this.option('skip-closing-message', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Skips the closing message when app generation is complete.'
    })
  }

  start () {
    if (this.options['standard-install']) {
      this.appName = defaults.appName
      if (cache.standardInstall) this.appName = cache.standardInstall
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
    if (this.options['standard-install']) return true

    return this.prompt(
      [
        {
          type: 'list',
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

  setSpaModeIfSelected () {
    if (this.configMode !== 'SPA — single page app (advanced users only)') return true
    this.spaMode = true
  }

  setStaticSiteModeIfSelected () {
    if (this.configMode !== 'Static site generator (easiest to use, but fewer features available)') return true
    this.staticSiteMode = true
  }

  chooseAppVariantToCustomize () {
    if (this.configMode !== 'Custom app') return true

    return this.prompt(
      [
        {
          type: 'list',
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
          type: 'list',
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
          type: 'list',
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
          when: () => !this.spaMode,
          type: 'confirm',
          name: 'webpack',
          message: 'Would you like to generate a default webpack config?',
          default: true
        }
      ]
    )
      .then((response) => {
        this.cssCompiler = response.cssCompiler
        this.webpack = response.webpack
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
    const standardInstall = this.options['standard-install']
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

    if (this.webpack || this.webpack === undefined) {
      this.webpackEnable = true
      this.webpackBundle = defaults.webpackBundle
      if (this.spaMode) {
        this.webpackBundle[0].config.resolve.modules = defaults.webpackSpaVariantResolveModules
        this.clientControllers = defaults.clientControllers
        this.clientViews = defaults.clientViews
      }
    } else {
      this.webpackEnable = false
      this.webpackBundle = []
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

    this.fs.copyTpl(
      this.templatePath('rooseveltConfig.json.ejs'),
      this.destinationPath('rooseveltConfig.json'),
      {
        spaMode: !!this.spaMode,
        staticSiteMode: !!this.staticSiteMode,
        makeBuildArtifacts: this.staticSiteMode ? '"staticsOnly"' : true,
        http: this.httpParams,
        https: this.httpsParams,
        secretsPath: this.secretsPath,
        modelsPath: this.modelsPath,
        viewsPath: this.viewsPath,
        controllersPath: this.controllersPath,
        viewEngine: this.viewEngine,
        cssCompilerOptions: this.cssCompilerOptions,
        webpackEnable: this.webpackEnable,
        webpackBundle: this.webpackBundle,
        clientControllers: this.clientControllers,
        clientViews: this.clientViews,
        symlinks: this.symlinks
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

    if (this.staticSiteMode) {
      this.fs.copyTpl(
        this.templatePath('build.js'),
        this.destinationPath('build.js')
      )
    } else {
      this.fs.copyTpl(
        this.templatePath('app.js'),
        this.destinationPath('app.js')
      )
    }

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
    fs.writeFileSync(this.destinationPath('rooseveltConfig.json'), JSON.stringify(JSON.parse(fs.readFileSync(this.destinationPath('rooseveltConfig.json'), 'utf8')), {}, 2))
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
