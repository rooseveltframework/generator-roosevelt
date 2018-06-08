const Generator = require('yeoman-generator')
const helper = require('./promptingHelpers')
const defaults = require('./templates/defaults.json')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    this.option('standard-install', {
      alias: 's',
      type: String,
      required: false,
      desc: 'Skips all prompts and creates a Roosevelt app with all defaults.'
    })

    this.option('install-deps', {
      alias: 'i',
      type: Boolean,
      required: false,
      default: false,
      desc: 'Automatically installs app dependencies.'
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
      this.packageName = helper.sanitizePackageName(this.appName)
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
          type: 'confirm',
          name: 'enableHTTPS',
          message: 'Use HTTPS?',
          default: defaults.https.enable
        },
        {
          when: (answers) => answers.enableHTTPS,
          type: 'confirm',
          name: 'httpsOnly',
          message: 'Use HTTPS only? (Disable HTTP?)',
          default: defaults.https.httpsOnly
        },
        {
          when: (answers) => !answers.httpsOnly,
          type: 'list',
          name: 'portNumber',
          choices: [
            'Random',
            `${defaults.httpPort}`,
            'Custom'
          ],
          message: 'Which HTTP port would you like to use?'
        },
        {
          when: (answers) => answers.portNumber === 'Custom',
          type: 'input',
          name: 'customHttpPort',
          message: 'Custom HTTP port your app will run on:',
          validate: helper.validatePortNumber
        }
      ]
    ).then((response) => {
      this.enableHTTPS = response.enableHTTPS
      this.httpsOnly = response.httpsOnly
      if (response.portNumber === 'Random') {
        this.httpPort = helper.randomPort()
      } else if (response.portNumber === 'Custom') {
        this.httpPort = response.customHttpPort
      } else {
        this.httpPort = defaults.httpPort
      }
    })
  }

  generateSSLCerts () {
    if (!this.enableHTTPS) {
      return true
    }

    return this.prompt(
      [
        {
          type: 'confirm',
          name: 'generateSSL',
          message: 'Would you like to generate SSL certs now?',
          default: false
        },
        {
          when: (answers) => answers.generateSSL,
          type: 'input',
          name: 'commonName',
          message: 'Enter the public domain name of your website (e.g. www.google.com)',
          validate: helper.inputRequired
        },
        {
          when: (answers) => answers.generateSSL,
          type: 'input',
          name: 'countryName',
          message: 'Enter the two-character denomination of your country (e.g. US, CA)',
          validate: helper.countryValidation
        },
        {
          when: (answers) => answers.generateSSL,
          type: 'input',
          name: 'stateName',
          message: 'Enter the name of your state or province, if applicable',
          default: defaults.stateName
        },
        {
          when: (answers) => answers.generateSSL,
          type: 'input',
          name: 'localityName',
          message: 'Enter the name of your city',
          default: defaults.localityName
        },
        {
          when: (answers) => answers.generateSSL,
          type: 'input',
          name: 'organizationName',
          message: 'Enter the legal name of your organization, if applicable',
          default: defaults.organizationName
        },
        {
          when: (answers) => answers.generateSSL,
          type: 'input',
          name: 'organizationalUnit',
          message: 'Enter the organizational unit represented by the site, if applicable (e.g. Internet Sales)',
          default: defaults.organizationalUnit
        }
      ]
    )
      .then((response) => {
        const responseKeys = Object.keys(response)

        responseKeys.forEach((answer) => {
          this[answer] = response[answer]
        })
      })
  }

  HTTPS () {
    if (!this.enableHTTPS) {
      return true
    }

    return this.prompt(
      [
        {
          type: 'list',
          name: 'httpsPortNumber',
          choices: [
            'Random',
            `${defaults.https.httpsPort}`,
            'Custom'
          ],
          message: 'Which HTTPS port would you like to use?'
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
          type: 'list',
          name: 'pfx',
          choices: [
            '.pfx',
            '.cert'
          ],
          message: 'Use .pfx or .cert for SSL connections?'
        },
        {
          type: 'input',
          name: 'keyPath',
          message: 'Key Path: Stores the file paths of specific key/certificate to be used by the server. Object values: pfx, key, cert -- use one of {pfx} or {key, cert}',
          default: defaults.https.keyPath
        },
        {
          type: 'password',
          name: 'passphrase',
          message: 'Passphrase for HTTPS server to use with the SSL cert (optional):',
          default: defaults.https.passphrase
        },
        {
          type: 'input',
          name: 'ca',
          message: 'Ca: Certificate authority to match client certificates against, as a file path or array of file paths.',
          default: defaults.https.ca
        },
        {
          type: 'input',
          name: 'requestCert',
          message: 'Request Cert: Request a certificate from a client and attempt to verify it',
          default: defaults.https.requestCert
        },
        {
          type: 'input',
          name: 'rejectUnauthorized',
          message: 'Reject Unauthorized: Upon failing to authorize a user with supplied CA(s), reject their connection entirely',
          default: defaults.https.rejectUnauthorized
        }
      ]
    )
      .then((response) => {
        if (response.httpsPortNumber === 'Random') {
          this.httpsPort = helper.randomPort(this.httpPort)
        } else if (response.httpsPortNumber === 'Custom') {
          this.httpsPort = response.customHttpsPort
        } else {
          this.httpsPort = defaults.https.httpsPort
        }
        this.pfx = response.pfx
        this.keyPath = response.keyPath
        this.passphrase = response.passphrase
        this.ca = response.ca
        this.requestCert = response.requestCert
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
            'LESS',
            'SASS',
            'none'
          ],
          message: 'Which CSS preprocessor would you like to use?'
        },
        {
          type: 'list',
          name: 'jsCompiler',
          choices: [
            'UglifyJS',
            'Closure Compiler',
            'none'
          ],
          message: 'Which JS compiler would you like to use?'
        }
      ]
    )
      .then((response) => {
        this.cssCompiler = response.cssCompiler
        this.jsCompiler = response.jsCompiler
      })
  }

  mvc () {
    if (this.configMode !== 'Customize') {
      return true
    }

    return this.prompt(
      [
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
        },
        {
          type: 'confirm',
          name: 'templatingEngine',
          message: 'Do you want to use a HTML templating engine?',
          default: defaults.templatingEngine
        }
      ]
    )
      .then((response) => {
        this.modelsPath = response.modelsPath
        this.viewsPath = response.viewsPath
        this.controllersPath = response.controllersPath
        this.templatingEngine = response.templatingEngine
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
          message: (answers) => `What file extension do you want ${answers.templatingEngineName} to use?`,
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
          `${answers[`templatingExtension` + num]}: ${answers['templatingEngineName' + num]}`
        )

        if (answers[`additionalTemplatingEngines` + num]) {
          num++
          return this.chooseViewEngine(num)
        }
      })
  }

  setParams () {
    let standardInstall = this.options['standard-install']
    let destination

    this.staticsSymlinksToPublic = ['images']

    if (standardInstall === 'true') {
      destination = this.packageName
    } else if (standardInstall || this.createDir) {
      destination = standardInstall || this.dirname
    }

    this.destinationRoot(destination)

    this.httpPort = this.httpPort || defaults.httpPort

    // HTTPS
    this.enableHTTPS = this.enableHTTPS || defaults.https.enable
    this.httpsOnly = this.httpsOnly || defaults.https.httpsOnly
    this.httpsPort = this.httpsPort || defaults.https.httpsPort
    this.pfx = this.pfx === '.pfx'
    this.keyPath = this.keyPath || defaults.https.keyPath
    this.passphrase = this.passphrase || defaults.https.passphrase
    this.ca = this.ca || defaults.https.ca
    this.requestCert = this.requestCert || defaults.https.requestCert
    this.rejectUnauthorized = this.rejectUnauthorized || defaults.https.rejectUnauthorized

    this.cssCompiler = this.cssCompiler || 'default'
    this.jsCompiler = this.jsCompiler || 'default'
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
      this.staticsSymlinksToPublic.push(
        'css: .build/css'
      )
      if (this.cssCompiler === 'default') {
        this.dependencies = Object.assign(this.dependencies, defaults[defaults.defaultCSSCompiler].dependencies)
        this.cssCompilerParams = defaults[defaults.defaultCSSCompiler].options
        this.cssExt = defaults[defaults.defaultCSSCompiler].scripts.cssExt
        this.cssSyntax = defaults[defaults.defaultCSSCompiler].scripts.cssSyntax
      } else if (this.cssCompiler === 'LESS') {
        this.dependencies = Object.assign(this.dependencies, defaults.rooseveltLess.dependencies)
        this.cssCompilerParams = defaults.rooseveltLess.options
        this.cssExt = defaults.rooseveltLess.scripts.cssExt
        this.cssSyntax = defaults.rooseveltLess.scripts.cssSyntax
      } else if (this.cssCompiler === 'SASS') {
        this.dependencies = Object.assign(this.dependencies, defaults.rooseveltSass.dependencies)
        this.cssCompilerParams = defaults.rooseveltSass.options
        this.cssExt = defaults.rooseveltSass.scripts.cssExt
        this.cssSyntax = defaults.rooseveltSass.scripts.cssSyntax
      }
    } else {
      this.staticsSymlinksToPublic.push(
        'css'
      )
      this.cssCompilerParams = 'none'
      this.cssExt = 'css'
      this.cssSyntax = ''
    }

    // generate params for selected JS compiler
    if (this.jsCompiler !== 'none') {
      this.staticsSymlinksToPublic.push(
        'js: .build/js'
      )
      if (this.jsCompiler === 'default') {
        this.dependencies = Object.assign(this.dependencies, defaults[defaults.defaultJSCompiler].dependencies)
        this.jsCompilerParams = defaults[defaults.defaultJSCompiler].options
      } else if (this.jsCompiler === 'UglifyJS') {
        this.dependencies = Object.assign(this.dependencies, defaults.rooseveltUglify.dependencies)
        this.jsCompilerParams = defaults.rooseveltUglify.options
      } else if (this.jsCompiler === 'Closure Compiler') {
        this.dependencies = Object.assign(this.dependencies, defaults.rooseveltClosure.dependencies)
        this.jsCompilerParams = defaults.rooseveltClosure.options
      }
    } else {
      this.jsCompilerParams = 'none'
      this.staticsSymlinksToPublic.push(
        'js'
      )
    }
  }

  writing () {
    if (this.generateSSL) {
      const forge = require('node-forge')
      let publicPem
      let certPem
      let privatePem
      let pki = forge.pki
      let keys = pki.rsa.generateKeyPair(2048)
      let cert = pki.createCertificate()
      let attrs = [
        {
          name: 'commonName',
          value: this.commonName
        },
        {
          name: 'countryName',
          value: this.countryName
        },
        {
          shortName: 'ST',
          value: this.stateName
        },
        {
          name: 'localityName',
          value: this.localityName
        },
        {
          name: 'organizationName',
          value: this.organizationName
        },
        {
          shortName: 'OU',
          value: this.organizationalUnit
        }
      ]

      this.log('Generating SSL certs...')

      cert.publicKey = keys.publicKey
      cert.serialNumber = '01'
      cert.validity.notBefore = new Date()
      cert.validity.notAfter = new Date()
      cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)

      cert.setSubject(attrs)
      cert.setIssuer(attrs)

      cert.sign(keys.privateKey)

      publicPem = pki.publicKeyToPem(keys.publicKey)
      certPem = pki.certificateToPem(cert)
      privatePem = pki.privateKeyToPem(keys.privateKey)

      this.fs.write(this.destinationPath('public.pem'), publicPem)
      this.fs.write(this.destinationPath('certPem.pem'), certPem)
      this.fs.write(this.destinationPath('privatePem.pem'), privatePem)
    }

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        appName: this.packageName,
        dependencies: this.dependencies,
        port: this.httpPort,
        enableHTTPS: this.enableHTTPS,
        httpsOnly: this.httpsOnly,
        httpsPort: this.httpsPort,
        pfx: this.pfx,
        keyPath: this.keyPath,
        passphrase: this.passphrase,
        ca: this.ca,
        requestCert: this.requestCert,
        rejectUnauthorized: this.rejectUnauthorized,
        modelsPath: this.modelsPath,
        viewsPath: this.viewsPath,
        viewEngine: this.viewEngine,
        controllersPath: this.controllersPath,
        cssCompiler: this.cssCompilerParams,
        jsCompiler: this.jsCompilerParams,
        staticsSymlinksToPublic: this.staticsSymlinksToPublic,
        cssExt: this.cssExt,
        cssSyntax: this.cssSyntax
      }
    )

    this.fs.copyTpl(
      this.templatePath('_.stylelintrc.json'),
      this.destinationPath('.stylelintrc.json')
    )

    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath('app.js')
    )

    this.fs.copy(
      this.templatePath('_.gitignore'),
      this.destinationPath('.gitignore')
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
    }

    // views
    this.fs.copy(
      this.templatePath('mvc/views/robots.txt'),
      this.destinationPath(this.viewsPath + '/robots.txt')
    )

    if (this.usesTeddy) {
      this.fs.copy(
        this.templatePath('mvc/views/teddy/layouts/main.html'),
        this.destinationPath(this.viewsPath + '/layouts/main.html')
      )

      this.fs.copy(
        this.templatePath('mvc/views/teddy/404.html'),
        this.destinationPath(this.viewsPath + '/404.html')
      )

      this.fs.copy(
        this.templatePath('mvc/views/teddy/homepage.html'),
        this.destinationPath(this.viewsPath + '/homepage.html')
      )
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
      this.fs.copy(
        this.templatePath('mvc/controllers/teddy/404.js'),
        this.destinationPath(this.controllersPath + '/404.js')
      )

      this.fs.copy(
        this.templatePath('mvc/controllers/teddy/homepage.js'),
        this.destinationPath(this.controllersPath + '/homepage.js')
      )
    } else {
      // assume vanilla for now
      this.fs.copy(
        this.templatePath('mvc/controllers/vanilla/homepage.js'),
        this.destinationPath(this.controllersPath + '/homepage.js')
      )
    }

    if (this.cssExt === 'less') {
      this.fs.copy(
        this.templatePath('statics/css/less/styles.less'),
        this.destinationPath('statics/css/styles.less')
      )

      this.fs.copy(
        this.templatePath('statics/css/less/more.less'),
        this.destinationPath('statics/css/more.less')
      )
    } else if (this.cssExt === 'scss') {
      this.fs.copy(
        this.templatePath('statics/css/sass/styles.scss'),
        this.destinationPath('statics/css/styles.scss')
      )

      this.fs.copy(
        this.templatePath('statics/css/sass/more.scss'),
        this.destinationPath('statics/css/more.scss')
      )
    } else if (this.cssExt === 'css') {
      this.fs.copy(
        this.templatePath('statics/css/vanilla/styles.css'),
        this.destinationPath('statics/css/styles.css')
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
      this.templatePath('statics/js/main.js'),
      this.destinationPath('statics/js/main.js')
    )
  }

  install () {
    if (this.options['install-deps']) {
      this.npmInstall()
    }
  }

  end () {
    if (!this.options['skip-closing-message']) {
      this.log(`\nYour app ${this.appName} has been generated.\n`)
      this.log('To run the app:')
      if (!this.options['install-deps']) {
        this.log('- Install dependencies: npm i')
      }
      this.log('- To run in dev mode:   npm run dev')
      this.log('- To run in prod mode:  npm run prod')
      this.log(`Once running, visit ${helper.whichHttpToShow(this.https, this.httpsOnly)}://localhost:${this.httpPort}\n`)
      this.log('To make further changes to the config, edit package.json. See https://github.com/rooseveltframework/roosevelt#configure-your-app-with-parameters for information on the configuration options.')
    }
  }
}
