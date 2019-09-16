#!/usr/bin/env node

const inquirer = require('inquirer')
const { exec } = require('child_process')

const myArgs = process.argv.slice(2)
let chosenDirectoryName

function askDirectoryName () {
  return inquirer
    .prompt([
      {
        name: 'file',
        type: 'input',
        message: 'What would you like to name your Roosevelt app?',
        default: 'my-roosevelt-sample-app'
      }
    ])
    .then((response) => {
      chosenDirectoryName = response.file
    })
}

function callYeoman (filename) {
  exec(`./node_modules/.bin/yo roosevelt --standard-install ${filename}`, (err, stdout, stderr) => {
    console.log(`${stdout}`)
    console.log(`${stderr}`)

    if (err) {
      console.error(`exec error: ${err}`)
    }
  })
}

async function runGenerator () {
  // check if args specified
  if (myArgs.length < 1 || myArgs === undefined) {
    // run prompt when no directory given
    await askDirectoryName()
  } else {
    chosenDirectoryName = myArgs[0]
  }

  callYeoman(chosenDirectoryName)
}

runGenerator()
