const helper = {}

helper.inputRequired = function (input) {
  if (/^\s*$/.test(input)) {
    return 'This is required'
  }
  return true
}

helper.validatePortNumber = function (input) {
  if (!/^(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[1-9])$/.test(input)) {
    return 'Invalid port, input a port between 1 and 65535'
  }
  // 9856 and 9857 are the reload ports
  // 5000 is used by macOS monterey
  // 8888 is frequently reserved by other software
  if (input === '8888' || input === '9856' || input === '9857' || input === '5000') {
    return 'Invalid port, 8888, 9856, 9857, and 5000 are not allowed'
  }
  return true
}

helper.randomPort = function (httpPort) {
  let port
  do {
    port = Math.round(Math.random() * (65536 - 1000) + 1000)
  }
  while (helper.validatePortNumber(port) !== true || port === httpPort)
  return port
}

helper.sanitizePackageName = function (appName) {
  return appName
    .replace(/^\.|_/, '')
    .replace(/\s+/g, '-')
    .replace(/(.{1,213})(.*)/, '$1')
    .toLowerCase()
}

helper.whichHttpToShow = function (https, httpsOnly) {
  if (https === 'true' && httpsOnly === 'false') {
    return 'http(s)'
  } else if (https === 'true' && httpsOnly === 'true') {
    return 'https'
  } else {
    return 'http'
  }
}

module.exports = helper
