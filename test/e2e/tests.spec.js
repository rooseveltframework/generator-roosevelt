const fs = require('fs')
const path = require('path')
const { test, expect } = require('@playwright/test')
const { spawn } = require('child_process')
let server
let port

test.beforeAll(async () => {
  // run `run-generator.js`
  await new Promise((resolve, reject) => {
    fs.rmSync('test/sample-app', { force: true, recursive: true })

    const generatorProcess = spawn('node', [path.resolve(__dirname, '../../run-generator.js')], {
      cwd: path.resolve(__dirname, '../../'),
      stdio: ['pipe', 'pipe', 'pipe']
    })
    console.log('Generating test app...')

    const answered = {}
    generatorProcess.stdout.on('data', (data) => {
      const output = data.toString()

      // provide answers to the prompts
      if (!answered[0] && output.includes('What would you like to name your Roosevelt app?')) {
        answered[0] = true
        generatorProcess.stdin.write('My Roosevelt Sample App\n')
      } else if (!answered[1] && output.includes('Would you like to create a new directory for your app?')) {
        answered[1] = true
        generatorProcess.stdin.write('Yes\n')
      } else if (!answered[2] && output.includes('Enter directory name')) {
        answered[2] = true
        generatorProcess.stdin.write('test/sample-app\n')
      } else if (!answered[3] && output.includes('Which type of app do you want?')) {
        answered[3] = true
        generatorProcess.stdin.write('\n')
      }
    })

    generatorProcess.stderr.on('data', (data) => {
      const output = data.toString()
      if (output.includes('- To run in production mode:     `npm run p` or `npm start`')) { // i have no fucking idea why this prints to stderr but ok
        resolve()
      }
    })
  })

  // change directory to test/sample-app and run npm install
  await new Promise((resolve, reject) => {
    console.log('Installing dependencies for test app...')
    const installProcess = spawn('npm', ['install'], { cwd: path.resolve(__dirname, '../../test/sample-app') })
    installProcess.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    installProcess.stderr.on('data', (data) => {
      console.error(data.toString())
    })
    installProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`npm install process exited with code ${code}`))
      }
    })
  })

  // start the server
  server = spawn('node', ['app.js', '--d'], { cwd: path.resolve(__dirname, '../../test/sample-app') })
  await new Promise((resolve) => {
    console.log('Starting test app...')
    server.stdout.on('data', (data) => {
      const output = data.toString()
      if (output.includes('server listening on')) {
        console.log('Started test app')
        port = output.split('https://localhost:')[1].split(' ')[0]
        resolve()
      }
    })
  })
})

test.afterAll(() => {
  server.kill()
  fs.rmSync('test/sample-app', { force: true, recursive: true })
})

test.beforeEach(async ({ page }) => {
  page.on('console', msg => console.log(msg.text()))
})

test('should render the homepage correctly', async ({ page }) => {
  await page.goto(`https://localhost:${port}/`)
  const resultText = await page.textContent('#homepage p')
  expect(resultText).toBe('Hi! I\'m a variable trickling down through the MVC structure!')
})

test('should render the not found page correctly', async ({ page }) => {
  await page.goto(`https://localhost:${port}/doesntexist`)
  const resultText = await page.textContent('#notFound p')
  expect(resultText).toBe('The requested URL /doesntexist was not found on this server.')
})

test('should render the robots.txt page correctly', async ({ page }) => {
  await page.goto(`https://localhost:${port}/robots.txt`)
  const content = await page.content()
  expect(content).toContain('Disallow: /harming/humans')
})
