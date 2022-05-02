/* eslint-env mocha */

/**
 * Unit tests for prompt helpers
 * @module test/unit/promptsHelpers
 */

const assert = require('yeoman-assert')
const helper = require('../../generators/app/promptingHelpers')

describe('Prompt Helpers', function () {
  describe('inputRequired()', function () {
    it('Should accept www.google.com', function () {
      assert.strictEqual(helper.inputRequired('www.google.com'), true)
    })

    it('Should fail with a space', function () {
      assert.strictEqual(helper.inputRequired(' '), 'This is required')
    })
  })

  describe('validatePortNumber()', function () {
    it('Should allow port number \'1234\'', function () {
      assert.strictEqual(helper.validatePortNumber('1234'), true)
    })

    it('Should not allow port number \'8888\'', function () { // 8888 is frequently reserved by other software
      assert.strictEqual(helper.validatePortNumber('8888'), 'Invalid port, 8888, 9856, 9857, and 5000 are not allowed')
    })

    it('Should not allow port number \'9856\'', function () { // 9856 and 9857 are the reload ports
      assert.strictEqual(helper.validatePortNumber('9856'), 'Invalid port, 8888, 9856, 9857, and 5000 are not allowed')
    })

    it('Should not allow port number \'9857\'', function () { // 9856 and 9857 are the reload ports
      assert.strictEqual(helper.validatePortNumber('9857'), 'Invalid port, 8888, 9856, 9857, and 5000 are not allowed')
    })

    it('Should not allow port number \'5000\'', function () { // 5000 is used by macOS monterey
      assert.strictEqual(helper.validatePortNumber('5000'), 'Invalid port, 8888, 9856, 9857, and 5000 are not allowed')
    })

    it('Should not allow port \'0\'', function () {
      assert.strictEqual(helper.validatePortNumber('0'), 'Invalid port, input a port between 1 and 65535')
    })
  })

  describe('randomPort()', function () {
    it('Should return a number.', function () {
      assert.strictEqual(typeof helper.randomPort(), 'number')
    })
  })
})
