const { test, expect } = require('@playwright/test')
const { setupRooseveltApp } = require('./generateTestApp.js')
const fs = require('fs/promises')

let appUrl
const destinationDir = 'my-roosevelt-sample-app'
const testType = 'homepage'

test.use({ ignoreHTTPSErrors: true })
test.describe('Standard Tests', () => {
  test.beforeAll(async () => {
    // test.setTimeout(120000)
    const appName = 'MyRooseveltSampleApp'
    try {
      appUrl = await setupRooseveltApp(appName, destinationDir, testType)
    } catch (e) {
      console.error('error: ', e)
    }
  })

  test.afterAll(async () => {
    // Delete the created directory after tests are done
    try {
      await fs.rm(destinationDir, { recursive: true, force: true })
    } catch (error) {
      console.error(`Error deleting directory ${destinationDir}:`, error)
    }
  })

  test('should load the homepage', async ({ page }) => {
    await page.goto(appUrl)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('h1')).toHaveText('My Roosevelt Sample App')
    await expect(page.locator('h2')).toHaveText('Homepage')
    await expect(page.locator('article#homepage')).toBeVisible()
    await expect(page.locator('img')).toHaveAttribute('src', '/images/teddy.jpg')
    await expect(page.locator('article#homepage p').first()).toHaveText(/I'm a variable trickling down through the MVC structure!/)
    await expect(page.locator('script[src="/reloadHttps/reload.js"]')).toBeHidden()
  })
})
