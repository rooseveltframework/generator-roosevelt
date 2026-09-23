const helper = {
  inputRequired: (input) => {
    if (/^\s*$/.test(input)) return 'This is required'
    return true
  },

  validatePortNumber: (input) => {
    if (!/^(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[1-9])$/.test(input)) return 'Invalid port, input a port between 1 and 65535'
    // 5000 is used by macOS monterey
    //
    // 8888 is frequently reserved by other software
    if (input === '8888' || input === '5000') return 'Invalid port: 8888 and 5000 are not allowed'
    return true
  },

  // 32768 is where every os this supports starts handing out ports for outbound connections: linux uses 32768-60999, and macos and windows use 49152-65535
  //
  // a port drawn from inside that range works until the day something else on the machine borrows it first, and the app then fails to start with a message about a port nothing appears to be listening on
  randomPort: (httpsPort) => {
    const lowest = 2000 // above the well known ports, and above the range most development tools default into
    const highest = 32767
    let port
    do port = Math.round(Math.random() * (highest - lowest) + lowest)
    while (helper.validatePortNumber(port) !== true || port === httpsPort)
    return port
  },

  sanitizePackageName: (appName) => appName.replace(/^\.|_/, '').replace(/\s+/g, '-').replace(/(.{1,213})(.*)/, '$1').toLowerCase()
}

module.exports = helper
