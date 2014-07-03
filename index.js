'use strict';

var through = require('through2');
var duplexer = require('duplexer2');

module.exports = function() {
  var output = through.obj();

  var streams = Array.prototype.slice.call(arguments);
  streams.forEach(function(stream) {
    stream.on('error', function(err) {
      output.emit('error', err);
    });
    stream.pipe(output);
  });

  var mirror = through.obj(function transform(file, enc, cb) {
    streams.forEach(function(stream) {
      // TODO: should clone
      stream.write(file);
    });
    cb();
  }, function flush(cb) {
    streams.forEach(function(stream) {
      stream.end();
    });
    cb();
  });

  return duplexer(mirror, output);
};
