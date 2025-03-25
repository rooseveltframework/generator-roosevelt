module.exports = {
  testDir: 'test/e2e',
  timeout: 60000,
  use: {
    headless: true,
    ignoreHTTPSErrors: true
  },
  projects: [
    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    }
  ],
  workers: 1
}
