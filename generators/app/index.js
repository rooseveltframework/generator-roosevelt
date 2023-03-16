const Generator = require('yeoman-generator')
const helper = require('./promptingHelpers')
const defaults = require('./templates/defaults.json')
const beautify = require('gulp-beautify')
const filter = require('gulp-filter')
const selfsigned = require('selfsigned')

const cache = {}

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    // if this is executed like `yo roosevelt --standard-install custom-app-name`, cache that name so it can override appName later
    if (opts.standardInstall && typeof opts.standardInstall === 'string') {
      cache.standardInstall = opts.standardInstall
    } else if (args[0] === '--standard-install') {
      // if mkroosevelt is being used, type of installation in args[0] and the project name will be in args[1]
      cache.standardInstall = args[1]
    }

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
      if (cache.standardInstall) {
        this.appName = cache.standardInstall
      }
      this.packageName = helper.sanitizePackageName(this.appName)
      this.spaMode = false
      return true
    }

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

  dir () {
    if (!this.createDir) {
      return true
    }

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

  spa () {
    if (this.spaMode === false) {
      return true
    }

    return this.prompt(
      [
        {
          type: 'list',
          name: 'spaMode',
          choices: [
            'Standard app',
            'Isomorphic (single page app)'
          ],
          message: 'Generate a standard app (for just doing server-side renders) or an isomorphic app (comes with bootstrapping for Roosevelt\'s single page app support)?',
          default: false
        }
      ]
    )
      .then((response) => {
        this.spaMode = response.spaMode === 'Isomorphic (single page app)' || false
      })
  }

  mode () {
    if (this.options['standard-install']) {
      return true
    }

    return this.prompt(
      [
        {
          type: 'list',
          name: 'configMode',
          choices: [
            'Standard',
            'Customize'
          ],
          message: 'Generate a standard config or customize it now?'
        }
      ]
    )
      .then((response) => {
        this.configMode = response.configMode
      })
  }

  customize () {
    if (this.configMode !== 'Customize') {
      return true
    }

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
        }
      ]
    )
      .then((response) => {
        if (response.httpsPortNumber === 'Random') {
          this.httpsPort = helper.randomPort(this.httpsPort)
        } else if (response.httpsPortNumber === 'Custom') {
          this.httpsPort = response.customHttpsPort
        } else {
          this.httpsPort = response.httpsPortNumber
        }

        this.rejectUnauthorized = response.rejectUnauthorized
      })
  }

  statics () {
    if (this.configMode !== 'Customize') {
      return true
    }

    return this.prompt(
      [
        {
          type: 'list',
          name: 'cssCompiler',
          choices: [
            'Less',
            'Sass',
            'none'
          ],
          message: 'Which CSS preprocessor would you like to use?',
          default: 'Less'
        },
        {
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

  mvc () {
    if (this.configMode !== 'Customize') {
      return true
    }

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

    // this question will be skipped in SPA mode and the answer of teddy will be assumed yes
    if (!this.spaMode) {
      questions.push(
        {
          type: 'confirm',
          name: 'templatingEngine',
          message: 'Do you want to use a HTML templating engine?',
          default: defaults.templatingEngine
        }
      )
    }

    return this.prompt(questions)
      .then((response) => {
        this.modelsPath = response.modelsPath
        this.viewsPath = response.viewsPath
        this.controllersPath = response.controllersPath
        this.templatingEngine = this.spaMode ? 'teddy' : response.templatingEngine // assume teddy in SPA mode
      })
  }

  chooseViewEngine (num) {
    if (!this.templatingEngine) {
      return true
    }

    if (!num) {
      num = 1
    }

    this.viewEngineList = this.viewEngineList || []

    // skip this question in SPA mode, assume it's teddy
    if (this.spaMode) {
      this.viewEngineList.push(`${defaults.templatingExtension}: ${defaults.templatingEngineName}`)
      return true
    }

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
          // TODO: in this line we should replace "that templating engine" with ${answers.templatingEngineName}, but for some reason it doesn't work anymore
          message: (answers) => 'What file extension do you want that templating engine to use?',
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
        this.viewEngineList.push(
          `${answers['templatingExtension' + num]}: ${answers['templatingEngineName' + num]}`
        )

        if (answers['additionalTemplatingEngines' + num]) {
          num++
          return this.chooseViewEngine(num)
        }
      })
  }

  setParams () {
    const standardInstall = this.options['standard-install']
    let destination

    this.symlinks = [
      {
        source: '${staticsRoot}/images', // eslint-disable-line
        dest: '${publicFolder}/images' // eslint-disable-line
      }
    ]

    if (standardInstall === 'true') {
      destination = this.packageName
    } else if (standardInstall || this.createDir) {
      destination = standardInstall || this.dirname
    }

    this.destinationRoot(destination)

    this.httpsPort = this.httpsPort || defaults.httpsPort
    if (this.httpsPort === 'Random') {
      this.httpsPort = helper.randomPort()
    }

    // HTTPS
    const httpsParams = {
      enable: true,
      port: this.httpsPort,
      force: true,
      authInfoPath: {
        authCertAndKey: {
          cert: './certs/cert.pem',
          key: './certs/key.pem'
        }
      }
    }

    this.httpsParams = httpsParams
    this.cssCompiler = this.cssCompiler || 'default'
    this.modelsPath = this.modelsPath || defaults.modelsPath
    this.viewsPath = this.viewsPath || defaults.viewsPath
    this.controllersPath = this.controllersPath || defaults.controllersPath
    this.viewEngine = this.templatingEngine !== false ? this.viewEngineList || defaults.viewEngine : 'none'

    this.dependencies = defaults.dependencies

    // determine if teddy will be used
    if (this.viewEngine !== 'none') {
      this.viewEngine.forEach((engine) => {
        if (engine.includes('teddy')) {
          this.usesTeddy = true
        }
      })
    }
    if (this.usesTeddy) {
      this.dependencies = Object.assign(this.dependencies, defaults.teddy)
    }

    // generate params for selected CSS preprocessor
    if (this.cssCompiler !== 'none') {
      if (this.cssCompiler === 'default') {
        this.dependencies = Object.assign(this.dependencies, defaults[defaults.defaultCSSCompiler].dependencies)
        this.cssCompilerOptions = defaults[defaults.defaultCSSCompiler].config
        this.cssExt = defaults[defaults.defaultCSSCompiler].scripts.cssExt
        this.stylelintConfigModule = defaults[defaults.defaultCSSCompiler].scripts.stylelintConfigModule
        this.stylelintConfigName = defaults[defaults.defaultCSSCompiler].scripts.stylelintConfigName
        this.stylelintPostCssModule = defaults[defaults.defaultCSSCompiler].scripts.stylelintPostCssModule
        this.stylelintSyntax = defaults[defaults.defaultCSSCompiler].scripts.stylelintSyntax
      } else if (this.cssCompiler === 'Less') {
        this.dependencies = Object.assign(this.dependencies, defaults.Less.dependencies)
        this.cssCompilerOptions = defaults.Less.config
        this.cssExt = defaults.Less.scripts.cssExt
        this.stylelintConfigModule = defaults.Less.scripts.stylelintConfigModule
        this.stylelintConfigName = defaults.Less.scripts.stylelintConfigName
        this.stylelintPostCssModule = defaults.Less.scripts.stylelintPostCssModule
        this.stylelintSyntax = defaults.Less.scripts.stylelintSyntax
      } else if (this.cssCompiler === 'Sass') {
        this.dependencies = Object.assign(this.dependencies, defaults.Sass.dependencies)
        this.cssCompilerOptions = defaults.Sass.config
        this.cssExt = defaults.Sass.scripts.cssExt
        this.stylelintConfigModule = defaults.Sass.scripts.stylelintConfigModule
        this.stylelintConfigName = defaults.Sass.scripts.stylelintConfigName
        this.stylelintPostCssModule = defaults.Sass.scripts.stylelintPostCssModule
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

    // generate params for selected JS compiler
    if (this.webpack || this.webpack === undefined) {
      this.webpackEnable = true
      this.webpackBundle = defaults.webpackBundle
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
  }

  writing () {
    const jsonFilter = filter(['**/*.json'], { restore: true, dot: true })

    this.log('Generating SSL certs...')

    // generate a self signed certificate with a far flung expiration date
    const certs = selfsigned.generate(null, {
      keySize: 2048, // the size for the private key in bits (default: 1024)
      days: 3650, // how long till expiry of the signed certificate (default: 365) days:3650 = years: 10
      algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
      extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
      pkcs7: true, // include PKCS#7 as part of the output (default: false)
      clientCertificate: true, // generate client cert signed by the original key (default: false)
      clientCertificateCN: 'unknown' // client certificate's common name (default: 'John Doe jdoe123')
    })

    // extract individual components of the cert and generate files
    const cert = certs.cert
    const key = certs.private

    this.fs.write(this.destinationPath('./certs/cert.pem'), cert)
    this.fs.write(this.destinationPath('./certs/key.pem'), key)

    this.queueTransformStream([
      jsonFilter,
      beautify({ indent_size: 2, preserve_newlines: false, end_with_newline: true }),
      jsonFilter.restore
    ])

    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('package.json'),
      {
        appName: this.packageName,
        dependencies: this.dependencies,
        cssExt: this.cssExt,
        stylelintPostCssModule: this.stylelintPostCssModule,
        stylelintConfigModule: this.stylelintConfigModule
      }
    )

    let spaModeConfig = ''
    if (this.spaMode) {
      spaModeConfig = `
  "clientViews": {
    "exposeAll": true,
    "blocklist": [],
    "allowlist": [],
    "defaultBundle": "views.js",
    "output": "js",
    "minify": false
  },
  "isomorphicControllers": {
    "output": "js",
    "file": "controllers.js"
  },`
    }
    this.fs.copyTpl(
      this.templatePath('rooseveltConfig.json.ejs'),
      this.destinationPath('rooseveltConfig.json'),
      {
        port: this.httpsPort,
        https: this.httpsParams,
        modelsPath: this.modelsPath,
        viewsPath: this.viewsPath,
        viewEngine: this.viewEngine,
        controllersPath: this.controllersPath,
        cssCompilerOptions: this.cssCompilerOptions,
        webpackEnable: this.webpackEnable,
        webpackBundle: this.webpackBundle,
        symlinks: this.symlinks,
        spaModeConfig
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

    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath('app.js')
    )

    this.fs.copy(
      this.templatePath('_.gitignore'),
      this.destinationPath('.gitignore')
    )

    this.fs.copyTpl(
      this.templatePath('README.md.ejs'),
      this.destinationPath('README.md'),
      {
        appName: this.appName
      }
    )

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
    }

    // views
    this.fs.copy(
      this.templatePath('mvc/views/robots.txt'),
      this.destinationPath(this.viewsPath + '/robots.txt')
    )

    if (this.usesTeddy) {
      let spaModeScript = ''
      let spaModeNav = ''
      if (this.spaMode) {
        spaModeScript = `
    <script>
      <if frontendModel>
        window.model = {frontendModel|s|p}
      </if>
    </script>`
        spaModeNav = `
      <nav>
        <ul>
          <li><a href='/'>Homepage</a></li>
          <li><a href='/otherPage'>Some other page</a></li>
          <li><a href='/pageWithForm'>Page with a form</a></li>
        </ul>
      </nav>`
      }
      this.fs.copyTpl(
        this.templatePath('mvc/views/teddy/layouts/main.html'),
        this.destinationPath(this.viewsPath + '/layouts/main.html'),
        {
          spaModeScript,
          spaModeNav
        }
      )

      this.fs.copy(
        this.templatePath('mvc/views/teddy/404.html'),
        this.destinationPath(this.viewsPath + '/404.html')
      )

      this.fs.copy(
        this.templatePath('mvc/views/teddy/homepage.html'),
        this.destinationPath(this.viewsPath + '/homepage.html')
      )

      if (this.spaMode) {
        this.fs.copy(
          this.templatePath('mvc/views/teddy/otherPage.html'),
          this.destinationPath(this.viewsPath + '/otherPage.html')
        )
        this.fs.copy(
          this.templatePath('mvc/views/teddy/pageWithForm.html'),
          this.destinationPath(this.viewsPath + '/pageWithForm.html')
        )
        this.fs.copy(
          this.templatePath('mvc/views/teddy/formResultsPage.html'),
          this.destinationPath(this.viewsPath + '/formResultsPage.html')
        )
        this.fs.copy(
          this.templatePath('mvc/views/teddy/loadingPage.html'),
          this.destinationPath(this.viewsPath + '/loadingPage.html')
        )
      }
    } else {
      // assume vanilla for now
      this.fs.copyTpl(
        this.templatePath('mvc/views/vanilla/homepage.html'),
        this.destinationPath(this.viewsPath + '/homepage.html'),
        {
          appName: this.appName
        }
      )
    }

    // controllers
    this.fs.copy(
      this.templatePath('mvc/controllers/robots.txt.js'),
      this.destinationPath(this.controllersPath + '/robots.txt.js')
    )

    if (this.usesTeddy) {
      let spaModeScript = ''
      if (this.spaMode) {
        spaModeScript = `
    model.frontendModel = JSON.stringify(model)`
      }
      this.fs.copyTpl(
        this.templatePath('mvc/controllers/teddy/404.js'),
        this.destinationPath(this.controllersPath + '/404.js'),
        {
          spaModeScript
        }
      )
      if (this.spaMode) {
        this.fs.copy(
          this.templatePath('mvc/controllers/teddy/spa/homepage.js'),
          this.destinationPath(this.controllersPath + '/homepage.js')
        )
        this.fs.copy(
          this.templatePath('mvc/controllers/teddy/spa/otherPage.js'),
          this.destinationPath(this.controllersPath + '/otherPage.js')
        )
        this.fs.copy(
          this.templatePath('mvc/controllers/teddy/spa/pageWithForm.js'),
          this.destinationPath(this.controllersPath + '/pageWithForm.js')
        )
      } else {
        this.fs.copy(
          this.templatePath('mvc/controllers/teddy/homepage.js'),
          this.destinationPath(this.controllersPath + '/homepage.js')
        )
      }
    } else {
      // assume vanilla for now
      this.fs.copy(
        this.templatePath('mvc/controllers/vanilla/homepage.js'),
        this.destinationPath(this.controllersPath + '/homepage.js')
      )
    }

    if (this.cssExt === 'less') {
      if (this.spaMode) {
        this.fs.copy(
          this.templatePath('statics/css/less/spa/styles.less'),
          this.destinationPath('statics/css/styles.less')
        )
        this.fs.copy(
          this.templatePath('statics/css/less/spa/widgets.less'),
          this.destinationPath('statics/css/widgets.less')
        )
        this.fs.copy(
          this.templatePath('statics/css/less/spa/helpers.less'),
          this.destinationPath('statics/css/helpers.less')
        )
        this.fs.copy(
          this.templatePath('statics/css/less/spa/pages/homepage.less'),
          this.destinationPath('statics/css/pages/homepage.less')
        )
        this.fs.copy(
          this.templatePath('statics/css/less/spa/pages/formResultsPage.less'),
          this.destinationPath('statics/css/pages/formResultsPage.less')
        )
      } else {
        this.fs.copy(
          this.templatePath('statics/css/less/styles.less'),
          this.destinationPath('statics/css/styles.less')
        )
        this.fs.copy(
          this.templatePath('statics/css/less/more.less'),
          this.destinationPath('statics/css/more.less')
        )
      }
    } else if (this.cssExt === 'scss') {
      if (this.spaMode) {
        this.fs.copy(
          this.templatePath('statics/css/sass/spa/styles.scss'),
          this.destinationPath('statics/css/styles.scss')
        )
        this.fs.copy(
          this.templatePath('statics/css/sass/spa/widgets.scss'),
          this.destinationPath('statics/css/widgets.scss')
        )
        this.fs.copy(
          this.templatePath('statics/css/sass/spa/helpers.scss'),
          this.destinationPath('statics/css/helpers.scss')
        )
        this.fs.copy(
          this.templatePath('statics/css/sass/spa/pages/homepage.scss'),
          this.destinationPath('statics/css/pages/homepage.scss')
        )
        this.fs.copy(
          this.templatePath('statics/css/sass/spa/pages/formResultsPage.scss'),
          this.destinationPath('statics/css/pages/formResultsPage.scss')
        )
      } else {
        this.fs.copy(
          this.templatePath('statics/css/sass/styles.scss'),
          this.destinationPath('statics/css/styles.scss')
        )
        this.fs.copy(
          this.templatePath('statics/css/sass/more.scss'),
          this.destinationPath('statics/css/more.scss')
        )
      }
    } else if (this.cssExt === 'styl') {
      if (this.spaMode) {
        this.fs.copy(
          this.templatePath('statics/css/stylus/spa/styles.styl'),
          this.destinationPath('statics/css/styles.styl')
        )
        this.fs.copy(
          this.templatePath('statics/css/stylus/spa/widgets.styl'),
          this.destinationPath('statics/css/widgets.styl')
        )
        this.fs.copy(
          this.templatePath('statics/css/stylus/spa/helpers.styl'),
          this.destinationPath('statics/css/helpers.styl')
        )
        this.fs.copy(
          this.templatePath('statics/css/stylus/spa/pages/homepage.styl'),
          this.destinationPath('statics/css/pages/homepage.styl')
        )
        this.fs.copy(
          this.templatePath('statics/css/stylus/spa/pages/formResultsPage.styl'),
          this.destinationPath('statics/css/pages/formResultsPage.styl')
        )
      } else {
        this.fs.copy(
          this.templatePath('statics/css/stylus/styles.styl'),
          this.destinationPath('statics/css/styles.styl')
        )
        this.fs.copy(
          this.templatePath('statics/css/stylus/more.styl'),
          this.destinationPath('statics/css/more.styl')
        )
      }
    } else if (this.cssExt === 'css') {
      if (this.spaMode) {
        // stuff
      } else {
        this.fs.copy(
          this.templatePath('statics/css/vanilla/styles.css'),
          this.destinationPath('statics/css/styles.css')
        )
      }
    }

    this.fs.copy(
      this.templatePath('statics/images/teddy.jpg'),
      this.destinationPath('statics/images/teddy.jpg')
    )

    this.fs.copy(
      this.templatePath('statics/images/favicon.ico'),
      this.destinationPath('statics/images/favicon.ico')
    )

    if (this.spaMode) {
      this.fs.copy(
        this.templatePath('statics/js/spa/main.js'),
        this.destinationPath('statics/js/main.js')
      )
    } else {
      this.fs.copy(
        this.templatePath('statics/js/main.js'),
        this.destinationPath('statics/js/main.js')
      )
    }
  }

  end () {
    ;(async () => {
      const terminalLink = await import('terminal-link')

      if (!this.options['skip-closing-message']) {
        this.log(`\nYour app ${this.appName} has been generated.\n`)
        this.log('To run the app:')
        this.log('- Change to your app directory:  cd ' + this.dirname)
        this.log('- Install dependencies:          npm i')
        this.log('- To run in development mode:    npm run d')
        this.log('- To run in production mode:     npm run p')
        const url = 'https://localhost:' + this.httpsPort
        this.log('- Once running, visit:           ' + terminalLink(url, url) + '\n')
        this.log('To make further changes to the config, edit package.json. See https://github.com/rooseveltframework/roosevelt#configure-your-app-with-parameters for information on the configuration options.')
      }
    })()
  }
}
