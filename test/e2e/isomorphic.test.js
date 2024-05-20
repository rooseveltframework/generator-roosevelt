const { test, expect, chromium } = require('@playwright/test')
const { setupRooseveltApp } = require('./generateTestApp.js')
const fs = require('fs/promises')

let appUrl
let page
let browser
let context
const destinationDir = 'my-roosevelt-sample-app'
const testType = 'isomorphic'

test.describe('Isomorphic Tests', () => {
  test.beforeAll(async () => {
    test.setTimeout(240000)
    const appName = 'MyRooseveltSampleApp'

    try {
      appUrl = await setupRooseveltApp(appName, destinationDir, testType)
    } catch (e) {
      console.error('error: ', e)
    }

    // Create a new browser instance
    browser = await chromium.launch()
    // Create a new context with ignoreHTTPSErrors set to true
    context = await browser.newContext({ ignoreHTTPSErrors: true })
    page = await context.newPage()
  })

  test.afterAll(async () => {
    // Close the context and the browser
    await context.close()
    await browser.close()

    // Delete the created directory after tests are done
    try {
      await fs.rm(destinationDir, { recursive: true, force: true })
    } catch (error) {
      console.error(`Error deleting directory ${destinationDir}:`, error)
    }
  })

  test('should load the homepage', async () => {
    await page.goto(appUrl)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('h1')).toHaveText('My Roosevelt Sample App')
    await expect(page.locator('h2')).toHaveText('Homepage')
    await expect(page.locator('article#homepage')).toBeVisible()
    await expect(page.locator('img')).toHaveAttribute('src', '/images/teddy.jpg')
    await expect(page.locator('article#homepage p').first()).toHaveText(/I'm a variable trickling down through the MVC structure!/)
    await expect(page.locator('script[src="/reloadHttps/reload.js"]')).toBeHidden()
  })

  test('should load "Some other page"', async () => {
    await page.goto(`${appUrl}/otherPage`) // Navigate to "Some other page"
    await expect(page.locator('header h1')).toHaveText('My Roosevelt Sample App')
    await expect(page.locator('header h2')).toHaveText('Some other page')
    await expect(page.locator('article#otherPage')).toBeVisible()
    await expect(page.locator('article#otherPage p').first()).toHaveText('Some other page.')
  })

  test('should navigate to 404 page on invalid link', async () => {
    await page.goto(`${appUrl}/otherPage`) // Navigate to "Some other page" first
    await page.click('a[href="/thisWill404"]') // Click the link that leads to 404
    await expect(page.locator('header h2')).toHaveText('Not Found')
    await expect(page.locator('article#notFound')).toBeVisible()
    await expect(page.locator('article#notFound p')).toHaveText('The requested URL /thisWill404 was not found on this server.')
  })

  test('should load "Page with a form"', async () => {
    await page.goto(`${appUrl}/pageWithForm`) // Navigate to "Page with a form"
    await expect(page.locator('header h1')).toHaveText('My Roosevelt Sample App')
    await expect(page.locator('header h2')).toHaveText('Page with a form')
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input#textbox')).toBeVisible()
    await expect(page.locator('input#checkbox')).toBeVisible()
    await expect(page.locator('input[type="radio"]')).toHaveCount(3)
  })

  test('should interact with form elements', async () => {
    await page.goto(`${appUrl}/pageWithForm`)
    await page.fill('input#textbox', 'Sample Text')
    await page.check('input#checkbox')
    await page.click('input#one') // Click on the first radio button
    // Verify the state of the form elements
    await expect(page.locator('input#textbox')).toHaveValue('Sample Text')
    await expect(page.locator('input#checkbox')).toBeChecked()
    await expect(page.locator('input#one')).toBeChecked()
  })

  test('should submit the form and update the page', async () => {
    await page.goto(`${appUrl}/pageWithForm`)
    await page.fill('input#textbox', 'Test Submission')
    await page.check('input#checkbox')
    await page.click('input#two')
    await page.click('button[type="submit"]')
    await page.waitForSelector('article#formResultsPage')
    await expect(page.locator('article#formResultsPage p:has-text("Data submitted!")')).toBeVisible()
    await expect(page.locator('article#formResultsPage')).toContainText('Text: Test Submission')
    await expect(page.locator('article#formResultsPage')).toContainText('Checkbox: on')
    await expect(page.locator('article#formResultsPage')).toContainText('Radios: two')
  })
})
