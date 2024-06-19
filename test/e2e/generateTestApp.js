const { spawn } = require('child_process')
const os = require('os')

function generateRooseveltApp (testType) {
  return new Promise((resolve, reject) => {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
    const child = spawn(shell, [], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let isAppTypeQuestionAsked = false
    let url = ''
    let dataBuffer = ''

    const handleOutput = (data) => {
      const output = data.toString()
      dataBuffer += output

      if (testType.localeCompare('homepage') === 0) {
        const urlMatch = output.match(/https:\/\/localhost:\d+/)
        if (urlMatch) {
          url = urlMatch[0]
          child.kill()
          resolve(url)
        }
      } else {
        if (output.includes('Generate a standard app') && !isAppTypeQuestionAsked) {
          child.stdin.write('\x1B[B') // ANSI code for arrow down
          child.stdin.write('\n') // Enter
          isAppTypeQuestionAsked = true
        }

        const urlMatch = output.match(/https:\/\/localhost:\d+/)
        if (urlMatch) {
          url = urlMatch[0]
          clearInterval(interval)
          child.kill()
          resolve(url)
        }
      }

      if (dataBuffer.includes('Your app has been generated.')) {
        clearInterval(interval)
        child.kill()
        resolve('App generated successfully.')
      }
    }

    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput) // Check stderr as well

    child.stdin.write('yo roosevelt\n')
    console.log('Building app...')

    const interval = setInterval(() => {
      child.stdin.write('\n')
    }, 1000)

    setTimeout(() => {
      clearInterval(interval)
      if (!url) {
        child.kill()
        reject(new Error('App generation did not complete within the expected time.'))
      }
    }, 60000)
  })
}

function executeCommand (child, command, successIndicator) {
  return new Promise((resolve, reject) => {
    let dataBuffer = ''

    const onDataHandler = data => {
      dataBuffer += data.toString()
      if (dataBuffer.includes(successIndicator)) {
        child.stdout.removeListener('data', onDataHandler)
        resolve()
      }
    }

    child.stdout.on('data', onDataHandler)
    child.stderr.on('data', onDataHandler) // Also check stderr

    child.stdin.write(`${command}\n`)
  })
}

async function runRooseveltApp (appDirectory) {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
  const child = spawn(shell, [], {
    cwd: appDirectory,
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe']
  })

  try {
    await executeCommand(child, `cd ${appDirectory}`, '')
    await executeCommand(child, 'npm install', 'added')
    await executeCommand(child, 'npm run d', 'HTTPS server listening on port')
    console.log('Starting app...')
    return 'App is running in development mode.'
  } catch (error) {
    console.error('An error occurred during the setup process:', error)
    throw error
  }
}

async function setupRooseveltApp (destinationDir, testType) {
  try {
    const url = await generateRooseveltApp(testType)
    await runRooseveltApp(destinationDir)
    return url
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = { setupRooseveltApp }
