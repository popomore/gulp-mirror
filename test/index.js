'use strict';

var should = require('should');
var through = require('through2');
var File = require('vinyl');
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

  it('should end after all stream are end', function(done) {
    var streamNormal = through.obj(function(buf, enc, cb) {
      cb(null, buf + 1);
    });

    var streamSlow = through.obj(function(buf, enc, cb) {
      setTimeout(function() {
        cb(null, buf - 1);
      }, 1000);
    });

    var ret = [];
    var stream = mirror(streamNormal, streamSlow)
    .on('data', function(data) {
      ret.push(data);
    })
    .on('error', function(e) {
      should.not.exist(e);
    })
    .on('end', function() {
      ret.should.eql([2, 0]);
      done();
    });

    stream.write(1);
    stream.end();
  });

  describe('file clone', function() {

    function testClone(writeCode, cb) {
      var streamA = through.obj();
      var streamB = through.obj();

      var ret = [];
      var stream = mirror(streamA, streamB)
      .on('data', function(data) {
        ret.push(data);
      })
      .on('end', function() {
        cb(ret);
      });

      stream.write(writeCode);
      stream.end();
    }

    it('should equal number', function(done) {
      testClone(1, function(ret) {
        ret[0].should.equal(ret[1]);
        done();
      });
    });

    it('should equal array', function(done) {
      testClone([1, 2], function(ret) {
        ret[0].should.not.equal(ret[1]);
        ret[0].should.eql(ret[1]);
        done();
      });
    });

    it('should equal object', function(done) {
      testClone({a: 1}, function(ret) {
        ret[0].should.not.equal(ret[1]);
        ret[0].should.eql(ret[1]);
        done();
      });
    });

    it('should equal buffer', function(done) {
      testClone(new Buffer('abc'), function(ret) {
        ret[0].should.not.equal(ret[1]);
        ret[0].toString().should.eql(ret[1].toString());
        done();
      });
    });

    it('should equal vinyl', function(done) {
      var file = new File({
        path: 'a.js',
        cwd: __dirname,
        base: __dirname,
        contents: new Buffer('abc')
      });
      file.originPath = file.path;

      testClone(file, function(ret) {
        ret[0].should.not.equal(ret[1]);
        ret[0].contents.should.not.equal(ret[1].contents);
        ret[0].contents.toString().should.equal(ret[1].contents.toString());
        ret[0].path.should.equal(ret[1].path);
        ret[0].cwd.should.equal(ret[1].cwd);
        ret[0].base.should.equal(ret[1].base);
        ret[0].originPath.should.equal(ret[1].originPath);
        done();
      });
    });
  });
});
