var readStream = require('filereader-stream')
var through = require('through')
var musicmetadata = require('./index')


module.exports = function (stream, opts) {
  return musicmetadata(wrapFileWithStream(stream), opts)
}

function wrapFileWithStream (file) {
  if (file instanceof FileList) {
    throw new Error('You have passed a FileList object but we expected a File');
  }
  if (!(file instanceof File || file instanceof Blob)) {
    throw new Error('You must provide a valid File or Blob object');
  }
  var stream = through(null, null, {autoDestroy: false});
  stream.fileSize = function (cb) {
    process.nextTick(function () {
      cb(file.size);
    })
  }
  return readStream(file).pipe(stream);
}