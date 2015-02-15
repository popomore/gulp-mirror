# Example

---

## Install

```
$ npm install -g gulp
$ npm install
```

## Example 1

Command

```
$ gulp mirror1
```

Code

```
var gulp = require('gulp');
var concat = require('gulp-concat');
var mirror = require('gulp-mirror');
var rename = require('gulp-rename');

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
```

Concat all js files in src directory, then rename it using mirror that will create three files which are the same.

## Example 2

Command

```
$ gulp mirror2
```

Code

```
var gulp = require('gulp');
var concat = require('gulp-concat');
var mirror = require('gulp-mirror');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pipe = require('multipipe');

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
```

Compress browser.js after renaming it, make a pipeline using multipipe.


## Example 3

Command

```
$ gulp mirror3
```

Code

```
var gulp = require('gulp');
var concat = require('gulp-concat');
var mirror = require('gulp-mirror');
var rename = require('gulp-rename');

gulp.task('mirror3', function() {
  return gulp.src('src/**/*.js')
  .pipe(concat('all.js'))
  .pipe(mirror(rename('common.js')))
  .pipe(gulp.dest('dist3'));
});
```

if mirror has only one argument, it will create another passthrough stream, just like gulp-clone.
