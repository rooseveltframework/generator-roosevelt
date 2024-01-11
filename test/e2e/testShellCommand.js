const pty = require('node-pty')
const os = require('os')

function generateRooseveltApp (appName, destinationDir) {
  return new Promise((resolve, reject) => {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.cwd(),
      env: process.env
    })

    let url = ''

    ptyProcess.onData(data => {
      const urlMatch = data.match(/https:\/\/localhost:\d+/)
      if (urlMatch) {
        url = urlMatch[0]
        ptyProcess.kill()
        resolve(url)
      }
    })

    ptyProcess.write('yo roosevelt\r')

    const interval = setInterval(() => {
      ptyProcess.write('\r')
    }, 1000)

    setTimeout(() => {
      clearInterval(interval)
      if (!url) {
        ptyProcess.kill()
        reject(new Error('App generation did not complete within the expected time.'))
      }
    }, 60000)
  })
}

function executeCommand (ptyProcess, command, successIndicator) {
  return new Promise((resolve, reject) => {
    let dataBuffer = ''

    const onDataHandler = data => {
      dataBuffer += data
      if (dataBuffer.includes(successIndicator)) {
        ptyProcess.removeListener('data', onDataHandler)
        resolve()
      }
    }

    ptyProcess.on('data', onDataHandler)
    ptyProcess.write(`${command}\r`)
  })
}

function runRooseveltApp (appDirectory) {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: appDirectory,
    env: process.env
  })

  return executeCommand(ptyProcess, `cd ${appDirectory}`, 'bash')
    .then(() => executeCommand(ptyProcess, 'npm install', 'added'))
    .then(() => executeCommand(ptyProcess, 'npm run d', 'HTTPS server listening on port'))
    .then(() => 'App is running in development mode.')
    .catch(error => {
      throw error
    })
}

async function setupRooseveltApp (appName, destinationDir) {
  try {
    const url = await generateRooseveltApp(appName, destinationDir)
    await runRooseveltApp(destinationDir)
    return url
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = { setupRooseveltApp }
