#!/usr/bin/env node

const inquirer = require('inquirer')

let directoryName

function askDirectoryName () {
  directoryName = [
    {
      name: 'file',
      type: 'input',
      message: 'What would you like to name your Roosevelt app?',
      validate: function (value) {
        if (value.length) {
          return true
        } else {
          return 'Please enter appName'
        }
      }
    }
  ]
  return inquirer.prompt(directoryName)
}

askDirectoryName()
