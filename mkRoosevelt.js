#!/usr/bin/env node

const inquirer = require('inquirer')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

let myArgs = process.argv.slice(2)

function askDirectoryName () {
  let directoryName = [
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

if (myArgs.length < 1 || myArgs === undefined) {
  // run prompt
  askDirectoryName()
}

async function runGenerator () {
  const { stdout, stderr } = await exec('cd .. && yo roosevelt --standard-install')

  if (stderr) {
    console.error(`error: ${stderr}`)
  }

  console.log(`output ${stdout}`)
}

runGenerator()
