'use strict';

var should = require('should');
var through = require('through2');
var mirror = require('..');

describe('gulp-mirror', function() {

  it('should mirror', function(done) {
    var streamA = through.obj(function(buf, enc, cb) {
      cb(null, buf + 1);
    });
    var streamB = through.obj(function(buf, enc, cb) {
      cb(null, buf * 10);
    });

    var ret = [];
    var stream = mirror(streamA, streamB);
    stream
    .on('data', function(data) {
      ret.push(data);
    })
    .on('end', function() {
      ret.should.eql([2, 10, 3, 20]);
      done();
    });

    stream.write(1);
    stream.write(2);
    stream.end();
  });

  it('should error handle', function(done) {
    var errorStream = through.obj(function(buf, enc, cb) {
      cb(new Error('err'));
    });

    var stream = mirror(errorStream);
    stream.on('error', function(err) {
      should.exist(err);
      done();
    });

    stream.write(1);
    stream.end();
  });
});
