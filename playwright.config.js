const { devices } = require('@playwright/test')

const config = {
  testDir: './test/e2e',
  testMatch: '*.test.js',

  // maximum time a single test can take
  timeout: 60 * 1000,

  expect: {
    // maximum time a single expect can take
    timeout: 5000
  },

  // CI related settings
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  // cli text reporter
  reporter: 'list',

  use: {
    actionTimeout: 0,
    trace: 'on-first-retry'
  },

  // browsers to use
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    }
  ]
}

module.exports = config