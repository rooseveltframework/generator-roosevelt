var rooseveltDefaults = {
  "appName": {
    "default": "newApp",
    "type": "string",
    "allowNull": false
  },
  "port": {
    "default": 43711,
    "type": "string",
    "allowNull": false
  },
  "localhostOnly": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "disableLogger": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "noMinify": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "multipart": {
    "default": {
      "multiples": true
    },
    "type": "object",
    "allowNull": false
  },
  "shutdownTimeout": {
    "default": 30000 ,
    "type": "number",
    "allowNull": false
  },
  "https": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "httpsOnly": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "httpsPort": {
    "default": 43733,
    "type": "number",
    "allowNull": false
  },
  "pfx": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "keyPath": {
    "default": null,
    "type": "string",
    "allowNull": true
  },
  "passphrase": {
    "default": null,
    "type": "number",
    "allowNull": true
  },
  "ca": {
    "default": null,
    "type": "string",
    "allowNull": true
  },
  "requestCert": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "rejectUnauthorized": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "bodyParserOptions": {
    "default": {
      "extended": true
    },
    "type": "object",
    "allowNull": false
  },
  "bodyParserJsonOptions": {
    "default": {},
    "type": "object",
    "allowNull": false
  },
  "modelsPath": {
    "default": "mvc/models",
    "type": "string",
    "allowNull": false
  },
  "modelsNodeModulesSymlink": {
    "default": "models",
    "type": "string",
    "allowNull": false
  },
  "viewsPath": {
    "default": "mvc/views",
    "type": "string",
    "allowNull": false
  },
  "viewEngine": {
    "default": "html: teddy",
    "type": "string",
    "allowNull": false
  },
  "controllersPath": {
    "default": "mvc/controllers",
    "type": "string",
    "allowNull": false
  },
  "libPath": {
    "default": "lib",
    "type": "string",
    "allowNull": false
  },
  "libPathNodeModulesSymlink": {
    "default": "lib",
    "type": "string",
    "allowNull": false
  },
  "error404": {
    "default": "404.js",
    "type": "string",
    "allowNull": false
  },
  "error5xx": {
    "default": "5xx.jx",
    "type": "string",
    "allowNull": false
  },
  "error503": {
    "default": "503.js",
    "type": "string",
    "allowNull": false
  },
  "staticsRoot": {
    "default": "statics",
    "type": "string",
    "allowNull": false
  },
  "cssPath": {
    "default": "css",
    "type": "string",
    "allowNull": false
  },
  "cssCompiler": {
    "default": {
      "nodeModule": "roosevelt-less",
      "params": {
        "compress": true
      }
    },
    "type": "object",
    "allowNull": false
  },
  "cssCompilerWhitelist": {
    "default": null,
    "type": "array",
    "allowNull": true
  },
  "cssCompiledOutput": {
    "default": ".build/css",
    "type": "string",
    "allowNull": false
  },
  "jsPath": {
    "default": "js",
    "type": "string",
    "allowNull": false
  },
  "jsCompiler": {
    "default": {
      "nodeModule": 'roosevelt-closure', 
      "params": {
        "compilation_level": 'ADVANCED_OPTIMIZATIONS'
      }
    },
    "type": "string",
    "allowNull": false
  },
  "jsCompilerWhitelist": {
    "default": null,
    "type": "array",
    "allowNull": true
  },
  "jsCompiledOutput": {
    "default": ".build/js",
    "type": "string",
    "allowNull": false
  },
  "publicFolder": {
    "default": "public",
    "type": "string",
    "allowNull": false
  },
  "favicon": {
    "default": "images/favicon.ico",
    "type": "string",
    "allowNull": false
  },
  "symlinksToStatics": {
    "default": [
      "css: .build/css",
      "images",
      "js: .build/js"
    ],
    "type": "array",
    "allowNull": false
  },
  "versionedStatics": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "versionedCssFile": {
    "default": null,
    "type": "boolean",
    "allowNull": true
  },
  "alwaysHostPublic": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  },
  "supressClosingMessage": {
    "default": false,
    "type": "boolean",
    "allowNull": false
  }
};

exports.rooseveltDefaults = rooseveltDefaults;