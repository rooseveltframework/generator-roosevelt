# How to contribute

## Before opening a pull request

- Update dependencies in `package.json`
- Update dependencies in `generators/app/templates/defaults.json` and `generators/app/templates/package.json.ejs` either manually or via `npm run update-generated-deps`.
- Be sure all tests pass: `npm t` and `npm run test-e2e`.
- Ensure good code coverage and write new tests if necessary: `npm run coverage`.
- Add your changes to `CHANGELOG.md`.

## Release process

If you are a maintainer, please follow the following release procedure:

- Merge all desired pull requests into main.
- Bump `package.json` to a new version and run `npm i` to generate a new `package-lock.json`.
- Add new version to CHANGELOG.
- Paste contents of CHANGELOG into new version commit.
- Open and merge a pull request with those changes.
- Tag the merge commit as the a new release version number.
- Publish commit to npm.
