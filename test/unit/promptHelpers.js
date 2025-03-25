/* eslint-env mocha */
const assert = require('assert')
const helper = require('../../generators/app/promptingHelpers')

describe('Prompt Helpers', function () {
  describe('inputRequired()', function () {
    it('should accept www.github.com', function () {
      assert.strictEqual(helper.inputRequired('www.github.com'), true)
    })

    it('should fail with a space', function () {
      assert.strictEqual(helper.inputRequired(' '), 'This is required')
    })
  })

  describe('validatePortNumber()', function () {
    it('should allow port number \'1234\'', function () {
      assert.strictEqual(helper.validatePortNumber('1234'), true)
    })

    it('should not allow port number \'8888\'', function () { // 8888 is frequently reserved by other software
      assert.strictEqual(helper.validatePortNumber('8888'), 'Invalid port: 8888 and 5000 are not allowed')
    })

    it('should not allow port number \'5000\'', function () { // 5000 is used by macOS monterey
      assert.strictEqual(helper.validatePortNumber('5000'), 'Invalid port: 8888 and 5000 are not allowed')
    })

    it('should not allow port \'0\'', function () {
      assert.strictEqual(helper.validatePortNumber('0'), 'Invalid port, input a port between 1 and 65535')
    })
  })

  describe('randomPort()', function () {
    it('should return a number.', function () {
      assert.strictEqual(typeof helper.randomPort(), 'number')
    })
  })
})
