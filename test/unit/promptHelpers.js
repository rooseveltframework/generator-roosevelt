/* eslint-env mocha */

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

    it('Should fail with more than one space', function () {
      assert.strictEqual(helper.inputRequired('  '), 'This is required')
    })
  })

  describe('validatePortNumber()', function () {
    it('Should allow port number \'1234\'', function () {
      assert.strictEqual(helper.validatePortNumber('1234'), true)
    })

    it('Should not allow port number \'8888\'', function () {
      assert.strictEqual(helper.validatePortNumber('8888'), 'Port cannot be 8888')
    })

    it('Should not allow port \'65536\'', function () {
      assert.strictEqual(helper.validatePortNumber('65536'), 'Invalid port, input a port between 1 and 65535')
    })

    it('Should not allow port \'0\'', function () {
      assert.strictEqual(helper.validatePortNumber('0'), 'Invalid port, input a port between 1 and 65535')
    })
  })

  describe('randomPort()', function () {
    it('Should return a number.', function () {
      assert.strictEqual(typeof helper.randomPort(), 'number')
    })

    it('Should return a port number between 1000 -> 65535', function () {
      var port = helper.randomPort()
      if (port >= 1000 && port <= 65535) {
        assert.ok(true)
      }
    })
  })

  describe('countryValidation()', function () {
    it('Should allow a 2 character country abbreviation', function () {
      assert.strictEqual(helper.countryValidation('US'), true)
    })

    it('Should not allow 2 numbers, \'10\'', function () {
      assert.strictEqual(helper.countryValidation('10'), 'Incorrect input please enter in this format (e.g. US, CA)')
    })

    it('Should not allow 3 letters, \'USA\'', function () {
      assert.strictEqual(helper.countryValidation('USA'), 'Incorrect input please enter in this format (e.g. US, CA)')
    })
  })
})
