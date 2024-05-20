const pty = require('node-pty')
const os = require('os')

function generateRooseveltApp (appName, destinationDir, testType) {
  return new Promise((resolve, reject) => {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.cwd(),
      env: process.env
    })

    let isAppTypeQuestionAsked = false
    let url = ''

    if(testType.localeCompare('homepage') == 0){
      ptyProcess.onData(data => {
        const urlMatch = data.match(/https:\/\/localhost:\d+/)
        if (urlMatch) {
          url = urlMatch[0]
          ptyProcess.kill()
          resolve(url)
        }
      })
    }else{
      ptyProcess.onData(data => {
        if (data.includes('Generate a standard app') && !isAppTypeQuestionAsked) {
          ptyProcess.write('\x1B[B') // ANSI code for arrow down
          ptyProcess.write('\r') // Enter
          isAppTypeQuestionAsked = true
        }
  
        const urlMatch = data.match(/https:\/\/localhost:\d+/)
        if (urlMatch) {
          url = urlMatch[0]
          clearInterval(interval)
          ptyProcess.kill()
          resolve(url)
        }
      })
    }
    

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

async function runRooseveltApp(appDirectory) {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: appDirectory,
    env: process.env
  });

  try {
    await executeCommand(ptyProcess, `cd ${appDirectory}`, 'bash');
    await executeCommand(ptyProcess, 'npm install', 'added');
    await executeCommand(ptyProcess, 'npm run d', 'HTTPS server listening on port');
    
    return 'App is running in development mode.';
  } catch (error) {
    console.error('An error occurred during the setup process:', error);
    throw error;
  }
}


async function setupRooseveltApp (appName, destinationDir, testType) {
  try {
    const url = await generateRooseveltApp(appName, destinationDir, testType)
    await runRooseveltApp(destinationDir)
    return url
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = { setupRooseveltApp }
