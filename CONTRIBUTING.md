# How to contribute to generator-roosevelt

## Before opening a pull request

- Update dependencies in `package.json`, `generators/app/templates/defaults.json`, and `generators/app/templates/package.json.ejs`.
- Be sure all tests pass: `npm t`.
- Ensure 100% code coverage and write new tests if necessary: `npm run coverage`.
- Add your changes to `CHANGELOG.md`.

## Release process

If you are a maintainer of generator-roosevelt, please follow the following release procedure:

- Merge all desired pull requests into master.
- Bump `package.json` to a new version and run `npm i` to generate a new `package-lock.json`.
- Alter CHANGELOG "Next version" section and stamp it with the new version.
- Paste contents of CHANGELOG into new version commit.
- Open and merge a pull request with those changes.
- Tag the merge commit as the a new release version number.
- Publish commit to npm.

### Updating dependencies

Not only do the dependencies of this generator need to be maintained, but also the dependencies of the app template need to be maintained. Here is the current procedure to maintain the app template's dependencies:

- Update dependencies in generators/app/templates/package.json.ejs.
- Update dependencies in generators/app/templates/defaults.json.
- An easy way to tell which dependencies need to be updated is to:
  - Run `npm link` on your generator-roosevelt clone.
  - Run `yo roosevelt` to generate a Roosevelt app from it.
  - Then run `ncu -u` on the generated app to see which dependencies need to be updated. You may need to globally install [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) first.
  - Note: by convention, generator-roosevelt's app template only needs a dependency update when a major (1.x.x) or minor (1.2.x) release of that dependency is made. The generator sets app dependencies to `~` so patch releases (1.2.3) will automatically update and do not need manual updating in this repo.

### Important note: Do a new release of mkroosevelt with every release of generator-roosevelt

The package-lock.json file in `mkroosevelt` needs to be regenerated every time `generator-roosevelt` is pushed to npm. As such, whenever doing a publish of `generator-roosevelt`, you should also bump the version number of `mkroosevelt` to match, regenerate the package-lock.json, and publish `mkroosevelt` to npm as well.
