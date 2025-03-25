const path = require('path')

async function init () {
  const yeomanEnvModule = await import('yeoman-environment')
  const YeomanEnvironment = yeomanEnvModule.default
  const env = new YeomanEnvironment()
  const generatorPath = path.resolve(__dirname, './generators/app')
  env.register(require.resolve(generatorPath), 'roosevelt')
  await env.run('roosevelt test/sample-app')
}

init()
