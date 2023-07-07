'use strict';

require('colorful').colorful();
const gulp = require('gulp');
const program = require('commander');

program.on('--help', () => {
  console.log('  Usage:'.to.bold.blue.color);
  console.log();
});

program.parse(process.argv);

const task = program.args[0];

function runTask(task) {
  let taskInstance = gulp.task(task);
  taskInstance.apply(gulp);
}

if(!task) {
  program.help();
} else {
  require('../gulpfile.js');
  runTask(task);
}
