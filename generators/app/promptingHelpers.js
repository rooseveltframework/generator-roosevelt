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
  if (input === '8888') {
    return 'Port cannot be 8888'
  }
  return true
}

helper.randomPort = function (httpPort) {
  var port
  do {
    port = Math.round(Math.random() * (65536 - 1000) + 1000)
  }
  while (port === 8888 || port === httpPort)
  return port
}

helper.sanitizePackageName = function (appName) {
  return appName
    .replace(/^\.|_/, '')
    .replace(/\s+/g, '-')
    .replace(/(.{1,213})(.*)/, '$1')
    .toLowerCase()
}

helper.countryValidation = function (input) {
  if (!/^[A-Z]{2}$/.test(input)) {
    return 'Incorrect input please enter in this format (e.g. US, CA)'
  }
  return true
}

module.exports = helper
