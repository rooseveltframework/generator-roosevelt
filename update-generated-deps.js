#!/usr/bin/env node
// updates the versions that generated apps pin their dependencies to
//
// every pin is written as ~major.minor.0 rather than as the exact latest patch, because the tilde already lets a generated app take patch releases on its own; writing the patch number in would mean a commit here every time any dependency published a patch, and would stop apps generated from an older commit resolving to those patches
//
// pass --dry-run to see what would change without writing anything
const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')

// the files that decide what a generated app depends on
//
// defaults.json holds most of them, including the ones written as escaped strings for the stylelint config
//
// package.json.ejs holds the ones every generated app gets regardless of what was chosen
const files = [
  path.join(__dirname, 'generators/app/templates/defaults.json'),
  path.join(__dirname, 'generators/app/templates/package.json.ejs')
]

// matches `"pkg": "~1.2.3"` and the escaped `\"pkg\": \"~1.2.3\"` form, including scoped names
const pin = /(\\?")((?:@[^"\\:]+\/)?[^"\\:]+)\\?"\s*:\s*\\?"~(\d+)\.(\d+)\.(\d+)\\?"/g

const dryRun = process.argv.includes('--dry-run')

// asks npm what the newest published version is
function latestVersion (name) {
  return new Promise(resolve => {
    execFile('npm', ['view', name, 'version'], { encoding: 'utf8' }, (err, stdout) => {
      if (err) return resolve(null)
      const version = stdout.trim().split('\n').pop()
      resolve(/^\d+\.\d+\.\d+/.test(version) ? version : null)
    })
  })
}

;(async () => {
  // gather every package named across the files first, so each one is only asked about once
  const contents = new Map()
  const names = new Set()
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8')
    contents.set(file, text)
    for (const [, , name] of text.matchAll(pin)) names.add(name)
  }

  console.log(`looking up ${names.size} packages...\n`)
  const latest = new Map()
  const lookups = [...names].map(async name => latest.set(name, await latestVersion(name)))
  await Promise.all(lookups)

  const changed = []
  const unchanged = []
  const failed = []

  for (const [file, text] of contents) {
    const updated = text.replace(pin, (match, quote, name, major, minor, patch) => {
      const version = latest.get(name)
      if (!version) {
        failed.push(name)
        return match
      }

      // the patch is deliberately dropped rather than carried over
      const [newMajor, newMinor] = version.split('.')
      const was = `~${major}.${minor}.${patch}`
      const now = `~${newMajor}.${newMinor}.0`
      if (was === now) unchanged.push(`${name} ${was}`)
      else changed.push({ name, was, now, latest: version, file: path.basename(file) })

      return match.replace(`~${major}.${minor}.${patch}`, now)
    })

    if (!dryRun && updated !== text) fs.writeFileSync(file, updated)
  }

  if (changed.length) {
    const width = Math.max(...changed.map(c => c.name.length))
    console.log(dryRun ? 'would update:' : 'updated:')
    for (const c of changed) console.log(`  ${c.name.padEnd(width)}  ${c.was}  ->  ${c.now}   (latest published is ${c.latest})`)
  } else console.log('every pin is already current')

  if (unchanged.length) console.log(`\n${unchanged.length} already current`)
  if (failed.length) console.log(`\ncould not look up, left alone: ${[...new Set(failed)].join(', ')}`)
  if (dryRun && changed.length) console.log('\nthis was a dry run, so nothing was written')
})()
