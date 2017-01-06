#!/usr/bin/env node

var exec = require('child_process').exec,
    path = require('path'),

    htmlLinterPath = path.normalize('./node_modules/.bin/htmlhint --config ./test/.htmlhintrc mvc/views'),
    htmlLinterActualPath = path.join(__dirname, '..', htmlLinterPath),

    lessLinterPath = path.normalize('./node_modules/.bin/lesshint -c ./test/.lesshintrc statics/css'),
    lessLinterActualPath = path.join(__dirname, '..', lessLinterPath),

    jsLinterPath = path.normalize('./node_modules/.bin/eslint --ignore-path ./test/.eslintignore .'),
    jsLinterActualPath = path.join(__dirname, '..', jsLinterPath);

console.log('Linting HTML...\n');
exec(htmlLinterActualPath, function(error, stdout, stderr) {
  console.log(stdout);
  console.log('Done linting HTML\n');
  if (error !== null) {
    console.error(error);
  }

  console.log('Linting LESS...\n');
});

exec(lessLinterActualPath, function(error, stdout, stderr) {
  console.log(stdout);
  console.log('Done linting LESS\n');
  if (error !== null) {
    console.error(error);
  }

  console.log('Linting JS...\n');
});

exec(jsLinterActualPath, function(error, stdout, stderr) {
  console.log(stdout);
  console.log('Done linting JS\n');
  if (error !== null) {
    console.error(error);
  }
});