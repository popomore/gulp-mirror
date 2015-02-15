'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pipe = require('multipipe');
var mirror = require('../');

gulp.task('mirror1', function() {
  return gulp.src('src/**/*.js')
  .pipe(concat('all.js'))
  .pipe(mirror(
    rename('browser.js'),
    rename('common.js'),
    rename('node.js')
  ))
  .pipe(gulp.dest('dist1'));
});

gulp.task('mirror2', function() {
  return gulp.src('src/**/*.js')
  .pipe(concat('all.js'))
  .pipe(mirror(
    pipe(
      rename('browser.js'),
      uglify()
    ),
    rename('common.js')
  ))
  .pipe(gulp.dest('dist2'));
});

gulp.task('mirror3', function() {
  return gulp.src('src/**/*.js')
  .pipe(concat('all.js'))
  .pipe(mirror(rename('common.js')))
  .pipe(gulp.dest('dist3'));
});

gulp.task('default', ['mirror1', 'mirror2', 'mirror3']);
