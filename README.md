# gulp-mirror

Make a mirror of stream, it's useful that do different transform of the same stream.

---

[![NPM version](https://img.shields.io/npm/v/gulp-mirror.svg?style=flat)](https://npmjs.org/package/gulp-mirror)
[![Build Status](https://img.shields.io/travis/popomore/gulp-mirror.svg?style=flat)](https://travis-ci.org/popomore/gulp-mirror)
[![Build Status](https://img.shields.io/coveralls/popomore/gulp-mirror.svg?style=flat)](https://coveralls.io/r/popomore/gulp-mirror)
[![NPM downloads](http://img.shields.io/npm/dm/gulp-mirror.svg?style=flat)](https://npmjs.org/package/gulp-mirror)

## Install

```
$ npm install gulp-mirror
```

## Usage

Real world [example](https://github.com/popomore/gulp-mirror/tree/master/examples).

```
var gulp = require('gulp');
var concat = require('gulp-concat');
var mirror = require('gulp-mirror');
var rename = require('gulp-rename');

gulp.task('default', function() {
  return gulp.src('src/**/*.js')
  .pipe(concat('all.js'))
  .pipe(mirror(
    rename('browser.js'),
    rename('common.js'),
    rename('node.js')
  ))
  .pipe(gulp.dest('dist'));
});
```

Concat all js files in src directory, then rename it using mirror that will create three files which are the same.

## API

### mirror(stream1, stream2 ..., streamN)

Pass the input stream to all the mirrored stream with cloned `File` object. The mirrored stream also can be pipeline stream using [multipipe](https://github.com/juliangruber/multipipe), see [example 2](https://github.com/popomore/gulp-mirror/tree/master/examples#example-2).

```
gulp.src(source)
.pipe(sharedStream1)
.pipe(mirror(
  stream1,
  stream2,
  ...
  streamN
))
.pipe(sharedStream2)
.pipe(gulp.dest(dest));
```

Stream flow

```
                        -->  stream1 --> 
                      /                   \
src --> sharedStream1    -->  stream2 --> 
                      \                     \ 
                          -->    ...   -->     sharedStream2 --> dest
                        \                    /  
                           -->  streamN  --> 
```

**if mirror has only one argument, it will create another passthrough stream, just like [gulp-clone](https://github.com/mariocasciaro/gulp-clone)**, See [example 3](https://github.com/popomore/gulp-mirror/tree/master/examples#example-3).

## LICENSE

Copyright (c) 2015 popomore. Licensed under the MIT license.
