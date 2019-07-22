#!/usr/bin/env node

const inquirer = require('inquirer')
// const util = require('util')
const exec = require('child_process').exec

const myArgs = process.argv.slice(2)
let chosenDirectoryName

// check if args specified
if (myArgs.length < 1 || myArgs === undefined) {
  // run prompt
  askDirectoryName()
} else {
  chosenDirectoryName = myArgs[0]
}

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
      console.info('response is:', response.file)
      chosenDirectoryName = response.file
    })
}

function callYeoman () {
  const { stdout, stderr } = exec('yo roosevelt --custom-app-name && ls')

  if (stderr) {
    console.error(`error: ${stderr}`)
    console.log(`output ${stdout}`)
  }

  console.log(`end of callYeoman()`)
}

function renameDirectory (filename) {
  console.log(`begin of renameDirectory()`)

  const { stdout, stderr } = exec(`mv  my-roosevelt-sample-app ${filename}`)

  if (stderr) {
    console.log('stdout err', stderr)
  } else {
    console.log('renameDirectory stdout', stdout)
  }
}

function runGenerator () {
  callYeoman()

  renameDirectory(chosenDirectoryName)
}

runGenerator()
