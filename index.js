/*
 * JSON streaming for Express
 * Copyright(c) 2012 Simon Murtha-Smith
 * MIT Licensed
 */

/*
 * JSON streaming add a jsonStream function to the response object that automatically
 * sets the Content-Type: application/jsonstream header and writes \n delimited JSON objects
 */

var jsonStreamSplitter = require('json-stream-splitter');

module.exports = function jsonStream(bytes){
  return function jsonStream(req, res, next) {
    var incomingData = '';
    var errs = [];
    // for parsing incoming jsonstream data via a POST or PUT request
    req.jsonStream = function() {
      var splitStream = jsonStreamSplitter.splitStream(req);
      if (req.method !== 'POST' && req.method !== 'PUT') {
        splitStream.emit('error', new Error('Can not stream in unless the request method is POST or PUT, got ' + req.method));
      }
      if (req.headers['content-type'] !== 'application/jsonstream') {
        splitStream.emit('error', new Error('Only a content-type of application/jsonstream may be streamed in got ' + req.headers['content-type']));
      }

      return splitStream;
    }

    // for pushing out jsonstream data via a GET request
    var first = true;
    res.jsonStream = function(object) {
      if (!(object && object instanceof Object)) return;
      if (first) {
        first = false;
        res.writeHead(200, {'content-type' : 'application/jsonstream'});
      }
      res.write(JSON.stringify(object) + '\n');
    }
    next();
  };
};
