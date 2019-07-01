#!/usr/bin/env node

const inquirer = require('inquirer')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

let myArgs = process.argv.slice(2)
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
      console.info('response is:', response.file)
      chosenDirectoryName = response.file
    })
}

async function runGenerator (filename) {
  const { stdout, stderr } = await exec('cd .. && yo roosevelt --standard-install')

  if (stderr) {
    console.error(`error: ${stderr}`)
  }

  console.log(`output ${stdout}`)
  console.log(`filename ${filename}`)
}

if (myArgs.length < 1 || myArgs === undefined) {
  // run prompt
  askDirectoryName()
} else {
  chosenDirectoryName = myArgs[0]
}

runGenerator(chosenDirectoryName)
